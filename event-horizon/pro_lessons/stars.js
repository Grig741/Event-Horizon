// Pro lesson: the life of a star. Pick a mass and watch it live and die on the Hertzsprung–Russell diagram.
// Main sequence scalings (solar units): L ≈ M^3.5 (M > 0.43), 0.23·M^2.3 below; R ≈ M^0.8 (M ≤ 1), M^0.57 above;
// T = 5772·(L/R²)^¼ K; lifetime ≈ 10 Gyr · M / L. Remnants: < 8 M☉ white dwarf, 8–20 neutron star, > 20 black hole.
// Served only to Pro subscribers by /api/lesson/stars.js.
export const meta = { id: "stars", title: "The life of a star", pro: true };

const PRESETS = [["proxima", 0.12], ["sun", 1], ["sirius", 2.06], ["betel", 18], ["rigel", 21], ["eta", 60]];
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["The life of a star", "Жизнь звезды", "Աստղի կյանքը", "La vida de una estrella"],
  intro: [
    "A star's whole life is set at birth by one number: its mass. Heavy stars burn hot, blue and fast and die in a supernova. Light ones glow red for longer than the universe has existed. <b>Pick a mass</b> and watch the star move across the Hertzsprung–Russell diagram, the map astronomers use for every star.",
    "Вся жизнь звезды задана при рождении одним числом — массой. Тяжёлые звёзды горят горячо, ярко-голубым и быстро, а умирают сверхновой. Лёгкие тлеют красным дольше, чем существует Вселенная. <b>Выберите массу</b> и смотрите, как звезда идёт по диаграмме Герцшпрунга — Рассела, карте, на которую астрономы наносят все звёзды.",
    "Աստղի ողջ կյանքը ծնվելիս որոշվում է մեկ թվով՝ զանգվածով։ Ծանր աստղերն այրվում են տաք, կապույտ ու արագ և մահանում գերնոր աստղի պայթյունով։ Թեթևները կարմիր են առկայծում ավելի երկար, քան գոյություն ունի Տիեզերքը։ <b>Ընտրեք զանգվածը</b> և տեսեք, թե ինչպես է աստղը շարժվում Հերցշպրունգ–Ռասելի դիագրամով՝ այն քարտեզով, որի վրա աստղագետները նշում են բոլոր աստղերը։",
    "Toda la vida de una estrella queda fijada al nacer por un solo número: su masa. Las pesadas arden calientes, azules y deprisa, y mueren en una supernova. Las ligeras brillan rojas durante más tiempo del que existe el universo. <b>Elige una masa</b> y mira cómo la estrella recorre el diagrama de Hertzsprung–Russell, el mapa en el que los astrónomos sitúan cada estrella."],
  aria: ["A glowing star whose colour and size change with age, beside a Hertzsprung–Russell diagram tracing its life.", "Светящаяся звезда меняет цвет и размер с возрастом; рядом диаграмма Герцшпрунга — Рассела с её путём.", "Լուսավոր աստղը տարիքի հետ փոխում է գույնն ու չափը, կողքին՝ Հերցշպրունգ–Ռասելի դիագրամը՝ նրա ուղով։", "Una estrella brillante cambia de color y tamaño con la edad, junto a un diagrama de Hertzsprung–Russell con su recorrido."],
  mass: ["Mass", "Масса", "Զանգված", "Masa"], msun: ["{n} Suns", "{n} Солнц", "{n} Արեգակ", "{n} Soles"],
  presetsAria: ["Real stars", "Настоящие звёзды", "Իրական աստղեր", "Estrellas reales"],
  proxima: ["Proxima Cen", "Проксима", "Պրոքսիմա", "Próxima Cen"], sun: ["Sun", "Солнце", "Արեգակ", "Sol"], sirius: ["Sirius A", "Сириус A", "Սիրիուս A", "Sirio A"],
  betel: ["Betelgeuse", "Бетельгейзе", "Բեթելգեյզե", "Betelgeuse"], rigel: ["Rigel", "Ригель", "Ռիգել", "Rigel"], eta: ["Eta Carinae", "Эта Киля", "Էտա Կարինա", "Eta Carinae"],
  life: ["Lives for", "Проживёт", "Կապրի", "Vive"], temp: ["Surface", "Поверхность", "Մակերևույթ", "Superficie"],
  lum: ["Brightness", "Яркость", "Պայծառություն", "Brillo"], fate: ["Ends as", "Станет в конце", "Վերջում կդառնա", "Termina como"],
  age: ["Age", "Возраст", "Տարիք", "Edad"],
  phases: [["Main sequence", "Red giant", "Planetary nebula", "Red supergiant", "Supernova!"],
    ["Главная последовательность", "Красный гигант", "Планетарная туманность", "Красный сверхгигант", "Сверхновая!"],
    ["Գլխավոր հաջորդականություն", "Կարմիր հսկա", "Մոլորակային միգամածություն", "Կարմիր գերհսկա", "Գերնոր աստղ"],
    ["Secuencia principal", "Gigante roja", "Nebulosa planetaria", "Supergigante roja", "¡Supernova!"]],
  fates: [["White dwarf", "Neutron star", "Black hole"], ["Белый карлик", "Нейтронная звезда", "Чёрная дыра"], ["Սպիտակ թզուկ", "Նեյտրոնային աստղ", "Սև խոռոչ"], ["Enana blanca", "Estrella de neutrones", "Agujero negro"]],
  yr: ["{n} years", "{n} лет", "{n} տարի", "{n} años"], myr: ["{n} million years", "{n} млн лет", "{n} միլիոն տարի", "{n} millones de años"],
  gyr: ["{n} billion years", "{n} млрд лет", "{n} միլիարդ տարի", "{n} mil millones de años"], tyr: ["{n} trillion years", "{n} трлн лет", "{n} տրիլիոն տարի", "{n} billones de años"],
  x: ["{n} × Sun", "{n} × Солнце", "{n} × Արեգակ", "{n} × Sol"], K: ["{n} K", "{n} K", "{n} K", "{n} K"],
  hot: ["hotter", "горячее", "ավելի տաք", "más caliente"], cool: ["cooler", "холоднее", "ավելի սառը", "más fría"],
  bright: ["brighter", "ярче", "ավելի պայծառ", "más brillante"], faint: ["fainter", "тусклее", "ավելի աղոտ", "más tenue"],
  older: ["Older than the universe will be for a very long time: no star this light has died yet.", "Дольше, чем существует Вселенная: ни одна такая лёгкая звезда ещё не умерла.", "Ավելի երկար, քան գոյություն ունի Տիեզերքը․ այսքան թեթև ոչ մի աստղ դեռ չի մահացել։", "Más que la edad del universo: ninguna estrella tan ligera ha muerto todavía."],
  note: [
    "Mass ten times bigger means a life roughly three hundred times shorter. The Sun is halfway through its 10 billion years. Betelgeuse, in Orion's shoulder, is already a red supergiant and could explode any time in the next 100 000 years.",
    "В десять раз больше массы — примерно в триста раз короче жизнь. Солнце прожило половину своих 10 миллиардов лет. Бетельгейзе в плече Ориона уже красный сверхгигант и может взорваться в любой момент в ближайшие 100 000 лет.",
    "Տասն անգամ ավելի մեծ զանգված՝ մոտ երեք հարյուր անգամ ավելի կարճ կյանք։ Արեգակն ապրել է իր 10 միլիարդ տարվա կեսը։ Բեթելգեյզեն՝ Օրիոնի ուսին, արդեն կարմիր գերհսկա է և կարող է պայթել ցանկացած պահի մոտակա 100 000 տարում։",
    "Diez veces más masa significa una vida unas trescientas veces más corta. El Sol va por la mitad de sus 10 000 millones de años. Betelgeuse, en el hombro de Orión, ya es una supergigante roja y podría estallar en cualquier momento de los próximos 100 000 años."],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];

