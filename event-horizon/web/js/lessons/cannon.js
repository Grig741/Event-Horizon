// Free lesson: Newton's cannon. Fire horizontally from a 400 km tower above the air.
// Real Earth: R = 6371 km, GM = 398 600 km³/s². Fate is decided from orbital energy; the flight itself is integrated (velocity Verlet).
export const meta = { id: "cannon", title: "Newton's cannon", pro: false };

const R_E = 6371, GM = 398600.4418, H0 = 400, r0 = R_E + H0;
const V_CIRC = Math.sqrt(GM / r0), V_ESC = Math.sqrt(2 * GM / r0);
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Newton's cannon", "Пушка Ньютона", "Նյուտոնի թնդանոթը", "El cañón de Newton"],
  intro: [
    "In 1687 Newton imagined a cannon on a mountain so high it stands above the air. Fire slowly and the ball falls nearby. Fire faster and it lands further, because the Earth curves away beneath it. At just the right speed it keeps falling forever and never lands: that is an orbit. <b>Pick a speed and press Fire</b>, or tap the picture.",
    "В 1687 году Ньютон представил пушку на горе выше воздуха. Выстрелите медленно — ядро упадёт рядом. Быстрее — дальше, потому что Земля под ним загибается. При правильной скорости оно падает вечно и никогда не приземляется: это и есть орбита. <b>Выберите скорость и нажмите «Огонь»</b> или коснитесь картинки.",
    "1687 թվականին Նյուտոնը պատկերացրեց թնդանոթ օդից բարձր լեռան վրա։ Կրակեք դանդաղ, և արկը կընկնի մոտակայքում։ Ավելի արագ՝ ավելի հեռու, որովհետև Երկիրը նրա տակ կորանում է։ Ճիշտ արագության դեպքում այն ընկնում է հավերժ և երբեք վայր չի գալիս․ սա է ուղեծիրը։ <b>Ընտրեք արագությունը և սեղմեք «Կրակ»</b> կամ հպեք նկարին։",
    "En 1687 Newton imaginó un cañón sobre una montaña tan alta que sobresale del aire. Dispara despacio y la bala cae cerca. Más rápido y cae más lejos, porque la Tierra se curva bajo ella. A la velocidad justa sigue cayendo para siempre sin tocar el suelo: eso es una órbita. <b>Elige una velocidad y pulsa Disparar</b>, o toca la imagen."],
  aria: ["The Earth with a tall tower on top; cannonballs fired from it trace their paths.", "Земля с высокой башней наверху; ядра, выпущенные с неё, оставляют следы.", "Երկիրը՝ վրան բարձր աշտարակով․ նրանից արձակված արկերը թողնում են հետքեր։", "La Tierra con una torre alta encima; las balas disparadas dejan su trayectoria."],
  speed: ["Launch speed", "Скорость выстрела", "Արձակման արագություն", "Velocidad de disparo"],
  fire: ["Fire", "Огонь", "Կրակ", "Disparar"], clear: ["Clear", "Очистить", "Մաքրել", "Borrar"],
  presetsAria: ["Interesting speeds", "Интересные скорости", "Հետաքրքիր արագություններ", "Velocidades interesantes"],
  rifle: ["Rifle bullet", "Пуля", "Գնդակ", "Bala de rifle"], circ: ["Circular orbit", "Круговая орбита", "Շրջանաձև ուղեծիր", "Órbita circular"],
  ell: ["Ellipse", "Эллипс", "Էլիպս", "Elipse"], esc: ["Escape", "Побег", "Փախուստ", "Escape"],
  result: ["Result", "Результат", "Արդյունք", "Resultado"],
  vc: ["Orbit needs", "Для орбиты нужно", "Ուղեծրի համար պետք է", "Para orbitar hace falta"],
  ve: ["To escape", "Чтобы улететь", "Փախչելու համար", "Para escapar"],
  far: ["Highest point", "Самая высокая точка", "Ամենաբարձր կետը", "Punto más alto"],
  fell: ["Fell {d} away", "Упало в {d}", "Ընկավ {d} հեռու", "Cayó a {d}"],
  orbit: ["Orbit, {t} per lap", "Орбита, виток за {t}", "Ուղեծիր, պտույտը՝ {t}", "Órbita, {t} por vuelta"],
  gone: ["Escaped Earth", "Улетело от Земли", "Հեռացավ Երկրից", "Escapó de la Tierra"],
  km: ["{n} km", "{n} км", "{n} կմ", "{n} km"], kms: ["{n} km/s", "{n} км/с", "{n} կմ/վ", "{n} km/s"],
  min: ["{n} min", "{n} мин", "{n} ր", "{n} min"], h: ["{h} h {m} min", "{h} ч {m} мин", "{h} ժ {m} ր", "{h} h {m} min"],
  inf: ["never comes back", "не вернётся", "չի վերադառնա", "no vuelve"],
  tower: ["400 km tower", "башня 400 км", "400 կմ աշտարակ", "torre de 400 km"],
  note: [
    "The ISS flies at exactly this height and speed: 7.7 km/s, one lap every 92 minutes. A rifle bullet at 1 km/s would hit the ground before it got anywhere. Real rockets climb first and then turn sideways for the same reason.",
    "МКС летит ровно на этой высоте и с этой скоростью: 7,7 км/с, виток за 92 минуты. Пуля на 1 км/с упала бы, никуда не долетев. Настоящие ракеты сначала поднимаются, а потом поворачивают вбок по той же причине.",
    "ՄՏԿ-ն թռչում է հենց այս բարձրությամբ և արագությամբ՝ 7,7 կմ/վ, մեկ պտույտ 92 րոպեում։ 1 կմ/վ արագությամբ գնդակը կընկներ՝ ոչ մի տեղ չհասնելով։ Իսկական հրթիռները նախ բարձրանում են, հետո թեքվում կողք՝ նույն պատճառով։",
    "La ISS vuela justo a esta altura y velocidad: 7,7 km/s, una vuelta cada 92 minutos. Una bala de rifle a 1 km/s caería sin llegar a ninguna parte. Los cohetes reales suben primero y luego giran de lado por la misma razón."],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];
