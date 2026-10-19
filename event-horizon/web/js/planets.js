import { HostStage } from "./host.js";
import { AU_KM, FACTS, heliocentric, jdOf, ORDER, planetView } from "./sky.js";
import { fmtDate, fmtNum as fmt, t } from "./i18n.js";

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
// orbital periods in days, to sample each orbit once
const PERIOD = { Mercury: 87.97, Venus: 224.7, Earth: 365.26, Mars: 687, Jupiter: 4332.6, Saturn: 10759, Uranus: 30687, Neptune: 60190 };
const SIZE = { Mercury: 3, Venus: 4.5, Earth: 4.6, Mars: 3.6, Jupiter: 8, Saturn: 7, Uranus: 5.5, Neptune: 5.5 };

export class Planets {
  constructor() {
    this.cv = $("orrery"); this.ctx = this.cv.getContext("2d");
    this.offset = 0; this.selected = "Mars"; this.playing = false; this.started = false;
    this.orbits = {};
    const pick = $("planet-pick");
    for (const n of ORDER) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = t("planet." + n); b.dataset.p = n;
      b.addEventListener("click", () => this.select(n));
      pick.appendChild(b);
    }
    $("t-slider").addEventListener("input", e => { this.offset = +e.target.value; this.update(); });
    $("t-today").addEventListener("click", () => { this.offset = 0; $("t-slider").value = 0; this.setPlay(false); this.update(); });
    $("t-play").addEventListener("click", () => this.setPlay(!this.playing));
    this.cv.addEventListener("click", e => this.pickAt(e));
    new ResizeObserver(() => this.resize()).observe(this.cv);
  }

  show() {
    if (!this.started) {
      this.started = true;
      this.host = new HostStage($("planet-host"), (W, H) => ({ cx: W / 2, cy: H / 2, r: H * 0.3 }), { gl: false });
      this.resize();
      this.select(this.selected);
    }
  }
  hide() { this.setPlay(false); }

  jd() { return jdOf(Date.now() + this.offset * 86400000); }

  resize() {
    const rc = this.cv.getBoundingClientRect();
    if (!rc.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.W = rc.width; this.H = rc.height; this.dpr = dpr;
    this.cv.width = Math.round(rc.width * dpr); this.cv.height = Math.round(rc.height * dpr);
    this.k = (Math.min(this.W, this.H) / 2 - 34) / Math.sqrt(30.4);
    this.draw();
  }

  // square-root radial scale: true directions, compressed distances
  toPx(v) {
    const r = Math.hypot(v[0], v[1]) || 1e-9, s = this.k * Math.sqrt(r) / r;
    return [this.W / 2 + v[0] * s, this.H / 2 - v[1] * s];
  }

  orbitPath(n, jd) {
    const pts = [];
    for (let i = 0; i <= 160; i++) pts.push(this.toPx(heliocentric(n, jd + PERIOD[n] * i / 160)));
    return pts;
  }

  setPlay(on) {
    this.playing = on && !reduce;
    $("t-play").setAttribute("aria-pressed", String(this.playing));
    $("t-play").textContent = this.playing ? t("planets.pause") : t("planets.play");
    if (this.playing) {
      const step = () => {
        if (!this.playing) return;
        this.offset += 3;
        if (this.offset > 730) this.offset = -730;
        $("t-slider").value = this.offset;
        this.update();
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }

  update() { this.draw(); this.renderCard(); }

  draw() {
    if (!this.W) return;
    const c = this.ctx, jd = this.jd(), W = this.W, H = this.H;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    // Sun
    const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 26);
    g.addColorStop(0, "rgba(255,240,200,1)"); g.addColorStop(0.3, "rgba(255,190,90,.8)"); g.addColorStop(1, "rgba(255,140,40,0)");
    c.fillStyle = g; c.beginPath(); c.arc(W / 2, H / 2, 26, 0, Math.PI * 2); c.fill();
    // orbits
    c.lineWidth = 1;
    for (const n of ORDER) {
      const pts = this.orbitPath(n, jd);
      c.strokeStyle = n === this.selected ? "rgba(231,161,94,.55)" : "rgba(236,229,214,.12)";
      c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
    }
    // Earth → selected line
    this.pos = {};
    for (const n of ORDER) this.pos[n] = this.toPx(heliocentric(n, jd));
    if (this.selected !== "Earth") {
      const a = this.pos.Earth, b = this.pos[this.selected];
      c.setLineDash([3, 4]); c.strokeStyle = "rgba(175,200,230,.6)";
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]);
    }
    // planets
    c.font = "12px Archivo, Arial, sans-serif";
    const placed = [];
    for (const n of ORDER) {
      const [x, y] = this.pos[n], sel = n === this.selected;
      c.fillStyle = FACTS[n].color;
      c.beginPath(); c.arc(x, y, SIZE[n] * (sel ? 1.35 : 1), 0, Math.PI * 2); c.fill();
      if (n === "Saturn") { c.strokeStyle = "rgba(230,208,156,.8)"; c.beginPath(); c.ellipse(x, y, 12, 4, -0.3, 0, Math.PI * 2); c.stroke(); }
      if (sel) { c.strokeStyle = "rgba(236,229,214,.9)"; c.beginPath(); c.arc(x, y, SIZE[n] * 1.35 + 5, 0, Math.PI * 2); c.stroke(); }
      c.fillStyle = sel ? "#ece5d6" : "rgba(156,147,132,.95)";
      // nudge labels down until they no longer overlap one already drawn (planets near conjunction)
      const label = t("planet." + n), lw = c.measureText(label).width; let lx = x + SIZE[n] + 6, ly = y - SIZE[n] - 2;
      if (lx + lw > W - 4) lx = x - SIZE[n] - 6 - lw; // keep labels inside the canvas
      while (placed.some(p => lx < p[0] + p[2] && lx + lw > p[0] && Math.abs(ly - p[1]) < 13)) ly += 13;
      placed.push([lx, ly, lw]);
      c.fillText(label, lx, ly);
    }
    // direction label
    c.fillStyle = "rgba(156,147,132,.7)"; c.font = "11px Archivo, Arial, sans-serif";
    c.fillText(t("planets.above"), 12, H - 12);
    const d = new Date(Date.now() + this.offset * 86400000);
    $("t-date").textContent = this.offset === 0 ? t("planets.today") : fmtDate(d);
  }

  pickAt(e) {
    const rc = this.cv.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
    let best = null, bd = 28;
    for (const n of ORDER) { const p = this.pos[n], d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = n; } }
    if (best) this.select(best);
  }

  select(n) {
    this.selected = n;
    [...$("planet-pick").children].forEach(b => b.setAttribute("aria-pressed", b.dataset.p === n ? "true" : "false"));
    this.host?.setKind(FACTS[n].host);
    this.update();
  }

  renderCard() {
    const n = this.selected, f = FACTS[n], v = planetView(n, this.jd());
    $("pc-name").textContent = t("planet." + n);
    const where = t("where." + v.where);
    $("pc-where").textContent = this.offset === 0 ? where : t("planets.onDate", { where });
    const rows = [];
    if (n !== "Earth") {
      rows.push([t("pf.distEarth"), `${fmt(v.distAU, 2)} ${t("u.au")}`], [t("pf.km"), t("pf.million", { n: fmt(v.distAU * AU_KM / 1e6, 0) })]);
      const m = v.lightMin;
      rows.push([t("pf.light"), m < 60 ? t("pf.min", { n: fmt(m, 1) }) : t("pf.hmin", { h: Math.floor(m / 60), m: Math.round(m % 60) })]);
    }
    const day = (f.day.earthDays ? t("u.earthDays", { n: fmt(f.day.earthDays) }) : f.day.m ? t("u.hm", { h: f.day.h, m: f.day.m }) : t("u.h", { h: f.day.h })) + (f.day.retro ? t("u.retro") : "");
    const year = f.year.days ? t("u.days", { n: fmt(f.year.days, f.year.days % 1 ? 2 : 0) }) : t("u.years", { n: fmt(f.year.years, f.year.years % 1 ? 1 : 0) });
    const temp = f.temp.avg != null ? t("u.tAvg", { t: fmt(f.temp.avg) }) : f.temp.clouds != null ? t("u.tClouds", { t: fmt(f.temp.clouds) }) : t("u.t", { t: fmt(f.temp.t) });
    rows.push([t("pf.fromSun"), `${fmt(v.sunAU, 2)} ${t("u.au")}`], [t("pf.diameter"), `${fmt(f.diameter)} ${t("u.km")}`], [t("pf.mass"), t("pf.massVal", { n: fmt(f.mass, f.mass < 1 ? 3 : 1) })],
      [t("pf.day"), day], [t("pf.year"), year], [t("pf.moons"), f.moons ? fmt(f.moons) : t("pf.none")], [t("pf.temp"), temp], [t("pf.gravity"), `${fmt(f.gravity, 1)} ${t("u.ms2")}`]);
    $("pc-facts").innerHTML = rows.map(([k, val]) => `<div><dt>${k}</dt><dd>${val}</dd></div>`).join("");
    $("pc-note").textContent = t("note." + n) + (f.moons > 20 ? t("note.moons") : "");
  }

  relang() {
    [...$("planet-pick").children].forEach(b => { b.textContent = t("planet." + b.dataset.p); });
    $("t-play").textContent = this.playing ? t("planets.pause") : t("planets.play");
    if (this.started) this.update();
  }
}
