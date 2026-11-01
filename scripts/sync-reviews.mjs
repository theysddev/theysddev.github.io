// Переносит новые отзывы с Профи.ру на сайт.
//
// 1. Открывает публичные профили в Chromium (Playwright) и читает отзывы из __NEXT_DATA__.
// 2. Берёт только письменные отзывы с оценкой 4 и выше, которых ещё нет на сайте.
// 3. Добавляет их в начало REVIEWS в index.html и 404.html, обновляет счётчики «N отзывов»
//    во всех местах и заново пререндерит блок отзывов.
//
// Запуск: node scripts/sync-reviews.mjs [--dry]
// Переменная PROFI_JSON=<файл> позволяет подать заранее сохранённые данные вместо похода на Профи (для проверки).
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEEN_FILE = path.join(ROOT, 'data', 'profi-reviews.json');
const DRY = process.argv.includes('--dry');
const PROFILES = [
  { id: 'KhripunovaSM', who: 's' }, // Софья
  { id: 'SherzodaYN', who: 'y' },   // Юсуф
];
const MIN_MARK = 4;

const MONTHS_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SERVICE_EN = [
  [/интернет-магазин/i, 'Online store'], [/telegram|бот/i, 'Telegram bot'], [/презентац/i, 'Presentation design'],
  [/лендинг|landing/i, 'Landing page'], [/визитк/i, 'Business-card site'], [/корпоративн/i, 'Corporate website'],
  [/баннер/i, 'Banner'], [/логотип/i, 'Logo design'], [/фирменн/i, 'Brand identity'], [/дизайн/i, 'Web design'],
  [/tilda/i, 'Tilda website'], [/wordpress/i, 'WordPress website'], [/сайт/i, 'Website'],
];

const plural = (n, one, few, many) => {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
};

const mskParts = (ts) => {
  const d = new Date((ts + 3 * 3600) * 1000); // Москва, UTC+3
  return { day: d.getUTCDate(), m: d.getUTCMonth(), y: d.getUTCFullYear() };
};

const cleanText = (html) => String(html || '')
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/\s+([,.!?])/g, '$1')
  .replace(/\s+/g, ' ')
  .trim();

// «Миронова Ирина» → «Ирина», «Чумакова Елена Юрьевна» → «Елена», «Мария» → «Мария».
const shortName = (author) => {
  const w = String(author || '').trim().split(/\s+/).filter(Boolean);
  if (w.length >= 3) return w[1];
  if (w.length === 2 && /(ова|ева|ёва|ина|ына|ая|ов|ев|ёв|ин|ын|ский|ская|ко|юк|ук)$/i.test(w[0])) return w[1];
  return w.join(' ') || 'Клиент';
};

const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;
const price = (v) => v ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽' : '';
const js = (s) => JSON.stringify(s);

export function toSiteReview(node, who) {
  const { day, m, y } = mskParts(node.date.timestamp);
  const w = cap((node.services?.main?.[0]?.name) || 'Работа на Профи.ру');
  const en = (SERVICE_EN.find(([re]) => re.test(w)) || [null, w])[1];
  const t = cleanText(node.textHTML);
  const pv = node.reviewPrice?.value || node.price;
  const parts = [
    `n:${js(shortName(node.author))}`, `w:${js(w)}`, `we:${js(en)}`, `p:${js(price(pv))}`,
    `d:${js(`${day} ${MONTHS_RU[m]} ${y}`)}`, `de:${js(`${day} ${MONTHS_EN[m]} ${y}`)}`, 'r:5',
  ];
  if (who === 's') parts.push('s:"s"');
  parts.push(`t:${js(t)}`, `te:${js(t)}`);
  return { line: '{' + parts.join(', ') + '},', d: `${day} ${MONTHS_RU[m]} ${y}`, n: shortName(node.author), author: node.author, t };
}

export function pickNew(edges, who, seen, existing) {
  const out = [];
  for (const e of edges) {
    const n = e.node || e;
    if (!n || n.__typename !== 'WrittenReview') continue;
    if (seen.has(String(n.id))) continue;
    if (parseInt(n.mark, 10) < MIN_MARK) continue;
    if (!cleanText(n.textHTML)) continue;
    const r = toSiteReview(n, who);
    // Защита от дублей с отзывами, которые были добавлены вручную до автопереноса.
    const dup = existing.some((x) => x.d === r.d && ((x.s || 'y') === who) &&
      (x.n === r.n || r.author.includes(x.n) || x.n.includes(r.n)));
    out.push({ id: String(n.id), dup, ...r });
  }
  return out;
}

function readReviews(html) {
  const i = html.indexOf('var REVIEWS = [');
  if (i < 0) throw new Error('REVIEWS not found');
  let depth = 0, j = html.indexOf('[', i);
  for (let k = j; k < html.length; k++) {
    if (html[k] === '[') depth++;
    else if (html[k] === ']' && --depth === 0) return (0, eval)(html.slice(j, k + 1));
  }
  throw new Error('REVIEWS not closed');
}

