// Live news from the Spaceflight News API, plus NASA's picture of the day, cached in Blobs.
// Each article gets a `host`: the object that presents it (mirrors server/news.py).
import { kv } from "./store.mjs";
import { NASA_API_KEY } from "./env.mjs";

const SNAPI = "https://api.spaceflightnewsapi.net/v4/articles/?limit=60&ordering=-published_at";
const KEEP = 120;
const STALE_MS = 20 * 60 * 1000;

const TOPICS = [
  ["blackhole", ["black holes?", "event horizon", "gravitational[- ]waves?", "\\bligo\\b", "quasars?", "sagittarius a\\*", "\\bm87\\b", "accretion"]],
  ["mercury", ["\\bmercury\\b", "bepicolombo"]],
  ["venus", ["\\bvenus\\b", "davinci", "veritas"]],
  ["mars", ["\\bmars\\b", "martian", "perseverance", "curiosity rover", "\\bmro\\b"]],
  ["jupiter", ["\\bjupiter\\b", "\\bjuno\\b", "europa", "\\bio\\b", "ganymede", "callisto", "\\bjuice\\b"]],
  ["saturn", ["\\bsaturn\\b", "titan", "enceladus", "dragonfly", "cassini"]],
  ["uranus", ["\\buranus\\b"]],
  ["neptune", ["\\bneptune\\b", "triton"]],
  ["exoplanet", ["exoplanets?", "\\btess\\b", "habitable zone", "super-earth"]],
  ["galaxy", ["galax(y|ies)", "\\bjwst\\b", "webb", "hubble", "nebula", "dark matter", "dark energy", "cosmolog", "big bang", "euclid", "supernova", "neutron star", "pulsar", "rubin"]],
  ["comet", ["comets?", "asteroids?", "meteor", "near-earth object", "\\bneo\\b", "planetary defen[cs]e"]],
  ["sun", ["\\bsun\\b", "solar (flare|wind|storm|cycle|maximum|minimum|eclipse|probe|orbiter)", "geomagnetic", "aurora", "coronal", "parker solar", "\\bsoho\\b", "heliophysics"]],
  ["moon", ["\\bmoon\\b", "lunar", "artemis", "chang'?e", "\\bclps\\b", "intuitive machines"]],
].map(([k, p]) => [k, new RegExp(p.join("|"), "i")]);

export function classify(title, summary) {
  const t = `${title} ${summary}`;
  for (const [k, rx] of TOPICS) if (rx.test(t)) return k;
  return "earth";
}

const clean = a => {
  const summary = String(a.summary || "").replace(/\s+/g, " ").trim();
  return { id: a.id, title: String(a.title || "").trim(), summary, url: a.url, image: a.image_url, site: a.news_site, published: a.published_at, host: classify(a.title || "", summary) };
};

export async function refreshNews() {
  const r = await fetch(SNAPI, { headers: { "User-Agent": "EventHorizon/1.0" } });
  if (!r.ok) throw new Error(`news HTTP ${r.status}`);
  const data = await r.json();
  const fresh = (data.results || []).filter(a => a.title).map(clean);
  const old = (await kv.get("news")) || { items: [] };
  const merged = new Map(old.items.map(i => [i.id, i]));
  for (const i of fresh) merged.set(i.id, i);
  const items = [...merged.values()].sort((a, b) => (b.published || "").localeCompare(a.published || "")).slice(0, KEEP);
  const doc = { items, updated: Date.now() };
  await kv.set("news", doc);
  return doc;
}

/** Cached news; refreshes on the spot if the scheduled job has not run yet or failed for a while. */
export async function getNews() {
  let doc = await kv.get("news");
  if (!doc || Date.now() - doc.updated > STALE_MS) {
    try { doc = await refreshNews(); } catch (e) { console.warn(e.message); }
  }
  return doc || { items: [], updated: 0 };
}

export async function refreshApod() {
  const day = new Date().toISOString().slice(0, 10);
  const cur = await kv.get("apod");
  if (cur && cur.day === day) return cur.data;
  const r = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY())}&thumbs=true`);
  if (!r.ok) throw new Error(`apod HTTP ${r.status}`);
  const a = await r.json();
  const data = {
    title: a.title, date: a.date, explanation: a.explanation, media: a.media_type,
    image: a.media_type === "image" ? a.url : a.thumbnail_url, hd: a.hdurl,
    copyright: (a.copyright || "").trim() || null,
    page: `https://apod.nasa.gov/apod/ap${String(a.date || "").replace(/-/g, "").slice(2)}.html`,
  };
  await kv.set("apod", { day, data });
  return data;
}
