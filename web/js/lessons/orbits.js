// Free lesson: throw bodies around a 10-solar-mass black hole. Newtonian gravity, velocity Verlet,
// distances in Schwarzschild radii, capture at the innermost stable circular orbit (3 Rs).
export const meta = { id: "orbits", title: "Orbits", pro: false,
  blurb: "Throw bodies around a black hole and find out what makes an orbit, an escape or a fall." };

const LANGS = ["en", "ru", "hy", "es"];
const L = {
  title: ["Orbits", "Орбиты", "Ուղեծրեր", "Órbitas"],
  intro: [
    "<b>Drag anywhere to throw a body</b>; a dashed line previews the path. A quick tap puts it on a circular orbit. Gravity follows Newton's inverse-square law. Distances are in Schwarzschild radii (R<sub>s</sub>), speeds as a fraction of light.",
    "<b>Потяните в любом месте, чтобы бросить тело</b>; пунктир покажет траекторию. Короткое касание выводит его на круговую орбиту. Гравитация подчиняется закону обратных квадратов Ньютона. Расстояния — в радиусах Шварцшильда (R<sub>s</sub>), скорости — в долях скорости света.",
    "<b>Քաշեք ցանկացած տեղում՝ մարմին նետելու համար</b>․ կետագիծը ցույց կտա հետագիծը։ Կարճ հպումը մարմինը դնում է շրջանաձև ուղեծրի վրա։ Ձգողությունը ենթարկվում է Նյուտոնի հակադարձ քառակուսիների օրենքին։ Հեռավորությունները Շվարցշիլդի շառավիղներով են (R<sub>s</sub>), արագությունները՝ լույսի արագության մասերով։",
    "<b>Arrastra en cualquier parte para lanzar un cuerpo</b>; una línea discontinua anticipa la trayectoria. Un toque rápido lo pone en órbita circular. La gravedad sigue la ley del inverso del cuadrado de Newton. Las distancias están en radios de Schwarzschild (R<sub>s</sub>) y las velocidades en fracción de la luz."],
  aria: ["Orbit simulator. Drag to throw a body, or use Add a body.", "Симулятор орбит. Потяните, чтобы бросить тело, или нажмите «Добавить тело».", "Ուղեծրերի սիմուլյատոր։ Քաշեք՝ մարմին նետելու համար, կամ սեղմեք «Ավելացնել մարմին»։", "Simulador de órbitas. Arrastra para lanzar un cuerpo o usa Añadir cuerpo."],
  start: ["Three bodies are already circling. Tap for a neat orbit, or drag to throw one.", "Три тела уже кружат. Коснитесь, чтобы получить ровную орбиту, или потяните, чтобы бросить.", "Երեք մարմին արդեն պտտվում են։ Հպեք՝ կոկիկ ուղեծրի համար, կամ քաշեք՝ նետելու համար։", "Ya hay tres cuerpos girando. Toca para una órbita limpia o arrastra para lanzar uno."],
  speed: ["Speed of newest", "Скорость нового", "Նորի արագությունը", "Velocidad del último"],
  dist: ["Its distance", "Его расстояние", "Նրա հեռավորությունը", "Su distancia"],
  count: ["Bodies", "Тела", "Մարմիններ", "Cuerpos"],
  eaten: ["Swallowed", "Поглощено", "Կուլ տրված", "Engullidos"],
  laps: ["Laps", "Витки", "Պտույտներ", "Vueltas"],
  esc: ["Speed vs escape", "Скорость / убегания", "Արագություն / փախուստի", "Velocidad / escape"],
  bound: ["bound", "связано", "կապված", "ligado"],
  escaping: ["escaping", "улетает", "հեռանում է", "escapa"],
  add: ["Add a body", "Добавить тело", "Ավելացնել մարմին", "Añadir cuerpo"],
  reset: ["Reset", "Сброс", "Վերսկսել", "Reiniciar"],
  note: [
    "Real black holes allow no stable orbit inside 3 R<sub>s</sub>, so a body that crosses it is counted as swallowed. For 10 solar masses, R<sub>s</sub> = 29.5 km. Close in, general relativity changes the paths; this model shows the Newtonian picture.",
    "У настоящих чёрных дыр нет устойчивых орбит внутри 3 R<sub>s</sub>, поэтому тело, пересёкшее эту границу, считается поглощённым. Для 10 масс Солнца R<sub>s</sub> = 29,5 км. Вблизи дыры траектории меняет общая теория относительности; модель показывает ньютоновскую картину.",
    "Իրական սև խոռոչների շուրջ 3 R<sub>s</sub>-ից ներս կայուն ուղեծիր չկա, ուստի այդ սահմանը հատած մարմինը համարվում է կուլ տրված։ 10 Արեգակի զանգվածի համար R<sub>s</sub> = 29,5 կմ։ Մոտիկից հետագծերը փոխում է հարաբերականության ընդհանուր տեսությունը․ մոդելը ցույց է տալիս Նյուտոնյան պատկերը։",
    "Los agujeros negros reales no permiten órbitas estables dentro de 3 R<sub>s</sub>, así que un cuerpo que cruza ese límite cuenta como engullido. Para 10 masas solares, R<sub>s</sub> = 29,5 km. De cerca, la relatividad general cambia las trayectorias; este modelo muestra la imagen newtoniana."],
  close: ["Too close. Inside 3 Rs nothing can orbit, so start a little farther out.", "Слишком близко. Внутри 3 Rs орбит не бывает, начните чуть дальше.", "Չափազանց մոտ է։ 3 Rs-ից ներս ուղեծիր չի լինում, սկսեք մի փոքր հեռվից։", "Demasiado cerca. Dentro de 3 Rs no hay órbitas; empieza un poco más lejos."],
  gone: ["Gone. It crossed the innermost stable orbit and spiralled in.", "Пропало. Оно пересекло последнюю устойчивую орбиту и упало по спирали.", "Անհետացավ։ Այն հատեց ամենաներքին կայուն ուղեծիրը և պարույրով ընկավ։", "Desapareció. Cruzó la órbita estable más interna y cayó en espiral."],
  another: ["Another one past 3 Rs. {n} swallowed so far.", "Ещё одно за 3 Rs. Всего поглощено: {n}.", "Եվս մեկը՝ 3 Rs-ից ներս։ Ընդամենը կուլ է տրվել՝ {n}։", "Otro más tras 3 Rs. Engullidos hasta ahora: {n}."],
  circ: ["A circular orbit at {r} Rs. Gravity and speed are exactly balanced.", "Круговая орбита на {r} Rs. Гравитация и скорость точно уравновешены.", "Շրջանաձև ուղեծիր {r} Rs-ի վրա։ Ձգողությունը և արագությունը ճշգրիտ հավասարակշռված են։", "Órbita circular a {r} Rs. La gravedad y la velocidad están en equilibrio exacto."],
  escSay: ["Above escape speed. It will leave and never come back.", "Выше скорости убегания. Оно улетит и не вернётся.", "Փախուստի արագությունից բարձր է։ Այն կհեռանա և այլևս չի վերադառնա։", "Por encima de la velocidad de escape. Se irá y no volverá."],
  barely: ["Barely bound. Expect a long, stretched ellipse.", "Едва удерживается. Будет длинный вытянутый эллипс.", "Հազիվ է պահվում։ Կլինի երկար, ձգված էլիպս։", "Apenas ligado. Espera una elipse larga y estirada."],
  boundSay: ["Bound. It will keep coming back around.", "Связано. Оно будет возвращаться снова и снова.", "Կապված է։ Այն նորից ու նորից կվերադառնա։", "Ligado. Seguirá volviendo una y otra vez."],
  resetSay: ["Back to three bodies.", "Снова три тела.", "Նորից երեք մարմին։", "De vuelta a tres cuerpos."],
};

