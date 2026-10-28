// Pro lesson: hunting exoplanets by transits. A planet crosses its star and the starlight dips by ≈ (Rp/R*)².
// The blocked light is integrated numerically over the planet's disc with quadratic limb darkening.
// Served only to Pro subscribers by /api/lesson/transits.js.
export const meta = { id: "transits", title: "Hunting exoplanets", pro: true };

const R_SUN_IN_EARTH = 109.1, R_JUP_IN_EARTH = 11.21;
const STARS = [["sunlike", 1.0, 5772], ["reddwarf", 0.12, 2566], ["fstar", 1.5, 6700]]; // radius (R☉), temperature
const PRESETS = [["earth", 0, 1, 0.2], ["jupiter", 0, R_JUP_IN_EARTH, 0.3], ["hotj", 2, 1.4 * R_JUP_IN_EARTH, 0.1], ["trappist", 1, 0.92, 0.2]];
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Hunting exoplanets", "Охота на экзопланеты", "Էկզոմոլորակների որս", "A la caza de exoplanetas"],
  intro: [
    "Most of the 6 000 known exoplanets were never seen. They were found because their star got very slightly dimmer, again and again, each time the planet passed in front of it. This is how the Kepler and TESS telescopes work. <b>Change the planet and its star</b> and see whether you could find it.",
    "Большинство из 6 000 известных экзопланет никто не видел. Их нашли, потому что звезда чуть-чуть тускнела — снова и снова, каждый раз, когда планета проходила перед ней. Так работают телескопы «Кеплер» и TESS. <b>Меняйте планету и её звезду</b> и проверьте, удалось бы вам её найти.",
    "Հայտնի 6 000 էկզոմոլորակների մեծ մասը ոչ ոք չի տեսել։ Դրանք գտնվել են, որովհետև աստղը շատ քիչ էր խամրում՝ նորից ու նորից, ամեն անգամ, երբ մոլորակն անցնում էր նրա առջևով։ Այսպես են աշխատում «Կեպլեր» և TESS աստղադիտակները։ <b>Փոխեք մոլորակը և նրա աստղը</b> և ստուգեք, արդյոք կկարողանայիք գտնել այն։",
    "La mayoría de los 6000 exoplanetas conocidos nunca se han visto. Se descubrieron porque su estrella se atenuaba un poquito, una y otra vez, cada vez que el planeta pasaba por delante. Así trabajan los telescopios Kepler y TESS. <b>Cambia el planeta y su estrella</b> y comprueba si podrías encontrarlo."],
  aria: ["A planet crossing the face of its star, and below it the star's brightness dipping as it passes.", "Планета проходит по диску звезды, а ниже — график яркости звезды с провалом во время прохождения.", "Մոլորակն անցնում է աստղի սկավառակով, իսկ ներքևում՝ աստղի պայծառության գրաֆիկը՝ անկումով անցման ժամանակ։", "Un planeta cruza el disco de su estrella y debajo el brillo de la estrella cae mientras pasa."],
  presetsAria: ["Real cases", "Настоящие примеры", "Իրական օրինակներ", "Casos reales"],
  earth: ["Earth & Sun", "Земля и Солнце", "Երկիր և Արեգակ", "Tierra y Sol"], jupiter: ["Jupiter & Sun", "Юпитер и Солнце", "Յուպիտեր և Արեգակ", "Júpiter y Sol"],
  hotj: ["Hot Jupiter", "Горячий юпитер", "Տաք յուպիտեր", "Júpiter caliente"], trappist: ["TRAPPIST-1e", "TRAPPIST-1e", "TRAPPIST-1e", "TRAPPIST-1e"],
  starAria: ["Star", "Звезда", "Աստղ", "Estrella"],
  sunlike: ["Like the Sun", "Как Солнце", "Արեգակի պես", "Como el Sol"], reddwarf: ["Red dwarf", "Красный карлик", "Կարմիր թզուկ", "Enana roja"], fstar: ["Hot F star", "Горячая F-звезда", "Տաք F աստղ", "Estrella F caliente"],
  size: ["Planet size", "Размер планеты", "Մոլորակի չափը", "Tamaño del planeta"],
  b: ["Path across the star", "Путь по диску звезды", "Ուղին աստղի սկավառակով", "Recorrido sobre la estrella"],
  centre: ["through the centre", "через центр", "կենտրոնով", "por el centro"], edge: ["grazing the edge", "по самому краю", "եզրով", "rozando el borde"], miss: ["misses the star", "мимо звезды", "աստղի կողքով", "no la cruza"],
  re: ["{n} × Earth", "{n} × Земля", "{n} × Երկիր", "{n} × Tierra"],
  depth: ["Starlight blocked", "Перекрыто света", "Ծածկված լույս", "Luz bloqueada"],
  ppm: ["Parts per million", "Миллионных долей", "Միլիոներորդական", "Partes por millón"],
  who: ["Who could find it", "Кто бы нашёл", "Ով կգտներ", "Quién lo encontraría"],
  ground: ["Any good telescope", "Любой хороший телескоп", "Ցանկացած լավ աստղադիտակ", "Cualquier buen telescopio"],
  space: ["Only a space telescope", "Только космический телескоп", "Միայն տիեզերական աստղադիտակ", "Solo un telescopio espacial"],
  none: ["Nobody, yet", "Пока никто", "Դեռ ոչ ոք", "Nadie, todavía"], nothing: ["No transit", "Прохождения нет", "Անցում չկա", "Sin tránsito"],
  flux: ["brightness", "яркость", "պայծառություն", "brillo"], time: ["time", "время", "ժամանակ", "tiempo"],
  note: [
    "An Earth crossing the Sun dims it by only 0.008%, like a mosquito in front of a car headlight seen from far away. Around a small red dwarf the same planet blocks 80 times more light, which is why the seven TRAPPIST-1 planets were found so easily. Most planets never transit at all: their orbit has to be lined up almost edge-on with us.",
    "Земля на фоне Солнца ослабляет его лишь на 0,008% — как комар перед далёкой фарой. Возле маленького красного карлика та же планета перекрывает в 80 раз больше света, поэтому семь планет TRAPPIST-1 нашли так легко. А большинство планет вообще не проходят перед звездой: их орбита должна быть видна почти точно с ребра.",
    "Արեգակի ֆոնին Երկիրը թուլացնում է նրան ընդամենը 0,008%-ով՝ ինչպես մոծակը հեռավոր լուսարձակի առջև։ Փոքր կարմիր թզուկի մոտ նույն մոլորակը ծածկում է 80 անգամ ավելի շատ լույս, ահա թե ինչու TRAPPIST-1-ի յոթ մոլորակները գտնվեցին այդքան հեշտ։ Իսկ մոլորակների մեծ մասն ընդհանրապես չի անցնում աստղի առջևով․ նրանց ուղեծիրը պետք է երևա գրեթե կողքից։",
    "La Tierra delante del Sol lo atenúa solo un 0,008 %, como un mosquito delante de un faro lejano. Alrededor de una pequeña enana roja, el mismo planeta bloquea 80 veces más luz; por eso los siete planetas de TRAPPIST-1 se encontraron tan fácilmente. La mayoría de los planetas nunca transitan: su órbita tiene que verse casi de canto."],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const fmt = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns" role="group" aria-label="${T("presetsAria")}">
        ${PRESETS.map(([id], i) => `<button class="btn small" data-p="${i}">${T(id)}</button>`).join("")}
      </div>
      <div class="btns" role="group" aria-label="${T("starAria")}">
        ${STARS.map(([id], i) => `<button class="btn small" data-s="${i}" aria-pressed="${i === 0}">${T(id)}</button>`).join("")}
      </div>
      <label class="field">${T("size")} <b data-r="rp"></b><input type="range" id="tr-r" min="0" max="1" step="0.001"></label>
      <label class="field">${T("b")} <b data-r="b"></b><input type="range" id="tr-b" min="0" max="1.3" step="0.01" value="0.2"></label>
      <dl class="readouts">
        <div><dt>${T("depth")}</dt><dd data-r="depth"></dd></div>
        <div><dt>${T("ppm")}</dt><dd data-r="ppm"></dd></div>
        <div style="grid-column:1/-1"><dt>${T("who")}</dt><dd data-r="who" style="font-size:1.25rem"></dd></div>
      </dl>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const rIn = root.querySelector("#tr-r"), bIn = root.querySelector("#tr-b"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, phase = 0, starI = 0, curve = [];
  const RMIN = 0.3, RMAX = 25, toR = s => RMIN * Math.pow(RMAX / RMIN, s), toS = r => Math.log(r / RMIN) / Math.log(RMAX / RMIN);
  rIn.value = toS(R_JUP_IN_EARTH).toFixed(4);

  const ld = mu => 1 - 0.4 * (1 - mu) - 0.25 * (1 - mu) * (1 - mu); // quadratic limb darkening
  const TOTAL = (() => { let s = 0; const N = 400; for (let i = 0; i < N; i++) { const r = (i + 0.5) / N; s += ld(Math.sqrt(1 - r * r)) * 2 * Math.PI * r / N; } return s; })();
  function blocked(x, y, p) { // fraction of starlight hidden by a planet of radius p (stellar radii) centred at (x, y)
    if (Math.hypot(x, y) > 1 + p) return 0;
    let s = 0; const N = 24, cell = (2 * p / N) ** 2;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const u = -p + (i + 0.5) * 2 * p / N, v = -p + (j + 0.5) * 2 * p / N;
      if (u * u + v * v > p * p) continue;
      const rr = (x + u) ** 2 + (y + v) ** 2; if (rr >= 1) continue;
      s += ld(Math.sqrt(1 - rr)) * cell;
    }
    return s / TOTAL;
  }
  const pRatio = () => toR(+rIn.value) / (STARS[starI][1] * R_SUN_IN_EARTH);
  const maxDepth = () => blocked(0, +bIn.value, pRatio());
  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const rp = toR(+rIn.value), b = +bIn.value, d = maxDepth(), ppm = d * 1e6;
    R("rp").textContent = T("re", { n: fmt(rp, rp < 10 ? 2 : 1) });
    R("b").textContent = b < 0.15 ? T("centre") : b < 1 ? `${fmt(b, 2)}` : b < 1 + pRatio() ? T("edge") : T("miss");
    R("depth").textContent = d <= 0 ? "0%" : `${fmt(d * 100, d < 0.001 ? 4 : d < 0.01 ? 3 : 2)}%`;
    R("ppm").textContent = fmt(ppm);
    R("who").textContent = d <= 0 ? T("nothing") : ppm > 1000 ? T("ground") : ppm > 20 ? T("space") : T("none");
    curve = [];
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const [, , temp] = STARS[starI], p = pRatio(), b = +bIn.value;
    const top = H * 0.56, sr = Math.min(W * 0.22, top * 0.4), sx = W / 2, sy = top / 2 + 6;
    // the star, limb-darkened, colour by temperature
    const hue = temp < 3500 ? [255, 150, 90] : temp < 6000 ? [255, 236, 200] : [225, 232, 255];
    for (let k = 20; k >= 1; k--) {
      const r = k / 20, mu = Math.sqrt(1 - r * r), I = ld(mu);
      c.fillStyle = `rgb(${hue.map(v => Math.round(v * (0.35 + 0.65 * I))).join(",")})`; c.beginPath(); c.arc(sx, sy, sr * r, 0, Math.PI * 2); c.fill();
    }
    const g = c.createRadialGradient(sx, sy, sr, sx, sy, sr * 1.5); g.addColorStop(0, `rgba(${hue.join(",")},.25)`); g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g; c.beginPath(); c.arc(sx, sy, sr * 1.5, 0, Math.PI * 2); c.fill();
    // the planet slides from left to right; its size is drawn true to the star (but never smaller than a dot)
    const x = -1.6 + 3.2 * phase, pr = Math.max(1.5, p * sr);
    c.fillStyle = "#050403"; c.beginPath(); c.arc(sx + x * sr, sy + b * sr, pr, 0, Math.PI * 2); c.fill();
    if (pr < 6) { c.strokeStyle = "rgba(231,161,94,.8)"; c.beginPath(); c.arc(sx + x * sr, sy + b * sr, pr + 6, 0, Math.PI * 2); c.stroke(); }
    // light curve, auto-scaled to the dip so even an Earth is visible, with photometric noise of a good space telescope
    const d = Math.max(maxDepth(), 2e-5), noise = 2e-5;
    const gx = 44, gy = top + 14, gw = W - 60, gh = H - top - 40;
    c.strokeStyle = "rgba(236,229,214,.2)"; c.strokeRect(gx, gy, gw, gh);
    const Y = f => gy + 10 + (1 - f) / (d * 1.3) * (gh - 20);
    const f = 1 - blocked(x, b, p) + (Math.random() - 0.5) * 2 * noise;
    curve.push([phase, f]); if (curve.length > 900) curve.shift();
    c.fillStyle = "#afc8e6"; for (const [ph, ff] of curve) c.fillRect(gx + ph * gw - 1, Y(ff) - 1, 2, 2);
    c.setLineDash([3, 4]); c.strokeStyle = "rgba(231,161,94,.6)"; c.beginPath(); c.moveTo(gx, Y(1 - maxDepth())); c.lineTo(gx + gw, Y(1 - maxDepth())); c.stroke(); c.setLineDash([]);
    c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "rgba(156,147,132,.9)";
    c.fillText("100%", 4, Y(1) + 4); c.fillText(T("time") + " →", gx + gw - 50, gy + gh + 14);
    c.save(); c.translate(12, gy + gh / 2 + 30); c.rotate(-Math.PI / 2); c.fillText(T("flux"), 0, 0); c.restore();
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    phase += dt / 7; if (phase >= 1) { phase = 0; if (curve.length > 600) curve = curve.slice(-300); }
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  const pickStar = i => { starI = i; root.querySelectorAll("[data-s]").forEach(x => x.setAttribute("aria-pressed", String(+x.dataset.s === i))); };
  root.querySelectorAll("[data-s]").forEach(b => b.addEventListener("click", () => { pickStar(+b.dataset.s); readouts(); }));
  root.querySelectorAll("[data-p]").forEach(b => b.addEventListener("click", () => {
    const [, s, r, bb] = PRESETS[+b.dataset.p]; pickStar(s); rIn.value = toS(r).toFixed(4); bIn.value = bb; phase = 0; readouts();
  }));
  rIn.addEventListener("input", readouts); bIn.addEventListener("input", readouts);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
