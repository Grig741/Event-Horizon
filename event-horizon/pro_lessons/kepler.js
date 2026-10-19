// Pro lesson: Kepler's laws. Served only to Pro subscribers by /api/lesson/kepler.js.
// The planet moves by solving Kepler's equation, so equal times really do sweep equal areas.
export const meta = { id: "kepler", title: "Kepler's laws", pro: true };

const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Kepler's laws", "Законы Кеплера", "Կեպլերի օրենքները", "Leyes de Kepler"],
  intro: [
    "Planets move on ellipses with the Sun at one focus (first law). A line from the Sun to the planet sweeps equal areas in equal times (second law), so the planet rushes near the Sun and crawls far away. The square of the period equals the cube of the orbit's size (third law): T² = a³, with T in years and a in astronomical units.",
    "Планеты движутся по эллипсам, в одном из фокусов которых Солнце (первый закон). Линия от Солнца к планете за равное время заметает равные площади (второй закон), поэтому у Солнца планета мчится, а вдали ползёт. Квадрат периода равен кубу размера орбиты (третий закон): T² = a³, где T в годах, а a в астрономических единицах.",
    "Մոլորակները շարժվում են էլիպսներով, որոնց կիզակետերից մեկում Արեգակն է (առաջին օրենք)։ Արեգակից մոլորակ տարված գիծը հավասար ժամանակում գծում է հավասար մակերեսներ (երկրորդ օրենք), ուստի Արեգակի մոտ մոլորակը սրընթաց է, իսկ հեռվում՝ դանդաղ։ Պարբերության քառակուսին հավասար է ուղեծրի չափի խորանարդին (երրորդ օրենք)՝ T² = a³, որտեղ T-ն տարիներով է, իսկ a-ն՝ աստղագիտական միավորներով։",
    "Los planetas se mueven en elipses con el Sol en uno de sus focos (primera ley). La línea del Sol al planeta barre áreas iguales en tiempos iguales (segunda ley), así que el planeta corre cerca del Sol y se arrastra lejos de él. El cuadrado del periodo es igual al cubo del tamaño de la órbita (tercera ley): T² = a³, con T en años y a en unidades astronómicas."],
  aria: ["An elliptical orbit divided into twelve wedges of equal area, each swept in the same time.", "Эллиптическая орбита, разделённая на двенадцать секторов равной площади; каждый проходится за одно и то же время.", "Էլիպսաձև ուղեծիր՝ բաժանված հավասար մակերեսով տասներկու սեկտորի, որոնցից յուրաքանչյուրն անցնում է նույն ժամանակում։", "Una órbita elíptica dividida en doce sectores de igual área, cada uno recorrido en el mismo tiempo."],
  presets: ["Real orbits", "Настоящие орбиты", "Իրական ուղեծրեր", "Órbitas reales"],
  earth: ["Earth", "Земля", "Երկիր", "Tierra"], mercury: ["Mercury", "Меркурий", "Մերկուրի", "Mercurio"],
  mars: ["Mars", "Марс", "Մարս", "Marte"], halley: ["Halley's Comet", "Комета Галлея", "Հալլեյի գիսաստղ", "Cometa Halley"],
  ecc: ["Eccentricity", "Эксцентриситет", "Էքսցենտրիսիտետ", "Excentricidad"],
  size: ["Size of orbit, a", "Размер орбиты, a", "Ուղեծրի չափը, a", "Tamaño de la órbita, a"],
  T: ["Period (third law)", "Период (третий закон)", "Պարբերություն (երրորդ օրենք)", "Periodo (tercera ley)"],
  ratio: ["Fastest ÷ slowest", "Макс. ÷ мин. скорость", "Ամենաարագ ÷ ամենադանդաղ", "Más rápida ÷ más lenta"],
  q: ["Closest to the Sun", "Ближе всего к Солнцу", "Արեգակին ամենամոտ", "Más cerca del Sol"],
  Q: ["Farthest", "Дальше всего", "Ամենահեռու", "Más lejos"],
  days: ["{n} days", "{n} дней", "{n} օր", "{n} días"], years: ["{n} years", "{n} лет", "{n} տարի", "{n} años"],
  au: ["AU", "а. е.", "ա. մ.", "UA"],
  note: ["Each coloured wedge takes exactly 1/12 of the year. Near the Sun the wedges are short and wide; far away they are long and thin, yet all have the same area.",
    "Каждый цветной сектор занимает ровно 1/12 года. У Солнца секторы короткие и широкие, вдали — длинные и узкие, но площадь у всех одинаковая.",
    "Յուրաքանչյուր գունավոր սեկտոր տևում է ճիշտ տարվա 1/12-ը։ Արեգակի մոտ սեկտորները կարճ են ու լայն, հեռվում՝ երկար ու նեղ, բայց բոլորի մակերեսը նույնն է։",
    "Cada sector de color dura exactamente 1/12 del año. Cerca del Sol los sectores son cortos y anchos; lejos, largos y estrechos, pero todos tienen la misma área."],
  sun: ["Sun (focus)", "Солнце (фокус)", "Արեգակ (կիզակետ)", "Sol (foco)"],
  empty: ["empty focus", "пустой фокус", "դատարկ կիզակետ", "foco vacío"],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns" role="group" aria-label="${T("presets")}">
        <button class="btn small" data-p="0.0167,1">${T("earth")}</button><button class="btn small" data-p="0.2056,0.387">${T("mercury")}</button>
        <button class="btn small" data-p="0.0934,1.524">${T("mars")}</button><button class="btn small" data-p="0.967,17.8">${T("halley")}</button>
      </div>
      <label class="field">${T("ecc")} <b data-r="e"></b><input type="range" id="k-e" min="0" max="0.97" step="0.001" value="0.5"></label>
      <label class="field">${T("size")} <b data-r="a"></b><input type="range" id="k-a" min="0.3" max="40" step="0.01" value="1"></label>
      <dl class="readouts">
        <div><dt>${T("T")}</dt><dd data-r="T"></dd></div>
        <div><dt>${T("ratio")}</dt><dd data-r="ratio"></dd></div>
        <div><dt>${T("q")}</dt><dd data-r="q"></dd></div>
        <div><dt>${T("Q")}</dt><dd data-r="Q"></dd></div>
      </dl>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const eIn = root.querySelector("#k-e"), aIn = root.querySelector("#k-a"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, M = 0, raf = 0, alive = true, last = 0;
  const fmt = (n, d = 2) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });

  function solve(Mm, e) { let E = e < 0.8 ? Mm : Math.PI; for (let i = 0; i < 30; i++) E -= (E - e * Math.sin(E) - Mm) / (1 - e * Math.cos(E)); return E; }
  function pos(Mm, e) { const E = solve(Mm, e); return [Math.cos(E) - e, Math.sqrt(1 - e * e) * Math.sin(E)]; } // units of a, Sun at origin

  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const e = +eIn.value, a = +aIn.value, per = Math.pow(a, 1.5);
    R("e").textContent = fmt(e, 3); R("a").textContent = `${fmt(a)} ${T("au")}`;
    R("T").textContent = per < 2 ? T("days", { n: fmt(per * 365.25, 0) }) : T("years", { n: fmt(per, 1) });
    R("ratio").textContent = `${fmt((1 + e) / (1 - e), 2)}×`;
    R("q").textContent = `${fmt(a * (1 - e))} ${T("au")}`; R("Q").textContent = `${fmt(a * (1 + e))} ${T("au")}`;
  }
  function draw() {
    const e = +eIn.value;
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const b = Math.sqrt(1 - e * e), s = Math.min((W - 40) / 2, (H - 40) / (2 * b));
    const ox = W / 2 + e * s, oy = H / 2; // Sun at the focus
    const P = (x, y) => [ox + x * s, oy - y * s];
    const N = 12, cur = Math.floor(((M % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) / (2 * Math.PI) * N);
    for (let k = 0; k < N; k++) {
      c.beginPath(); c.moveTo(ox, oy);
      for (let j = 0; j <= 24; j++) { const p = P(...pos((k + j / 24) / N * 2 * Math.PI, e)); c.lineTo(p[0], p[1]); }
      c.closePath();
      c.fillStyle = k === cur ? "rgba(231,161,94,.45)" : k % 2 ? "rgba(175,200,230,.10)" : "rgba(236,229,214,.06)";
      c.fill();
    }
    c.strokeStyle = "rgba(236,229,214,.35)"; c.lineWidth = 1; c.beginPath();
    for (let j = 0; j <= 200; j++) { const p = P(...pos(j / 200 * 2 * Math.PI, e)); j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }
    c.stroke();
    // empty focus
    const f2 = P(-2 * e, 0); c.strokeStyle = "rgba(156,147,132,.6)"; c.beginPath(); c.arc(f2[0], f2[1], 3, 0, Math.PI * 2); c.stroke();
    // Sun
    const g = c.createRadialGradient(ox, oy, 0, ox, oy, 16); g.addColorStop(0, "#fff3d0"); g.addColorStop(0.4, "rgba(255,180,80,.9)"); g.addColorStop(1, "rgba(255,140,40,0)");
    c.fillStyle = g; c.beginPath(); c.arc(ox, oy, 16, 0, Math.PI * 2); c.fill();
    // planet and its radius vector
    const p = P(...pos(M, e));
    c.strokeStyle = "rgba(231,161,94,.9)"; c.beginPath(); c.moveTo(ox, oy); c.lineTo(p[0], p[1]); c.stroke();
    c.fillStyle = "#afc8e6"; c.beginPath(); c.arc(p[0], p[1], 5, 0, Math.PI * 2); c.fill();
    c.fillStyle = "rgba(156,147,132,.85)"; c.font = "11px Archivo, Arial, sans-serif";
    const clampX = (txt, x) => Math.max(6, Math.min(x, W - c.measureText(txt).width - 6));
    c.fillText(T("sun"), clampX(T("sun"), ox + 12), oy + 22); c.fillText(T("empty"), clampX(T("empty"), f2[0] - 30), f2[1] + 18);
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    M += dt * 2 * Math.PI / 8; // one orbit every 8 seconds on screen, whatever its real period
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  root.querySelectorAll("[data-p]").forEach(btn => btn.addEventListener("click", () => {
    const [e, a] = btn.dataset.p.split(",").map(Number); eIn.value = e; aIn.value = a; readouts();
  }));
  eIn.addEventListener("input", readouts); aIn.addEventListener("input", readouts);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