const COLORS = ["#e7a15e", "#afc8e6", "#e8cf9a", "#9fd8de", "#d0643a"];

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const fmt = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <label class="field">${T("speed")} <b data-r="v"></b><input type="range" id="nc-v" min="0.5" max="12" step="0.01" value="5"></label>
      <div class="btns"><button class="btn small primary" data-a="fire">${T("fire")}</button><button class="btn small" data-a="clear">${T("clear")}</button></div>
      <div class="btns" role="group" aria-label="${T("presetsAria")}">
        <button class="btn small" data-v="1">${T("rifle")}</button><button class="btn small" data-v="${V_CIRC.toFixed(2)}">${T("circ")}</button>
        <button class="btn small" data-v="9.5">${T("ell")}</button><button class="btn small" data-v="11.2">${T("esc")}</button>
      </div>
      <dl class="readouts">
        <div style="grid-column:1/-1"><dt>${T("result")}</dt><dd data-r="res" style="font-size:1.25rem">—</dd></div>
        <div><dt>${T("vc")}</dt><dd>${T("kms", { n: fmt(V_CIRC, 2) })}</dd></div>
        <div><dt>${T("ve")}</dt><dd>${T("kms", { n: fmt(V_ESC, 2) })}</dd></div>
        <div><dt>${T("far")}</dt><dd data-r="apo">—</dd></div>
      </dl>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const vIn = root.querySelector("#nc-v"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, shots = [], n = 0;

  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  const dur = s => s < 3600 ? T("min", { n: fmt(s / 60) }) : T("h", { h: Math.floor(s / 3600), m: Math.round(s % 3600 / 60) });
  function predict(v) { // energy and angular momentum give the whole orbit at once
    const E = v * v / 2 - GM / r0, h = r0 * v;
    if (E >= 0) return { kind: "esc" };
    const a = -GM / (2 * E), e = Math.sqrt(Math.max(0, 1 + 2 * E * h * h / (GM * GM)));
    const rp = a * (1 - e), ra = a * (1 + e);
    return { kind: Math.min(rp, ra) > R_E ? "orbit" : "fall", T: 2 * Math.PI * Math.sqrt(a * a * a / GM), apo: Math.max(rp, ra) - R_E };
  }
  function show(p, s) {
    R("res").textContent = p.kind === "esc" ? T("gone") : p.kind === "orbit" ? T("orbit", { t: dur(p.T) }) : s && s.landed != null ? T("fell", { d: T("km", { n: fmt(s.landed) }) }) : "…";
    R("apo").textContent = p.kind === "esc" ? T("inf") : T("km", { n: fmt(p.apo) });
  }
  function fire() {
    const v = +vIn.value, p = predict(v);
    const s = { x: 0, y: r0, vx: v, vy: 0, path: [[0, r0]], done: false, col: COLORS[n++ % COLORS.length], p, landed: null, ang: 0, t: 0 };
    shots.push(s); if (shots.length > 5) shots.shift(); show(p, s);
  }
  const acc = (x, y) => { const r = Math.hypot(x, y), k = -GM / (r * r * r); return [k * x, k * y]; };
  function step(s, dt) {
    let [ax, ay] = acc(s.x, s.y);
    s.vx += ax * dt / 2; s.vy += ay * dt / 2; s.x += s.vx * dt; s.y += s.vy * dt;
    [ax, ay] = acc(s.x, s.y); s.vx += ax * dt / 2; s.vy += ay * dt / 2; s.t += dt;
    const r = Math.hypot(s.x, s.y);
    if (r <= R_E) { s.done = true; const a = Math.atan2(s.x, s.y); s.landed = R_E * (((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)); if (s === shots.at(-1)) show(s.p, s); }
    if (r > R_E * 8) s.done = true;
    if (s.p.kind === "orbit" && s.t > s.p.T) s.done = true; // one full lap is enough
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const S = Math.min(W, H) * 0.34 / R_E, cx = W / 2, cy = H / 2 + Math.min(W, H) * 0.05;
    const P = (x, y) => [cx + x * S, cy - y * S];
    // faint stars
    let sd = 11; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
    c.fillStyle = "rgba(236,229,214,.35)"; for (let k = 0; k < 60; k++) c.fillRect(rnd() * W, rnd() * H, 1, 1);
    // Earth
    const g = c.createRadialGradient(cx - R_E * S * 0.3, cy - R_E * S * 0.3, R_E * S * 0.1, cx, cy, R_E * S);
    g.addColorStop(0, "#5b8ed6"); g.addColorStop(1, "#173058");
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R_E * S, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "rgba(175,200,230,.35)"; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R_E * S + 2, 0, Math.PI * 2); c.stroke(); c.lineWidth = 1;
    // tower and cannon
    const [tx, ty] = P(0, R_E), [, top] = P(0, r0);
    c.strokeStyle = "#9c9384"; c.lineWidth = 3; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx, top); c.stroke(); c.lineWidth = 1;
    c.fillStyle = "#ece5d6"; c.fillRect(tx - 3, top - 4, 12, 6);
    c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "rgba(156,147,132,.85)"; c.fillText(T("tower"), tx - 70, top - 8);
    // circular-orbit guide
    c.setLineDash([3, 6]); c.strokeStyle = "rgba(236,229,214,.15)"; c.beginPath(); c.arc(cx, cy, r0 * S, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    for (const s of shots) {
      c.strokeStyle = s.col; c.lineWidth = 1.5; c.beginPath();
      s.path.forEach(([x, y], i) => { const [px, py] = P(x, y); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke(); c.lineWidth = 1;
      if (!s.done || s.p.kind === "orbit") { const [px, py] = P(s.x, s.y); c.fillStyle = "#ece5d6"; c.beginPath(); c.arc(px, py, 3.5, 0, Math.PI * 2); c.fill(); }
    }
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    for (const s of shots) {
      if (s.done) {
        if (s.p.kind === "orbit") { // keep circling along the drawn lap
          s.t2 = (s.t2 || 0) + dt * 600; const i = Math.floor((s.t2 / s.p.T * (s.path.length - 1)) % (s.path.length - 1)); [s.x, s.y] = s.path[i]; }
        continue;
      }
      const sim = dt * 600, sub = Math.max(1, Math.ceil(sim / 2)); // 10 simulated minutes per real second
      for (let k = 0; k < sub && !s.done; k++) step(s, sim / sub);
      s.path.push([s.x, s.y]);
    }
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  root.querySelector('[data-a="fire"]').addEventListener("click", fire);
  root.querySelector('[data-a="clear"]').addEventListener("click", () => { shots = []; R("res").textContent = "—"; R("apo").textContent = "—"; });
  root.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => { vIn.value = b.dataset.v; R("v").textContent = T("kms", { n: fmt(+vIn.value, 2) }); fire(); }));
  vIn.addEventListener("input", () => { R("v").textContent = T("kms", { n: fmt(+vIn.value, 2) }); });
  cv.addEventListener("pointerdown", fire);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); R("v").textContent = T("kms", { n: fmt(+vIn.value, 2) }); raf = requestAnimationFrame(frame); fire();
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