function updateCounts(total) {
  const ru = `${total} ${plural(total, 'отзыв', 'отзыва', 'отзывов')}`;
  const ruGen = `${total} ${plural(total, 'отзыв', 'отзыва', 'отзывов')}`;
  const en = `${total} review${total === 1 ? '' : 's'}`;
  const rules = {
    'index.html': [[/(день\. )\d+ отзыв[а-яё]*( клиентов)/g, `$1${ru}$2`], [/(<br>)\d+ отзыв[а-яё]*(<\/h2>)/g, `$1${ru}$2`], [/(на сайте )\d+ отзыв[а-яё]*/g, `$1${ruGen}`]],
    '404.html': [[/(день\. )\d+ отзыв[а-яё]*( клиентов)/g, `$1${ru}$2`], [/(<br>)\d+ отзыв[а-яё]*(<\/h2>)/g, `$1${ru}$2`], [/(на сайте )\d+ отзыв[а-яё]*/g, `$1${ruGen}`]],
    'en.js': [[/(with )\d+ client reviews?/g, `$1${total} client review${total === 1 ? '' : 's'}`], [/(<br>)\d+ reviews?/g, `$1${en}`]],
    'widget.js': [[/(на сайте )\d+ отзыв[а-яё]*/g, `$1${ruGen}`], [/(; )\d+ reviews?( on this site)/g, `$1${en}$2`]],
  };
  for (const [f, rs] of Object.entries(rules)) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    let t = fs.readFileSync(p, 'utf8');
    for (const [re, to] of rs) t = t.replace(re, to);
    fs.writeFileSync(p, t);
  }
}

function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const f = path.join(ROOT, u.endsWith('/') ? u + 'index.html' : u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, '127.0.0.1', () => ok(srv)));
}

// Тот же пререндер, что раньше делался вручную: JS-блоки главной сохраняются в HTML между маркерами <!--pr:id-->.
async function prerender(browser) {
  const IDS = ['filters', 'worksGrid', 'wMore', 'ptable', 'revWho', 'revGrid', 'revMore'];
  const srv = await serve();
  const port = srv.address().port;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => document.getElementById('works')?.scrollIntoView());
  await page.waitForTimeout(3000);
  const got = await page.evaluate((ids) => Object.fromEntries(ids.map((id) => [id, document.getElementById(id)?.innerHTML ?? null])), IDS);
  await page.close();
  srv.close();
  const FILE = path.join(ROOT, 'index.html');
  let t = fs.readFileSync(FILE, 'utf8');
  for (const id of IDS) {
    const h = got[id];
    if (h == null) { console.log('prerender: missing', id); continue; }
    const m = t.match(new RegExp('<div[^>]*id="' + id + '"[^>]*>'));
    if (!m) { console.log('prerender: nofind', id); continue; }
    const start = m.index + m[0].length, open = '<!--pr:' + id + '-->', close = '<!--/pr:' + id + '-->';
    if (t.startsWith(open, start)) {
      const end = t.indexOf(close, start);
      t = t.slice(0, start) + open + h + close + t.slice(end + close.length);
    } else if (t.startsWith('</div>', start)) {
      t = t.slice(0, start) + open + h + close + t.slice(start);
    } else console.log('prerender: not empty', id);
  }
  fs.writeFileSync(FILE, t);
}

async function fetchProfiles(browser) {
  if (process.env.PROFI_JSON) return JSON.parse(fs.readFileSync(process.env.PROFI_JSON, 'utf8'));
  const out = {};
  const ctx = await browser.newContext({ locale: 'ru-RU', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
  for (const p of PROFILES) {
    const page = await ctx.newPage();
    try {
      await page.goto(`https://profi.ru/profile/${p.id}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const data = await page.evaluate(() => {
        const el = document.getElementById('__NEXT_DATA__');
        if (!el) return null;
        const d = JSON.parse(el.textContent);
        const pr = d?.props?.pageProps?.dehydratedState?.queries?.[0]?.state?.data?.pages?.[0]?.pxf?.profile;
        return pr?.reviews ? { total: pr.reviews.totalCount, edges: pr.reviews.edges } : null;
      });
      if (!data) console.log(`${p.id}: профиль недоступен (скрыт или сайт не отдал данные) — пропускаю`);
      else { out[p.id] = data; console.log(`${p.id}: на Профи ${data.total} отзывов, на странице ${data.edges.length}`); }
    } catch (e) {
      console.log(`${p.id}: ошибка загрузки — ${e.message}`);
    }
    await page.close();
  }
  await ctx.close();
  return out;
}

async function main() {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const seenData = fs.existsSync(SEEN_FILE) ? JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8')) : { seen: [] };
  const seen = new Set(seenData.seen.map(String));
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const existing = readReviews(indexHtml);

  const profiles = await fetchProfiles(browser);
  const add = [];
  for (const p of PROFILES) {
    const data = profiles[p.id];
    if (!data) continue;
    for (const r of pickNew(data.edges, p.who, seen, existing)) {
      seen.add(r.id);
      if (r.dup) console.log(`уже на сайте: ${r.n}, ${r.d}`);
      else { add.push(r); console.log(`новый отзыв: ${r.n}, ${r.d} — ${r.t.slice(0, 60)}…`); }
    }
  }

  const seenChanged = seen.size !== new Set(seenData.seen.map(String)).size;
  if (!add.length && !seenChanged) { console.log('Новых отзывов нет.'); await browser.close(); return; }
  if (DRY) { console.log(`[dry] добавил бы ${add.length}`); await browser.close(); return; }

  if (add.length) {
    // Новые сверху: Профи отдаёт отзывы от новых к старым.
    const block = add.map((r) => r.line + '\n').join('');
    for (const f of ['index.html', '404.html']) {
      const p = path.join(ROOT, f);
      if (!fs.existsSync(p)) continue;
      const t = fs.readFileSync(p, 'utf8');
      if (!t.includes('var REVIEWS = [\n')) continue;
      fs.writeFileSync(p, t.replace('var REVIEWS = [\n', 'var REVIEWS = [\n' + block));
    }
    const total = readReviews(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')).length;
    updateCounts(total);
    await prerender(browser);
    console.log(`Добавлено: ${add.length}, всего на сайте: ${total}`);
  }
  fs.mkdirSync(path.dirname(SEEN_FILE), { recursive: true });
  fs.writeFileSync(SEEN_FILE, JSON.stringify({ seen: [...seen].sort() }, null, 1) + '\n');
  await browser.close();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
