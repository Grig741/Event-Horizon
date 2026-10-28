import { api, bus, state, toast } from "./api.js";
import { lang, t } from "./i18n.js";

const $ = id => document.getElementById(id);
const LESSONS = [
  { id: "orbits", pro: false }, { id: "phases", pro: false }, { id: "gravity", pro: false }, { id: "seasons", pro: false }, { id: "cannon", pro: false },
  { id: "kepler", pro: true }, { id: "scale", pro: true }, { id: "horizon", pro: true }, { id: "expansion", pro: true }, { id: "stars", pro: true }, { id: "transits", pro: true },
];
const FILTERS = ["all", "free", "pro", "new"];

// progress lives in this browser only; storage can be blocked, so every access is guarded
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } },
};
const done = () => new Set(store.get("eh-done", []));

function preview(canvas, id) {
  const dpr = Math.min(devicePixelRatio || 1, 2), W = canvas.clientWidth || 300, H = 150;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const c = canvas.getContext("2d"); c.scale(dpr, dpr); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  if (id === "orbits") {
    for (const [r, s] of [[60, 0.9], [38, 0.6], [22, 0.4]]) { c.strokeStyle = `rgba(236,229,214,${s * 0.4})`; c.beginPath(); c.ellipse(cx, cy, r * 1.3, r * 0.9, 0.4, 0, Math.PI * 2); c.stroke(); }
    c.fillStyle = "#000"; c.strokeStyle = "#e7a15e"; c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.fill(); c.stroke();
    c.fillStyle = "#afc8e6"; c.beginPath(); c.arc(cx + 75, cy - 10, 3, 0, Math.PI * 2); c.fill();
  } else if (id === "kepler") {
    const a = 90, b = 50, e = Math.sqrt(1 - b * b / a / a), fx = cx + a * e - 30;
    for (let k = 0; k < 12; k++) {
      c.beginPath(); c.moveTo(fx, cy);
      for (let j = 0; j <= 10; j++) {
        const M = (k + j / 10) / 12 * Math.PI * 2; let E = M; for (let i = 0; i < 12; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        c.lineTo(cx - 30 + a * Math.cos(E), cy - b * Math.sin(E));
      }
      c.closePath(); c.fillStyle = k % 2 ? "rgba(175,200,230,.16)" : "rgba(231,161,94,.22)"; c.fill();
    }
    c.fillStyle = "#ffd28a"; c.beginPath(); c.arc(fx, cy, 5, 0, Math.PI * 2); c.fill();
  } else if (id === "phases") {
    const n = 5, r = 13, gap = (W - 40) / (n - 1);
    for (let k = 0; k < n; k++) { // new → crescent → quarter → gibbous → full
      const x = 20 + k * gap, th = k / (n - 1) * Math.PI, cs = Math.cos(th);
      c.fillStyle = "#1a1712"; c.beginPath(); c.arc(x, cy, r, 0, Math.PI * 2); c.fill();
      c.save(); c.beginPath(); c.arc(x, cy, r, 0, Math.PI * 2); c.clip(); c.fillStyle = "#e9e2d0";
      c.beginPath(); c.arc(x, cy, r, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fill();
      c.fillStyle = cs > 0 ? "#1a1712" : "#e9e2d0"; c.beginPath(); c.ellipse(x, cy, Math.max(0.01, r * Math.abs(cs)), r, 0, 0, Math.PI * 2); c.fill(); c.restore();
    }
  } else if (id === "gravity") {
    c.fillStyle = "rgba(236,229,214,.08)"; c.fillRect(0, H - 22, W, 22);
    [[W * 0.3, 0.9, "#5b8ed6"], [W * 0.7, 0.2, "#cfc8b8"]].forEach(([x, h, col]) => {
      c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x - W * 0.18, H - 22); c.lineTo(x + W * 0.18, H - 22); c.stroke();
      const y = H - 22 - (1 - h) * 90; c.strokeStyle = "rgba(231,161,94,.5)"; c.setLineDash([3, 4]); c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, H - 26); c.lineTo(x, y + 14); c.stroke(); c.setLineDash([]);
      c.fillStyle = "#ece5d6"; c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.fill(); c.fillRect(x - 1, y + 5, 2, 10);
    });
  } else if (id === "horizon") {
    const bx = W * 0.3, g = c.createRadialGradient(bx, cy, 18, bx, cy, 48); g.addColorStop(0, "rgba(231,161,94,.45)"); g.addColorStop(1, "rgba(231,161,94,0)");
    c.fillStyle = g; c.beginPath(); c.arc(bx, cy, 48, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#000"; c.strokeStyle = "#e7a15e"; c.beginPath(); c.arc(bx, cy, 18, 0, Math.PI * 2); c.fill(); c.stroke();
    let x = bx + 34, w = 5;
    for (let k = 0; k < 7 && x < W - 10; k++) { c.strokeStyle = ["#7fd36b", "#c9d84d", "#f0c040", "#f08a30", "#e04a2a", "#a02a20", "#601a18"][k]; c.beginPath(); c.arc(x, cy, 14, -0.6, 0.6); c.stroke(); x += w; w *= 1.6; }
  } else if (id === "expansion") {
    let s = 3; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < 26; k++) {
      const x = rnd() * W, y = rnd() * H, dx = (x - cx) * 0.18, dy = (y - cy) * 0.18;
      c.strokeStyle = "rgba(231,161,94,.5)"; c.beginPath(); c.moveTo(x, y); c.lineTo(x + dx, y + dy); c.stroke();
      c.fillStyle = "#afc8e6"; c.beginPath(); c.ellipse(x, y, 3, 1.4, k, 0, Math.PI * 2); c.fill();
    }
    c.strokeStyle = "#e7a15e"; c.beginPath(); c.arc(cx, cy, 6, 0, Math.PI * 2); c.stroke();
  } else if (id === "seasons") {
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, 20); g.addColorStop(0, "#fff3d0"); g.addColorStop(0.4, "rgba(255,190,90,.9)"); g.addColorStop(1, "rgba(255,150,50,0)");
    c.strokeStyle = "rgba(236,229,214,.2)"; c.setLineDash([3, 5]); c.beginPath(); c.ellipse(cx, cy, W * 0.38, 34, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, 20, 0, Math.PI * 2); c.fill();
    for (const [x, a] of [[cx - W * 0.38, 0], [cx + W * 0.38, Math.PI]]) {
      c.fillStyle = "#0f1f38"; c.beginPath(); c.arc(x, cy, 11, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#5b8ed6"; c.beginPath(); c.arc(x, cy, 11, a - Math.PI / 2, a + Math.PI / 2); c.fill();
      c.strokeStyle = "#ece5d6"; c.beginPath(); c.moveTo(x - 7, cy + 17); c.lineTo(x + 7, cy - 17); c.stroke();
    }
  } else if (id === "cannon") {
    const ey = H + 120, r = 175;
    c.fillStyle = "#173058"; c.beginPath(); c.arc(cx, ey, r, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#9c9384"; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, ey - r); c.lineTo(cx, ey - r - 22); c.stroke(); c.lineWidth = 1.5;
    [[120, "#e7a15e"], [200, "#afc8e6"], [240, "#e8cf9a"]].forEach(([d, col]) => {
      c.strokeStyle = col; c.beginPath(); c.moveTo(cx, ey - r - 22);
      c.quadraticCurveTo(cx + d * 0.6, ey - r - 30, cx + d, d > 220 ? ey - r - 10 : ey - Math.sqrt(Math.max(0, r * r - d * d)));
      c.stroke();
    });
    c.lineWidth = 1;
  } else if (id === "stars") {
    [[0.18, 9, [165, 190, 255]], [0.42, 14, [255, 244, 225]], [0.7, 26, [255, 160, 90]]].forEach(([fx, r, col]) => {
      const x = W * fx, g = c.createRadialGradient(x, cy, 0, x, cy, r * 1.8);
      g.addColorStop(0, "#fff"); g.addColorStop(0.45, `rgb(${col})`); g.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = g; c.beginPath(); c.arc(x, cy, r * 1.8, 0, Math.PI * 2); c.fill();
    });
    c.fillStyle = "#eef3ff"; c.beginPath(); c.arc(W * 0.9, cy, 2.5, 0, Math.PI * 2); c.fill();
  } else if (id === "transits") {
    const sx = cx, sy = cy - 22, g = c.createRadialGradient(sx, sy, 0, sx, sy, 40); g.addColorStop(0, "#fff8e8"); g.addColorStop(0.7, "#ffd9a0"); g.addColorStop(1, "rgba(255,190,110,0)");
    c.fillStyle = g; c.beginPath(); c.arc(sx, sy, 40, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#050403"; c.beginPath(); c.arc(sx + 6, sy + 4, 7, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#afc8e6"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(20, H - 30);
    c.lineTo(cx - 34, H - 30); c.lineTo(cx - 24, H - 16); c.lineTo(cx + 24, H - 16); c.lineTo(cx + 34, H - 30); c.lineTo(W - 20, H - 30); c.stroke(); c.lineWidth = 1;
  } else {
    c.fillStyle = "#ffd28a"; c.beginPath(); c.arc(16, cy, 10, 0, Math.PI * 2); c.fill();
    [[0.387, "#a99f97"], [0.723, "#e8cf9a"], [1, "#5b8ed6"], [1.524, "#d0643a"]].forEach(([a, col]) => {
      c.fillStyle = col; c.beginPath(); c.arc(16 + a * (W - 40) / 1.6, cy, 3, 0, Math.PI * 2); c.fill();
    });
    const g = c.createLinearGradient(16, 0, W * 0.55, 0); g.addColorStop(0, "rgba(255,240,200,0)"); g.addColorStop(1, "rgba(255,240,200,.9)");
    c.strokeStyle = g; c.lineWidth = 2; c.beginPath(); c.moveTo(16, cy + 12); c.lineTo(W * 0.55, cy + 12); c.stroke();
  }
}

export class Learn {
  constructor() {
    this.current = null; this.rendered = false;
    this.filter = store.get("eh-filter", "all"); if (!FILTERS.includes(this.filter)) this.filter = "all";
    $("lesson-back").addEventListener("click", () => { location.hash = "#learn"; });
    bus.addEventListener("me", () => this.renderList());
  }

  renderBar() {
    const bar = $("learn-bar"), seen = done(), n = LESSONS.filter(l => seen.has(l.id)).length;
    const lastId = store.get("eh-last", null), lastL = LESSONS.find(l => l.id === lastId);
    bar.innerHTML = `<div class="chips" role="group" aria-label="${t("learn.filter")}">
        ${FILTERS.map(f => `<button type="button" class="chip" data-f="${f}" aria-pressed="${f === this.filter}">${t("learn.f." + f)}</button>`).join("")}
      </div>
      <div class="progress">
        <div class="progress-text"><span>${n === LESSONS.length ? t("learn.allDone") : t("learn.progress", { n, total: LESSONS.length })}</span>
          ${lastL && !(lastL.pro && !state.pro) ? `<a class="linkbtn" href="#learn/${lastL.id}">${t("learn.continue", { title: t("l." + lastL.id) })}</a>` : ""}</div>
        <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${LESSONS.length}" aria-valuenow="${n}"><span style="width:${n / LESSONS.length * 100}%"></span></div>
      </div>`;
    bar.querySelectorAll("[data-f]").forEach(b => b.addEventListener("click", () => {
      this.filter = b.dataset.f; store.set("eh-filter", this.filter); this.renderList();
    }));
  }

  renderList() {
    this.renderBar();
    const box = $("lessons"); box.innerHTML = "";
    const seen = done();
    const list = LESSONS.filter(l => this.filter === "all" || (this.filter === "free" && !l.pro) || (this.filter === "pro" && l.pro) || (this.filter === "new" && !seen.has(l.id)));
    if (!list.length) box.innerHTML = `<p class="note empty">${t("learn.none")}</p>`;
    for (const l of list) {
      const locked = l.pro && !state.pro;
      const b = document.createElement("button");
      b.type = "button"; b.className = "lesson-card" + (seen.has(l.id) ? " is-done" : "");
      b.innerHTML = `<canvas aria-hidden="true"></canvas><span class="body">
        <span class="tags"><span class="badge ${l.pro ? "is-pro" : ""}">${l.pro ? (locked ? t("learn.pro") : t("learn.unlocked")) : t("learn.free")}</span>
        ${seen.has(l.id) ? `<span class="badge is-done">✓ ${t("learn.done")}</span>` : ""}</span>
        <h3>${t("l." + l.id)}</h3><p>${t("l." + l.id + ".b")}</p></span>`;
      b.addEventListener("click", () => { location.hash = `#learn/${l.id}`; });
      box.appendChild(b);
      requestAnimationFrame(() => preview(b.querySelector("canvas"), l.id));
    }
    this.rendered = true;
  }

  async show(sub) {
    this.sub = sub;
    if (!this.rendered) this.renderList();
    this.close();
    const l = LESSONS.find(x => x.id === sub);
    $("lessons").hidden = !!l; $("learn-head").hidden = !!l; $("learn-bar").hidden = !!l; $("lesson").hidden = !l;
    if (!l) { this.renderBar(); return; }
    this.renderNav(l);
    const body = $("lesson-body");
    body.innerHTML = '<div class="skeleton"></div>';
    try {
      let mod;
      if (!l.pro) mod = await import(`./lessons/${l.id}.js`);
      else {
        if (!state.pro) return this.locked(body, l);
        const src = await api.lesson(l.id);
        const url = URL.createObjectURL(new Blob([src], { type: "text/javascript" }));
        try { mod = await import(url); } finally { URL.revokeObjectURL(url); }
      }
      if (location.hash !== `#learn/${l.id}`) return; // the user moved on while it loaded
      this.current = mod.mount(body, { lang });
      const seen = done(); seen.add(l.id); store.set("eh-done", [...seen]); store.set("eh-last", l.id);
    } catch (e) {
      if (e.status === 402 || e.status === 401) return this.locked(body, l);
      body.innerHTML = `<p class="fine">${t("learn.fail")}</p>`;
      toast(t("learn.failToast"));
    }
  }

  renderNav(l) {
    const i = LESSONS.indexOf(l), prev = LESSONS[i - 1], next = LESSONS[i + 1];
    const link = (x, cls, key) => x ? `<a class="lesson-step ${cls}" href="#learn/${x.id}"><small>${t(key)}${x.pro && !state.pro ? " · Pro" : ""}</small><span>${t("l." + x.id)}</span></a>` : "<span></span>";
    $("lesson-nav").innerHTML = link(prev, "prev", "learn.prev") + link(next, "next", "learn.next");
    window.scrollTo({ top: 0 });
  }

  locked(body, l) {
    body.innerHTML = `<div class="locked"><p>${t("learn.locked", { title: t("l." + l.id), blurb: t("l." + l.id + ".b") })}</p>
      <a class="btn primary" href="#pro">${t("learn.unlock", { price: state.price })}</a></div>`;
  }

  close() { if (this.current) { this.current.destroy(); this.current = null; } }
  hide() { this.close(); }
  relang() { this.renderList(); if (location.hash.startsWith("#learn")) this.show(this.sub); }
}
