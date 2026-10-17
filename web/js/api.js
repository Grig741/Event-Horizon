import { fmtDate, t } from "./i18n.js";
// Talks to our server. Inside Telegram, every request carries the signed initData so the server knows who you are.
export const tg = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData ? window.Telegram.WebApp : null;

export const state = { user: null, pro: false, proUntil: 0, price: 150, bot: "" };
export const bus = new EventTarget();

async function req(path, { method = "GET", as = "json" } = {}) {
  const headers = {};
  if (tg) headers["X-Telegram-Init-Data"] = tg.initData;
  const r = await fetch(path, { method, headers, cache: "no-store" });
  if (!r.ok) {
    const err = new Error((await r.text().catch(() => "")) || r.statusText);
    err.status = r.status;
    throw err;
  }
  return as === "text" ? r.text() : r.json();
}

export const api = {
  config: () => req("/api/config"),
  me: () => req("/api/me", { method: "POST" }),
  news: ({ limit = 12, offset = 0, host = "" } = {}) =>
    req(`/api/news?limit=${limit}&offset=${offset}${host ? `&host=${encodeURIComponent(host)}` : ""}`),
  apod: () => req("/api/apod"),
  invoice: () => req("/api/invoice", { method: "POST" }),
  lesson: name => req(`/api/lesson/${encodeURIComponent(name)}.js`, { as: "text" }),
};

export async function refreshMe() {
  try {
    const me = await api.me();
    Object.assign(state, { user: me.user, pro: !!me.pro, proUntil: me.pro_until || 0, price: me.price || state.price });
  } catch { /* offline: keep defaults */ }
  bus.dispatchEvent(new Event("me"));
}

export function toast(msg, ms = 3200) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.h); toast.h = setTimeout(() => { t.hidden = true; }, ms);
}

export function timeAgo(iso) {
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (!isFinite(s)) return "";
  if (s < 3600) return t("time.min", { n: Math.max(1, Math.round(s / 60)) });
  if (s < 86400) return t("time.h", { n: Math.round(s / 3600) });
  const d = Math.round(s / 86400);
  if (d > 30) return fmtDate(iso);
  return d === 1 ? t("time.yesterday") : t("time.days", { n: d });
}
