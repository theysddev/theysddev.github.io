(function(){
var AI = {
ru: {
hi: "Здравствуйте! Я консультант YSD DEV.\nПодскажу цену, срок и что входит в работу — спрашивайте своими словами.",
chips: ["Сколько стоит сайт?", "Какие сроки?", "Что входит в цену?", "Нужен Telegram-бот", "Позвать человека"],
ph: "Спросите что угодно о заказе",
chat: {
call: "Позвать человека",
who: "Юсуф",
hi: "Юсуфу ушло уведомление. Напишите вопрос здесь — ответит в этом окне, обычно в течение пяти минут.",
live: "Юсуф на связи · отвечает лично",
wait: "ждём ответа",
off: "Быстрее всего — написать мне лично, отвечаю за пару минут:",
err: "Сообщение не ушло. Напишите, пожалуйста, сюда:",
tg: "Telegram — @ysddev"
},
rules: [
{s:["привет","здравств","добрый день","добрый вечер","доброе утро"], k:["салам","хай"],
a:"Здравствуйте! Расскажите, что нужно — сайт, Telegram-бот или презентация. Подскажу цену и срок."},
{s:["сколько стоит","стоимость","цена","цены","прайс","почем"], k:["сколько","стоит","бюджет","дорого","дешев","деньги","руб"],
a:"Три пакета под ключ:\n• Страница — 8 000 ₽, 2–4 дня\n• Сайт — 20 000 ₽, 5–8 дней\n• Магазин — 30 000 ₽, 10–14 дней\n\nОтдельно: Telegram-бот 8 000 ₽, презентация от 5 000 ₽, вёрстка из Figma от 3 000 ₽, доработка сайта от 2 000 ₽.\nТочную сумму назову после короткого уточнения — дальше она не меняется. Опишите задачу в форме «Оставить заявку», пришлю смету и срок в тот же день."},
{s:["за сколько","сколько дней","какие сроки","срок","сроки","как долго","когда будет","как быстро"], k:["дней","дня","недел","быстро","успе","дедлайн","долго","время"],
a:"Сроки:\n• Страница — 2–4 дня\n• Многостраничный сайт — 5–8 дней\n• Магазин — 10–14 дней\n• Telegram-бот — 1–2 дня\n• Презентация — 1–2 дня\n\nСрочные беру. Напишите в заявке, что нужно быстрее — посчитаю, насколько реально сжать срок."},
{s:["что входит","что включено","входит в цену","входит в стоимость","за эти деньги"], k:["включ","комплект","получу"],
a:"В пакет входит всё, чтобы сайт сразу работал:\nструктура и дизайн, вёрстка под телефон, форма заявки с уведомлением вам в Telegram, базовое SEO, домен, хостинг и SSL, обучение — как самому менять тексты.\nПравки после сдачи: 14 дней на «Странице», 30 дней на «Сайте», 60 дней на «Магазине»."},
{s:["telegram-бот","телеграм бот","нужен бот","сделать бота"], k:["бот","бота","ботов","telegram","телеграм"],
a:"Telegram-бот — 8 000 ₽, срок 1–2 дня.\nДелаю боты для записи, заказов, оплат, рассылок и поддержки. Подключаю к таблицам и CRM, уведомления о заявках приходят вам в личку.\nПримеры есть в разделе «Работы» — фильтр «Telegram-боты»."},
{s:["нужен сайт","сделать сайт","интернет-магазин","лендинг","сайт-визитка","корпоративный сайт"], k:["сайт","сайта","магазин","визитк"],
a:"Сайты делаю на WordPress, Tilda или чистом коде — подбираю под задачу и бюджет.\nПакет «Страница» 8 000 ₽, «Сайт» 20 000 ₽, «Магазин» 30 000 ₽. Те же работы по прайсу поштучно выходят дороже — 25 000 и 35 000.\nВ разделе «Работы» 15 примеров — фильтр «Сайты»."},
{s:["презентация","презентацию","коммерческое предложение","питч"], k:["слайд","слайды","презентац"],
a:"Презентация под ключ — от 5 000 ₽, от 500 ₽ за слайд, срок 1–2 дня.\nСтруктура, дизайн, инфографика, единый стиль. Отдаю в PowerPoint, Google Slides или Figma — в редактируемом виде.\nПримеры — в разделе «Работы»."},
{s:["гарантия","правки","доработки","если не понравится"], k:["гарант","правк","передел","доработ","исправ"],
a:"Правки после сдачи бесплатно: 14 дней на «Странице», 30 на «Сайте», 60 на «Магазине».\nПо ходу работы показываю этапы каждые 1–2 дня, так что сюрпризов в конце не бывает. Оценка задачи и смета — бесплатно."},
{s:["как оплатить","предоплата","способ оплаты","рассрочка"], k:["оплат","аванс","платить","карта","перевод","счет"],
a:"Обычно так: предоплата в начале, остаток после сдачи. Точный порядок обсудим — подстроюсь под удобный вам вариант.\nСмета фиксируется до старта и потом не растёт."},
{s:["домен","хостинг","ssl","сертификат"], k:["доменом","хостинге","замочек"],
a:"Домен и SSL подключаю бесплатно, они входят в стоимость сайта. Помогу выбрать и оформить, если своего ещё нет.\nСам хостинг оплачиваете вы — обычно 150–400 ₽ в месяц."},
{s:["seo","продвижение","реклама"], k:["продвиж","яндекс","гугл","google","поиск","трафик"],
a:"Базовое SEO входит в цену сайта: заголовки, описания, скорость, карта сайта, подключение к Яндекс.Вебмастеру и Google.\nПолноценное продвижение и реклама — отдельная задача."},
{s:["интеграция","интеграции","подключить crm","прием оплат","онлайн-оплата"], k:["crm","api","1с","amocrm","битрикс","платеж","эквайринг","таблиц"],
a:"Интеграции делаю: CRM (Bitrix24, amoCRM), онлайн-оплаты, доставка, 1С, Google-таблицы, нейросети и любой REST API — от 5 000 ₽.\nСначала проверяю API на реальных запросах, потом называю точную цену."},
{s:["как заказать","с чего начать","хочу заказать","оставить заявку","как связаться"], k:["заказ","начать","оформ","связат","контакт","написать","позвонить"],
a:"Проще всего так: заполните три поля в форме «Оставить заявку» — и я пришлю точную цену и срок. Отвечаем круглосуточно, в течение 5 минут.\nИли напишите сразу в Telegram: @ysddev."},
{s:["спасибо","благодарю","понятно"], k:["спасиб","ясно","хорошо"],
a:"Рад помочь. Если готовы — оставьте заявку ниже, отвечу быстро."},
{s:["кто вы","о вас","какой опыт","есть отзывы","можно доверять"], k:["опыт","отзыв","надежн","доверя","портфолио"],
a:"YSD DEV — Казань, работаем дистанционно по всему миру. Рейтинг 4,87 на Профи.ру, 30 отзывов на сайте, в портфолио 35 работ.\nПаспорт проверен, есть страховка. Отзывы — в разделе ниже."},
{s:["ии","искусственный интеллект","нейросет","ai-бот","ассистент"], k:["gpt","нейро"],
a:"AI-ботов и ассистентов делаю: подключаю нейросеть к Telegram или к сайту, чтобы она отвечала клиентам, консультировала и собирала заявки.\nЦена по договорённости — зависит от модели и объёма обращений. Опишите задачу, посчитаю."},
{s:["позвать человека","живой человек","оператор","менеджер","с человеком","не бот","юсуф"], k:["человек","человеком","живьем","лично","созвон","автор"],
a:"__HUMAN__"}
],
miss: "Не уверен, что понял вопрос. Спросите про цену, сроки, что входит в работу, боты, сайты или презентации.\nИли нажмите «Позвать человека» — отвечу лично."
},
en: {
hi: "Hi, I'm the YSD DEV assistant.\nAsk me about prices, timelines or what's included — in your own words.",
chips: ["How much is a website?", "How long does it take?", "What's included?", "I need a Telegram bot", "Talk to a human"],
ph: "Ask anything about your project",
chat: {
call: "Talk to a human",
who: "Yusuf",
hi: "Yusuf has been notified. Type your question here — he'll answer in this window, usually within five minutes.",
live: "Yusuf is here · answering in person",
wait: "waiting for a reply",
off: "The fastest way to reach me is a direct message — I reply within minutes:",
err: "The message didn't go through. Please write to me here:",
tg: "Telegram — @ysddev"
},
rules: [
{s:["hello","hey","good morning","good evening"], k:["hi"],
a:"Hi! Tell me what you need — a website, a Telegram bot or a deck. I'll give you a price and a timeline."},
{s:["how much","price","cost","pricing","quote","budget"], k:["cheap","expensive","rate","fee"],
a:"Three fixed packages:\n• Page — 8 000 ₽ (about $95), 2–4 days\n• Website — 20 000 ₽ (about $235), 5–8 days\n• Store — 30 000 ₽ (about $350), 10–14 days\n\nSeparately: Telegram bot 8 000 ₽, presentation from 5 000 ₽, Figma-to-HTML from 3 000 ₽, edits to an existing site from 2 000 ₽.\nAfter a short brief you get an exact number, and it doesn't move afterwards."},
{s:["how long","how many days","deadline","timeline","lead time","when will"], k:["days","weeks","fast","urgent","rush","quick"],
a:"Timelines:\n• Page — 2–4 days\n• Multi-page website — 5–8 days\n• Online store — 10–14 days\n• Telegram bot — 1–2 days\n• Presentation — 1–2 days\n\nRush jobs are fine. Say so in your request and I'll tell you honestly how far the deadline can be pulled in."},
{s:["what is included","included in the price","what do i get","what does it cover"], k:["include","included","inside","cover"],
a:"Everything needed to go live:\nstructure and design, mobile layout, a lead form that pings my Telegram, basic SEO, domain, hosting and SSL setup, plus a short handover so you can edit the texts yourself.\nFree revisions after delivery: 14 days on Page, 30 on Website, 60 on Store."},
{s:["telegram bot","need a bot","build a bot","chat bot","chatbot"], k:["bot","telegram"],
a:"A Telegram bot is 8 000 ₽ and takes 1–2 days.\nBookings, orders, payments, broadcasts and support, wired to Google Sheets or your CRM, with lead alerts straight to your phone.\nExamples are under Work — the Telegram bots filter."},
{s:["need a website","build a site","online store","landing page","e-commerce","web site"], k:["site","website","shop","store","page"],
a:"Websites on WordPress, Tilda or hand-written code — whichever fits the job and the budget.\nPage 8 000 ₽, Website 20 000 ₽, Store 30 000 ₽. The same scope billed item by item costs more — 25 000 and 35 000.\nThere are 15 examples under Work — the Websites filter."},
{s:["presentation","deck","pitch deck","slides"], k:["slide","powerpoint","keynote","investor"],
a:"A deck is from 5 000 ₽, from 500 ₽ per slide, 1–2 days.\nStructure, design, infographics, one consistent style. Delivered editable in PowerPoint, Google Slides or Figma.\nExamples are under Work."},
{s:["guarantee","warranty","revisions","if i dont like","if i do not like","not happy with"], k:["fix","fixes","change","changes","refund","unhappy"],
a:"Free revisions after delivery: 14 days on Page, 30 on Website, 60 on Store.\nI show progress every 1–2 days, so nothing comes as a surprise at the end. Scoping and the quote cost nothing."},
{s:["how to pay","payment terms","deposit","installments"], k:["pay","invoice","card","transfer","upfront"],
a:"Usually a deposit up front and the balance on delivery — I can adapt to what works for you.\nThe quote is fixed before we start and doesn't grow.\nInternational clients: card transfer, USDT or an invoice, whichever you prefer."},
{s:["domain","hosting","ssl"], k:["certificate","https","server"],
a:"Domain and SSL setup are included at no extra cost, and I'll help you pick a domain if you don't have one.\nHosting itself you pay for — usually 150–400 ₽ (about $2–5) a month."},
{s:["seo","promotion","advertising","google ranking"], k:["search","ads","traffic","rank"],
a:"Basic SEO is included: titles, descriptions, speed, sitemap, structured data and submission to Google and Yandex.\nOngoing promotion and paid ads are a separate job — happy to quote it."},
{s:["integration","connect crm","online payments","api"], k:["crm","payment","stripe","sheets","zapier"],
a:"Integrations from 5 000 ₽: CRM (Bitrix24, amoCRM, HubSpot), online payments, delivery, 1C, Google Sheets, AI services and any REST API.\nI test the API on real requests first, then name a firm price."},
{s:["how to order","how do i start","place an order","get in touch","contact"], k:["order","start","begin","reach","email"],
a:"Fill in three fields in the request form below and you'll get the exact price and timeline the same day — I answer around the clock, usually within five minutes.\nOr message me on Telegram: @ysddev."},
{s:["thank you","thanks","got it"], k:["appreciate","cheers"],
a:"Glad to help. When you're ready, leave a request below and I'll come back with a price and a date."},
{s:["who are you","about you","your experience","any reviews","can i trust"], k:["review","reviews","trust","portfolio","experience"],
a:"YSD DEV — based in Kazan, Russia, working remotely worldwide, in Russian and English.\n4.87 rating on Profi.ru, 30 reviews on this site, 35 projects in the portfolio. Identity verified, work insured."},
{s:["ai bot","ai assistant","artificial intelligence","gpt","neural"], k:["ai","assistant","llm","openai"],
a:"I build AI bots and assistants: a language model wired into Telegram or your website so it answers clients, advises them and collects leads.\nPrice depends on the model and the volume of conversations — describe the task and I'll quote it."},
{s:["do you speak english","speak english","what language","in english","russian"], k:["english","language","translate"],
a:"Yes — I work in English and Russian, and the site itself ships in both if you need it.\nWrite in English any time: here, on Telegram or in the request form."},
{s:["where are you","time zone","timezone","abroad","outside russia","international"], k:["located","country","remote","overseas"],
a:"I'm in Kazan, Russia (UTC+3), working remotely with clients anywhere.\nMost of the work happens in chat: a brief, a mock-up before you pay, then progress every 1–2 days. Payment from abroad by card transfer, USDT or an invoice."},
{s:["talk to a human","real person","human","operator","manager","not a bot","yusuf"], k:["person","someone","live","call"],
a:"__HUMAN__"}
],
miss: "I'm not sure I caught that. Ask about prices, timelines, what's included, bots, websites or decks.\nOr tap “Talk to a human” below and I'll answer in person."
}
};
/* Живой чат с человеком.
Пока адрес пустой, виджет работает как автоответчик, а кнопка «Позвать человека»
отправляет в Telegram. Чтобы отвечать прямо в окне сайта: положите chat.php на
российский хостинг и впишите сюда его адрес, например "https://ysddev.ru/chat.php". */
var CHAT_URL = "";
(function(){
var log = document.getElementById("aiLog"), chips = document.getElementById("aiChips"),
form = document.getElementById("aiForm"), input = document.getElementById("aiText"),
launch = document.getElementById("aiOpen"), box = document.getElementById("ai"),
sub = document.querySelector('.ai-hd [data-i="aiS"]'),
started = false, misses = 0, mine = [];
if (!log || !launch) return;
var C = { on:false, last:0, sid:null, timer:0, t0:0, live:false };
var hold = window.trapOn || function(){}, free = window.trapOff || function(){};
function L(){ return document.documentElement.lang === "en" ? "en" : "ru"; }
function kb(){ return AI[L()]; }
function ls(k, v){
try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }
catch(e){ return null; }
}
function sid(){
if (C.sid) return C.sid;
var v = ls("ysd_sid") || "";
if (!/^[a-z0-9]{12,40}$/.test(v)) {
var a = new Uint8Array(8), i;
if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
else for (i = 0; i < 8; i++) a[i] = Math.floor(Math.random() * 256);
v = ""; for (i = 0; i < 8; i++) v += ("0" + a[i].toString(16)).slice(-2);
ls("ysd_sid", v);
}
C.sid = v; return v;
}
function add(text, who, tag){
var p = document.createElement("p");
p.className = who; if (tag) p.setAttribute("data-who", tag);
p.textContent = text;
log.appendChild(p); log.scrollTop = log.scrollHeight;
return p;
}
function addTg(text){
var p = add(text, "bot"), a = document.createElement("a");
a.className = "ai-tg"; a.href = "https://t.me/ysddev";
a.target = "_blank"; a.rel = "noopener"; a.textContent = kb().chat.tg;
p.appendChild(a);
}
function note(text){
var p = document.createElement("p");
p.className = "sys"; p.textContent = text;
log.appendChild(p); log.scrollTop = log.scrollHeight;
}
function url(q){ return CHAT_URL + (CHAT_URL.indexOf("?") < 0 ? "?" : "&") + q; }
function pull(){
if (!C.on || !CHAT_URL || document.hidden) return;
fetch(url("sid=" + sid() + "&after=" + C.last), { cache: "no-store" })
.then(function(r){ return r.json(); })
.then(function(d){
if (!d || !d.ok || !d.messages) return;
d.messages.forEach(function(m){
if ((m.id | 0) > C.last) { C.last = m.id | 0; ls("ysd_last", String(C.last)); }
add(m.text, "op", kb().chat.who);
C.t0 = Date.now();
if (!C.live) { C.live = true; if (sub) sub.textContent = kb().chat.live; }
if (!document.body.classList.contains("ai-on")) launch.classList.add("new");
});
})
.catch(function(){});
}
function tick(){
clearTimeout(C.timer);
if (!C.on) return;
var age = Date.now() - C.t0;
if (age > 2700000) { C.on = false; return; }           /* 45 минут тишины — отключаемся */
C.timer = setTimeout(function(){ pull(); tick(); }, age < 180000 ? 4000 : (age < 900000 ? 12000 : 30000));
}
function push(text){
C.t0 = Date.now();
fetch(url("sid=" + sid()), {
method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" },
body: JSON.stringify({ text: text, page: location.pathname, lang: L() })
})
.then(function(r){ if (!r.ok) throw 0; return r.json(); })
.then(function(d){ if (!d || !d.ok) throw 0; })
.catch(function(){ addTg(kb().chat.err); });
tick();
}
function human(){
if (!CHAT_URL) { addTg(kb().chat.off); return; }
if (C.on) { note(kb().chat.wait); return; }
C.on = true; C.t0 = Date.now();
C.last = parseInt(ls("ysd_last") || "0", 10) || 0;
ls("ysd_op", String(Date.now()));
add(kb().chat.hi, "bot");
chips.innerHTML = "";                 /* дальше отвечает человек — подсказки не нужны */
var call = kb().chat.call;
var ctx = mine.filter(function(x){ return x !== call; }).slice(-3).join(" / ");
push((L() === "en" ? "A visitor asked for a human." : "Посетитель просит связаться с человеком.")
+ (ctx ? "\n\n" + (L() === "en" ? "Asked before: " : "До этого спрашивал: ") + ctx : ""));
tick();
}
function answer(q){
var k = kb(), hit = k.miss, best = 0;
var t = " " + q.toLowerCase().replace(/ё/g, "е").replace(/[^0-9a-zа-я\s\-]/gi, " ").replace(/\s+/g, " ") + " ";
k.rules.forEach(function(r){
var sc = 0;
(r.s || []).forEach(function(w){ if(t.indexOf(w.replace(/ё/g, "е")) >= 0) sc += 3; });
(r.k || []).forEach(function(w){ if(t.indexOf(w.replace(/ё/g, "е")) >= 0) sc += 1; });
if(sc > best){ best = sc; hit = r.a; }
});
if (hit === "__HUMAN__") { human(); misses = 0; return; }
misses = hit === k.miss ? misses + 1 : 0;
var p = document.createElement("p");
p.className = "bot typing"; p.innerHTML = "<i></i><i></i><i></i>";
log.appendChild(p); log.scrollTop = log.scrollHeight;
var twice = misses >= 2;
setTimeout(function(){
p.remove(); add(hit, "bot");
if (twice && !C.on) { misses = 0; human(); }
}, 420 + Math.min(700, hit.length * 3));
}
function say(q){
add(q, "me"); mine.push(q); if (mine.length > 8) mine.shift();
if (C.on) { push(q); return; }
answer(q);
}
function drawChips(){
chips.innerHTML = kb().chips.map(function(c){ return "<button type='button'>" + c + "</button>"; }).join("");
chips.querySelectorAll("button").forEach(function(b){
b.addEventListener("click", function(){ say(b.textContent); });
});
}
function start(){
if (started) return;
started = true; add(kb().hi, "bot"); drawChips();
if (CHAT_URL && Date.now() - (parseInt(ls("ysd_op") || "0", 10) || 0) < 21600000) {
C.on = true; C.t0 = Date.now();
C.last = parseInt(ls("ysd_last") || "0", 10) || 0;
chips.innerHTML = ""; tick(); pull();
}
}
function openAi(){
document.body.classList.add("ai-on");
launch.classList.remove("new");
start();
hold(box, innerWidth > 620 ? input : document.getElementById("aiClose"));
}
function closeAi(){ document.body.classList.remove("ai-on"); free(box); }
launch.addEventListener("click", openAi);
document.getElementById("aiClose").addEventListener("click", closeAi);
addEventListener("keydown", function(e){ if(e.key === "Escape") closeAi(); });
document.addEventListener("visibilitychange", function(){ if (!document.hidden && C.on) { pull(); tick(); } });
form.addEventListener("submit", function(e){
e.preventDefault();
var q = input.value.trim(); if(!q) return;
input.value = ""; say(q);
});
window.YSD_AI = { reset: function(){
if(!started) return;
if(C.on){ if (sub && C.live) sub.textContent = kb().chat.live; return; }
log.innerHTML = ""; add(kb().hi, "bot"); drawChips();
} };
if (document.body.classList.contains("ai-on")) openAi();
})();
})();