// Pro lesson: ride a beam of light from the Sun to Neptune at true scale. Served only to Pro subscribers.
export const meta = { id: "scale", title: "The true scale", pro: true };

const AU_KM = 149597870.7, C = 299792.458, LIGHT_S_PER_AU = AU_KM / C; // ≈ 499 s
const PLANETS = [ // mean distance (AU), diameter (km), colour
  ["Mercury", 0.387, 4879, "#a99f97"], ["Venus", 0.723, 12104, "#e8cf9a"], ["Earth", 1.0, 12756, "#5b8ed6"], ["Mars", 1.524, 6792, "#d0643a"],
  ["Jupiter", 5.203, 142984, "#d8b88f"], ["Saturn", 9.537, 120536, "#e6d09c"], ["Uranus", 19.19, 51118, "#9fd8de"], ["Neptune", 30.07, 49528, "#5878d8"],
];
const SUN_KM = 1392700;

const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["The true scale", "Настоящий масштаб", "Իրական մասշտաբը", "La escala real"],
  intro: [
    "Most pictures of the Solar System cheat: the planets are drawn huge and close together. Here every distance is true. You are riding a photon that has just left the Sun at 299,792 km/s. Speed up time to reach Neptune before dinner.",
    "Почти все картинки Солнечной системы врут: планеты нарисованы огромными и близко друг к другу. Здесь все расстояния настоящие. Вы летите на фотоне, который только что покинул Солнце со скоростью 299 792 км/с. Ускорьте время, чтобы добраться до Нептуна до ужина.",
    "Արեգակնային համակարգի գրեթե բոլոր նկարները խաբում են․ մոլորակները նկարված են հսկայական և իրար մոտ։ Այստեղ բոլոր հեռավորությունները իրական են։ Դուք թռչում եք ֆոտոնի վրա, որը հենց նոր է լքել Արեգակը՝ 299 792 կմ/վ արագությամբ։ Արագացրեք ժամանակը, որ ընթրիքից առաջ հասնեք Նեպտուն։",
    "Casi todas las imágenes del sistema solar hacen trampa: los planetas aparecen enormes y muy juntos. Aquí todas las distancias son reales. Viajas en un fotón que acaba de salir del Sol a 299 792 km/s. Acelera el tiempo para llegar a Neptuno antes de cenar."],
  aria: ["A beam of light travelling outward from the Sun past the planets at true distances.", "Луч света летит от Солнца мимо планет на настоящих расстояниях.", "Լույսի ճառագայթը Արեգակից թռչում է մոլորակների կողքով՝ իրական հեռավորություններով։", "Un rayo de luz sale del Sol y pasa junto a los planetas a distancias reales."],
  speedAria: ["Time speed", "Скорость времени", "Ժամանակի արագություն", "Velocidad del tiempo"],
  real: ["Real time", "Реальное время", "Իրական ժամանակ", "Tiempo real"],
  restart: ["Restart", "Сначала", "Սկսել նորից", "Reiniciar"],
  zoom: ["Zoom: width of view", "Масштаб: ширина обзора", "Մասշտաբ՝ տեսադաշտի լայնություն", "Zoom: ancho de la vista"],
  t: ["Light travel time", "Время в пути", "Լույսի ճանապարհի ժամանակը", "Tiempo de viaje de la luz"],
  d: ["Distance from Sun", "Расстояние от Солнца", "Հեռավորությունը Արեգակից", "Distancia al Sol"],
  next: ["Next planet", "Следующая планета", "Հաջորդ մոլորակը", "Siguiente planeta"],
  eta: ["Arrives in", "Прибытие через", "Կհասնի", "Llega en"],
  beyond: ["Beyond Neptune", "За Нептуном", "Նեպտունից այն կողմ", "Más allá de Neptuno"],
  s: ["{n} s", "{n} с", "{n} վ", "{n} s"],
  ms: ["{m} min {s} s", "{m} мин {s} с", "{m} ր {s} վ", "{m} min {s} s"],
  hm: ["{h} h {m} min", "{h} ч {m} мин", "{h} ժ {m} ր", "{h} h {m} min"],
  mkm: ["{n} million km", "{n} млн км", "{n} միլիոն կմ", "{n} millones de km"],
  au: ["AU", "а. е.", "ա. մ.", "UA"],
  sizes: [
    "At this zoom one pixel is {km} km. Earth would be {e} px wide and the Sun {s} px, which is why the dots are enlarged; their positions are exact.",
    "При таком масштабе один пиксель — это {km} км. Земля была бы шириной {e} пикс., а Солнце — {s} пикс., поэтому точки увеличены; их положения точные.",
    "Այս մասշտաբով մեկ պիքսելը {km} կմ է։ Երկիրը կլիներ {e} պիքսել լայնությամբ, իսկ Արեգակը՝ {s} պիքսել, դրա համար կետերը մեծացված են․ նրանց դիրքերը ճշգրիտ են։",
    "Con este zoom, un píxel equivale a {km} km. La Tierra mediría {e} px y el Sol {s} px, por eso los puntos están agrandados; sus posiciones son exactas."],
  names: [["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    ["Меркурий", "Венера", "Земля", "Марс", "Юпитер", "Сатурн", "Уран", "Нептун"],
    ["Մերկուրի", "Վեներա", "Երկիր", "Մարս", "Յուպիտեր", "Սատուրն", "Ուրան", "Նեպտուն"],
    ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"]],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const num = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns" role="group" aria-label="${T("speedAria")}">
        <button class="btn small" data-s="1" aria-pressed="false">${T("real")}</button>
        <button class="btn small" data-s="60" aria-pressed="true">60×</button>
        <button class="btn small" data-s="600" aria-pressed="false">600×</button>
        <button class="btn small" data-a="restart">${T("restart")}</button>
      </div>
      <label class="field">${T("zoom")} <b data-r="zoom"></b><input type="range" id="s-zoom" min="0" max="1" step="0.001" value="0.25"></label>
      <dl class="readouts">
        <div><dt>${T("t")}</dt><dd data-r="t"></dd></div>
        <div><dt>${T("d")}</dt><dd data-r="d"></dd></div>
        <div><dt>${T("next")}</dt><dd data-r="next"></dd></div>
        <div><dt>${T("eta")}</dt><dd data-r="eta"></dd></div>
      </dl>
      <p class="note" data-r="sizes"></p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const zoomIn = root.querySelector("#s-zoom"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, t = 0, speed = 60, raf = 0, alive = true, last = 0, clock = 0;
  const fmtT = s => s < 60 ? T("s", { n: s.toFixed(0) }) : s < 3600 ? T("ms", { m: Math.floor(s / 60), s: Math.floor(s % 60) }) : T("hm", { h: Math.floor(s / 3600), m: Math.floor(s % 3600 / 60) });
  const nameOf = n => L.names[li][PLANETS.findIndex(p => p[0] === n)];
  const viewAU = () => 0.08 * Math.pow(32 / 0.08, +zoomIn.value);

  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const d = t / LIGHT_S_PER_AU, v = viewAU();
    R("zoom").textContent = `${num(v, v < 1 ? 2 : 1)} ${T("au")}`;
    R("t").textContent = fmtT(t);
    R("d").textContent = d < 1 ? T("mkm", { n: num(d * AU_KM / 1e6, 1) }) : `${num(d, 2)} ${T("au")}`;
    const nx = PLANETS.find(p => p[1] > d);
    R("next").textContent = nx ? nameOf(nx[0]) : T("beyond");
    R("eta").textContent = nx ? fmtT((nx[1] - d) * LIGHT_S_PER_AU) : "—";
    const kmPerPx = v * AU_KM / W;
    R("sizes").textContent = T("sizes", { km: num(Math.round(kmPerPx)), e: num(12756 / kmPerPx, 3), s: num(SUN_KM / kmPerPx, 2) });
  }
  function draw() {
    const d = t / LIGHT_S_PER_AU, v = viewAU(), pxPerAU = W / v, cy = H / 2;
    const left = Math.max(0, d - v * 0.4); // keep the photon at 40% across
    const X = au => (au - left) * pxPerAU;
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    // AU ticks
    const step = v > 10 ? 5 : v > 2 ? 1 : v > 0.5 ? 0.1 : 0.05;
    c.fillStyle = "rgba(156,147,132,.7)"; c.font = "11px Archivo, Arial, sans-serif";
    for (let a = Math.ceil(left / step) * step; a < left + v; a += step) {
      const x = X(a); c.fillRect(x, H - 26, 1, 6);
      if (Math.abs(a / step - Math.round(a / step)) < 1e-6 && (Math.round(a / step) % (v > 2 && step < 1 ? 5 : 1) === 0)) c.fillText(`${num(+a.toFixed(2), a % 1 ? 2 : 0)} ${T("au")}`, x + 3, H - 12);
    }
    // Sun
    if (X(0) > -40) {
      const sx = X(0), g = c.createRadialGradient(sx, cy, 0, sx, cy, 30); g.addColorStop(0, "#fff3d0"); g.addColorStop(0.35, "rgba(255,180,80,.9)"); g.addColorStop(1, "rgba(255,140,40,0)");
      c.fillStyle = g; c.beginPath(); c.arc(sx, cy, 30, 0, Math.PI * 2); c.fill();
    }
    for (const [n, a, , col] of PLANETS) {
      const x = X(a); if (x < -20 || x > W + 20) continue;
      c.strokeStyle = "rgba(236,229,214,.08)"; c.beginPath(); c.moveTo(x, 24); c.lineTo(x, H - 34); c.stroke();
      c.fillStyle = col; c.beginPath(); c.arc(x, cy, 4, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(236,229,214,.9)"; c.fillText(nameOf(n), x + 7, cy - 10);
      c.fillStyle = "rgba(156,147,132,.8)"; c.fillText(fmtT(a * LIGHT_S_PER_AU), x + 7, cy + 18);
    }
    // the photon and its trail
    const px = X(d), tg = c.createLinearGradient(px - 160, 0, px, 0);
    tg.addColorStop(0, "rgba(255,240,200,0)"); tg.addColorStop(1, "rgba(255,240,200,.9)");
    c.strokeStyle = tg; c.lineWidth = 2; c.beginPath(); c.moveTo(Math.max(X(0), px - 160), cy); c.lineTo(px, cy); c.stroke(); c.lineWidth = 1;
    c.fillStyle = "#fff8e6"; c.beginPath(); c.arc(px, cy, 3, 0, Math.PI * 2); c.fill();
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.1, (ts - (last || ts)) / 1000); last = ts;
    if (!document.hidden) {
      t += dt * speed;
      if (t / LIGHT_S_PER_AU > 32) t = 0;
      draw(); clock += dt; if (clock > 0.2) { clock = 0; readouts(); }
    }
    raf = requestAnimationFrame(frame);
  }
  root.querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => {
    speed = +b.dataset.s;
    root.querySelectorAll("[data-s]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  }));
  root.querySelector('[data-a="restart"]').addEventListener("click", () => { t = 0; readouts(); });
  zoomIn.addEventListener("input", readouts);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
