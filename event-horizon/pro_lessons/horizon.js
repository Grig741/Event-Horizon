// Pro lesson: time near a black hole. Schwarzschild geometry, exact formulas:
//   hovering at r:          dτ/dt = √(1 − Rs/r)
//   circular orbit at r:    dτ/dt = √(1 − 1.5·Rs/r)   (photon sphere 1.5 Rs, last stable orbit 3 Rs)
//   tidal stretch across L: Δa = 2GM·L/r³ = c²·L/(Rs²·x³), since GM = c²·Rs/2 and x = r/Rs
// Served only to Pro subscribers by /api/lesson/horizon.js.
export const meta = { id: "horizon", title: "Near the horizon", pro: true };

const C = 299792458, RS_SUN_KM = 2.95325, G0 = 9.807;
const MASSES = [["stellar", 10], ["sgra", 4.3e6], ["m87", 6.5e9]];
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Near the horizon", "У горизонта событий", "Իրադարձությունների հորիզոնի մոտ", "Junto al horizonte"],
  intro: [
    "Gravity slows time. Send a probe toward a black hole and compare its clock with yours far away. Its light reaches you stretched to longer, redder waves. Closer to the horizon both effects run away to infinity.",
    "Гравитация замедляет время. Отправьте зонд к чёрной дыре и сравните его часы со своими, вдали от неё. Его свет приходит к вам растянутым — более длинными, красными волнами. У самого горизонта оба эффекта уходят в бесконечность.",
    "Ձգողությունը դանդաղեցնում է ժամանակը։ Զոնդ ուղարկեք սև խոռոչի մոտ և համեմատեք նրա ժամացույցը ձերի հետ, որը հեռու է։ Նրա լույսը ձեզ է հասնում ձգված՝ ավելի երկար, կարմիր ալիքներով։ Հորիզոնի մոտ երկու երևույթներն էլ ձգտում են անվերջության։",
    "La gravedad frena el tiempo. Envía una sonda hacia un agujero negro y compara su reloj con el tuyo, lejos de allí. Su luz te llega estirada en ondas más largas y rojas. Junto al horizonte ambos efectos se disparan al infinito."],
  aria: ["A probe near a black hole sending light pulses outward, with two clocks comparing its time with a distant observer's.", "Зонд у чёрной дыры посылает световые импульсы; двое часов сравнивают его время со временем далёкого наблюдателя.", "Զոնդը սև խոռոչի մոտ լուսային իմպուլսներ է ուղարկում․ երկու ժամացույց համեմատում են նրա ժամանակը հեռավոր դիտորդի ժամանակի հետ։", "Una sonda junto a un agujero negro envía pulsos de luz; dos relojes comparan su tiempo con el de un observador lejano."],
  massAria: ["Black hole", "Чёрная дыра", "Սև խոռոչ", "Agujero negro"],
  stellar: ["10 Suns", "10 Солнц", "10 Արեգակ", "10 Soles"], sgra: ["Sgr A*", "Sgr A*", "Sgr A*", "Sgr A*"], m87: ["M87*", "M87*", "M87*", "M87*"],
  modeAria: ["How the probe stays there", "Как зонд держится", "Ինչպես է զոնդը մնում այնտեղ", "Cómo se mantiene la sonda"],
  hover: ["Hovering (rockets)", "Зависает (двигатели)", "Կախված (շարժիչներ)", "Suspendida (cohetes)"],
  orbit: ["Orbiting", "На орбите", "Ուղեծրում", "En órbita"],
  dist: ["Distance from the centre", "Расстояние от центра", "Հեռավորությունը կենտրոնից", "Distancia al centro"],
  rate: ["Probe clock runs at", "Часы зонда идут со скоростью", "Զոնդի ժամացույցի արագությունը", "El reloj de la sonda va al"],
  hour: ["1 probe hour = your", "1 час зонда = ваших", "Զոնդի 1 ժամ = ձեր", "1 hora de la sonda ="],
  light: ["Green light arrives as", "Зелёный свет приходит как", "Կանաչ լույսը հասնում է որպես", "La luz verde llega como"],
  tide: ["Head-to-toe stretch", "Растяжение голова–ноги", "Ձգումը գլխից ոտքեր", "Estiramiento cabeza-pies"],
  rs: ["{n} Rs", "{n} Rs", "{n} Rs", "{n} Rs"],
  far: ["You, far away", "Вы, вдали", "Դուք, հեռվում", "Tú, lejos"], probe: ["Probe", "Зонд", "Զոնդ", "Sonda"],
  ir: ["{n} nm, infrared", "{n} нм, инфракрасный", "{n} նմ, ինֆրակարմիր", "{n} nm, infrarrojo"], nm: ["{n} nm", "{n} нм", "{n} նմ", "{n} nm"],
  radio: ["radio waves", "радиоволны", "ռադիոալիքներ", "ondas de radio"],
  h: ["{n} h", "{n} ч", "{n} ժ", "{n} h"], d: ["{n} days", "{n} сут", "{n} օր", "{n} días"], y: ["{n} years", "{n} лет", "{n} տարի", "{n} años"],
  km: ["{n} km", "{n} км", "{n} կմ", "{n} km"], mkm: ["{n} million km", "{n} млн км", "{n} միլիոն կմ", "{n} millones de km"], au: ["{n} AU", "{n} а. е.", "{n} ա. մ.", "{n} UA"],
  ps: ["photon sphere", "фотонная сфера", "ֆոտոնային սֆերա", "esfera de fotones"], isco: ["last stable orbit", "последняя устойчивая орбита", "վերջին կայուն ուղեծիր", "última órbita estable"],
  unstable: ["Below 3 Rs no orbit is stable: the slightest nudge sends the probe in.", "Ниже 3 Rs устойчивых орбит нет: малейший толчок — и зонд падает.", "3 Rs-ից ներքև կայուն ուղեծրեր չկան․ ամենափոքր հրումից զոնդն ընկնում է։", "Por debajo de 3 Rs ninguna órbita es estable: el menor empujón hace caer la sonda."],
  note: [
    "Rs is the Schwarzschild radius, the size of the horizon. Distances on the picture are compressed. Notice the paradox: the heavier the black hole, the gentler its tides at the horizon. You could cross M87*'s without feeling a thing; a 10-Sun one would spaghettify you long before.",
    "Rs — радиус Шварцшильда, размер горизонта. Расстояния на картинке сжаты. Заметьте парадокс: чем тяжелее чёрная дыра, тем мягче приливы у её горизонта. Горизонт M87* можно пересечь, ничего не почувствовав, а дыра в 10 Солнц растянет вас в макаронину задолго до него.",
    "Rs-ը Շվարցշիլդի շառավիղն է՝ հորիզոնի չափը։ Նկարում հեռավորությունները սեղմված են։ Ուշադրություն դարձրեք պարադոքսին․ որքան ծանր է սև խոռոչը, այնքան մեղմ են մակընթացությունները նրա հորիզոնի մոտ։ M87*-ի հորիզոնը կարելի է անցնել առանց որևէ բան զգալու, իսկ 10 Արեգակ զանգվածով խոռոչը ձեզ մակարոնի պես կձգի դրանից շատ առաջ։",
    "Rs es el radio de Schwarzschild, el tamaño del horizonte. Las distancias del dibujo están comprimidas. Fíjate en la paradoja: cuanto más pesado es el agujero negro, más suaves son sus mareas en el horizonte. Podrías cruzar el de M87* sin notar nada; uno de 10 Soles te convertiría en espagueti mucho antes."],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];

