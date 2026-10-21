// Free lesson: phases of the Moon. Left: the Earth–Moon system seen from above the north pole, Sun far to the left.
// Right: the Moon as seen from Earth's northern hemisphere. Phase angle θ = 0 at new moon, π at full moon.
export const meta = { id: "phases", title: "Phases of the Moon", pro: false };

const SYNODIC = 29.530589; // days from new moon to new moon
const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Phases of the Moon", "Фазы Луны", "Լուսնի փուլերը", "Fases de la Luna"],
  intro: [
    "The Sun always lights exactly half of the Moon. What changes is how much of that lit half faces us. <b>Drag the Moon around the Earth</b>, or press play, and watch the view from Earth on the right. One full cycle takes 29.5 days.",
    "Солнце всегда освещает ровно половину Луны. Меняется лишь то, какая часть этой освещённой половины повёрнута к нам. <b>Тащите Луну вокруг Земли</b> или нажмите «Пуск» и следите справа, как она выглядит с Земли. Полный цикл длится 29,5 суток.",
    "Արեգակը միշտ լուսավորում է Լուսնի ճիշտ կեսը։ Փոխվում է միայն այն, թե այդ լուսավոր կեսի որքան մասն է նայում մեզ։ <b>Քաշեք Լուսինը Երկրի շուրջը</b> կամ սեղմեք «Սկսել» և աջ կողմում տեսեք, թե ինչպես է այն երևում Երկրից։ Լրիվ շրջանը տևում է 29,5 օր։",
    "El Sol siempre ilumina exactamente la mitad de la Luna. Lo que cambia es cuánto de esa mitad iluminada mira hacia nosotros. <b>Arrastra la Luna alrededor de la Tierra</b> o pulsa reproducir y mira a la derecha cómo se ve desde la Tierra. Un ciclo completo dura 29,5 días."],
  aria: ["The Moon orbiting the Earth, seen from above, next to the Moon as it looks from Earth.", "Луна на орбите вокруг Земли, вид сверху, и рядом — Луна, какой её видно с Земли.", "Լուսինը Երկրի շուրջ ուղեծրում՝ վերևից, և կողքին՝ Լուսինն այնպես, ինչպես երևում է Երկրից։", "La Luna orbitando la Tierra vista desde arriba, junto a la Luna tal como se ve desde la Tierra."],
  play: ["Play", "Пуск", "Սկսել", "Reproducir"], pause: ["Pause", "Пауза", "Դադար", "Pausa"],
  day: ["Day of the cycle", "День цикла", "Շրջանի օրը", "Día del ciclo"],
  phase: ["Phase", "Фаза", "Փուլ", "Fase"],
  lit: ["Lit, as seen", "Видимая освещённость", "Տեսանելի լուսավորվածություն", "Iluminada, vista"],
  rise: ["Rises around", "Восходит около", "Ծագում է մոտ", "Sale hacia las"],
  best: ["Best seen", "Лучше всего видна", "Լավագույնս երևում է", "Mejor vista"],
  names: [
    ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"],
    ["Новолуние", "Растущий серп", "Первая четверть", "Растущая Луна", "Полнолуние", "Убывающая Луна", "Последняя четверть", "Убывающий серп"],
    ["Նորալուսին", "Աճող մահիկ", "Առաջին քառորդ", "Աճող Լուսին", "Լիալուսին", "Նվազող Լուսին", "Վերջին քառորդ", "Նվազող մահիկ"],
    ["Luna nueva", "Creciente", "Cuarto creciente", "Gibosa creciente", "Luna llena", "Gibosa menguante", "Cuarto menguante", "Menguante"]],
  when: [
    ["not visible", "evening", "evening", "evening & night", "all night", "night & morning", "morning", "dawn"],
    ["не видна", "вечером", "вечером", "вечером и ночью", "всю ночь", "ночью и утром", "утром", "на рассвете"],
    ["չի երևում", "երեկոյան", "երեկոյան", "երեկոյան և գիշերը", "ամբողջ գիշեր", "գիշերը և առավոտյան", "առավոտյան", "արշալույսին"],
    ["no visible", "al anochecer", "por la tarde", "tarde y noche", "toda la noche", "noche y mañana", "por la mañana", "al amanecer"]],
  sunlight: ["sunlight", "солнечный свет", "արևի լույս", "luz solar"],
  above: ["from above the North Pole", "вид с Северного полюса", "տեսքը Հյուսիսային բևեռից", "desde el Polo Norte"],
  fromEarth: ["from Earth", "с Земли", "Երկրից", "desde la Tierra"],
  note: [
    "Phases are not Earth's shadow: that only happens at a lunar eclipse. In the southern hemisphere the same Moon appears flipped, lit side on the left when waxing.",
    "Фазы — это не тень Земли: она падает на Луну только при лунном затмении. В Южном полушарии та же Луна выглядит перевёрнутой: растущая освещена слева.",
    "Փուլերը Երկրի ստվերը չեն․ այն Լուսնի վրա ընկնում է միայն լուսնի խավարման ժամանակ։ Հարավային կիսագնդում նույն Լուսինը շրջված է երևում․ աճողը լուսավորված է ձախից։",
    "Las fases no son la sombra de la Tierra: eso solo ocurre en un eclipse lunar. En el hemisferio sur la misma Luna se ve invertida: la creciente aparece iluminada por la izquierda."],
  days: ["{n} d", "{n} сут", "{n} օր", "{n} d"],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];
