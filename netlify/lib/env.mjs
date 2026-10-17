// Settings come from Netlify → Site configuration → Environment variables. Nothing secret is ever sent to the browser.
const env = name => (globalThis.Netlify?.env?.get?.(name) ?? process.env[name] ?? "");

export const BOT_TOKEN = () => env("BOT_TOKEN");
export const BOT_USERNAME = () => env("BOT_USERNAME").replace(/^@/, "");
export const NASA_API_KEY = () => env("NASA_API_KEY") || "DEMO_KEY";
export const PRICE = () => parseInt(env("PRO_PRICE_STARS") || "150", 10);
export const DIGEST_HOUR = () => parseInt(env("DIGEST_HOUR_UTC") || "5", 10);
export const ADMIN_IDS = () => new Set(env("ADMIN_IDS").split(",").map(s => s.trim()).filter(Boolean).map(Number));
// Netlify sets URL to the site's main address (https://name.netlify.app or your own domain)
export const SITE_URL = () => (env("PUBLIC_URL") || env("URL")).replace(/\/$/, "");

export const SUBSCRIPTION_SECONDS = 2592000; // Telegram allows only 30 days for Stars subscriptions
export const FREE_NEWS_DEPTH = 24;
