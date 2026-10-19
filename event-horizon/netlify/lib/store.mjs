// Users and payments live in Netlify Blobs (strongly consistent stores).
// Set MEMORY_BLOBS=1 to run the functions locally without Netlify (used by the tests).
import { getStore } from "@netlify/blobs";

const memory = new Map();
function store(name) {
  if (process.env.MEMORY_BLOBS === "1") {
    if (!memory.has(name)) memory.set(name, new Map());
    const m = memory.get(name);
    return {
      async get(k) { return m.has(k) ? JSON.parse(m.get(k)) : null; },
      async setJSON(k, v, o = {}) { if (o.onlyIfNew && m.has(k)) return { modified: false }; m.set(k, JSON.stringify(v)); return { modified: true }; },
      async delete(k) { m.delete(k); },
    };
  }
  const s = getStore({ name, consistency: "strong" });
  return { get: k => s.get(k, { type: "json" }), setJSON: (k, v, o) => s.setJSON(k, v, o), delete: k => s.delete(k) };
}

const users = () => store("users");
const payments = () => store("payments");
const meta = () => store("meta");
const now = () => Math.floor(Date.now() / 1000);

export async function getUser(id) { return users().get(String(id)); }

export async function upsertUser(u) {
  if (!u?.id) return null;
  const cur = (await getUser(u.id)) || { id: u.id, pro_until: 0, digest: true, created: now() };
  const next = { ...cur, username: u.username ?? cur.username ?? null, first_name: u.first_name ?? cur.first_name ?? null, lang: u.language_code ?? cur.lang ?? null };
  await users().setJSON(String(u.id), next);
  return next;
}

export async function setUiLang(id, l) {
  const u = (await getUser(id)) || { id, pro_until: 0, digest: true, created: now() };
  u.ui_lang = l; await users().setJSON(String(id), u);
}

export async function isPro(id) { const u = await getUser(id); return !!(u && u.pro_until > now()); }

// Index of Pro users for the digest, so we never have to scan every user.
async function proIndex() { return (await meta().get("pro-index")) || {}; }
async function setProIndex(id, until, digest) {
  const idx = await proIndex();
  if (until > now()) idx[id] = { until, digest }; else delete idx[id];
  await meta().setJSON("pro-index", idx);
}

/** Records a payment once. Returns false if Telegram resent the same payment. */
export async function addPayment({ chargeId, userId, amount, recurring, expires }) {
  const res = await payments().setJSON(chargeId, { chargeId, userId, amount, recurring, expires, refunded: false, created: now() }, { onlyIfNew: true });
  if (res && res.modified === false) return false;
  const u = (await getUser(userId)) || { id: userId, pro_until: 0, digest: true, created: now() };
  u.pro_until = Math.max(u.pro_until || 0, expires);
  await users().setJSON(String(userId), u);
  await setProIndex(userId, u.pro_until, u.digest !== false);
  await bumpStats(amount);
  return true;
}

export async function getPayment(chargeId) { return payments().get(chargeId); }

export async function markRefunded(chargeId) {
  const p = await getPayment(chargeId);
  if (!p) return null;
  await payments().setJSON(chargeId, { ...p, refunded: true });
  const u = await getUser(p.userId);
  if (u) { u.pro_until = 0; await users().setJSON(String(u.id), u); }
  await setProIndex(p.userId, 0, false);
  await bumpStats(-p.amount);
  return p;
}

export async function patchUser(id, fields) {
  const u = (await getUser(id)) || { id, pro_until: 0, digest: true, created: now() };
  Object.assign(u, fields); await users().setJSON(String(id), u); return u;
}

/** Manual payment confirmed by an admin: adds `days` of Pro on top of any time left. Returns the new end time. */
export async function grantPro(id, days, by = null) {
  const u = (await getUser(id)) || { id, pro_until: 0, digest: true, created: now() };
  u.pro_until = Math.max(now(), u.pro_until || 0) + days * 86400;
  await users().setJSON(String(id), u);
  await setProIndex(id, u.pro_until, u.digest !== false);
  const s = (await meta().get("stats")) || { stars: 0, payments: 0 };
  s.manual = (s.manual || 0) + 1;
  await meta().setJSON("stats", s);
  const log = (await meta().get("grants")) || [];
  log.push({ id, days, by, at: now(), until: u.pro_until });
  await meta().setJSON("grants", log.slice(-500));
  return u.pro_until;
}

/** Turns Pro off. Returns false if the user is unknown. */
export async function revokePro(id) {
  const u = await getUser(id);
  if (!u) return false;
  u.pro_until = 0; await users().setJSON(String(id), u);
  await setProIndex(id, 0, false);
  return true;
}

/** Pro users whose Pro ends within `days` days and who have not been reminded about this end date yet. */
export async function expiringSoon(days) {
  const idx = await proIndex(), t = now(), limit = t + days * 86400, out = [];
  for (const [k, v] of Object.entries(idx)) {
    if (v.until <= t || v.until > limit) continue;
    const u = await getUser(k);
    if (u && u.pro_until === v.until && u.reminded_for !== u.pro_until) out.push(u);
  }
  return out;
}

export async function markReminded(id) {
  const u = await getUser(id);
  if (u) { u.reminded_for = u.pro_until; await users().setJSON(String(id), u); }
}

export async function setDigest(id, on) {
  const u = await getUser(id);
  if (!u) return;
  u.digest = on; await users().setJSON(String(id), u);
  await setProIndex(id, u.pro_until, on);
}

export async function digestRecipients() {
  const idx = await proIndex();
  return Object.entries(idx).filter(([, v]) => v.until > now() && v.digest).map(([k]) => Number(k));
}

async function bumpStats(stars) {
  const s = (await meta().get("stats")) || { stars: 0, payments: 0 };
  s.stars += stars; s.payments += stars > 0 ? 1 : 0;
  await meta().setJSON("stats", s);
}
export async function stats() {
  const s = (await meta().get("stats")) || { stars: 0, payments: 0 };
  const idx = await proIndex();
  return { stars: s.stars || 0, payments: s.payments || 0, manual: s.manual || 0, pro: Object.values(idx).filter(v => v.until > now()).length };
}

// small key/value for the news cache and digest progress
export const kv = { get: k => meta().get(k), set: (k, v) => meta().setJSON(k, v) };
