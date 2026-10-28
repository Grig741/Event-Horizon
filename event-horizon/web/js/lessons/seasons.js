// Free lesson: why we have seasons. Earth's axis keeps pointing the same way in space while Earth circles the Sun.
// Solar declination δ = asin(sin ε · sin λ), day length from cos H₀ = −tan φ · tan δ, noon altitude = 90° − |φ − δ|.
export const meta = { id: "seasons", title: "Seasons", pro: false };

const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Why we have seasons", "Почему бывают времена года", "Ինչու են լինում տարվա եղանակներ", "Por qué hay estaciones"],
  intro: [
    "Not because Earth gets closer to the Sun: we are actually closest in early January. The reason is the tilt. Earth's axis leans by 23.4° and keeps pointing the same way all year, so each hemisphere in turn gets a higher Sun and longer days. <b>Change the tilt and your latitude</b> and see what happens to your summer.",
    "Не потому, что Земля подлетает к Солнцу: ближе всего мы к нему в начале января. Причина — наклон. Ось Земли наклонена на 23,4° и весь год смотрит в одну сторону, поэтому то одно, то другое полушарие получает высокое Солнце и длинные дни. <b>Поменяйте наклон и свою широту</b> и посмотрите, что станет с вашим летом.",
    "Ոչ այն պատճառով, որ Երկիրը մոտենում է Արեգակին․ մենք նրան ամենամոտն ենք հունվարի սկզբին։ Պատճառը թեքությունն է։ Երկրի առանցքը թեքված է 23,4°-ով և ամբողջ տարին նայում է նույն կողմ, ուստի հերթով մեկ կիսագունդն է ստանում բարձր Արեգակ ու երկար օրեր, մեկ՝ մյուսը։ <b>Փոխեք թեքությունը և ձեր լայնությունը</b> և տեսեք, թե ինչ կլինի ձեր ամառվա հետ։",
    "No porque la Tierra se acerque al Sol: de hecho estamos más cerca a principios de enero. La razón es la inclinación. El eje terrestre está inclinado 23,4° y apunta al mismo lado todo el año, así que cada hemisferio recibe por turnos un Sol más alto y días más largos. <b>Cambia la inclinación y tu latitud</b> y mira qué le pasa a tu verano."],
  aria: ["Earth circling the Sun with its tilted axis, and the path of the Sun across your sky.", "Земля с наклонённой осью обходит Солнце; рядом — путь Солнца по вашему небу.", "Թեքված առանցքով Երկիրը պտտվում է Արեգակի շուրջը, կողքին՝ Արեգակի ճանապարհը ձեր երկնքում։", "La Tierra con su eje inclinado gira alrededor del Sol, junto al recorrido del Sol por tu cielo."],
  play: ["Play", "Пуск", "Սկսել", "Reproducir"], pause: ["Pause", "Пауза", "Դադար", "Pausa"],
  date: ["Date", "Дата", "Ամսաթիվ", "Fecha"],
  tilt: ["Axial tilt", "Наклон оси", "Առանցքի թեքություն", "Inclinación del eje"],
  lat: ["Your latitude", "Ваша широта", "Ձեր լայնությունը", "Tu latitud"],
  placesAria: ["Places", "Места", "Վայրեր", "Lugares"],
  yerevan: ["Yerevan", "Ереван", "Երևան", "Ereván"], equator: ["Equator", "Экватор", "Հասարակած", "Ecuador"],
  arctic: ["Arctic Circle", "Полярный круг", "Բևեռային շրջան", "Círculo polar"], sydney: ["Sydney", "Сидней", "Սիդնեյ", "Sídney"],
  day: ["Daylight", "Длина дня", "Օրվա տևողություն", "Horas de luz"],
  noon: ["Sun at noon", "Солнце в полдень", "Արեգակը կեսօրին", "Sol a mediodía"],
  energy: ["Sunlight per m²", "Свет на 1 м²", "Լույս 1 մ²-ին", "Luz por m²"],
  season: ["Season here", "Сезон здесь", "Եղանակը այստեղ", "Estación aquí"],
  seasons: [["Spring", "Summer", "Autumn", "Winter"], ["Весна", "Лето", "Осень", "Зима"], ["Գարուն", "Ամառ", "Աշուն", "Ձմեռ"], ["Primavera", "Verano", "Otoño", "Invierno"]],
  polarDay: ["polar day", "полярный день", "բևեռային օր", "día polar"], polarNight: ["polar night", "полярная ночь", "բևեռային գիշեր", "noche polar"],
  hm: ["{h} h {m} min", "{h} ч {m} мин", "{h} ժ {m} ր", "{h} h {m} min"],
  noTilt: ["With no tilt, every day is the same: no seasons at all, 12 hours of daylight everywhere.", "Без наклона все дни одинаковы: никаких сезонов и 12 часов света везде.", "Առանց թեքության բոլոր օրերը նույնն են․ ոչ մի եղանակ և ամենուր 12 ժամ լույս։", "Sin inclinación todos los días son iguales: sin estaciones y 12 horas de luz en todas partes."],
  sky: ["your sky at", "ваше небо, широта", "ձեր երկինքը, լայնություն", "tu cielo a"],
  sun: ["Sun", "Солнце", "Արեգակ", "Sol"], n: ["N", "С", "Հս", "N"], s: ["S", "Ю", "Հվ", "S"],
  june: ["June", "июнь", "հունիս", "junio"], dec: ["December", "декабрь", "դեկտեմբեր", "diciembre"],
  note: [
    "Uranus is tilted 98°: each pole gets 42 years of daylight followed by 42 years of night. Try tilt 40° and latitude 40°: summers become scorching and winters very dark.",
    "Уран наклонён на 98°: на каждом полюсе 42 года длится день, а потом 42 года — ночь. Поставьте наклон 40° и широту 40°: лето станет пеклом, а зима — очень тёмной.",
    "Ուրանը թեքված է 98°-ով․ յուրաքանչյուր բևեռում 42 տարի ցերեկ է, հետո՝ 42 տարի գիշեր։ Դրեք թեքությունը 40° և լայնությունը 40°․ ամառը կդառնա շոգ, իսկ ձմեռը՝ շատ մութ։",
    "Urano está inclinado 98°: cada polo tiene 42 años de día y luego 42 de noche. Prueba inclinación 40° y latitud 40°: los veranos se vuelven abrasadores y los inviernos muy oscuros."],
};
const LOCALES = ["en-GB", "ru-RU", "hy-AM", "es-ES"];
const RAD = Math.PI / 180;

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  const fmt = (n, d = 0) => n.toLocaleString(LOCALES[li], { maximumFractionDigits: d, minimumFractionDigits: d });
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas></div>
    <div class="panel">
      <div class="btns"><button class="btn small" data-a="play" aria-pressed="true">${T("pause")}</button></div>
      <label class="field">${T("date")} <b data-r="date"></b><input type="range" id="se-d" min="0" max="365" step="0.1" value="172"></label>
      <label class="field">${T("tilt")} <b data-r="tilt"></b><input type="range" id="se-t" min="0" max="45" step="0.1" value="23.44"></label>
      <label class="field">${T("lat")} <b data-r="lat"></b><input type="range" id="se-l" min="-80" max="80" step="0.1" value="40.18"></label>
      <div class="btns" role="group" aria-label="${T("placesAria")}">
        <button class="btn small" data-lat="40.18">${T("yerevan")}</button><button class="btn small" data-lat="0">${T("equator")}</button>
        <button class="btn small" data-lat="66.56">${T("arctic")}</button><button class="btn small" data-lat="-33.87">${T("sydney")}</button>
      </div>
      <dl class="readouts">
        <div><dt>${T("day")}</dt><dd data-r="day" style="font-size:1.25rem"></dd></div>
        <div><dt>${T("noon")}</dt><dd data-r="noon"></dd></div>
        <div><dt>${T("energy")}</dt><dd data-r="energy"></dd></div>
        <div><dt>${T("season")}</dt><dd data-r="season" style="font-size:1.25rem"></dd></div>
      </dl>
      <p class="note" data-r="flat" hidden>${T("noTilt")}</p>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), c = cv.getContext("2d");
  const dIn = root.querySelector("#se-d"), tIn = root.querySelector("#se-t"), lIn = root.querySelector("#se-l");
  const playBtn = root.querySelector('[data-a="play"]'), R = k => root.querySelector(`[data-r="${k}"]`);
  let W = 0, H = 0, dpr = 1, raf = 0, alive = true, last = 0, playing = true;

  // day 0 = 1 January; the March equinox falls on day ≈ 79
  const lambda = d => (d - 79.3) / 365.2422 * 2 * Math.PI; // Sun's ecliptic longitude
  const decl = (d, eps) => Math.asin(Math.sin(eps * RAD) * Math.sin(lambda(d))) / RAD;
  function dayLen(phi, dec) {
    const x = -Math.tan(phi * RAD) * Math.tan(dec * RAD);
    if (x <= -1) return 24; if (x >= 1) return 0;
    return 2 * Math.acos(x) / RAD / 15;
  }
  const noonAlt = (phi, dec) => 90 - Math.abs(phi - dec);
  function resize() {
    const rc = bench.getBoundingClientRect(); W = rc.width; H = rc.height; dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }
  function readouts() {
    const d = +dIn.value, eps = +tIn.value, phi = +lIn.value, dec = decl(d, eps);
    const date = new Date(Date.UTC(2026, 0, 1) + d * 864e5);
    R("date").textContent = date.toLocaleDateString(LOCALES[li], { day: "numeric", month: "long", timeZone: "UTC" });
    R("tilt").textContent = `${fmt(eps, 1)}°`;
    R("lat").textContent = `${fmt(Math.abs(phi), 1)}° ${phi >= 0 ? T("n") : T("s")}`;
    const len = dayLen(phi, dec);
    R("day").textContent = len >= 24 ? T("polarDay") : len <= 0 ? T("polarNight") : T("hm", { h: Math.floor(len), m: String(Math.round(len % 1 * 60) % 60).padStart(2, "0") });
    const alt = noonAlt(phi, dec);
    R("noon").textContent = `${fmt(Math.max(0, alt), 1)}°`;
    R("energy").textContent = `${fmt(Math.max(0, Math.sin(alt * RAD)) * 100)}%`;
    // astronomical seasons, swapped in the south
    const q = Math.floor((((lambda(d) / (2 * Math.PI)) % 1 + 1) % 1) * 4);
    R("season").textContent = L.seasons[li][(phi >= 0 ? q : q + 2) % 4];
    R("flat").hidden = eps > 0.5;
  }
  function earth(x, y, r, eps, sx, sy) {
    // the terminator is perpendicular to the direction of the Sun
    const a = Math.atan2(sy - y, sx - x);
    c.fillStyle = "#0f1f38"; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#5b8ed6"; c.beginPath(); c.arc(x, y, r, a - Math.PI / 2, a + Math.PI / 2); c.fill();
    // axis leans the same way in space all year
    const t = eps * RAD, ax = Math.sin(t) * r * 1.7, ay = Math.cos(t) * r * 1.7;
    c.strokeStyle = "#ece5d6"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - ax, y + ay); c.lineTo(x + ax, y - ay); c.stroke();
    // equator and the reader's latitude
    c.save(); c.translate(x, y); c.rotate(t);
    c.strokeStyle = "rgba(236,229,214,.35)"; c.lineWidth = 1; c.beginPath(); c.moveTo(-r, 0); c.lineTo(r, 0); c.stroke();
    const py = -Math.sin(+lIn.value * RAD) * r, pw = Math.cos(+lIn.value * RAD) * r;
    c.strokeStyle = "#e7a15e"; c.lineWidth = 2; c.beginPath(); c.moveTo(-pw, py); c.lineTo(pw, py); c.stroke();
    c.restore(); c.lineWidth = 1;
  }
  function sky(x0, y0, w, h) {
    // the Sun's path across your sky, east to west, at three dates for comparison
    const phi = +lIn.value, eps = +tIn.value, gy = y0 + h * 0.78, sc = (h * 0.7) / 90;
    c.strokeStyle = "rgba(236,229,214,.3)"; c.beginPath(); c.moveTo(x0, gy); c.lineTo(x0 + w, gy); c.stroke();
    c.fillStyle = "rgba(236,229,214,.04)"; c.fillRect(x0, gy, w, y0 + h - gy);
    const path = (dec, style, width) => {
      const len = dayLen(phi, dec), alt = noonAlt(phi, dec);
      if (len <= 0) return;
      const half = Math.min(1, len / 24) * w * 0.48, cx = x0 + w / 2;
      c.strokeStyle = style; c.lineWidth = width; c.beginPath();
      const low = len >= 24 ? Math.abs(phi + dec) - 90 : 0; // midnight altitude when the Sun never sets
      for (let k = 0; k <= 60; k++) {
        const u = k / 60 * 2 - 1, f = len >= 24 ? (1 + Math.cos(u * Math.PI)) / 2 : Math.cos(u * Math.PI / 2);
        const yy = gy - (low + (Math.max(0, alt) - low) * f) * sc, xx = cx + u * half;
        k ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
      }
      c.stroke(); c.lineWidth = 1;
    };
    path(decl(172, eps), "rgba(231,161,94,.3)", 1); path(decl(355, eps), "rgba(175,200,230,.3)", 1);
    const dec = decl(+dIn.value, eps), alt = noonAlt(phi, dec), len = dayLen(phi, dec);
    path(dec, "#ffd28a", 2);
    if (len > 0) {
      const sy = gy - Math.max(0, alt) * sc, g = c.createRadialGradient(x0 + w / 2, sy, 0, x0 + w / 2, sy, 14);
      g.addColorStop(0, "#fff3d0"); g.addColorStop(0.5, "rgba(255,190,90,.9)"); g.addColorStop(1, "rgba(255,150,50,0)");
      c.fillStyle = g; c.beginPath(); c.arc(x0 + w / 2, sy, 14, 0, Math.PI * 2); c.fill();
    }
    c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "rgba(156,147,132,.9)";
    const lbl = `${T("sky")} ${fmt(Math.abs(phi), 0)}°${phi >= 0 ? T("n") : T("s")}`;
    c.fillText(lbl, x0 + w / 2 - c.measureText(lbl).width / 2, y0 + h - 6);
    c.fillStyle = "rgba(231,161,94,.7)"; c.fillText(T("june"), x0 + 4, y0 + 14);
    c.fillStyle = "rgba(175,200,230,.7)"; c.fillText(T("dec"), x0 + 4, y0 + 28);
  }
  function draw() {
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    const wide = W > H * 1.15, aw = wide ? W * 0.62 : W, ah = wide ? H : H * 0.6;
    const cx = aw / 2, cy = ah / 2, R0 = aw * 0.38, r0 = Math.min(ah * 0.22, R0 * 0.32);
    // orbit seen from slightly above; June on the left, December on the right
    c.strokeStyle = "rgba(236,229,214,.18)"; c.setLineDash([3, 5]); c.beginPath(); c.ellipse(cx, cy, R0, r0, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
    const lam = lambda(+dIn.value), ex = cx - R0 * Math.sin(lam), ey = cy + r0 * Math.cos(lam);
    const behind = Math.cos(lam) < 0, er = Math.max(9, Math.min(aw, ah) * 0.055);
    const drawSun = () => {
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, er * 2.6); g.addColorStop(0, "#fff3d0"); g.addColorStop(0.35, "rgba(255,190,90,.95)"); g.addColorStop(1, "rgba(255,150,50,0)");
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, er * 2.6, 0, Math.PI * 2); c.fill();
    };
    if (behind) { earth(ex, ey, er * (0.85 + 0.15 * (1 + Math.cos(lam)) / 2), +tIn.value, cx, cy); drawSun(); }
    else { drawSun(); earth(ex, ey, er * (0.85 + 0.15 * (1 + Math.cos(lam)) / 2), +tIn.value, cx, cy); }
    c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "rgba(156,147,132,.75)";
    c.fillText(T("june"), cx - R0 - 10, cy + r0 + 22); c.fillText(T("dec"), cx + R0 - 30, cy + r0 + 22);
    if (wide) { c.strokeStyle = "rgba(236,229,214,.12)"; c.beginPath(); c.moveTo(aw, 16); c.lineTo(aw, H - 16); c.stroke(); sky(aw + 12, H * 0.2, W - aw - 24, H * 0.6); }
    else { c.strokeStyle = "rgba(236,229,214,.12)"; c.beginPath(); c.moveTo(16, ah); c.lineTo(W - 16, ah); c.stroke(); sky(16, ah + 8, W - 32, H - ah - 12); }
  }
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    if (playing) { dIn.value = ((+dIn.value + dt * 365 / 20) % 365).toFixed(2); readouts(); } // a year in 20 s
    if (!document.hidden) draw();
    raf = requestAnimationFrame(frame);
  }
  function setPlaying(p) { playing = p; playBtn.textContent = T(p ? "pause" : "play"); playBtn.setAttribute("aria-pressed", String(p)); }
  playBtn.addEventListener("click", () => setPlaying(!playing));
  dIn.addEventListener("input", () => { setPlaying(false); readouts(); });
  tIn.addEventListener("input", readouts); lIn.addEventListener("input", readouts);
  root.querySelectorAll("[data-lat]").forEach(b => b.addEventListener("click", () => { lIn.value = b.dataset.lat; readouts(); }));
  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); } };
}
