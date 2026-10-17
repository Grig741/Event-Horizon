// Bot texts in English, Russian, Armenian and Spanish. Each entry: [en, ru, hy, es].
export const LANGS = ["en", "ru", "hy", "es"];
export const LANG_NAMES = { en: "English", ru: "Русский", hy: "Հայերեն", es: "Español" };
const LOCALE = { en: "en-GB", ru: "ru-RU", hy: "hy-AM", es: "es-ES" };

/** Telegram's language_code → one of our languages. */
export const pickLang = code => {
  const p = String(code || "").slice(0, 2).toLowerCase();
  return LANGS.includes(p) ? p : "en";
};
/** The language a stored user should be answered in: their explicit choice, else their Telegram language. */
export const userLang = (u, from) => (u && LANGS.includes(u.ui_lang) ? u.ui_lang : pickLang(from?.language_code ?? u?.lang));

const B = {
  start: [
    "🕳 <b>Event Horizon</b>\nAstronomy explained by a black hole.\n\n• /news: the latest space news\n• /sky: which planets you can see tonight\n• /pro: Pro subscription\n• /status: your plan\n• /digest: daily digest on or off\n• /lang: language\n• /paysupport: help with payments",
    "🕳 <b>Event Horizon</b>\nАстрономия, которую рассказывает чёрная дыра.\n\n• /news: свежие космические новости\n• /sky: какие планеты видно сегодня\n• /pro: подписка Pro\n• /status: ваш тариф\n• /digest: включить или выключить дайджест\n• /lang: язык\n• /paysupport: помощь с оплатой",
    "🕳 <b>Event Horizon</b>\nԱստղագիտություն, որը պատմում է սև խոռոչը։\n\n• /news՝ տիեզերական թարմ նորություններ\n• /sky՝ որ մոլորակներն են երևում այսօր\n• /pro՝ Pro բաժանորդագրություն\n• /status՝ ձեր փաթեթը\n• /digest՝ միացնել կամ անջատել ամփոփումը\n• /lang՝ լեզու\n• /paysupport՝ օգնություն վճարման հարցում",
    "🕳 <b>Event Horizon</b>\nAstronomía contada por un agujero negro.\n\n• /news: las últimas noticias espaciales\n• /sky: qué planetas se ven esta noche\n• /pro: suscripción Pro\n• /status: tu plan\n• /digest: activar o desactivar el resumen diario\n• /lang: idioma\n• /paysupport: ayuda con pagos"],
  btnOpen: ["🕳 Open Event Horizon", "🕳 Открыть Event Horizon", "🕳 Բացել Event Horizon", "🕳 Abrir Event Horizon"],
  btnNews: ["📰 Latest news", "📰 Новости", "📰 Նորություններ", "📰 Noticias"],
  btnSky: ["🔭 Tonight's sky", "🔭 Небо сегодня", "🔭 Այսօրվա երկինքը", "🔭 El cielo de hoy"],
  btnPro: ["⭐ Get Pro · {price} Stars / month", "⭐ Pro · {price} звёзд в месяц", "⭐ Pro · {price} աստղ ամսական", "⭐ Pro · {price} estrellas al mes"],
  newsLoading: ["News is loading. Try again in a minute.", "Новости загружаются. Попробуйте через минуту.", "Նորությունները բեռնվում են։ Փորձեք մեկ րոպեից։", "Las noticias se están cargando. Inténtalo en un minuto."],
  newsVia: ["<i>News via Spaceflight News API</i>", "<i>Новости из Spaceflight News API, на языке источника (английском)</i>", "<i>Նորությունները՝ Spaceflight News API-ից, աղբյուրի լեզվով (անգլերեն)</i>", "<i>Noticias de Spaceflight News API, en el idioma de la fuente (inglés)</i>"],
  skyTitle: ["🔭 <b>Tonight's sky</b>", "🔭 <b>Небо сегодня</b>", "🔭 <b>Այսօրվա երկինքը</b>", "🔭 <b>El cielo de esta noche</b>"],
  allNight: ["🌌 All night: {list}", "🌌 Всю ночь: {list}", "🌌 Ամբողջ գիշեր՝ {list}", "🌌 Toda la noche: {list}"],
  evening: ["🌇 Evening sky (west after sunset): {list}", "🌇 Вечером (на западе после заката): {list}", "🌇 Երեկոյան (արևմուտքում՝ մայրամուտից հետո)՝ {list}", "🌇 Al anochecer (al oeste tras la puesta de sol): {list}"],
  morning: ["🌅 Morning sky (east before sunrise): {list}", "🌅 Утром (на востоке перед рассветом): {list}", "🌅 Առավոտյան (արևելքում՝ արևածագից առաջ)՝ {list}", "🌅 Al amanecer (al este antes de la salida del sol): {list}"],
  hidden: ["☀️ Too close to the Sun: {list}", "☀️ Слишком близко к Солнцу: {list}", "☀️ Չափազանց մոտ են Արեգակին՝ {list}", "☀️ Demasiado cerca del Sol: {list}"],
  moon: ["🌙 Moon: {phase}, {pct}% lit", "🌙 Луна: {phase}, освещено {pct}%", "🌙 Լուսին՝ {phase}, լուսավորված է {pct}%-ով", "🌙 Luna: {phase}, {pct}% iluminada"],
  mars: ["🔴 Light from Mars takes {min} min to reach you right now.", "🔴 Свет от Марса идёт до вас сейчас {min} мин.", "🔴 Մարսի լույսը հիմա ձեզ է հասնում {min} րոպեում։", "🔴 La luz de Marte tarda ahora {min} min en llegar a ti."],
  already: ["⭐ You already have Pro until {date}.", "⭐ У вас уже есть Pro до {date}.", "⭐ Դուք արդեն ունեք Pro մինչև {date}։", "⭐ Ya tienes Pro hasta el {date}."],
  offer: [
    "⭐ <b>Event Horizon Pro</b>\n\n• A morning digest of the day's space news, presented by the right host\n• The full news archive on the site\n• All Pro lessons: Kepler's laws, the true scale of the Solar System\n\nPaid with Telegram Stars. Renews every 30 days, cancel any time.\nBy paying you accept the /terms.",
    "⭐ <b>Event Horizon Pro</b>\n\n• Утренний дайджест космических новостей от нужного ведущего\n• Полный архив новостей на сайте\n• Все Pro-уроки: законы Кеплера, настоящий масштаб Солнечной системы\n\nОплата звёздами Telegram. Продлевается каждые 30 дней, отменить можно в любой момент.\nОплачивая, вы принимаете /terms.",
    "⭐ <b>Event Horizon Pro</b>\n\n• Առավոտյան ամփոփում օրվա տիեզերական նորություններով՝ ճիշտ վարողից\n• Նորությունների ամբողջ արխիվը կայքում\n• Բոլոր Pro դասերը՝ Կեպլերի օրենքները, Արեգակնային համակարգի իրական մասշտաբը\n\nՎճարումը՝ Telegram աստղերով։ Երկարաձգվում է 30 օրը մեկ, կարող եք չեղարկել ցանկացած պահի։\nՎճարելով՝ ընդունում եք /terms պայմանները։",
    "⭐ <b>Event Horizon Pro</b>\n\n• Un resumen matinal de las noticias espaciales del día, contadas por el presentador adecuado\n• El archivo completo de noticias en la web\n• Todas las lecciones Pro: las leyes de Kepler y la escala real del sistema solar\n\nSe paga con estrellas de Telegram. Se renueva cada 30 días y puedes cancelar cuando quieras.\nAl pagar aceptas los /terms."],
  subscribe: ["⭐ Subscribe for {price} Stars / month", "⭐ Подписаться за {price} звёзд в месяц", "⭐ Բաժանորդագրվել {price} աստղով ամսական", "⭐ Suscribirse por {price} estrellas al mes"],
  invoiceDesc: [
    "Daily space digest in Telegram, the full news archive and every Pro lesson. Renews every 30 days; cancel any time in Telegram.",
    "Ежедневный космический дайджест в Telegram, полный архив новостей и все Pro-уроки. Продлевается каждые 30 дней; отменить можно в Telegram.",
    "Ամենօրյա տիեզերական ամփոփում Telegram-ում, նորությունների ամբողջ արխիվը և բոլոր Pro դասերը։ Երկարաձգվում է 30 օրը մեկ, չեղարկել կարող եք Telegram-ում։",
    "Resumen espacial diario en Telegram, el archivo completo de noticias y todas las lecciones Pro. Se renueva cada 30 días; cancela cuando quieras en Telegram."],
  invoiceLabel: ["Pro, 30 days", "Pro, 30 дней", "Pro, 30 օր", "Pro, 30 días"],
  statusPro: ["⭐ Pro until {date}. Daily digest: {state}.\nManage or cancel the subscription in Telegram Settings → My Stars.", "⭐ Pro до {date}. Дайджест: {state}.\nУправлять подпиской или отменить её можно в Telegram: Настройки → Мои звёзды.", "⭐ Pro մինչև {date}։ Ամփոփում՝ {state}։\nԲաժանորդագրությունը կառավարել կամ չեղարկել կարող եք Telegram-ում՝ Կարգավորումներ → Իմ աստղերը։", "⭐ Pro hasta el {date}. Resumen diario: {state}.\nGestiona o cancela la suscripción en Telegram: Ajustes → Mis estrellas."],
  on: ["on", "включён", "միացված", "activado"],
  off: ["off", "выключен", "անջատված", "desactivado"],
  statusFree: ["You are on the free plan. /pro to upgrade.", "У вас бесплатный тариф. /pro — перейти на Pro.", "Դուք անվճար փաթեթում եք։ /pro՝ Pro-ին անցնելու համար։", "Estás en el plan gratuito. /pro para mejorar."],
  digestPro: ["The daily digest is part of Pro. /pro", "Ежедневный дайджест входит в Pro. /pro", "Ամենօրյա ամփոփումը Pro-ի մաս է։ /pro", "El resumen diario es parte de Pro. /pro"],
  digestOn: ["Daily digest on ✅", "Дайджест включён ✅", "Ամփոփումը միացված է ✅", "Resumen diario activado ✅"],
  digestOff: ["Daily digest off", "Дайджест выключен", "Ամփոփումն անջատված է", "Resumen diario desactivado"],
  paysupport: ["Payment problem? Send /paysupport followed by a description and the date of the payment. We answer within 48 hours.", "Проблема с оплатой? Отправьте /paysupport, а после — описание и дату платежа. Ответим в течение 48 часов.", "Վճարման հետ խնդի՞ր կա։ Ուղարկեք /paysupport, իսկ դրանից հետո՝ նկարագրությունը և վճարման ամսաթիվը։ Կպատասխանենք 48 ժամվա ընթացքում։", "¿Problema con un pago? Envía /paysupport seguido de una descripción y la fecha del pago. Respondemos en 48 horas."],
  terms: [
    "<b>Terms</b>\nEvent Horizon Pro is a digital subscription paid in Telegram Stars. It renews every 30 days until you cancel in Telegram. Content is educational. News summaries belong to their publishers and link to the original article. Refund requests: write /paysupport within 14 days of a payment; each request is reviewed.",
    "<b>Условия</b>\nEvent Horizon Pro — цифровая подписка, оплачиваемая звёздами Telegram. Она продлевается каждые 30 дней, пока вы не отмените её в Telegram. Материалы носят образовательный характер. Тексты новостей принадлежат издателям и ведут на оригинальные статьи. Возврат: напишите /paysupport в течение 14 дней после оплаты; каждый запрос рассматривается.",
    "<b>Պայմաններ</b>\nEvent Horizon Pro-ն թվային բաժանորդագրություն է, որը վճարվում է Telegram աստղերով։ Այն երկարաձգվում է 30 օրը մեկ, մինչև չեղարկեք Telegram-ում։ Նյութերը կրթական են։ Նորությունների տեքստերը պատկանում են հրատարակիչներին և հղվում են բնօրինակ հոդվածներին։ Վերադարձ՝ գրեք /paysupport վճարումից հետո 14 օրվա ընթացքում․ յուրաքանչյուր հայտ դիտարկվում է։",
    "<b>Condiciones</b>\nEvent Horizon Pro es una suscripción digital pagada con estrellas de Telegram. Se renueva cada 30 días hasta que la canceles en Telegram. El contenido es educativo. Los resúmenes de noticias pertenecen a sus editores y enlazan al artículo original. Reembolsos: escribe /paysupport en los 14 días siguientes al pago; cada solicitud se revisa."],
  welcome: ["🕳 Welcome to Pro! Active until {date}.\nYour first digest arrives tomorrow morning. Pro lessons are open in the app.", "🕳 Добро пожаловать в Pro! Действует до {date}.\nПервый дайджест придёт завтра утром. Pro-уроки уже открыты в приложении.", "🕳 Բարի գալուստ Pro! Գործում է մինչև {date}։\nԱռաջին ամփոփումը կգա վաղը առավոտյան։ Pro դասերն արդեն բաց են հավելվածում։", "🕳 ¡Bienvenido a Pro! Activo hasta el {date}.\nTu primer resumen llega mañana por la mañana. Las lecciones Pro ya están abiertas en la app."],
  renewed: ["⭐ Pro renewed until {date}. Thank you!", "⭐ Pro продлён до {date}. Спасибо!", "⭐ Pro-ն երկարաձգվեց մինչև {date}։ Շնորհակալություն։", "⭐ Pro renovado hasta el {date}. ¡Gracias!"],
  digestHead: ["🕳 <b>Your space morning, {date}</b>", "🕳 <b>Ваше космическое утро, {date}</b>", "🕳 <b>Ձեր տիեզերական առավոտը, {date}</b>", "🕳 <b>Tu mañana espacial, {date}</b>"],
  digestTonight: ["🔭 <b>Tonight</b>", "🔭 <b>Сегодня вечером</b>", "🔭 <b>Այս երեկո</b>", "🔭 <b>Esta noche</b>"],
  langChoose: ["Choose a language:", "Выберите язык:", "Ընտրեք լեզուն՝", "Elige un idioma:"],
  langSet: ["Language: English ✅", "Язык: русский ✅", "Լեզու՝ հայերեն ✅", "Idioma: español ✅"],
  badInvoice: ["This invoice is no longer valid. Send /pro for a new one.", "Этот счёт больше не действует. Отправьте /pro, чтобы получить новый.", "Այս հաշիվն այլևս վավեր չէ։ Ուղարկեք /pro՝ նորը ստանալու համար։", "Esta factura ya no es válida. Envía /pro para obtener una nueva."],

  "cmd.news": ["Latest space news", "Свежие космические новости", "Տիեզերական թարմ նորություններ", "Últimas noticias espaciales"],
  "cmd.sky": ["Which planets you can see tonight", "Какие планеты видно сегодня", "Որ մոլորակներն են երևում այսօր", "Qué planetas se ven esta noche"],
  "cmd.pro": ["Pro subscription", "Подписка Pro", "Pro բաժանորդագրություն", "Suscripción Pro"],
  "cmd.status": ["Your plan", "Ваш тариф", "Ձեր փաթեթը", "Tu plan"],
  "cmd.digest": ["Daily digest on or off", "Дайджест вкл. или выкл.", "Ամփոփումը՝ միացնել կամ անջատել", "Activar o desactivar el resumen"],
  "cmd.lang": ["Language", "Язык", "Լեզու", "Idioma"],
  "cmd.paysupport": ["Help with payments", "Помощь с оплатой", "Օգնություն վճարման հարցում", "Ayuda con pagos"],
  "cmd.terms": ["Terms", "Условия", "Պայմաններ", "Condiciones"],
  menuOpen: ["Open", "Открыть", "Բացել", "Abrir"],
};