export function mount(root, opts = {}) {
  const li = Math.max(0, LANGS.indexOf(opts.lang));
  const T = (k, v = {}) => Object.entries(v).reduce((a, [x, y]) => a.split(`{${x}}`).join(y), L[k][li] ?? L[k][0]);
  root.innerHTML = `<div class="lab">
    <div class="lab-head"><h2>${T("title")}</h2><p>${T("intro")}</p></div>
    <div class="bench"><canvas aria-label="${T("aria")}"></canvas>
      <p class="say" aria-live="polite">${T("start")}</p></div>
    <div class="panel">
      <dl class="readouts">
        <div><dt>${T("speed")}</dt><dd><span data-r="speed">0.00</span><small>c</small></dd></div>
        <div><dt>${T("dist")}</dt><dd><span data-r="dist">0</span><small>R<sub>s</sub></small></dd></div>
        <div><dt>${T("count")}</dt><dd data-r="count">0</dd></div>
        <div><dt>${T("eaten")}</dt><dd data-r="eaten">0</dd></div>
        <div><dt>${T("laps")}</dt><dd data-r="laps">0</dd></div>
        <div><dt>${T("esc")}</dt><dd><span data-r="esc">0.00</span><small data-r="escl">${T("bound")}</small></dd></div>
      </dl>
      <div class="btns"><button class="btn primary" data-a="add" type="button">${T("add")}</button><button class="btn" data-a="reset" type="button">${T("reset")}</button></div>
      <p class="note">${T("note")}</p>
    </div></div>`;

  const cv = root.querySelector("canvas"), bench = root.querySelector(".bench"), ctx = cv.getContext("2d");
  const sayEl = root.querySelector(".say"), R = k => root.querySelector(`[data-r="${k}"]`);
  const GM = 8772, CL = Math.sqrt(2 * GM), CAP = 3, FAR = 160, MAXB = 40, TRAIL = 140;
  let W = 0, H = 0, dpr = 1, scale = 10, bodies = [], flashes = [], eaten = 0, last = null, drag = null, glow = 0, raf = 0, alive = true, sayT = 0, clock = 0;
  let stars = [];

  const say = (m, force) => {
    const now = performance.now(); if (!force && now - sayT < 2200) return; sayT = now;
    sayEl.textContent = m; sayEl.classList.remove("off");
    clearTimeout(say.h); say.h = setTimeout(() => sayEl.classList.add("off"), 5200);
  };
  const accel = b => { const r2 = b.x * b.x + b.y * b.y, r = Math.sqrt(r2), f = -GM / (r2 * r); b.ax = b.x * f; b.ay = b.y * f; };
  const circ = (x, y, k = 1) => { const r = Math.hypot(x, y), v = Math.sqrt(GM / r) * k; return { vx: -y / r * v, vy: x / r * v }; };
  const escR = b => Math.hypot(b.vx, b.vy) / Math.sqrt(2 * GM / Math.hypot(b.x, b.y));
  const toSim = (px, py) => ({ x: (px - W / 2) / scale, y: (py - H / 2) / scale });

  function add(x, y, vx, vy) {
    if (Math.hypot(x, y) <= CAP + 0.2) { say(T("close"), true); return null; }
    if (bodies.length >= MAXB) bodies.shift();
    const b = { x, y, vx, vy, ax: 0, ay: 0, trail: [], ang: Math.atan2(y, x), turn: 0 };
    accel(b); bodies.push(b); last = b; return b;
  }
  function seed() {
    bodies = []; flashes = []; eaten = 0; last = null;
    let v = circ(0, -22); add(0, -22, v.vx, v.vy);
    v = circ(12, 0, 1.22); add(12, 0, v.vx, v.vy);
    v = circ(-30, 6, 0.78); add(-30, 6, v.vx, v.vy);
  }
  function resize() {
    const rc = bench.getBoundingClientRect();
    W = Math.max(1, rc.width); H = Math.max(1, rc.height); dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    scale = Math.min(W, H) / 2 / 36;
    stars = Array.from({ length: Math.round(W * H / 3000) }, () => [Math.random() * W, Math.random() * H, Math.random()]);
  }
  function step(dt) {
    const sub = 12, h = dt / sub;
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i]; let gone = false;
      for (let s = 0; s < sub; s++) {
        b.x += b.vx * h + 0.5 * b.ax * h * h; b.y += b.vy * h + 0.5 * b.ay * h * h;
        const ax = b.ax, ay = b.ay; accel(b);
        b.vx += 0.5 * (ax + b.ax) * h; b.vy += 0.5 * (ay + b.ay) * h;
        const r = Math.hypot(b.x, b.y);
        if (r < CAP) {
          eaten++; flashes.push({ x: b.x, y: b.y, t: 0 }); glow = Math.min(1, glow + 0.5); gone = true;
          say(eaten === 1 ? T("gone") : T("another", { n: eaten }));
          break;
        }
        if (r > FAR) { gone = true; break; }
      }
      if (gone) { bodies.splice(i, 1); if (last === b) last = bodies[bodies.length - 1] || null; continue; }
      const a = Math.atan2(b.y, b.x); let da = a - b.ang;
      if (da > Math.PI) da -= 2 * Math.PI; else if (da < -Math.PI) da += 2 * Math.PI;
      b.turn += da; b.ang = a;
      b.trail.push(b.x, b.y); if (b.trail.length > TRAIL * 2) b.trail.splice(0, 2);
    }
    for (let j = flashes.length - 1; j >= 0; j--) { flashes[j].t += dt; if (flashes[j].t > 0.9) flashes.splice(j, 1); }
    glow *= Math.pow(0.15, dt);
  }
  function dragVel() {
    const k = 1.8 / scale; let vx = (drag.ex - drag.sx) * k, vy = (drag.ey - drag.sy) * k;
    const sp = Math.hypot(vx, vy), mx = 0.7 * CL; if (sp > mx) { vx *= mx / sp; vy *= mx / sp; }
    return { vx, vy };
  }
  function draw() {
    const c = ctx, cx = W / 2, cy = H / 2;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
    for (const s of stars) { c.fillStyle = `rgba(236,229,214,${0.12 + s[2] * 0.35})`; c.fillRect(s[0], s[1], 1, 1); }
    c.lineWidth = 1; c.font = "11px Archivo, Arial, sans-serif"; c.fillStyle = "rgba(156,147,132,.75)";
    for (const rr of [10, 20, 30]) {
      c.strokeStyle = "rgba(236,229,214,.07)"; c.beginPath(); c.arc(cx, cy, rr * scale, 0, Math.PI * 2); c.stroke();
      c.fillText(rr + " Rs", cx + rr * scale * 0.7071 + 4, cy - rr * scale * 0.7071 - 4);
    }
    const gr = scale * (7 + glow * 5), g = c.createRadialGradient(cx, cy, scale, cx, cy, gr);
    g.addColorStop(0, `rgba(231,161,94,${0.35 + glow * 0.4})`); g.addColorStop(1, "rgba(231,161,94,0)");
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, gr, 0, Math.PI * 2); c.fill();
    c.setLineDash([4, 4]);
    c.strokeStyle = "rgba(231,161,94,.8)"; c.beginPath(); c.arc(cx, cy, CAP * scale, 0, Math.PI * 2); c.stroke();
    c.strokeStyle = "rgba(236,229,214,.4)"; c.beginPath(); c.arc(cx, cy, 1.5 * scale, 0, Math.PI * 2); c.stroke();
    c.setLineDash([]);
    c.fillStyle = "#000"; c.strokeStyle = "rgba(236,229,214,.85)";
    c.beginPath(); c.arc(cx, cy, Math.max(2, scale), 0, Math.PI * 2); c.fill(); c.stroke();
    c.lineCap = "round";
    for (const b of bodies) {
      const t = b.trail, n = t.length / 2, col = b === last ? "175,200,230" : "236,229,214";
      for (let st = 0; st < n - 1; st += 10) {
        const en = Math.min(n - 1, st + 10);
        c.strokeStyle = `rgba(${col},${0.05 + 0.6 * (en / n)})`; c.lineWidth = b === last ? 1.6 : 1.1;
        c.beginPath(); c.moveTo(cx + t[st * 2] * scale, cy + t[st * 2 + 1] * scale);
        for (let q = st + 1; q <= en; q++) c.lineTo(cx + t[q * 2] * scale, cy + t[q * 2 + 1] * scale);
        c.stroke();
      }
      c.fillStyle = b === last ? "#AFC8E6" : "#ECE5D6";
      c.beginPath(); c.arc(cx + b.x * scale, cy + b.y * scale, b === last ? 3.2 : 2.4, 0, Math.PI * 2); c.fill();
    }
    for (const f of flashes) {
      const p = f.t / 0.9;
      c.strokeStyle = `rgba(231,161,94,${1 - p})`; c.lineWidth = 2 * (1 - p) + 0.5;
      c.beginPath(); c.arc(cx + f.x * scale, cy + f.y * scale, 4 + p * 26, 0, Math.PI * 2); c.stroke();
    }
    if (drag && drag.moved) {
      const v = dragVel(), p0 = toSim(drag.sx, drag.sy);
      if (Math.hypot(p0.x, p0.y) > CAP) {
        const pb = { x: p0.x, y: p0.y, vx: v.vx, vy: v.vy, ax: 0, ay: 0 }; accel(pb);
        const hh = 0.004; c.strokeStyle = "rgba(175,200,230,.45)"; c.setLineDash([2, 5]);
        c.beginPath(); c.moveTo(drag.sx, drag.sy);
        for (let i = 0; i < 900; i++) {
          pb.x += pb.vx * hh + 0.5 * pb.ax * hh * hh; pb.y += pb.vy * hh + 0.5 * pb.ay * hh * hh;
          const ox = pb.ax, oy = pb.ay; accel(pb);
          pb.vx += 0.5 * (ox + pb.ax) * hh; pb.vy += 0.5 * (oy + pb.ay) * hh;
          c.lineTo(cx + pb.x * scale, cy + pb.y * scale);
          const pr = Math.hypot(pb.x, pb.y); if (pr < CAP || pr > 60) break;
        }
        c.stroke(); c.setLineDash([]);
      }
      c.strokeStyle = "rgba(175,200,230,.9)"; c.setLineDash([3, 3]);
      c.beginPath(); c.moveTo(drag.sx, drag.sy); c.lineTo(drag.ex, drag.ey); c.stroke(); c.setLineDash([]);
      c.fillStyle = "rgba(236,229,214,.9)"; c.fillText((Math.hypot(v.vx, v.vy) / CL).toFixed(2) + " c", drag.ex + 8, drag.ey - 8);
    }
  }
  function readouts() {
    if (last) {
      R("speed").textContent = (Math.hypot(last.vx, last.vy) / CL).toFixed(2);
      R("dist").textContent = Math.hypot(last.x, last.y).toFixed(1);
      const e = escR(last); R("esc").textContent = e.toFixed(2); R("escl").textContent = e >= 1 ? T("escaping") : T("bound");
    } else { R("speed").textContent = "0.00"; R("dist").textContent = "0"; R("esc").textContent = "0.00"; R("escl").textContent = "—"; }
    R("count").textContent = bodies.length; R("eaten").textContent = eaten;
    R("laps").textContent = bodies.reduce((s, b) => s + Math.floor(Math.abs(b.turn) / (2 * Math.PI)), 0);
  }
  let lastTs = 0;
  function frame(ts) {
    if (!alive) return;
    const dt = Math.min(0.05, (ts - (lastTs || ts)) / 1000); lastTs = ts;
    if (!document.hidden) { step(dt); draw(); clock += dt; if (clock > 0.12) { clock = 0; readouts(); } }
    raf = requestAnimationFrame(frame);
  }

  cv.addEventListener("pointerdown", e => {
    const rc = cv.getBoundingClientRect();
    drag = { id: e.pointerId, sx: e.clientX - rc.left, sy: e.clientY - rc.top, ex: e.clientX - rc.left, ey: e.clientY - rc.top, moved: false };
    try { cv.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  });
  cv.addEventListener("pointermove", e => {
    if (!drag || drag.id !== e.pointerId) return;
    const rc = cv.getBoundingClientRect(); drag.ex = e.clientX - rc.left; drag.ey = e.clientY - rc.top;
    if (Math.hypot(drag.ex - drag.sx, drag.ey - drag.sy) > 6) drag.moved = true;
  });
  cv.addEventListener("pointerup", e => {
    if (!drag || drag.id !== e.pointerId) return;
    const p = toSim(drag.sx, drag.sy), v = drag.moved ? dragVel() : circ(p.x, p.y);
    const b = add(p.x, p.y, v.vx, v.vy);
    if (b) {
      if (!drag.moved) say(T("circ", { r: Math.hypot(p.x, p.y).toFixed(0) }));
      else { const e2 = escR(b); say(e2 >= 1 ? T("escSay") : e2 > 0.85 ? T("barely") : T("boundSay")); }
    }
    drag = null; readouts();
  });
  cv.addEventListener("pointercancel", () => { drag = null; });
  root.querySelector('[data-a="add"]').addEventListener("click", () => {
    const a = Math.random() * Math.PI * 2, r = 8 + Math.random() * 24, x = Math.cos(a) * r, y = Math.sin(a) * r;
    const v = circ(x, y, 0.7 + Math.random() * 0.55); add(x, y, v.vx, v.vy); readouts();
  });
  root.querySelector('[data-a="reset"]').addEventListener("click", () => { seed(); readouts(); say(T("resetSay"), true); });

  const ro = new ResizeObserver(resize); ro.observe(bench);
  resize(); seed(); readouts(); raf = requestAnimationFrame(frame);
  return { destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(say.h); } };
}
