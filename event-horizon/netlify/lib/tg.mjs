// Minimal Telegram Bot API client plus Mini App initData verification.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { BOT_TOKEN, PRICE, SUBSCRIPTION_SECONDS } from "./env.mjs";
import { tr } from "./i18n.mjs";

export const PAYLOAD = "pro-30d";

export async function tg(method, body = {}) {
  const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({ ok: false, description: `HTTP ${r.status}` }));
  if (!j.ok) throw new Error(`${method}: ${j.description}`);
  return j.result;
}

// Telegram sends this back in X-Telegram-Bot-Api-Secret-Token, so nobody else can post fake updates.
export const webhookSecret = () => createHash("sha256").update(`webhook:${BOT_TOKEN()}`).digest("hex").slice(0, 48);

export function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Returns the Telegram user if initData was signed with our bot token and is under maxAge seconds old. */
export function verifyInitData(raw, maxAge = 86400) {
  if (!raw || !BOT_TOKEN()) return null;
  const params = new URLSearchParams(raw);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");
  const check = [...params.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, v]) => `${k}=${v}`).join("\n");
  const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN()).digest();
  const expected = createHmac("sha256", secret).update(check).digest("hex");
  if (!safeEqual(expected, hash)) return null;
  const age = Date.now() / 1000 - Number(params.get("auth_date") || 0);
  if (!(age >= 0 && age < maxAge)) return null;
  try { return JSON.parse(params.get("user") || "null"); } catch { return null; }
}

export function createInvoiceLink(lang = "en") {
  return tg("createInvoiceLink", {
    title: "Event Horizon Pro",
    description: tr(lang, "invoiceDesc"),
    payload: PAYLOAD,
    currency: "XTR",
    prices: [{ label: tr(lang, "invoiceLabel"), amount: PRICE() }],
    subscription_period: SUBSCRIPTION_SECONDS,
  });
}

export const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
