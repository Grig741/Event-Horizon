// Runs the Netlify functions in plain Node with in-memory Blobs and a fake Telegram/News API.
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

process.env.MEMORY_BLOBS = "1";
process.env.BOT_TOKEN = "123456:TESTTOKEN";
process.env.BOT_USERNAME = "EventHorizonBot";
process.env.ADMIN_IDS = "1";
process.env.URL = "https://event-horizon.netlify.app";

const calls = [];
globalThis.fetch = async (url, opts = {}) => {
  url = String(url);
  if (url.startsWith("https://api.telegram.org/")) {
    const method = url.split("/").pop(); const body = JSON.parse(opts.body || "{}");
    calls.push({ method, body });
    const result = method === "createInvoiceLink" ? "https://t.me/$invoice123" : method === "getMe" ? { username: "EventHorizonBot" } : true;
    return new Response(JSON.stringify({ ok: true, result }));
  }
  if (url.startsWith("https://api.spaceflightnewsapi.net/")) {
    const now = new Date().toISOString();
    const results = Array.from({ length: 40 }, (_, i) => ({ id: i, title: i % 2 ? "Black hole merger seen by LIGO" : "Falcon 9 launches satellites", summary: "Story " + i, url: "https://x/" + i, news_site: "Site", published_at: now }));
    return new Response(JSON.stringify({ results }));
  }
  if (url.startsWith("https://api.nasa.gov/")) return new Response(JSON.stringify({ title: "Pic", date: "2026-10-16", media_type: "image", url: "https://apod/img.jpg" }));
  throw new Error("unexpected fetch " + url);
};

const api = (await import("../netlify/functions/api.mjs")).default;
const webhook = (await import("../netlify/functions/telegram.mjs")).default;
const setup = (await import("../netlify/functions/tg-setup.mjs")).default;
const digest = (await import("../netlify/functions/digest.mjs")).default;
const { verifyInitData, webhookSecret } = await import("../netlify/lib/tg.mjs");
const { classify } = await import("../netlify/lib/news.mjs");

function initData(id, ageSec = 0) {
  const f = { auth_date: String(Math.floor(Date.now() / 1000) - ageSec), query_id: "AAA", user: JSON.stringify({ id, first_name: "Grigor", username: "grigor" }) };
  const dcs = Object.keys(f).sort().map(k => `${k}=${f[k]}`).join("\n");
  const secret = createHmac("sha256", "WebAppData").update(process.env.BOT_TOKEN).digest();
  f.hash = createHmac("sha256", secret).update(dcs).digest("hex");
  return new URLSearchParams(f).toString();
}
const get = (p, h = {}) => api(new Request("https://s" + p, { headers: h }));
const post = (p, h = {}) => api(new Request("https://s" + p, { method: "POST", headers: h }));
const hook = (update, secret = webhookSecret()) => webhook(new Request("https://s/tg/webhook", { method: "POST", headers: { "x-telegram-bot-api-secret-token": secret }, body: JSON.stringify(update) }));
const U = { "x-telegram-init-data": initData(777) };

test("initData: valid, tampered, expired", () => {
  assert.equal(verifyInitData(initData(5)).id, 5);
  assert.equal(verifyInitData(initData(5).replace("Grigor", "Hacker")), null);
  assert.equal(verifyInitData(initData(5, 90000)), null);
  assert.equal(verifyInitData(""), null);
});

test("classify matches the Python server", () => {
  assert.equal(classify("Gravitational waves from a black hole merger", ""), "blackhole");
  assert.equal(classify("Perseverance finds layered rocks", "Mars rover"), "mars");
  assert.equal(classify("SpaceX launches Starlink", ""), "earth");
  assert.equal(classify("Strong solar flare triggers auroras", ""), "sun");
});

test("news: free users stop at 24, Pro users do not", async () => {
  let r = await (await get("/api/news?limit=12&offset=18")).json();
  assert.equal(r.items.length, 6); assert.equal(r.locked, true);
  r = await (await get("/api/news?host=blackhole&limit=5")).json();
  assert.ok(r.items.every(i => i.host === "blackhole"));
});

test("config and apod are public; secrets are not in responses", async () => {
  const c = await (await get("/api/config")).json();
  assert.deepEqual(c, { bot: "EventHorizonBot", price: 150 });
  const a = await get("/api/apod"); assert.equal(a.status, 200);
  assert.ok(!JSON.stringify(await a.json()).includes("TESTTOKEN"));
});

test("lessons and invoices are gated", async () => {
  assert.equal((await get("/api/lesson/kepler.js")).status, 402);
  assert.equal((await get("/api/lesson/kepler.js", U)).status, 402);
  assert.equal((await get("/api/lesson/..%2Fsecret.js", U)).status, 404);
  assert.equal((await post("/api/invoice")).status, 401);
  const inv = await (await post("/api/invoice", U)).json();
  assert.equal(inv.link, "https://t.me/$invoice123");
  const call = calls.find(c => c.method === "createInvoiceLink").body;
  assert.equal(call.currency, "XTR"); assert.equal(call.subscription_period, 2592000); assert.equal(call.prices[0].amount, 150);
});

test("webhook rejects forged updates", async () => {
  assert.equal((await hook({ message: {} }, "wrong")).status, 403);
});