function waveRGB(nm) { // visible spectrum approximation, 380–780 nm
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else { r = 1; }
  const k = nm > 700 ? Math.max(0.15, 0.3 + 0.7 * (780 - nm) / 80) : 1;
  return `rgb(${Math.round(255 * r * k)},${Math.round(255 * g * k)},${Math.round(255 * b * k)})`;
}

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const fmt = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  const sig = n => n >= 100 ? fmt(n) : n >= 10 ? fmt(n, 1) : n >= 1 ? fmt(n, 2) : fmt(n, 3);
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns" role="group" aria-label="${T("massAria")}">
        ${MASSES.map(([id], i) => `<button class="btn small" data-m="${i}" aria-pressed="${i === 0}">${T(id)}</button>`).join("")}
      </div>
      <div class="btns" role="group" aria-label="${T("modeAria")}">
        <button class="btn small" data-mode="hover" aria-pressed="true">${T("hover")}</button>
        <button class="btn small" data-mode="orbit" aria-pressed="false">${T("orbit")}</button>
      </div>
      <label class="field">${T("dist")} <b data-r="r"></b><input type="range" id="h-r" min="0" max="1" step="0.0005" value="0.35"></label>
      <dl class="readouts">
        <div><dt>${T("rate")}</dt><dd data-r="rate"></dd></div>
        <div><dt>${T("hour")}</dt><dd data-r="hour"></dd></div>
        <div><dt>${T("light")}</dt><dd data-r="light" style="font-size:1.15rem"></dd></div>
        <div><dt>${T("tide")}</dt><dd data-r="tide"></dd></div>
      </dl>
      <p class="note" data-r="warn" hidden>${T("unstable")}</p>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const rIn = root.querySelector("#h-r"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, mass = MASSES[0][1], mode = "hover";
  let farT = 0, probeT = 0, orbA = 0, pulses = [], nextPulse = 0;

  const minR = () => mode === "orbit" ? 1.52 : 1.002;
  const radius = () => { const s = +rIn.value; return minR() + (100 - minR()) * Math.pow(s, 2.6); };
  const factor = r => Math.sqrt(Math.max(1e-9, 1 - (mode === "orbit" ? 1.5 : 1) / r));
  const rsKm = () => RS_SUN_KM * mass;

  function dist(km) {
    if (km < 1e6) return T("km", { n: fmt(km) });
    if (km < 1.5e9) return T("mkm", { n: sig(km / 1e6) });
    return T("au", { n: sig(km / 149597870.7) });
  }
  function dur(h) {
    if (h < 48) return T("h", { n: sig(h) });
    if (h < 24 * 730) return T("d", { n: sig(h / 24) });
    return T("y", { n: sig(h / 24 / 365.25) });
  }
  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const r = radius(), f = factor(r);
    R("r").textContent = `${T("rs", { n: sig(r) })} · ${dist(r * rsKm())}`;
    R("rate").textContent = `${fmt(f * 100, f < 0.1 ? 2 : 1)}%`;
    R("hour").textContent = dur(1 / f);
    const nm = 530 / f;
    R("light").textContent = nm < 780 ? T("nm", { n: fmt(nm) }) : nm < 1e6 ? T("ir", { n: fmt(nm) }) : T("radio");
    const rsM = rsKm() * 1000, tide = C * C * 2 / (rsM * rsM * r * r * r) / G0; // 2 m tall body, in g
    const sup = n => String(n).replace(/./g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]);
    if (tide >= 1e4) { const ex = Math.floor(Math.log10(tide)); R("tide").textContent = `${fmt(tide / 10 ** ex, 1)}×10${sup(ex)} g`; }
    else R("tide").textContent = `${sig(tide)} g`;
    R("warn").hidden = !(mode === "orbit" && r < 3);
  }
  function clock(x, y, rad, t, label, col) {
    c.strokeStyle = "rgba(236,229,214,.35)"; c.lineWidth = 1; c.beginPath(); c.arc(x, y, rad, 0, Math.PI * 2); c.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; c.beginPath(); c.moveTo(x + Math.cos(a) * rad * 0.82, y + Math.sin(a) * rad * 0.82); c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); c.stroke(); }
    const a = t / 6 * Math.PI * 2 - Math.PI / 2; // one turn every 6 s of that clock's own time
    c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * rad * 0.78, y + Math.sin(a) * rad * 0.78); c.stroke();
    c.fillStyle = "rgba(156,147,132,.9)"; c.font = "11px Archivo, Arial, sans-serif"; c.fillText(label, x - c.measureText(label).width / 2, y + rad + 15);
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const r = radius(), f = factor(r);
    const bx = Math.min(W, H) * 0.32, by = H * 0.45, Rh = Math.min(W, H) * 0.075;
    const avail = W - bx - 30, A = (avail / Rh - 1) / Math.log(100);
    const px = x => Rh * (1 + A * Math.log(x)); // compressed radial scale
    // faint accretion glow + horizon
    const g = c.createRadialGradient(bx, by, Rh, bx, by, Rh * 2.6); g.addColorStop(0, "rgba(231,161,94,.35)"); g.addColorStop(1, "rgba(231,161,94,0)");
    c.fillStyle = g; c.beginPath(); c.arc(bx, by, Rh * 2.6, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#000"; c.beginPath(); c.arc(bx, by, Rh, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "rgba(231,161,94,.8)"; c.lineWidth = 1.2; c.stroke();
    c.font = "11px Archivo, Arial, sans-serif"; c.lineWidth = 1;
    for (const [x, lbl] of [[1.5, T("ps")], [3, T("isco")]]) {
      c.setLineDash([3, 5]); c.strokeStyle = "rgba(175,200,230,.35)"; c.beginPath(); c.arc(bx, by, px(x), 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      c.fillStyle = "rgba(175,200,230,.7)"; c.fillText(lbl, bx - c.measureText(lbl).width / 2, by - px(x) - 4);
    }
    // probe position
    const pr = px(r), a = mode === "orbit" ? orbA : 0, sx = bx + Math.cos(a) * pr, sy = by - Math.sin(a) * pr * 0.35;
    // light pulses: rings expanding from where they were emitted, colour by received wavelength
    const col = waveRGB(Math.min(780, 530 / f));
    for (const p of pulses) {
      const rad = (farT - p.t) * Math.min(W, H) * 0.35; if (rad <= 0) continue;
      c.strokeStyle = col; c.globalAlpha = Math.max(0, 0.8 - rad / (W * 0.9)); c.beginPath(); c.arc(p.x, p.y, rad, -0.5, 0.5); c.stroke();
    }
    c.globalAlpha = 1;
    c.fillStyle = "#ece5d6"; c.beginPath(); c.arc(sx, sy, 4, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "rgba(236,229,214,.5)"; c.beginPath(); c.arc(sx, sy, 8, 0, Math.PI * 2); c.stroke();
    // clocks
    const cr = Math.max(16, Math.min(W, H) * 0.075), cy = H - cr - 26;
    clock(W - cr * 4.2, cy, cr, farT, T("far"), "#afc8e6");
    clock(W - cr * 1.6, cy, cr, probeT, T("probe"), "#e7a15e");
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    const r = radius(), f = factor(r);
    farT += dt; probeT += dt * f;
    if (mode === "orbit") orbA += dt * 0.6 / Math.pow(r / 3, 1.5); // visual angular speed, falls off like Kepler
    // a pulse every 0.6 s of probe time → spaced 0.6/f s apart for you
    if (probeT >= nextPulse) {
      const bx = Math.min(W, H) * 0.32, by = H * 0.45, Rh = Math.min(W, H) * 0.075, A = (W - bx - 30 - Rh) / Rh / Math.log(100);
      const pr = Rh * (1 + A * Math.log(r)), a = mode === "orbit" ? orbA : 0;
      pulses.push({ t: farT, x: bx + Math.cos(a) * pr, y: H * 0.45 - Math.sin(a) * pr * 0.35 });
      nextPulse = probeT + 0.6; if (pulses.length > 24) pulses.shift();
    }
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  root.querySelectorAll("[data-m]").forEach(b => b.addEventListener("click", () => {
    mass = MASSES[+b.dataset.m][1];
    root.querySelectorAll("[data-m]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); readouts();
  }));
  root.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => {
    mode = b.dataset.mode; pulses = []; nextPulse = probeT;
    root.querySelectorAll("[data-mode]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); readouts();
  }));
  rIn.addEventListener("input", () => { pulses = []; nextPulse = probeT; readouts(); });
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
