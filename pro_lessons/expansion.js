// Pro lesson: the expanding universe. Galaxies sit still in "comoving" space while the scale factor grows,
// so every galaxy sees every other one recede at a speed proportional to its distance (Hubble's law, v = H0·d).
// Tap any galaxy to live there: the picture looks the same, because there is no centre.
// Served only to Pro subscribers by /api/lesson/expansion.js.
export const meta = { id: "expansion", title: "The expanding universe", pro: true };

const H0 = 70, MLY_PER_MPC = 3.26156, C_KMS = 299792.458;
const HUBBLE_GYR = 977.8 / H0; // 1/H0 in billions of years
const PRESETS = [["virgo", 54], ["coma", 321], ["q3c273", 2400], ["far", 14000]];
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["The expanding universe", "Расширяющаяся Вселенная", "Ընդարձակվող Տիեզերքը", "El universo en expansión"],
  intro: [
    "Galaxies are not flying away through space; space between them is growing. Every galaxy sees all the others recede, and twice as far means twice as fast. <b>Tap any galaxy to move there.</b> The view looks the same from everywhere: the universe has no centre.",
    "Галактики не разлетаются сквозь пространство — растёт само пространство между ними. Каждая галактика видит, как все остальные удаляются, и вдвое дальше значит вдвое быстрее. <b>Коснитесь любой галактики, чтобы переселиться туда.</b> Отовсюду картина одинакова: у Вселенной нет центра.",
    "Գալակտիկաները չեն թռչում տարածության միջով․ աճում է հենց նրանց միջև եղած տարածությունը։ Յուրաքանչյուր գալակտիկա տեսնում է, որ մյուսները հեռանում են, և երկու անգամ ավելի հեռուն նշանակում է երկու անգամ ավելի արագ։ <b>Հպեք ցանկացած գալակտիկայի՝ այնտեղ տեղափոխվելու համար։</b> Ամենուրեքից պատկերը նույնն է․ Տիեզերքը կենտրոն չունի։",
    "Las galaxias no vuelan a través del espacio: lo que crece es el espacio entre ellas. Cada galaxia ve alejarse a todas las demás, y el doble de lejos significa el doble de rápido. <b>Toca cualquier galaxia para mudarte allí.</b> La vista es igual desde todas partes: el universo no tiene centro."],
  aria: ["A field of galaxies drifting apart, with arrows showing their speeds and a small Hubble diagram.", "Поле галактик, расходящихся в стороны; стрелки показывают скорости, в углу — диаграмма Хаббла.", "Իրարից հեռացող գալակտիկաների դաշտ․ սլաքները ցույց են տալիս արագությունները, անկյունում՝ Հաբլի դիագրամը։", "Un campo de galaxias que se separan, con flechas que muestran sus velocidades y un pequeño diagrama de Hubble."],
  presetsAria: ["Real objects", "Настоящие объекты", "Իրական օբյեկտներ", "Objetos reales"],
  virgo: ["Virgo Cluster", "Скопление Девы", "Կույսի կույտ", "Cúmulo de Virgo"], coma: ["Coma Cluster", "Скопление Волос Вероники", "Վերոնիկայի Վարսերի կույտ", "Cúmulo de Coma"],
  q3c273: ["Quasar 3C 273", "Квазар 3C 273", "3C 273 քվազար", "Cuásar 3C 273"], far: ["Edge of the Hubble sphere", "Край сферы Хаббла", "Հաբլի սֆերայի եզրը", "Borde de la esfera de Hubble"],
  dist: ["Distance", "Расстояние", "Հեռավորություն", "Distancia"],
  v: ["Moves away at", "Удаляется со скоростью", "Հեռանում է", "Se aleja a"],
  pc: ["Share of light speed", "Доля скорости света", "Լույսի արագության մասը", "Fracción de la luz"],
  H: ["Hubble constant", "Постоянная Хаббла", "Հաբլի հաստատուն", "Constante de Hubble"],
  age: ["Hubble time, 1/H₀", "Время Хаббла, 1/H₀", "Հաբլի ժամանակ, 1/H₀", "Tiempo de Hubble, 1/H₀"],
  mly: ["{n} million ly", "{n} млн св. лет", "{n} միլիոն լ. տ.", "{n} millones de a. l."],
  gly: ["{n} billion ly", "{n} млрд св. лет", "{n} միլիարդ լ. տ.", "{n} mil millones de a. l."],
  kms: ["{n} km/s", "{n} км/с", "{n} կմ/վ", "{n} km/s"], gyr: ["{n} bn yr", "{n} млрд лет", "{n} մլրդ տ.", "{n} mil M a."],
  hu: ["70 km/s/Mpc", "70 км/с/Мпк", "70 կմ/վ/Մպկ", "70 km/s/Mpc"],
  dAx: ["distance", "расстояние", "հեռավորություն", "distancia"], vAx: ["speed", "скорость", "արագություն", "velocidad"],
  home: ["you are here", "вы здесь", "դուք այստեղ եք", "estás aquí"],
  near: ["This close, gravity beats expansion: the Milky Way and its neighbours are bound together and do not drift apart. Andromeda is in fact approaching us at about 110 km/s.",
    "Так близко гравитация сильнее расширения: Млечный Путь и его соседи связаны и не разлетаются. Галактика Андромеды на самом деле приближается к нам со скоростью около 110 км/с.",
    "Այսքան մոտ ձգողությունը ուժեղ է ընդարձակումից․ Ծիր Կաթինը և նրա հարևանները կապված են իրար և չեն հեռանում։ Անդրոմեդայի գալակտիկան իրականում մոտենում է մեզ մոտ 110 կմ/վ արագությամբ։",
    "Tan cerca, la gravedad gana a la expansión: la Vía Láctea y sus vecinas están ligadas y no se separan. Andrómeda, de hecho, se acerca a nosotros a unos 110 km/s."],
  ftl: ["Faster than light, and no law is broken: nothing moves through space faster than light, the space in between simply grows. Light this galaxy emits today will never reach us.",
    "Быстрее света — и никакой закон не нарушен: сквозь пространство ничто не движется быстрее света, просто растёт само пространство между нами. Свет, который эта галактика испускает сегодня, до нас никогда не дойдёт.",
    "Լույսից արագ, և ոչ մի օրենք չի խախտվում․ տարածության միջով ոչինչ լույսից արագ չի շարժվում, պարզապես աճում է մեր միջև եղած տարածությունը։ Լույսը, որ այս գալակտիկան արձակում է այսօր, երբեք մեզ չի հասնի։",
    "Más rápido que la luz, sin romper ninguna ley: nada se mueve a través del espacio más rápido que la luz, simplemente crece el espacio intermedio. La luz que esta galaxia emite hoy nunca nos alcanzará."],
  note: [
    "Speeds use Hubble's law with today's H₀ ≈ 70 km/s per megaparsec. For very distant objects the light we see left long ago, so their distance \"now\" is larger than the light-travel distance; the numbers here are for today's distance.",
    "Скорости — по закону Хаббла с сегодняшним H₀ ≈ 70 км/с на мегапарсек. Свет очень далёких объектов вышел давно, поэтому расстояние до них «сейчас» больше, чем путь, пройденный светом; здесь расстояния — сегодняшние.",
    "Արագությունները ըստ Հաբլի օրենքի են՝ այսօրվա H₀ ≈ 70 կմ/վ մեգապարսեկի համար։ Շատ հեռավոր օբյեկտների լույսը դուրս է եկել վաղուց, ուստի նրանց «այժմյան» հեռավորությունը մեծ է լույսի անցած ճանապարհից․ այստեղ հեռավորությունները այսօրվանն են։",
    "Las velocidades siguen la ley de Hubble con el H₀ actual ≈ 70 km/s por megapársec. La luz de los objetos muy lejanos salió hace mucho, así que su distancia «actual» es mayor que el recorrido de la luz; aquí las distancias son las de hoy."],
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
        ${PRESETS.map(([id, d]) => `<button class="btn small" data-d="${d}">${T(id)}</button>`).join("")}
      </div>
      <label class="field">${T("dist")} <b data-r="d"></b><input type="range" id="x-d" min="0" max="1" step="0.0005" value="0.45"></label>
      <dl class="readouts">
        <div><dt>${T("v")}</dt><dd data-r="v"></dd></div>
        <div><dt>${T("pc")}</dt><dd data-r="pc"></dd></div>
        <div><dt>${T("H")}</dt><dd style="font-size:1.15rem">${T("hu")}</dd></div>
        <div><dt>${T("age")}</dt><dd>${T("gyr", { n: fmt(HUBBLE_GYR, 1) })}</dd></div>
      </dl>
      <p class="note" data-r="extra" hidden></p>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const dIn = root.querySelector("#x-d"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, phase = 0, home = 0;

  // deterministic galaxy field in comoving coordinates
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const GAL = [];
  const BOX = 3.2; // the field repeats every BOX in both directions, so every galaxy has neighbours all around
  for (let i = 0; i < 110; i++) GAL.push({ x: (rnd() - 0.5) * BOX, y: (rnd() - 0.5) * BOX, s: 1.2 + rnd() * 2.2, tilt: rnd() * Math.PI });
  GAL.sort((p, q) => Math.hypot(p.x, p.y) - Math.hypot(q.x, q.y)); // GAL[0] is the one nearest the middle
  const wrap = v => ((v + BOX / 2) % BOX + BOX) % BOX - BOX / 2;
  const rel = g => [wrap(g.x - GAL[home].x), wrap(g.y - GAL[home].y)];

  const MIN = 1, MAX = 20000; // million light years, log slider
  const dist = () => MIN * Math.pow(MAX / MIN, +dIn.value);
  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const d = dist(), v = H0 * d / MLY_PER_MPC, frac = v / C_KMS;
    R("d").textContent = d < 1000 ? T("mly", { n: fmt(d, d < 10 ? 1 : 0) }) : T("gly", { n: fmt(d / 1000, d < 10000 ? 2 : 1) });
    R("v").textContent = T("kms", { n: fmt(v, v < 100 ? 1 : 0) });
    R("pc").textContent = `${fmt(frac * 100, frac < 0.01 ? 3 : frac < 0.1 ? 2 : 1)}%`;
    const ex = R("extra");
    if (d < 20) { ex.textContent = T("near"); ex.hidden = false; }
    else if (frac > 1) { ex.textContent = T("ftl"); ex.hidden = false; }
    else ex.hidden = true;
  }
  const scale = () => 1 + 0.75 * (phase / 8); // grows for 8 s, then the picture restarts
  function screen(g) {
    const S = Math.min(W, H) * 0.3, a = scale(), [dx, dy] = rel(g);
    return [W / 2 + dx * a * S, H / 2 + dy * a * S];
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const S = Math.min(W, H) * 0.3, h = GAL[home], fade = Math.min(1, phase / 0.4, (8 - phase) / 0.4);
    c.globalAlpha = Math.max(0, fade);
    // comoving grid: it stretches with space, galaxies stay on their grid points
    c.strokeStyle = "rgba(236,229,214,.06)"; c.lineWidth = 1; const a = scale(), step = 0.4 * a * S;
    const ox = (W / 2 - h.x * a * S) % step, oy = (H / 2 - h.y * a * S) % step;
    for (let x = ox; x < W; x += step) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = oy; y < H; y += step) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    for (let i = 0; i < GAL.length; i++) {
      const g = GAL[i], [x, y] = screen(g); if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
      const [dx, dy] = rel(g);
      if (i !== home) { // velocity arrow ∝ distance
        const k = S * 0.35, ex = x + dx * k, ey = y + dy * k;
        c.strokeStyle = "rgba(231,161,94,.55)"; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        const ang = Math.atan2(dy, dx); c.beginPath(); c.moveTo(ex, ey);
        c.lineTo(ex - 5 * Math.cos(ang - 0.4), ey - 5 * Math.sin(ang - 0.4)); c.moveTo(ex, ey); c.lineTo(ex - 5 * Math.cos(ang + 0.4), ey - 5 * Math.sin(ang + 0.4)); c.stroke();
      }
      // redder with distance from home, like real redshift
      const red = Math.min(1, Math.hypot(dx, dy) / 1.8);
      c.fillStyle = `rgb(${Math.round(200 + 55 * red)},${Math.round(215 - 90 * red)},${Math.round(235 - 160 * red)})`;
      c.save(); c.translate(x, y); c.rotate(g.tilt); c.beginPath(); c.ellipse(0, 0, g.s * 1.6, g.s * 0.7, 0, 0, Math.PI * 2); c.fill(); c.restore();
    }
    c.globalAlpha = 1;
    const [hx, hy] = [W / 2, H / 2];
    c.strokeStyle = "#e7a15e"; c.lineWidth = 1.5; c.beginPath(); c.arc(hx, hy, 9, 0, Math.PI * 2); c.stroke(); c.lineWidth = 1;
    c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "#e7a15e"; c.fillText(T("home"), hx + 13, hy - 10);
    // mini Hubble diagram, measured from the current home
    const bw = Math.min(150, W * 0.34), bh = bw * 0.7, bx = W - bw - 12, by = 12;
    c.fillStyle = "rgba(10,8,7,.85)"; c.fillRect(bx, by, bw, bh); c.strokeStyle = "rgba(236,229,214,.2)"; c.strokeRect(bx, by, bw, bh);
    c.fillStyle = "rgba(156,147,132,.9)"; c.fillText(T("dAx"), bx + bw - c.measureText(T("dAx")).width - 6, by + bh - 6);
    c.save(); c.translate(bx + 12, by + 6); c.rotate(Math.PI / 2); c.fillText(T("vAx"), 0, 0); c.restore();
    c.fillStyle = "#afc8e6";
    for (let i = 0; i < GAL.length; i++) {
      if (i === home) continue; const d = Math.hypot(...rel(GAL[i])) / 2.2;
      if (d > 1) continue;
      c.beginPath(); c.arc(bx + 16 + d * (bw - 24), by + bh - 16 - d * (bh - 24), 1.6, 0, Math.PI * 2); c.fill();
    }
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    phase += dt; if (phase >= 8) phase = 0;
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  cv.addEventListener("pointerdown", e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let best = -1, bd = 30;
    GAL.forEach((g, i) => { const [sx, sy] = screen(g), d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { home = best; phase = 0; }
  });
  root.querySelectorAll("[data-d]").forEach(b => b.addEventListener("click", () => {
    dIn.value = (Math.log(+b.dataset.d / MIN) / Math.log(MAX / MIN)).toFixed(4); readouts();
  }));
  dIn.addEventListener("input", readouts);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
