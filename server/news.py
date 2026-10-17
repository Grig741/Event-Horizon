"""Live news from the Spaceflight News API (TheSpaceDevs) and NASA's Astronomy Picture of the Day.

Each article gets a `host`: the object that presents it on the site
(a black hole for black-hole news, Mars for Mars news, and so on).
"""
import asyncio
import logging
import re
import time

import aiohttp

from . import config

log = logging.getLogger("news")

SNAPI = "https://api.spaceflightnewsapi.net/v4/articles/"
APOD = "https://api.nasa.gov/planetary/apod"
REFRESH_SECONDS = 15 * 60
KEEP = 120

# First match wins, so the most specific topics come first.
TOPICS: list[tuple[str, list[str]]] = [
    ("blackhole", [r"black holes?", r"event horizon", r"gravitational[- ]waves?", r"\bligo\b", r"quasars?",
                   r"sagittarius a\*", r"\bm87\b", r"accretion"]),
    ("mercury", [r"\bmercury\b", r"bepicolombo"]),
    ("venus", [r"\bvenus\b", r"davinci", r"veritas"]),
    ("mars", [r"\bmars\b", r"martian", r"perseverance", r"curiosity rover", r"\bmro\b"]),
    ("jupiter", [r"\bjupiter\b", r"\bjuno\b", r"europa", r"\bio\b", r"ganymede", r"callisto", r"\bjuice\b"]),
    ("saturn", [r"\bsaturn\b", r"titan", r"enceladus", r"dragonfly", r"cassini"]),
    ("uranus", [r"\buranus\b"]),
    ("neptune", [r"\bneptune\b", r"triton"]),
    ("exoplanet", [r"exoplanets?", r"\btess\b", r"habitable zone", r"super-earth"]),
    ("galaxy", [r"galax(y|ies)", r"\bjwst\b", r"webb", r"hubble", r"nebula", r"dark matter", r"dark energy",
                r"cosmolog", r"big bang", r"euclid", r"supernova", r"neutron star", r"pulsar", r"rubin"]),
    ("comet", [r"comets?", r"asteroids?", r"meteor", r"near-earth object", r"\bneo\b", r"planetary defen[cs]e"]),
    ("sun", [r"\bsun\b", r"solar (flare|wind|storm|cycle|maximum|minimum|eclipse|probe|orbiter)",
             r"geomagnetic", r"aurora", r"coronal", r"parker solar", r"\bsoho\b", r"heliophysics"]),
    ("moon", [r"\bmoon\b", r"lunar", r"artemis", r"chang'?e", r"\bclps\b", r"intuitive machines"]),
]
_compiled = [(k, re.compile("|".join(p), re.I)) for k, p in TOPICS]


def classify(title: str, summary: str) -> str:
    text = f"{title} {summary}"
    for key, rx in _compiled:
        if rx.search(text):
            return key
    return "earth"  # launches, stations, satellites: Earth presents them


def _clean(a: dict) -> dict:
    summary = (a.get("summary") or "").strip()
    summary = re.sub(r"\s+", " ", summary)
    return {
        "id": a["id"],
        "title": a.get("title", "").strip(),
        "summary": summary,
        "url": a.get("url"),
        "image": a.get("image_url"),
        "site": a.get("news_site"),
        "published": a.get("published_at"),
        "host": classify(a.get("title", ""), summary),
    }


class NewsCache:
    def __init__(self):
        self.items: list[dict] = []
        self.updated = 0.0
        self.apod: dict | None = None
        self.apod_day = ""
        self._lock = asyncio.Lock()

    async def refresh(self, session: aiohttp.ClientSession):
        async with self._lock:
            try:
                async with session.get(SNAPI, params={"limit": 60, "ordering": "-published_at"},
                                       timeout=aiohttp.ClientTimeout(total=20)) as r:
                    r.raise_for_status()
                    data = await r.json()
                fresh = [_clean(a) for a in data.get("results", []) if a.get("title")]
                known = {i["id"] for i in self.items}
                merged = {i["id"]: i for i in self.items}
                for i in fresh:
                    merged[i["id"]] = i
                self.items = sorted(merged.values(), key=lambda i: i["published"] or "", reverse=True)[:KEEP]
                self.updated = time.time()
                new = [i for i in fresh if i["id"] not in known]
                if known and new:
                    log.info("news: %d new articles", len(new))
            except Exception as e:  # keep serving the last good copy
                log.warning("news refresh failed: %s", e)

    async def refresh_apod(self, session: aiohttp.ClientSession):
        day = time.strftime("%Y-%m-%d", time.gmtime())
        if self.apod_day == day and self.apod:
            return
        try:
            async with session.get(APOD, params={"api_key": config.NASA_API_KEY, "thumbs": "true"},
                                   timeout=aiohttp.ClientTimeout(total=20)) as r:
                r.raise_for_status()
                a = await r.json()
            self.apod = {
                "title": a.get("title"),
                "date": a.get("date"),
                "explanation": a.get("explanation"),
                "media": a.get("media_type"),
                "image": a.get("url") if a.get("media_type") == "image" else a.get("thumbnail_url"),
                "hd": a.get("hdurl"),
                "copyright": (a.get("copyright") or "").strip() or None,
                "page": "https://apod.nasa.gov/apod/ap{}.html".format(a.get("date", "").replace("-", "")[2:]),
            }
            self.apod_day = day
        except Exception as e:
            log.warning("apod refresh failed: %s", e)

    async def run(self, session: aiohttp.ClientSession):
        while True:
            await self.refresh(session)
            await self.refresh_apod(session)
            await asyncio.sleep(REFRESH_SECONDS)

    def latest(self, n: int, offset: int = 0, host: str | None = None) -> list[dict]:
        items = self.items if not host else [i for i in self.items if i["host"] == host]
        return items[offset:offset + n]


cache = NewsCache()
