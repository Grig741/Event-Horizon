// Every 15 minutes: pull fresh news and NASA's picture of the day into the cache.
import { refreshApod, refreshNews } from "../lib/news.mjs";

export default async () => {
  try { const d = await refreshNews(); console.log(`news: ${d.items.length} cached`); } catch (e) { console.error(e.message); }
  try { await refreshApod(); } catch (e) { console.error(e.message); }
};

export const config = { schedule: "*/15 * * * *" };
