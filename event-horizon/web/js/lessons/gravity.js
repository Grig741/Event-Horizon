// Free lesson: gravity on other worlds. Same legs, same take-off speed (a 50 cm jump on Earth),
// two lanes jumping side by side in real time. Surface gravity and escape speed from NASA fact sheets.
export const meta = { id: "gravity", title: "Gravity on other worlds", pro: false };

const G_EARTH = 9.807, V0 = Math.sqrt(2 * G_EARTH * 0.5); // ≈ 3.13 m/s take-off speed
const WORLDS = [ // id, surface gravity m/s², escape speed km/s, colour
  ["moon", 1.62, 2.38, "#cfc8b8"], ["mars", 3.71, 5.03, "#d0643a"], ["ceres", 0.28, 0.51, "#8f8a84"],
  ["titan", 1.35, 2.64, "#d9a75a"], ["pluto", 0.62, 1.21, "#d8c3a5"], ["mercury", 3.70, 4.25, "#a99f97"],
  ["venus", 8.87, 10.36, "#e8cf9a"], ["jupiter", 24.79, 59.5, "#d8b88f"], ["sun", 274, 617.7, "#ffd28a"],
];
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Gravity on other worlds", "Гравитация на других мирах", "Ձգողությունը այլ աշխարհներում", "La gravedad en otros mundos"],
  intro: [
    "Your mass is the same everywhere; your weight is not. Both astronauts below push off with exactly the same legs. On the left is Earth, on the right the world you pick. Everything runs in real time.",
    "Масса везде одинакова, а вес — нет. Оба космонавта ниже отталкиваются одинаково сильно. Слева Земля, справа — мир, который вы выберете. Всё идёт в реальном времени.",
    "Ձեր զանգվածը ամենուր նույնն է, իսկ քաշը՝ ոչ։ Ներքևի երկու տիեզերագնացներն էլ հրվում են ճիշտ նույն ուժով։ Ձախում Երկիրն է, աջում՝ ձեր ընտրած աշխարհը։ Ամեն ինչ ընթանում է իրական ժամանակում։",
    "Tu masa es la misma en todas partes; tu peso no. Los dos astronautas de abajo se impulsan con las mismas piernas. A la izquierda está la Tierra, a la derecha el mundo que elijas. Todo ocurre en tiempo real."],
  aria: ["Two astronauts jumping side by side, one on Earth and one on the chosen world.", "Два космонавта прыгают рядом: один на Земле, другой на выбранном мире.", "Երկու տիեզերագնաց ցատկում են կողք կողքի՝ մեկը Երկրում, մյուսը՝ ընտրված աշխարհում։", "Dos astronautas saltan uno junto al otro, uno en la Tierra y otro en el mundo elegido."],
  pick: ["Choose a world", "Выберите мир", "Ընտրեք աշխարհ", "Elige un mundo"],
  mass: ["Your mass", "Ваша масса", "Ձեր զանգվածը", "Tu masa"],
  g: ["Gravity", "Тяготение", "Ձգողություն", "Gravedad"],
  w: ["Scales would show", "Весы покажут", "Կշեռքը ցույց կտա", "La báscula marcaría"],
  h: ["Jump height", "Высота прыжка", "Ցատկի բարձրություն", "Altura del salto"],
  air: ["Time in the air", "Время в воздухе", "Օդում անցկացրած ժամանակ", "Tiempo en el aire"],
  esc: ["Escape speed", "Вторая космическая", "Երկրորդ տիեզերական արագություն", "Velocidad de escape"],
  kg: ["{n} kg", "{n} кг", "{n} կգ", "{n} kg"], m: ["{n} m", "{n} м", "{n} մ", "{n} m"], cm: ["{n} cm", "{n} см", "{n} սմ", "{n} cm"],
  s: ["{n} s", "{n} с", "{n} վ", "{n} s"], kms: ["{n} km/s", "{n} км/с", "{n} կմ/վ", "{n} km/s"], gE: ["{n} g", "{n} g", "{n} g", "{n} g"],
  note: [
    "Jump height and hang time both scale as 1/g. On the Sun no one could stand at all; it is shown only for the numbers. On Ceres one hop keeps you in the air for over 20 seconds.",
    "Высота прыжка и время в воздухе растут как 1/g. На Солнце стоять невозможно, оно здесь только ради цифр. А на Церере один прыжок держит вас в воздухе больше 20 секунд.",
    "Ցատկի բարձրությունը և օդում մնալու ժամանակը աճում են 1/g-ի պես։ Արեգակի վրա կանգնել հնարավոր չէ, այն այստեղ է միայն թվերի համար։ Իսկ Ցերերայի վրա մեկ ցատկը ձեզ օդում է պահում ավելի քան 20 վայրկյան։",
    "La altura del salto y el tiempo en el aire crecen como 1/g. En el Sol nadie podría estar de pie; aparece solo por los números. En Ceres un solo salto te mantiene en el aire más de 20 segundos."],
  names: [
    { earth: "Earth", moon: "Moon", mars: "Mars", ceres: "Ceres", titan: "Titan", pluto: "Pluto", mercury: "Mercury", venus: "Venus", jupiter: "Jupiter", sun: "Sun" },
    { earth: "Земля", moon: "Луна", mars: "Марс", ceres: "Церера", titan: "Титан", pluto: "Плутон", mercury: "Меркурий", venus: "Венера", jupiter: "Юпитер", sun: "Солнце" },
    { earth: "Երկիր", moon: "Լուսին", mars: "Մարս", ceres: "Ցերերա", titan: "Տիտան", pluto: "Պլուտոն", mercury: "Մերկուրի", venus: "Վեներա", jupiter: "Յուպիտեր", sun: "Արեգակ" },
    { earth: "Tierra", moon: "Luna", mars: "Marte", ceres: "Ceres", titan: "Titán", pluto: "Plutón", mercury: "Mercurio", venus: "Venus", jupiter: "Júpiter", sun: "Sol" }],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const N = id => L.names[li][id];
  const fmt = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns" role="group" aria-label="${T("pick")}">
        ${WORLDS.map(([id], i) => `<button class="btn small" data-w="${i}" aria-pressed="${i === 0}">${N(id)}</button>`).join("")}
      </div>
      <label class="field">${T("mass")} <b data-r="mass"></b><input type="range" id="gr-m" min="20" max="150" step="1" value="70"></label>
      <dl class="readouts">
        <div><dt>${T("g")}</dt><dd data-r="g"></dd></div>
        <div><dt>${T("w")}</dt><dd data-r="w"></dd></div>
        <div><dt>${T("h")}</dt><dd data-r="h"></dd></div>
        <div><dt>${T("air")}</dt><dd data-r="air"></dd></div>
        <div><dt>${T("esc")}</dt><dd data-r="esc"></dd></div>
      </dl>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const mIn = root.querySelector("#gr-m"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, sel = 0;
  const lanes = [{ g: G_EARTH, t: 0, pause: 0, col: "#5b8ed6", id: "earth" }, { g: WORLDS[0][1], t: 0, pause: 0, col: WORLDS[0][3], id: WORLDS[0][0] }];

  const len = m => m >= 1 ? T("m", { n: fmt(m, m < 10 ? 2 : 1) }) : T("cm", { n: fmt(m * 100, 1) });
  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const [, g, esc] = WORLDS[sel], m = +mIn.value, h = V0 * V0 / (2 * g);
    R("mass").textContent = T("kg", { n: fmt(m) });
    R("g").textContent = T("gE", { n: fmt(g / G_EARTH, g / G_EARTH < 1 ? 3 : 2) });
    R("w").textContent = T("kg", { n: fmt(m * g / G_EARTH, m * g / G_EARTH < 10 ? 1 : 0) });
    R("h").textContent = len(h);
    R("air").textContent = T("s", { n: fmt(2 * V0 / g, 2 * V0 / g < 10 ? 2 : 1) });
    R("esc").textContent = T("kms", { n: fmt(esc, esc < 10 ? 2 : 1) });
  }
  function astronaut(x, y, s, col, airborne) {
    c.strokeStyle = "#ece5d6"; c.fillStyle = "#ece5d6"; c.lineWidth = Math.max(1.5, s * 0.08); c.lineCap = "round";
    const leg = airborne ? 0.25 : 0.12;
    c.beginPath(); c.moveTo(x, y - s * 0.45); c.lineTo(x - s * leg, y); c.moveTo(x, y - s * 0.45); c.lineTo(x + s * leg, y); c.stroke();
    c.beginPath(); c.moveTo(x, y - s * 0.45); c.lineTo(x, y - s * 0.85); c.stroke();
    const arm = airborne ? -0.35 : 0.1;
    c.beginPath(); c.moveTo(x, y - s * 0.75); c.lineTo(x - s * 0.25, y - s * (0.6 + arm)); c.moveTo(x, y - s * 0.75); c.lineTo(x + s * 0.25, y - s * (0.6 + arm)); c.stroke();
    c.beginPath(); c.arc(x, y - s, s * 0.15, 0, Math.PI * 2); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(x + s * 0.05, y - s, s * 0.08, 0, Math.PI * 2); c.fill(); // visor
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const ground = H - 34, top = 34, body = 1.75; // astronaut height in metres
    const maxH = Math.max(...lanes.map(l => V0 * V0 / (2 * l.g))) + body + 0.3;
    const ppm = (ground - top) / maxH; // pixels per metre, shared by both lanes so heights compare honestly
    c.font = "11px Archivo, Arial, sans-serif";
    // ruler
    const step = [0.25, 0.5, 1, 2, 5, 10, 20, 50].find(s => s * ppm > 34) || 100;
    c.fillStyle = "rgba(156,147,132,.7)"; c.strokeStyle = "rgba(236,229,214,.08)"; c.lineWidth = 1;
    for (let m = step; m * ppm < ground - top + 1; m += step) {
      const y = ground - m * ppm; c.beginPath(); c.moveTo(40, y); c.lineTo(W - 8, y); c.stroke(); c.fillText(len(m), 6, y + 4);
    }
    lanes.forEach((ln, i) => {
      const x0 = 40 + (W - 48) * (i + 0.5) / 2, hang = 2 * V0 / ln.g;
      const y = ln.pause > 0 ? 0 : Math.max(0, V0 * ln.t - 0.5 * ln.g * ln.t * ln.t);
      c.fillStyle = "rgba(236,229,214,.06)"; c.fillRect(40 + (W - 48) * i / 2 + 6, ground, (W - 48) / 2 - 12, H - ground);
      c.strokeStyle = ln.col; c.lineWidth = 2; c.beginPath(); c.moveTo(40 + (W - 48) * i / 2 + 6, ground); c.lineTo(40 + (W - 48) * (i + 1) / 2 - 6, ground); c.stroke();
      // apex marker
      const apex = ground - (V0 * V0 / (2 * ln.g)) * ppm;
      c.setLineDash([4, 4]); c.strokeStyle = "rgba(231,161,94,.5)"; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x0 - 30, apex - body * ppm); c.lineTo(x0 + 30, apex - body * ppm); c.stroke(); c.setLineDash([]);
      astronaut(x0, ground - y * ppm, Math.max(14, body * ppm), ln.col, y > 0.01);
      c.fillStyle = "#ece5d6"; const nm = N(ln.id); c.fillText(nm, x0 - c.measureText(nm).width / 2, H - 12);
      const tl = T("s", { n: fmt(Math.min(ln.t, hang), 1) });
      c.fillStyle = "rgba(156,147,132,.85)"; c.fillText(tl, x0 - c.measureText(tl).width / 2, top - 12);
    });
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    for (const ln of lanes) {
      if (ln.pause > 0) { ln.pause -= dt; if (ln.pause <= 0) ln.t = 0; continue; }
      ln.t += dt; if (ln.t >= 2 * V0 / ln.g) { ln.t = 2 * V0 / ln.g; ln.pause = 0.6; }
    }
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  root.querySelectorAll("[data-w]").forEach(b => b.addEventListener("click", () => {
    sel = +b.dataset.w; const [id, g, , col] = WORLDS[sel];
    Object.assign(lanes[1], { g, col, id, t: 0, pause: 0 }); Object.assign(lanes[0], { t: 0, pause: 0 });
    root.querySelectorAll("[data-w]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    readouts();
  }));
  mIn.addEventListener("input", readouts);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
