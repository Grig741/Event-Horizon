import { api, timeAgo } from "./api.js";
import { HOSTS, HostStage } from "./host.js";
import { FACTS, jdNow, moonPhase, planetView } from "./sky.js";
import { fmtNum, lang, t } from "./i18n.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = id => document.getElementById(id);
const MAX_CHARS = 460;

// Shown until the live feed answers (or if it can't): real, well-established facts.
const OFFLINE = [
  { id: "o1", k: "off.1", host: "blackhole", site: "Event Horizon Telescope", url: "https://eventhorizontelescope.org", published: "2019-04-10T13:00:00Z" },
  { id: "o2", k: "off.2", host: "mars", site: "NASA", url: "https://science.nasa.gov/mars/", published: "" },
  { id: "o3", k: "off.3", host: "sun", site: "NASA", url: "https://science.nasa.gov/sun/", published: "" },
];

function trim(text) {
  if (text.length <= MAX_CHARS) return text;
  const cut = text.slice(0, MAX_CHARS);
  const dot = cut.lastIndexOf(". ");
  return (dot > 200 ? cut.slice(0, dot + 1) : cut.slice(0, cut.lastIndexOf(" ")) + "…");
}

export class Today {
  constructor() {
    this.items = OFFLINE.slice();
    this.idx = 0; this.pos = 0; this.timer = 0;
    this.stage = $("today-host");
    this.host = new HostStage(this.stage, (W, H) => this.place(W, H));
    $("prev").addEventListener("click", () => this.go(this.idx - 1));
    $("next").addEventListener("click", () => this.go(this.idx + 1));
    $("skip").addEventListener("click", () => this.finish());
    this.stage.addEventListener("click", () => this.finish());
    $("brief").addEventListener("keydown", e => {
      if (e.key === "ArrowRight") this.go(this.idx + 1);
      if (e.key === "ArrowLeft") this.go(this.idx - 1);
    });
    this.go(0);
    this.load();
    this.renderTonight();
    this.loadApod();
  }

  place(W, H) {
    if (innerWidth <= 860) return { cx: W / 2, cy: H * 0.5, r: Math.min(W / 2 / 3.1, H / 3.4) };
    const brief = $("brief").getBoundingClientRect(), rc = this.stage.getBoundingClientRect();
    const left = Math.max(200, brief.left - rc.left - 24);
    return { cx: Math.max(left * 0.5, W * 0.28), cy: H * 0.58, r: Math.min(left / 2 / 3.2, H / 4.4, 190) };
  }

  async load() {
    try {
      const { items } = await api.news({ limit: 20 });
      if (items.length) {
        const pinned = this.pinned ? [this.pinned] : [];
        // Today is about the sky: stories with a cosmic host go first, launches and Earth news after them
        const rest = items.filter(i => !this.pinned || i.id !== this.pinned.id);
        const sorted = rest.filter(i => i.host !== "earth").concat(rest.filter(i => i.host === "earth"));
        this.items = pinned.concat(sorted).slice(0, 12);
        this.buildDots();
        if (!this.pinned) this.go(0);
      }
    } catch { /* keep offline stories */ }
  }

  buildDots() {
    const d = $("dots"); d.innerHTML = "";
    this.items.forEach((it, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "dot";
      b.setAttribute("aria-label", t("brief.dot", { i: i + 1, title: this.title(it) }));
      b.addEventListener("click", () => this.go(i));
      d.appendChild(b);
    });
  }

  present(item) {
    this.pinned = item;
    this.items = [item].concat(this.items.filter(i => i.id !== item.id));
    this.buildDots();
    this.go(0);
  }

  go(i) {
    if (!this.items.length) return;
    if (!$("dots").children.length) this.buildDots();
    this.idx = (i + this.items.length) % this.items.length;
    const it = this.items[this.idx];
    const text = trim(it.k ? t(it.k + ".s") : it.summary || "");
    this.text = text;
    this.host.setKind(it.host);
    const name = t("host." + (HOSTS[it.host] ? it.host : "earth"));
    $("presenter").textContent = lang === "en" ? name.replace(/^(The|A|An) /, m => m.toLowerCase()) : name;
    $("brief-count").textContent = t("brief.count", { i: this.idx + 1, n: this.items.length });
    $("story-title").textContent = this.title(it);
    $("story-note").hidden = !!it.k;
    $("story-meta").textContent = [it.site, it.published ? timeAgo(it.published) : ""].filter(Boolean).join(" · ");
    const rm = $("readmore");
    rm.href = it.url || "#"; rm.hidden = !it.url;
    rm.textContent = it.site ? t("brief.readAt", { site: it.site }) : t("brief.read");
    $("speech-full").textContent = `${this.title(it)}. ${text}`;
    $("ghost").textContent = text + " ";
    [...$("dots").children].forEach((b, j) => b.setAttribute("aria-current", j === this.idx ? "true" : "false"));
    clearTimeout(this.timer);
    this.pos = 0; $("typed").textContent = "";
    if (reduce) { this.finish(); return; }
    this.setSpeaking(true);
    this.timer = setTimeout(() => this.tick(), 420);
  }

  tick() {
    if (document.hidden) { this.timer = setTimeout(() => this.tick(), 250); return; }
    this.pos++;
    $("typed").textContent = this.text.slice(0, this.pos);
    const ch = this.text.charAt(this.pos - 1);
    this.host.speak(ch);
    if (this.pos >= this.text.length) { this.setSpeaking(false); return; }
    const d = /[.!?]/.test(ch) ? 420 : /[,:;]/.test(ch) ? 180 : ch === " " ? 32 : 22;
    this.timer = setTimeout(() => this.tick(), d);
  }

  finish() {
    clearTimeout(this.timer);
    $("typed").textContent = this.text || "";
    this.setSpeaking(false);
  }

  setSpeaking(on) {
    $("caret").hidden = !on; $("skip").hidden = !on;
    this.host.setSpeaking(on);
  }

  renderTonight() {
    const jd = jdNow();
    const ul = $("tonight-list"); ul.innerHTML = "";
    for (const n of ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"]) {
      const v = planetView(n, jd);
      const li = document.createElement("li");
      if (v.where === "hidden") li.className = "out";
      li.innerHTML = `<i style="background:${FACTS[n].color}"></i><span><b>${t("planet." + n)}</b> · ${t("where." + v.where)}</span><em>${fmtNum(v.distAU, 2)} ${t("u.au")}</em>`;
      ul.appendChild(li);
    }
    const m = moonPhase(jd);
    $("moon-line").textContent = t("moon.line", { phase: t("moon." + m.index), pct: Math.round(m.illum * 100) });
  }

  async loadApod() {
    try {
      const a = await api.apod();
      if (!a.image) return;
      $("apod-img").src = a.image;
      $("apod-img").alt = a.title || "NASA Astronomy Picture of the Day";
      $("apod-title").textContent = a.title;
      $("apod-credit").textContent = `${a.date}${a.copyright ? " · © " + a.copyright : " · NASA"}`;
      $("apod-link").href = a.page;
      $("apod").hidden = false;
    } catch { /* section stays hidden */ }
  }

  title(it) { return it.k ? t(it.k + ".t") : it.title; }
  relang() { this.buildDots(); this.go(this.idx); this.renderTonight(); }
  show() { this.host.resize(); }
  hide() {}
}
