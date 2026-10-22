// Copies ../web into www/ for the Android/iOS app and points it at the live API.
// API address: EH_API env var, or "api" in app.config.json.
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const src = new URL("../../web/", import.meta.url);
const out = new URL("www/", root);
const cfg = JSON.parse(readFileSync(new URL("app.config.json", root), "utf8"));
const api = (process.env.EH_API || cfg.api || "").replace(/\/+$/, "");
if (!/^https:\/\/[^/]+$/.test(api) || api.includes("YOUR-SITE")) {
  console.error("Set the site address: EH_API=https://<site> or \"api\" in mobile/app.config.json");
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

const indexUrl = new URL("index.html", out);
let html = readFileSync(indexUrl, "utf8");
html = html
  // the Telegram Mini App script is useless in the app and slows the start
  .replace(/\s*<script src="https:\/\/telegram\.org\/js\/telegram-web-app\.js"><\/script>/, "")
  // absolute paths ("/css/app.css") → relative, so they resolve inside the app bundle
  .replace(/(href|src)="\/(?!\/)/g, '$1="./')
  .replace("<head>", `<head>\n<script>window.EH_API=${JSON.stringify(api)};</script>`);
writeFileSync(indexUrl, html);
console.log("www/ ready, API:", api);