// Planck-ish colour of a blackbody, interpolated from a small table
const TCOL = [[2500, [255, 140, 60]], [3500, [255, 180, 110]], [5000, [255, 220, 170]], [5800, [255, 244, 225]], [7500, [235, 238, 255]], [10000, [200, 215, 255]], [20000, [165, 190, 255]], [40000, [150, 175, 255]]];
function tcol(T, a = 1) {
  let i = TCOL.findIndex(([t]) => t >= T); if (i <= 0) i = i === 0 ? 1 : TCOL.length - 1;
  const [t0, c0] = TCOL[i - 1], [t1, c1] = TCOL[i], k = Math.max(0, Math.min(1, (T - t0) / (t1 - t0)));
  return `rgba(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(",")},${a})`;
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
      <div class="btns" role="group" aria-label="${T("presetsAria")}">
        ${PRESETS.map(([id, m]) => `<button class="btn small" data-m="${m}">${T(id)}</button>`).join("")}
      </div>
      <label class="field">${T("mass")} <b data-r="m"></b><input type="range" id="st-m" min="0" max="1" step="0.001"></label>
      <dl class="readouts">
        <div><dt>${T("life")}</dt><dd data-r="life" style="font-size:1.2rem"></dd></div>
        <div><dt>${T("fate")}</dt><dd data-r="fate" style="font-size:1.2rem"></dd></div>
        <div><dt>${T("temp")}</dt><dd data-r="temp"></dd></div>
        <div><dt>${T("lum")}</dt><dd data-r="lum"></dd></div>
      </dl>
      <p class="note" data-r="older" hidden>${T("older")}</p>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const mIn = root.querySelector("#st-m"), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, clock = 0;
  const MMIN = 0.1, MMAX = 80, toM = s => MMIN * Math.pow(MMAX / MMIN, s), toS = m => Math.log(m / MMIN) / Math.log(MMAX / MMIN);
  mIn.value = toS(1).toFixed(4);

  function star(M) {
    const Lm = M > 0.43 ? Math.pow(M, 3.5) : 0.23 * Math.pow(M, 2.3);
    const Lc = M > 55 ? Lm * Math.pow(55 / M, 1.5) : Lm; // the most massive stars sit near the Eddington limit
    const Rr = M <= 1 ? Math.pow(M, 0.8) : Math.pow(M, 0.57), Teff = 5772 * Math.pow(Lc / (Rr * Rr), 0.25);
    const life = 10 * M / Lc; // Gyr
    const fate = M < 8 ? 0 : M < 20 ? 1 : 2;
    return { L: Lc, R: Rr, T: Teff, life, fate };
  }
  function lifeStr(g) {
    if (g >= 1000) return T("tyr", { n: sig(g / 1000) });
    if (g >= 1) return T("gyr", { n: sig(g) });
    return T("myr", { n: sig(g * 1000) });
  }
  // a schematic evolutionary track: main sequence → giant branch → death, each a fraction of the 18 s loop
  function track(M) {
    const s = star(M);
    if (M < 0.5) return [{ T: s.T, L: s.L, R: s.R, ph: 0, until: 1 }];
    const giant = s.fate === 0
      ? { T: 3800, L: Math.min(3000, 1000 * Math.pow(M, 1.2)), ph: 1 }
      : { T: 3500, L: s.L * 1.6, ph: 3 };
    giant.R = Math.sqrt(giant.L) * Math.pow(5772 / giant.T, 2);
    const end = s.fate === 0 ? { T: 30000, L: 0.05, R: 0.012, ph: 2 } : { T: 30000, L: s.L * 1e3, R: 4, ph: 4 };
    return [{ T: s.T, L: s.L, R: s.R, ph: 0, until: 0.55 }, { ...giant, until: 0.8 }, { ...end, until: 1 }];
  }
  function stateAt(M, u) {
    const tr = track(M); let prev = tr[0];
    for (const p of tr) {
      const from = prev === p ? 0 : prev.until;
      if (u <= p.until) {
        const k = prev === p ? 1 : Math.min(1, (u - from) / 0.08); // glide between phases
        const lerp = (a, b) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * k);
        return { T: lerp(prev.T, p.T), L: lerp(prev.L, p.L), R: lerp(prev.R, p.R), ph: p.ph, u, last: p === tr.at(-1), k };
      }
      prev = p;
    }
    return { ...tr.at(-1), u, last: true, k: 1 };
  }
  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const M = toM(+mIn.value), s = star(M);
    R("m").textContent = M < 10 ? T("msun", { n: fmt(M, 2) }) : T("msun", { n: fmt(M, 0) });
    R("life").textContent = lifeStr(s.life);
    R("fate").textContent = M < 0.5 ? L.fates[li][0] : L.fates[li][s.fate];
    R("temp").textContent = T("K", { n: fmt(Math.round(s.T / 10) * 10) });
    R("lum").textContent = T("x", { n: s.L >= 1 ? sig(s.L) : s.L.toLocaleString(LOCALES[li], { maximumSignificantDigits: 2 }) });
    R("older").hidden = s.life < 13.8;
    clock = 0;
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const M = toM(+mIn.value), s = star(M), u = (clock % 18) / 18, st = stateAt(M, u);
    const wide = W > H * 1.15, sw = wide ? W * 0.42 : W, sh = wide ? H : H * 0.42;
    c.font = "11px Archivo, Arial, sans-serif";
    // the star itself; radius on a log scale so a dwarf and a supergiant both fit
    const sx = sw / 2, sy = sh / 2, maxR = Math.min(sw, sh) * 0.36;
    const pr = Math.max(2, maxR * (0.18 + 0.82 * (Math.log10(st.R) + 2) / 5));
    if (st.ph === 4) { // supernova flash then a fading shell and the remnant
      const f = st.k;
      c.fillStyle = `rgba(255,255,255,${0.9 * (1 - f)})`; c.fillRect(0, 0, sw, sh);
      c.strokeStyle = `rgba(175,200,230,${0.8 * (1 - f * 0.6)})`; c.lineWidth = 2; c.beginPath(); c.arc(sx, sy, maxR * (0.3 + f), 0, Math.PI * 2); c.stroke(); c.lineWidth = 1;
      if (s.fate === 2) { c.fillStyle = "#000"; c.strokeStyle = "#e7a15e"; c.beginPath(); c.arc(sx, sy, 7, 0, Math.PI * 2); c.fill(); c.stroke(); }
      else { c.fillStyle = "#cfe0ff"; c.beginPath(); c.arc(sx, sy, 2.5, 0, Math.PI * 2); c.fill(); }
    } else if (st.ph === 2) { // planetary nebula around a tiny white dwarf
      const f = st.k, g = c.createRadialGradient(sx, sy, maxR * 0.2 * f, sx, sy, maxR * (0.4 + 0.6 * f));
      g.addColorStop(0, "rgba(120,200,190,0)"); g.addColorStop(0.7, `rgba(120,200,190,${0.35 * (1 - f * 0.5)})`); g.addColorStop(1, "rgba(220,110,110,0)");
      c.fillStyle = g; c.beginPath(); c.arc(sx, sy, maxR * (0.4 + 0.6 * f), 0, Math.PI * 2); c.fill();
      c.fillStyle = "#eef3ff"; c.beginPath(); c.arc(sx, sy, 3, 0, Math.PI * 2); c.fill();
    } else {
      const g = c.createRadialGradient(sx, sy, 0, sx, sy, pr * 1.8);
      g.addColorStop(0, "#fff"); g.addColorStop(0.45, tcol(st.T)); g.addColorStop(0.56, tcol(st.T, 0.35)); g.addColorStop(1, tcol(st.T, 0));
      c.fillStyle = g; c.beginPath(); c.arc(sx, sy, pr * 1.8, 0, Math.PI * 2); c.fill();
    }
    c.fillStyle = "#ece5d6"; const ph = L.phases[li][st.ph];
    c.fillText(ph, sx - c.measureText(ph).width / 2, sh - 26);
    const age = M < 0.5 ? u * s.life : u < 0.55 ? u / 0.55 * s.life : s.life * (1 + (u - 0.55) / 0.45 * 0.12);
    c.fillStyle = "rgba(156,147,132,.85)"; const ag = `${T("age")}: ${lifeStr(age)}`;
    c.fillText(ag, sx - c.measureText(ag).width / 2, sh - 10);
    // HR diagram: temperature falls to the right, brightness rises upward (both logarithmic)
    const hx = wide ? sw + 36 : 46, hy = wide ? 24 : sh + 14, hw = wide ? W - sw - 52 : W - 62, hh = wide ? H - 60 : H - sh - 44;
    const X = Tk => hx + (Math.log10(40000) - Math.log10(Tk)) / (Math.log10(40000) - Math.log10(2400)) * hw;
    const Y = Lx => hy + hh - (Math.log10(Lx) + 4.5) / 11 * hh;
    c.strokeStyle = "rgba(236,229,214,.2)"; c.strokeRect(hx, hy, hw, hh);
    const grd = c.createLinearGradient(hx, 0, hx + hw, 0); [40000, 10000, 5800, 3500, 2400].forEach(t => grd.addColorStop(Math.max(0, Math.min(1, (X(t) - hx) / hw)), tcol(t, 0.5)));
    c.fillStyle = grd; c.fillRect(hx, hy + hh + 3, hw, 4);
    c.save(); c.beginPath(); c.rect(hx, hy, hw, hh); c.clip();
    // the main sequence band
    c.strokeStyle = "rgba(236,229,214,.25)"; c.lineWidth = 6; c.lineCap = "round"; c.beginPath();
    for (let k = 0; k <= 40; k++) { const m = MMIN * Math.pow(MMAX / MMIN, k / 40), q = star(m); k ? c.lineTo(X(q.T), Y(q.L)) : c.moveTo(X(q.T), Y(q.L)); }
    c.stroke(); c.lineWidth = 1;
    // the Sun for reference
    const sun = star(1); c.strokeStyle = "#ffd28a"; c.beginPath(); c.arc(X(sun.T), Y(sun.L), 4, 0, Math.PI * 2); c.stroke();
    // the chosen star's track
    const tr = track(M); c.setLineDash([3, 4]); c.strokeStyle = "rgba(231,161,94,.6)"; c.beginPath();
    tr.forEach((p, i) => { if (p.ph === 4) return; i ? c.lineTo(X(p.T), Y(p.L)) : c.moveTo(X(p.T), Y(p.L)); }); c.stroke(); c.setLineDash([]);
    if (st.ph !== 4) { c.fillStyle = tcol(st.T); c.beginPath(); c.arc(X(st.T), Y(Math.max(st.L, 1e-4)), 5, 0, Math.PI * 2); c.fill(); }
    c.restore();
    c.fillStyle = "rgba(156,147,132,.9)";
    c.fillText(`← ${T("hot")}`, hx + 2, hy + hh + 20); const cl = `${T("cool")} →`; c.fillText(cl, hx + hw - c.measureText(cl).width, hy + hh + 20);
    c.save(); c.translate(hx - 10, hy + hh / 2); c.rotate(-Math.PI / 2); const br = `${T("faint")} — ${T("bright")}`; c.fillText(br, -c.measureText(br).width / 2, 0); c.restore();
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts; clock += dt;
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  root.querySelectorAll("[data-m]").forEach(b => b.addEventListener("click", () => { mIn.value = toS(+b.dataset.m).toFixed(4); readouts(); }));
  mIn.addEventListener("input", readouts);
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