test("payment flow: pre-checkout, pay once, duplicates ignored, Pro unlocked, refund", async () => {
  await hook({ pre_checkout_query: { id: "q1", from: { id: 777 }, currency: "XTR", total_amount: 150, invoice_payload: "pro-30d" } });
  assert.deepEqual(calls.at(-1), { method: "answerPreCheckoutQuery", body: { pre_checkout_query_id: "q1", ok: true } });
  await hook({ pre_checkout_query: { id: "q2", from: { id: 777 }, currency: "XTR", total_amount: 150, invoice_payload: "evil" } });
  assert.equal(calls.at(-1).body.ok, false);

  const exp = Math.floor(Date.now() / 1000) + 2592000;
  const paid = { message: { chat: { id: 777 }, from: { id: 777, first_name: "Grigor" }, successful_payment: { currency: "XTR", total_amount: 150, invoice_payload: "pro-30d", telegram_payment_charge_id: "ch_1", subscription_expiration_date: exp, is_recurring: true, is_first_recurring: true } } };
  const before = calls.length;
  await hook(paid); await hook(paid);
  const welcomes = calls.slice(before).filter(c => c.method === "sendMessage" && c.body.chat_id === 777);
  assert.equal(welcomes.length, 1, "duplicate payment must not be processed twice");

  const me = await (await post("/api/me", U)).json();
  assert.equal(me.pro, true); assert.equal(me.pro_until, exp);
  const lesson = await get("/api/lesson/kepler.js", U);
  assert.equal(lesson.status, 200); assert.match(await lesson.text(), /Kepler/);
  const deep = await (await get("/api/news?limit=12&offset=18", U)).json();
  assert.equal(deep.locked, false); assert.equal(deep.items.length, 12);

  // non-admin cannot refund
  const n = calls.length;
  await hook({ message: { chat: { id: 777 }, from: { id: 777 }, text: "/refund ch_1" } });
  assert.ok(!calls.slice(n).some(c => c.method === "refundStarPayment"));
  // admin can
  await hook({ message: { chat: { id: 1 }, from: { id: 1 }, text: "/refund ch_1" } });
  assert.ok(calls.some(c => c.method === "refundStarPayment" && c.body.telegram_payment_charge_id === "ch_1"));
  assert.equal((await (await post("/api/me", U)).json()).pro, false);
});

test("commands answer", async () => {
  for (const t of ["/start", "/news", "/sky", "/status", "/terms", "/pro"]) {
    const n = calls.length;
    await hook({ message: { chat: { id: 9 }, from: { id: 9, first_name: "A" }, text: t } });
    assert.ok(calls.slice(n).some(c => c.method === "sendMessage"), t);
  }
  const sky = calls.findLast(c => c.body.text?.includes("Tonight's sky"));
  assert.match(sky.body.text, /Moon:/);
});

test("digest goes once per day to Pro users with it on", async () => {
  const exp = Math.floor(Date.now() / 1000) + 2592000;
  await hook({ message: { chat: { id: 55 }, from: { id: 55 }, successful_payment: { currency: "XTR", total_amount: 150, invoice_payload: "pro-30d", telegram_payment_charge_id: "ch_2", subscription_expiration_date: exp } } });
  process.env.DIGEST_HOUR_UTC = "0";
  let n = calls.length; await digest();
  assert.equal(calls.slice(n).filter(c => c.method === "sendMessage" && c.body.chat_id === 55).length, 1);
  n = calls.length; await digest();
  assert.equal(calls.slice(n).filter(c => c.method === "sendMessage").length, 0, "no second digest the same day");
});

test("setup points the webhook at this site with the secret", async () => {
  const r = await setup(); const t = await r.text();
  assert.match(t, /✅ Webhook/);
  const wh = calls.find(c => c.method === "setWebhook").body;
  assert.equal(wh.url, "https://event-horizon.netlify.app/tg/webhook");
  assert.equal(wh.secret_token, webhookSecret());
});

test("bot answers in the user's language and /lang switches it", async () => {
  const say = async (id, text, code) => {
    const n = calls.length;
    await hook({ message: { chat: { id }, from: { id, first_name: "U", language_code: code }, text } });
    return calls.slice(n).filter(c => c.method === "sendMessage").map(c => c.body.text).join("\n");
  };
  assert.match(await say(301, "/start", "ru"), /Астрономия, которую рассказывает чёрная дыра/);
  assert.match(await say(302, "/start", "hy"), /Աստղագիտություն/);
  assert.match(await say(303, "/sky", "es"), /El cielo de esta noche/);
  assert.match(await say(304, "/start", "de"), /Astronomy explained/); // unknown language → English
  // switch 304 to Armenian with the button
  await hook({ callback_query: { id: "cb1", from: { id: 304, language_code: "de" }, data: "lang:hy", message: { chat: { id: 304 } } } });
  assert.match(calls.findLast(c => c.method === "sendMessage").body.text, /Լեզու՝ հայերեն/);
  assert.match(await say(304, "/status", "de"), /անվճար/);
  // invoice in Russian
  await say(301, "/pro", "ru");
  assert.match(calls.findLast(c => c.method === "createInvoiceLink").body.description, /Ежедневный/);
});

test("commands are registered in every language", async () => {
  await setup();
  const langs = calls.filter(c => c.method === "setMyCommands").map(c => c.body.language_code || "default");
  for (const l of ["default", "ru", "hy", "es"]) assert.ok(langs.includes(l), l);
});