const RISE = ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "00:00", "03:00"];

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const fmt = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns"><button class="btn small" data-a="play" aria-pressed="true">${T("pause")}</button></div>
      <label class="field">${T("day")} <b data-r="day"></b><input type="range" id="ph-d" min="0" max="${SYNODIC}" step="0.01" value="3"></label>
      <dl class="readouts">
        <div><dt>${T("phase")}</dt><dd data-r="name" style="font-size:1.15rem"></dd></div>
        <div><dt>${T("lit")}</dt><dd data-r="lit"></dd></div>
        <div><dt>${T("rise")}</dt><dd data-r="rise"></dd></div>
        <div><dt>${T("best")}</dt><dd data-r="best" style="font-size:1.15rem"></dd></div>
      </dl>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const dIn = root.querySelector("#ph-d"), playBtn = root.querySelector('[data-a="play"]'), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, playing = true, dragging = false;
  let geo = { ex: 0, ey: 0, orb: 1 };

  const theta = () => (+dIn.value / SYNODIC) * 2 * Math.PI;
  const octant = th => Math.floor(((th / (2 * Math.PI)) * 8 + 0.5)) % 8;

  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const th = theta(), k = (1 - Math.cos(th)) / 2, o = octant(th);
    R("day").textContent = T("days", { n: fmt(+dIn.value, 1) });
    R("name").textContent = L.names[li][o];
    R("lit").textContent = `${fmt(k * 100)}%`;
    R("rise").textContent = RISE[o];
    R("best").textContent = L.when[li][o];
  }
  // Moon disc as seen from Earth (northern hemisphere): waxing is lit on the right.
  function seenMoon(x, y, r, th) {
    c.fillStyle = "#16130f"; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    const waxing = th < Math.PI, cosT = Math.cos(th), side = waxing ? 1 : -1;
    c.save(); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.clip();
    c.fillStyle = "#e9e2d0";
    c.beginPath(); // lit limb half
    c.arc(x, y, r, -Math.PI / 2, Math.PI / 2, side < 0); c.closePath(); c.fill();
    // terminator: an ellipse of half-width r|cosθ|; dark over the lit half for crescents, lit over the dark half for gibbous
    c.beginPath(); c.ellipse(x, y, Math.max(0.01, r * Math.abs(cosT)), r, 0, 0, Math.PI * 2);
    c.fillStyle = cosT > 0 ? "#16130f" : "#e9e2d0"; c.fill();
    // a few maria so the face reads as the Moon and stays the same face
    c.globalCompositeOperation = "multiply"; c.fillStyle = "rgba(120,112,100,.55)";
    for (const [mx, my, mr] of [[-0.25, -0.3, 0.22], [0.15, -0.35, 0.16], [0.3, 0.05, 0.14], [-0.1, 0.1, 0.18], [-0.35, 0.35, 0.12]]) {
      c.beginPath(); c.arc(x + mx * r, y + my * r, mr * r, 0, Math.PI * 2); c.fill();
    }
    c.restore();
    c.strokeStyle = "rgba(236,229,214,.25)"; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const wide = W > H * 1.15, th = theta();
    // layout: orbit diagram + view from Earth, side by side or stacked
    const aw = wide ? W * 0.62 : W, ah = wide ? H : H * 0.62;
    const ex = aw / 2 + (wide ? 20 : 0), ey = ah / 2 + (wide ? 0 : 10), orb = Math.min(aw, ah) * 0.36;
    geo = { ex, ey, orb };
    c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "rgba(156,147,132,.85)";
    // sunlight arrows from the left
    c.strokeStyle = "rgba(255,210,138,.35)"; c.lineWidth = 1;
    for (let i = -3; i <= 3; i++) {
      const y = ey + i * orb * 0.33; c.beginPath(); c.moveTo(8, y); c.lineTo(28, y); c.lineTo(23, y - 3); c.moveTo(28, y); c.lineTo(23, y + 3); c.stroke();
    }
    c.fillText(T("sunlight"), 8, ey - orb - 14 > 14 ? ey - orb - 14 : 14);
    c.fillText(T("above"), 8, ah - 10);
    // orbit
    c.strokeStyle = "rgba(236,229,214,.18)"; c.setLineDash([3, 5]); c.beginPath(); c.arc(ex, ey, orb, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    // ghost moons at the eight phases
    for (let k = 0; k < 8; k++) {
      const a = k / 8 * 2 * Math.PI, mx = ex - Math.cos(a) * orb, my = ey + Math.sin(a) * orb;
      c.fillStyle = "rgba(40,36,30,1)"; c.beginPath(); c.arc(mx, my, 5, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(236,229,214,.25)"; c.beginPath(); c.arc(mx, my, 5, Math.PI / 2, -Math.PI / 2); c.fill();
    }
    // Earth: day side facing the Sun
    const er = Math.max(10, orb * 0.16);
    c.fillStyle = "#0f1f38"; c.beginPath(); c.arc(ex, ey, er, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#5b8ed6"; c.beginPath(); c.arc(ex, ey, er, Math.PI / 2, -Math.PI / 2); c.fill();
    // Moon, counter-clockwise seen from the north: new moon toward the Sun (left)
    const mx = ex - Math.cos(th) * orb, my = ey + Math.sin(th) * orb, mr = Math.max(7, orb * 0.08);
    c.strokeStyle = "rgba(231,161,94,.5)"; c.beginPath(); c.moveTo(ex, ey); c.lineTo(mx, my); c.stroke();
    c.fillStyle = "#24201a"; c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#e9e2d0"; c.beginPath(); c.arc(mx, my, mr, Math.PI / 2, -Math.PI / 2); c.fill();
    c.strokeStyle = dragging ? "#e7a15e" : "rgba(231,161,94,.7)"; c.lineWidth = 1.5; c.beginPath(); c.arc(mx, my, mr + 5, 0, Math.PI * 2); c.stroke(); c.lineWidth = 1;
    // view from Earth
    const vx = wide ? aw + (W - aw) / 2 : W / 2, vy = wide ? H / 2 : ah + (H - ah) / 2;
    const vr = Math.min(wide ? (W - aw) * 0.38 : (H - ah) * 0.38, H * 0.3);
    if (wide) { c.strokeStyle = "rgba(236,229,214,.12)"; c.beginPath(); c.moveTo(aw, 16); c.lineTo(aw, H - 16); c.stroke(); }
    else { c.strokeStyle = "rgba(236,229,214,.12)"; c.beginPath(); c.moveTo(16, ah); c.lineTo(W - 16, ah); c.stroke(); }
    seenMoon(vx, vy, vr, th);
    c.fillStyle = "rgba(156,147,132,.85)"; const lbl = T("fromEarth");
    c.fillText(lbl, vx - c.measureText(lbl).width / 2, vy + vr + 18);
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    if (playing && !dragging) { dIn.value = ((+dIn.value + dt * SYNODIC / 12) % SYNODIC).toFixed(3); readouts(); } // one cycle in 12 s
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  function setPlaying(p) { playing = p; playBtn.textContent = T(p ? "pause" : "play"); playBtn.setAttribute("aria-pressed", String(p)); }
  function point(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function setFrom(x, y) {
    let a = Math.atan2(y - geo.ey, -(x - geo.ex)); // matches mx = ex - cosθ·orb, my = ey + sinθ·orb
    if (a < 0) a += 2 * Math.PI;
    dIn.value = (a / (2 * Math.PI) * SYNODIC).toFixed(3); readouts();
  }
  cv.addEventListener("pointerdown", e => {
    const [x, y] = point(e), d = Math.hypot(x - geo.ex, y - geo.ey);
    if (Math.abs(d - geo.orb) > Math.max(40, geo.orb * 0.35)) return;
    dragging = true; cv.setPointerCapture(e.pointerId); setPlaying(false); setFrom(x, y);
  });
  cv.addEventListener("pointermove", e => { if (dragging) setFrom(...point(e)); });
  const end = () => { dragging = false; };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  playBtn.addEventListener("click", () => setPlaying(!playing));
  dIn.addEventListener("input", () => { setPlaying(false); readouts(); });
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
