// Open https://<your-site>/tg/setup once after deploying (and after changing the domain).
// It points the bot at this site. It takes no input, so anyone calling it only re-applies the same settings.
import { commandsFor } from "../lib/bot.mjs";
import { LANGS } from "../lib/i18n.mjs";
import { tg, webhookSecret } from "../lib/tg.mjs";
import { BOT_TOKEN, SITE_URL } from "../lib/env.mjs";

export default async () => {
  if (!BOT_TOKEN()) return new Response("Set BOT_TOKEN in Netlify environment variables, redeploy, then open this page again.", { status: 503 });
  const site = SITE_URL();
  if (!site.startsWith("https://")) return new Response("The site URL must be https.", { status: 500 });
  const steps = [];
  const run = async (name, method, body) => {
    try { await tg(method, body); steps.push(`✅ ${name}`); } catch (e) { steps.push(`❌ ${name}: ${e.message}`); }
  };
  await run("Webhook", "setWebhook", {
    url: `${site}/tg/webhook`, secret_token: webhookSecret(), drop_pending_updates: false,
    allowed_updates: ["message", "callback_query", "pre_checkout_query"],
  });
  await run("Menu button", "setChatMenuButton", { menu_button: { type: "web_app", text: "Event Horizon", web_app: { url: `${site}/` } } });
  await run("Commands", "setMyCommands", { commands: commandsFor("en") });
  for (const l of LANGS.filter(x => x !== "en")) await run(`Commands (${l})`, "setMyCommands", { commands: commandsFor(l), language_code: l });
  let me = "";
  try { me = (await tg("getMe")).username; } catch { /* reported above */ }
  return new Response(`Event Horizon bot @${me}\nSite: ${site}\n\n${steps.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};

export const config = { path: "/tg/setup" };
