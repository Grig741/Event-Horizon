// /api/* for the site and Mini App. Identity comes only from Telegram's signed initData.
import { getNews, refreshApod } from "../lib/news.mjs";
import { verifyInitData } from "../lib/tg.mjs";
import * as db from "../lib/store.mjs";
import { BOT_USERNAME, FREE_NEWS_DEPTH, PRICE_LABEL } from "../lib/env.mjs";
import { LESSONS } from "../lib/lessons.generated.mjs";

const json = (o, status = 200, headers = {}) => Response.json(o, { status, headers: { "Cache-Control": "no-store", ...headers } });
const text = (t, status) => new Response(t, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

// The Android/iOS app runs from these local origins and calls the API cross-origin.
const APP_ORIGINS = new Set(["capacitor://localhost", "https://localhost", "http://localhost"]);

export default async (req) => {
  const origin = req.headers.get("origin") || "";
  if (!APP_ORIGINS.has(origin)) return handle(req);
  const cors = { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Telegram-Init-Data", "Access-Control-Max-Age": "86400", "Vary": "Origin" };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const res = await handle(req);
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
  return out;
};

async function handle(req) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, "");
  const user = verifyInitData(req.headers.get("x-telegram-init-data"));
  const pro = user ? await db.isPro(user.id) : false;

  if (path === "/api/config") return json({ bot: BOT_USERNAME(), price: PRICE_LABEL() }, 200, { "Cache-Control": "public, max-age=300" });

  if (path === "/api/news") {
    let limit = Math.max(1, Math.min(30, parseInt(url.searchParams.get("limit") || "12", 10) || 12));
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0);
    const host = url.searchParams.get("host") || "";
    let locked = false;
    if (!pro && offset + limit > FREE_NEWS_DEPTH) { limit = Math.max(0, FREE_NEWS_DEPTH - offset); locked = true; }
    const { items, updated } = await getNews();
    const list = host ? items.filter(i => i.host === host) : items;
    return json({ items: limit ? list.slice(offset, offset + limit) : [], updated, locked, pro });
  }

  if (path === "/api/apod") {
    try { return json(await refreshApod(), 200, { "Cache-Control": "public, max-age=600" }); }
    catch { return text("Picture of the day is loading", 503); }
  }

  if (path === "/api/me" && req.method === "POST") {
    if (!user) return json({ user: null, pro: false, price: PRICE_LABEL() });
    const u = await db.upsertUser(user);
    return json({ user: { id: u.id, first_name: u.first_name }, pro: u.pro_until > Date.now() / 1000, pro_until: u.pro_until, price: PRICE_LABEL() });
  }


  const m = path.match(/^\/api\/lesson\/([a-z0-9-]{1,40})\.js$/);
  if (m) {
    const src = LESSONS[m[1]];
    if (!src) return text("Not found", 404);
    if (!pro) return text("Pro lesson", 402);
    return new Response(src, { headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "private, no-store" } });
  }

  if (path === "/api/health") return json({ ok: true });
  return text("Not found", 404);
}

export const config = { path: "/api/*" };
