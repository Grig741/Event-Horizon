// Runs hourly. From DIGEST_HOUR_UTC on, sends the morning digest to Pro users who have it on.
// Each run has 30 seconds, so progress is saved and the next run continues where this one stopped.
import { DIGEST_HOUR } from "../lib/env.mjs";
import { fmtItem, skyText } from "../lib/bot.mjs";
import { fmtDate, tr, userLang } from "../lib/i18n.mjs";
import { getNews } from "../lib/news.mjs";
import { tg } from "../lib/tg.mjs";
import * as db from "../lib/store.mjs";

const BUDGET_MS = 24000;

export default async () => {
  const start = Date.now(), d = new Date();
  // Pro is paid manually and does not renew by itself: remind people 3 days before it ends
  for (const u of await db.expiringSoon(3)) {
    const l = userLang(u);
    try { await tg("sendMessage", { chat_id: u.id, text: tr(l, "expiring", { date: fmtDate(l, u.pro_until) }), parse_mode: "HTML" }); } catch (e) { console.log(e.message); }
    await db.markReminded(u.id);
  }
  if (d.getUTCHours() < DIGEST_HOUR()) return;
  const day = d.toISOString().slice(0, 10);
  const prog = (await db.kv.get("digest")) || {};
  const done = prog.day === day ? new Set(prog.sent) : new Set();
  const recipients = (await db.digestRecipients()).filter(id => !done.has(id));
  if (!recipients.length) return;

  const { items } = await getNews();
  const since = Date.now() - 86400000;
  const fresh = items.filter(i => Date.parse(i.published) >= since).slice(0, 6);
  const pick = fresh.length ? fresh : items.slice(0, 4);
  const texts = {};
  const textFor = l => (texts[l] ??= tr(l, "digestHead", { date: fmtDate(l, Date.now() / 1000, { day: "numeric", month: "short" }) }) + "\n\n" +
    pick.map(fmtItem).join("\n\n") + "\n\n" + tr(l, "newsVia") + "\n\n" + tr(l, "digestTonight") + "\n" + skyText(l));

  for (const id of recipients) {
    if (Date.now() - start > BUDGET_MS) break;
    const l = userLang(await db.getUser(id));
    try { await tg("sendMessage", { chat_id: id, text: textFor(l), parse_mode: "HTML", link_preview_options: { is_disabled: true } }); }
    catch (e) { console.log(`digest to ${id} failed: ${e.message}`); }
    done.add(id);
    await new Promise(r => setTimeout(r, 40)); // stay under Telegram's broadcast limit
  }
  await db.kv.set("digest", { day, sent: [...done] });
};

export const config = { schedule: "7 * * * *" };
