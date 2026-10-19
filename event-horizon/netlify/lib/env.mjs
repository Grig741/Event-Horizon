// Settings come from Netlify → Site configuration → Environment variables. Nothing secret is ever sent to the browser.
const env = name => (globalThis.Netlify?.env?.get?.(name) ?? process.env[name] ?? "");

export const BOT_TOKEN = () => env("BOT_TOKEN");
export const BOT_USERNAME = () => env("BOT_USERNAME").replace(/^@/, "");
export const NASA_API_KEY = () => env("NASA_API_KEY") || "DEMO_KEY";
// Price shown everywhere for manual payment (card / transfer details sent in Telegram)
export const PRICE_LABEL = () => env("PRO_PRICE") || "$4.99";
// Optional: payment details the bot sends automatically. Leave empty to send them yourself.
export const PAY_DETAILS = () => env("PAY_DETAILS").replace(/\\n/g, "\n");
// Days of Pro for one payment
export const PRO_DAYS = () => parseInt(env("PRO_DAYS") || "30", 10);
// Only for the old Telegram Stars flow (kept so earlier Stars payments still register)
export const PRICE = () => parseInt(env("PRO_PRICE_STARS") || "150", 10);
export const SUBSCRIPTION_SECONDS = 2592000;
export const DIGEST_HOUR = () => parseInt(env("DIGEST_HOUR_UTC") || "5", 10);
export const ADMIN_IDS = () => new Set(env("ADMIN_IDS").split(",").map(s => s.trim()).filter(Boolean).map(Number));
// Netlify sets URL to the site's main address (https://name.netlify.app or your own domain)
export const SITE_URL = () => (env("PUBLIC_URL") || env("URL")).replace(/\/$/, "");

export const FREE_NEWS_DEPTH = 24;
