// Telegram webhook. Telegram calls this for every message, button press and payment.
import { handleUpdate } from "../lib/bot.mjs";
import { safeEqual, webhookSecret } from "../lib/tg.mjs";

export default async (req) => {
  if (req.method !== "POST") return new Response("ok");
  if (!safeEqual(req.headers.get("x-telegram-bot-api-secret-token") || "", webhookSecret())) return new Response("forbidden", { status: 403 });
  const update = await req.json().catch(() => null);
  if (update) {
    try { await handleUpdate(update); }
    catch (e) { console.error("update failed:", e.message); } // still answer 200 so Telegram does not retry forever
  }
  return new Response("ok");
};

export const config = { path: "/tg/webhook" };
