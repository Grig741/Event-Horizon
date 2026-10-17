// Telegram bot logic for the webhook: news, tonight's sky, Pro via Telegram Stars subscription.
// Answers in the user's language (English, Russian, Armenian, Spanish); /lang changes it.
import { ADMIN_IDS, PRICE, SITE_URL, SUBSCRIPTION_SECONDS } from "./env.mjs";
import { createInvoiceLink, esc, PAYLOAD, tg } from "./tg.mjs";
import * as db from "./store.mjs";
import { getNews } from "./news.mjs";
import { fmtDate, fmtNum, LANG_NAMES, LANGS, moonName, pickLang, planetName, tr, userLang } from "./i18n.mjs";
import { jdNow, moonPhase, planetView } from "../../web/js/sky.js";

const EMOJI = { blackhole: "🕳", sun: "☀️", moon: "🌙", mercury: "☿", venus: "♀", earth: "🌍", mars: "🔴", jupiter: "🟠", saturn: "🪐", uranus: "🔵", neptune: "🔷", galaxy: "🌌", exoplanet: "🌐", comet: "☄️" };
const now = () => Math.floor(Date.now() / 1000);

export function skyText(l) {
  const jd = jdNow(), groups = { "all night": [], evening: [], morning: [], hidden: [] };
  for (const n of ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"]) groups[planetView(n, jd).where].push(planetName(l, n));
  const lines = [];
  if (groups["all night"].length) lines.push(tr(l, "allNight", { list: groups["all night"].join(", ") }));
  if (groups.evening.length) lines.push(tr(l, "evening", { list: groups.evening.join(", ") }));
  if (groups.morning.length) lines.push(tr(l, "morning", { list: groups.morning.join(", ") }));
  if (groups.hidden.length) lines.push(tr(l, "hidden", { list: groups.hidden.join(", ") }));
  const m = moonPhase(jd);
  lines.push(tr(l, "moon", { phase: moonName(l, m.index), pct: Math.round(m.illum * 100) }));
  lines.push(tr(l, "mars", { min: fmtNum(l, planetView("Mars", jd).lightMin, 1) }));
  return lines.join("\n");
}

export function fmtItem(i) {
  let s = i.summary || "";
  if (s.length > 260) s = s.slice(0, 257).replace(/\s+\S*$/, "") + "…";
  return `${EMOJI[i.host] || "✨"} <b>${esc(i.title)}</b>\n${esc(s)}\n<a href="${esc(i.url)}">${esc(i.site || "Source")}</a>`;
}

async function newsText(l, n) {
  const { items } = await getNews();
  if (!items.length) return tr(l, "newsLoading");
  return items.slice(0, n).map(fmtItem).join("\n\n") + "\n\n" + tr(l, "newsVia");
}

function mainKb(l, pro) {
  const rows = [];
  if (SITE_URL().startsWith("https://")) rows.push([{ text: tr(l, "btnOpen"), web_app: { url: SITE_URL() + "/" } }]);
  rows.push([{ text: tr(l, "btnNews"), callback_data: "news" }, { text: tr(l, "btnSky"), callback_data: "sky" }]);
  if (!pro) rows.push([{ text: tr(l, "btnPro", { price: PRICE() }), callback_data: "pro" }]);
  return { inline_keyboard: rows };
}

const langKb = () => ({ inline_keyboard: [LANGS.map(x => ({ text: LANG_NAMES[x], callback_data: "lang:" + x }))] });

const send = (chat_id, text, extra = {}) => tg("sendMessage", { chat_id, text, parse_mode: "HTML", link_preview_options: { is_disabled: true }, ...extra });

async function proOffer(l, chatId, userId) {
  const u = await db.getUser(userId);
  if (u && u.pro_until > now()) return send(chatId, tr(l, "already", { date: fmtDate(l, u.pro_until) }));
  const link = await createInvoiceLink(l);
  return send(chatId, tr(l, "offer"), { reply_markup: { inline_keyboard: [[{ text: tr(l, "subscribe", { price: PRICE() }), url: link }]] } });
}

async function onMessage(m) {
  const from = m.from, chat = m.chat.id;
  if (!from) return;
  if (m.successful_payment) return onPaid(m);
  const text = m.text || "";
  const [cmdRaw, ...rest] = text.split(/\s+/);
  const cmd = cmdRaw.split("@")[0].toLowerCase();
  const arg = rest.join(" ").trim();
  const isAdmin = ADMIN_IDS().has(from.id);
  const user = await db.getUser(from.id);
  const l = userLang(user, from);

  if (cmd === "/start") {
    const u = await db.upsertUser(from);
    if (arg === "pro") return proOffer(l, chat, from.id);
    return send(chat, tr(l, "start"), { reply_markup: mainKb(l, u.pro_until > now()) });
  }
  if (cmd === "/news") return send(chat, await newsText(l, (await db.isPro(from.id)) ? 5 : 3));
  if (cmd === "/sky") return send(chat, tr(l, "skyTitle") + "\n\n" + skyText(l));
  if (cmd === "/pro") { await db.upsertUser(from); return proOffer(l, chat, from.id); }
  if (cmd === "/lang") return send(chat, tr(l, "langChoose"), { reply_markup: langKb() });
  if (cmd === "/status") {
    if (user && user.pro_until > now()) return send(chat, tr(l, "statusPro", { date: fmtDate(l, user.pro_until), state: tr(l, user.digest !== false ? "on" : "off") }));
    return send(chat, tr(l, "statusFree"));
  }
  if (cmd === "/digest") {
    if (!user || user.pro_until <= now()) return send(chat, tr(l, "digestPro"));
    const on = user.digest === false;
    await db.setDigest(from.id, on);
    return send(chat, tr(l, on ? "digestOn" : "digestOff"));
  }
  if (cmd === "/paysupport") {
    await send(chat, tr(l, "paysupport"));
    if (arg) for (const a of ADMIN_IDS()) await send(a, `💬 paysupport from ${from.id} (@${esc(from.username || "")}):\n${esc(arg)}`).catch(() => {});
    return;
  }
  if (cmd === "/terms") return send(chat, tr(l, "terms"));
  if (cmd === "/stats" && isAdmin) {
    const s = await db.stats();
    return send(chat, `Pro now: ${s.pro}\nPayments: ${s.payments}\nStars received (net): ${s.stars}`);
  }
  if (cmd === "/refund" && isAdmin) {
    const p = arg && (await db.getPayment(arg));
    if (!p) return send(chat, "Usage: /refund <telegram_payment_charge_id>");
    await tg("refundStarPayment", { user_id: p.userId, telegram_payment_charge_id: p.chargeId });
    await db.markRefunded(p.chargeId);
    return send(chat, `Refunded ${p.amount} Stars to ${p.userId}.`);
  }
}

async function onPaid(m) {
  const sp = m.successful_payment, u = m.from;
  await db.upsertUser(u);
  const l = userLang(await db.getUser(u.id), u);
  const expires = sp.subscription_expiration_date || now() + SUBSCRIPTION_SECONDS;
  const fresh = await db.addPayment({ chargeId: sp.telegram_payment_charge_id, userId: u.id, amount: sp.total_amount, recurring: !!sp.is_recurring, expires });
  if (!fresh) return;
  for (const a of ADMIN_IDS()) send(a, `⭐ ${sp.total_amount} Stars from ${u.id} (@${esc(u.username || "")}). Charge: <code>${esc(sp.telegram_payment_charge_id)}</code>`).catch(() => {});
  if (sp.is_recurring && !sp.is_first_recurring) return send(m.chat.id, tr(l, "renewed", { date: fmtDate(l, expires) }));
  return send(m.chat.id, tr(l, "welcome", { date: fmtDate(l, expires) }), { reply_markup: mainKb(l, true) });
}

async function onCallback(q) {
  const chat = q.message?.chat?.id ?? q.from.id;
  await tg("answerCallbackQuery", { callback_query_id: q.id }).catch(() => {});
  if (q.data?.startsWith("lang:")) {
    const l = pickLang(q.data.slice(5));
    await db.upsertUser(q.from);
    await db.setUiLang(q.from.id, l);
    const u = await db.getUser(q.from.id);
    return send(chat, tr(l, "langSet") + "\n\n" + tr(l, "start"), { reply_markup: mainKb(l, u.pro_until > now()) });
  }
  const l = userLang(await db.getUser(q.from.id), q.from);
  if (q.data === "news") return send(chat, await newsText(l, (await db.isPro(q.from.id)) ? 5 : 3));
  if (q.data === "sky") return send(chat, tr(l, "skyTitle") + "\n\n" + skyText(l));
  if (q.data === "pro") return proOffer(l, chat, q.from.id);
}

async function onPreCheckout(q) {
  const ok = q.invoice_payload === PAYLOAD && q.currency === "XTR";
  const l = userLang(await db.getUser(q.from.id), q.from);
  return tg("answerPreCheckoutQuery", ok ? { pre_checkout_query_id: q.id, ok: true }
    : { pre_checkout_query_id: q.id, ok: false, error_message: tr(l, "badInvoice") });
}

export async function handleUpdate(u) {
  if (u.pre_checkout_query) return onPreCheckout(u.pre_checkout_query);
  if (u.message) return onMessage(u.message);
  if (u.callback_query) return onCallback(u.callback_query);
}

/** Bot command menus, one per language (Telegram picks by the user's app language). */
export const commandsFor = l => ["news", "sky", "pro", "status", "digest", "lang", "paysupport", "terms"]
  .map(c => ({ command: c, description: tr(l, "cmd." + c) }));
export const COMMANDS = commandsFor("en");
export { tr, userLang };
