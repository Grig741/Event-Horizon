// Event Horizon service worker.
// Only page navigations are touched: if the network is down, an offline screen is shown.
// API calls, scripts, images and Telegram requests go straight to the network, nothing is cached.
const OFFLINE = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Event Horizon</title>
<style>html,body{height:100%;margin:0;background:#000;color:#FFE2B0;font:16px system-ui,sans-serif}
body{display:grid;place-items:center;text-align:center;padding:24px;box-sizing:border-box}
button{margin-top:16px;background:none;border:1px solid #E7A15E;color:#FFE2B0;padding:10px 18px;font:inherit}</style></head>
<body><div><p>No connection. The black hole is waiting for the internet.</p>
<button onclick="location.reload()">Try again</button></div></body></html>`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).catch(() =>
    new Response(OFFLINE, { headers: { "Content-Type": "text/html; charset=utf-8" } })));
});