const PLANETS = {
  Mercury: ["Mercury", "Меркурий", "Մերկուրի", "Mercurio"], Venus: ["Venus", "Венера", "Վեներա", "Venus"],
  Mars: ["Mars", "Марс", "Մարս", "Marte"], Jupiter: ["Jupiter", "Юпитер", "Յուպիտեր", "Júpiter"], Saturn: ["Saturn", "Сатурн", "Սատուրն", "Saturno"],
};
const MOON = [
  ["New Moon", "Новолуние", "Նորալուսին", "Luna nueva"], ["Waxing crescent", "Растущий серп", "Աճող մահիկ", "Creciente"],
  ["First quarter", "Первая четверть", "Առաջին քառորդ", "Cuarto creciente"], ["Waxing gibbous", "Растущая Луна", "Աճող լուսին", "Gibosa creciente"],
  ["Full Moon", "Полнолуние", "Լիալուսին", "Luna llena"], ["Waning gibbous", "Убывающая Луна", "Նվազող լուսին", "Gibosa menguante"],
  ["Last quarter", "Последняя четверть", "Վերջին քառորդ", "Cuarto menguante"], ["Waning crescent", "Убывающий серп", "Նվազող մահիկ", "Menguante"],
];

const i = l => Math.max(0, LANGS.indexOf(l));
export function tr(l, key, vars = {}) {
  let s = B[key] ? B[key][i(l)] ?? B[key][0] : key;
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
  return s;
}
export const planetName = (l, n) => (PLANETS[n] || [n])[i(l)] ?? n;
export const moonName = (l, idx) => MOON[idx][i(l)];
export const fmtDate = (l, sec, opts = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(sec * 1000).toLocaleDateString(LOCALE[l] || "en-GB", { timeZone: "UTC", ...opts });
export const fmtNum = (l, n, d = 1) => Number(n).toLocaleString(LOCALE[l] || "en-GB", { maximumFractionDigits: d, minimumFractionDigits: d });
