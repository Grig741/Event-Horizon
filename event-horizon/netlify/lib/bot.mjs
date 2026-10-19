// Telegram bot logic for the webhook: news, tonight's sky, Pro paid by transfer (details sent in Telegram, admin confirms).
// Answers in the user's language (English, Russian, Armenian, Spanish); /lang changes it.
import { ADMIN_IDS, PAY_DETAILS, PRICE_LABEL, PRO_DAYS, SITE_URL, SUBSCRIPTION_SECONDS } from "./env.mjs";
import { esc, PAYLOAD, tg } from "./tg.mjs";
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
  if (!pro) rows.push([{ text: tr(l, "btnPro", { price: PRICE_LABEL() }), callback_data: "pro" }]);
  return { inline_keyboard: rows };
}

const langKb = () => ({ inline_keyboard: [LANGS.map(x => ({ text: LANG_NAMES[x], callback_data: "lang:" + x }))] });

const send = (chat_id, text, extra = {}) => tg("sendMessage", { chat_id, text, parse_mode: "HTML", link_preview_options: { is_disabled: true }, ...extra });

async function proOffer(l, chatId, userId) {
  const u = await db.getUser(userId);
  if (u && u.pro_until > now()) return send(chatId, tr(l, "already", { date: fmtDate(l, u.pro_until) }));
  return send(chatId, tr(l, "offer", { price: PRICE_LABEL() }), { reply_markup: { inline_keyboard: [[{ text: tr(l, "subscribe"), callback_data: "payreq" }]] } });
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

  // Admin replies to a request/receipt card → the bot passes the reply to that user
  if (isAdmin && m.reply_to_message && !cmd.startsWith("/")) {
    const target = userIdFrom(m.reply_to_message);
    if (target) return relayToUser(target, m, chat);
  }
  if (isAdmin && cmd === "/grant") {
    const [id, days] = arg.split(/\s+/).map(Number);
    if (!id) return send(chat, "Использование: /grant <user_id> [дней]");
    return grant(id, days || PRO_DAYS(), from.id, chat);
  }
  if (isAdmin && cmd === "/revokepro") {
    const id = Number(arg);
    if (!id || !(await db.revokePro(id))) return send(chat, "Использование: /revokepro <user_id>");
    return send(chat, `Pro отключён у ${id}.`);
  }
  if (isAdmin && cmd === "/send") {
    const [id, ...rest2] = arg.split(/\s+/);
    if (!Number(id) || !rest2.length) return send(chat, "Использование: /send <user_id> текст");
    return relayToUser(Number(id), { text: rest2.join(" ") }, chat);
  }
  // Anything a user sends that is not a command (receipt screenshot, question) goes to the admins
  if (!isAdmin && !cmd.startsWith("/")) return forwardToAdmins(m, l);

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
  if (cmd === "/terms") return send(chat, tr(l, "terms", { days: PRO_DAYS(), price: PRICE_LABEL() }));
  if (cmd === "/stats" && isAdmin) {
    const s = await db.stats();
    return send(chat, `Pro сейчас: ${s.pro}\nРучных оплат подтверждено: ${s.manual}\nОплат звёздами: ${s.payments} (${s.stars} ⭐)`);
  }
  if (cmd === "/refund" && isAdmin) {
    const p = arg && (await db.getPayment(arg));
    if (!p) return send(chat, "Usage: /refund <telegram_payment_charge_id>");
    await tg("refundStarPayment", { user_id: p.userId, telegram_payment_charge_id: p.chargeId });
    await db.markRefunded(p.chargeId);
    return send(chat, `Refunded ${p.amount} Stars to ${p.userId}.`);
  }
}

// ---------- manual payments ----------
const who = u => `${esc(u.first_name || "")}${u.username ? " @" + esc(u.username) : ""} · id ${u.id}`;
const userIdFrom = msg => { const t = msg.text || msg.caption || ""; const m = t.match(/\bid (\d+)/); return m ? Number(m[1]) : null; };
const grantKb = id => ({ inline_keyboard: [[{ text: `✅ Выдать Pro на ${PRO_DAYS()} дней`, callback_data: `grant:${id}:${PRO_DAYS()}` }]] });

async function toAdmins(text, extra = {}) {
  for (const a of ADMIN_IDS()) await send(a, text, extra).catch(e => console.log("admin notify failed:", e.message));
}

async function payRequest(q, l) {
  await db.upsertUser(q.from);
  const chat = q.message?.chat?.id ?? q.from.id;
  if (PAY_DETAILS()) await send(chat, tr(l, "detailsHere", { details: esc(PAY_DETAILS()), price: PRICE_LABEL() }));
  else await send(chat, tr(l, "detailsSoon"));
  await toAdmins(`💳 <b>Запрос на оплату Pro (${PRICE_LABEL()})</b>\n${who(q.from)} · язык ${l}\n\n` +
    (PAY_DETAILS() ? "Реквизиты отправлены автоматически. Ждите чек." : "Ответьте на это сообщение реквизитами — бот перешлёт их пользователю."),
    { reply_markup: grantKb(q.from.id) });
}

async function forwardToAdmins(m, l) {
  for (const a of ADMIN_IDS()) {
    try {
      const copy = await tg("copyMessage", { chat_id: a, from_chat_id: m.chat.id, message_id: m.message_id });
      const kind = m.photo || m.document ? "🧾 Чек / файл" : "💬 Сообщение";
      await send(a, `${kind} от ${who(m.from)}\nОтветьте на это сообщение, чтобы написать пользователю.`,
        { reply_markup: grantKb(m.from.id), reply_parameters: { message_id: copy.message_id, allow_sending_without_reply: true } });
    } catch (e) { console.log("forward failed:", e.message); }
  }
  if (m.photo || m.document) return send(m.chat.id, tr(l, "receiptGot"));
}

async function relayToUser(id, m, adminChat) {
  const u = await db.getUser(id);
  const l = userLang(u, null);
  try {
    if (m.text) await send(id, tr(l, "fromAdmin", { text: esc(m.text) }));
    else await tg("copyMessage", { chat_id: id, from_chat_id: m.chat.id, message_id: m.message_id });
    return send(adminChat, `✉️ Отправлено пользователю ${id}.`);
  } catch (e) {
    return send(adminChat, `Не удалось отправить ${id}: ${esc(e.message)}`);
  }
}

async function grant(id, days, by, adminChat) {
  const until = await db.grantPro(id, days, by);
  const u = await db.getUser(id);
  const l = userLang(u, null);
  await send(id, tr(l, "welcome", { date: fmtDate(l, until) }), { reply_markup: mainKb(l, true) }).catch(() => {});
  return send(adminChat, `✅ Pro выдан ${id} до ${fmtDate("ru", until)}.`);
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
  if (q.data?.startsWith("grant:")) {
    if (!ADMIN_IDS().has(q.from.id)) return;
    const [, id, days] = q.data.split(":").map(Number);
    await tg("editMessageReplyMarkup", { chat_id: chat, message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
    return grant(id, days, q.from.id, chat);
  }
  const l = userLang(await db.getUser(q.from.id), q.from);
  if (q.data === "payreq") return payRequest(q, l);
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
