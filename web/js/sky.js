// Planet positions from JPL's "Keplerian Elements for Approximate Positions of the Major Planets"
// (E. M. Standish, Table 1, valid 1800-2050). Mirrors server/sky.py.

const EL = {
  Mercury: [[0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593], [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081]],
  Venus: [[0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255], [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418]],
  Earth: [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0], [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0]],
  Mars: [[1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891], [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343]],
  Jupiter: [[5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106]],
  Saturn: [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]],
  Uranus: [[19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503], [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589]],
  Neptune: [[30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574], [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664]],
};
export const ORDER = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
export const AU_KM = 149597870.7;
export const C_KM_S = 299792.458;
const SYNODIC = 29.530588853;
const D = Math.PI / 180;

// NASA Planetary Fact Sheet values; moon counts from NASA Space Place (Jupiter as of Apr 2026, Saturn as of Jun 2026).
export const FACTS = {
  Mercury: { host: "mercury", color: "#a99f97", diameter: 4879, mass: 0.055, day: { earthDays: 176 }, year: { days: 88 }, moons: 0, temp: { avg: 167 }, gravity: 3.7 },
  Venus: { host: "venus", color: "#e8cf9a", diameter: 12104, mass: 0.815, day: { earthDays: 117, retro: true }, year: { days: 225 }, moons: 0, temp: { avg: 464 }, gravity: 8.9 },
  Earth: { host: "earth", color: "#5b8ed6", diameter: 12756, mass: 1, day: { h: 24, m: 0 }, year: { days: 365.25 }, moons: 1, temp: { avg: 15 }, gravity: 9.8 },
  Mars: { host: "mars", color: "#d0643a", diameter: 6792, mass: 0.107, day: { h: 24, m: 40 }, year: { days: 687 }, moons: 2, temp: { avg: -65 }, gravity: 3.7 },
  Jupiter: { host: "jupiter", color: "#d8b88f", diameter: 142984, mass: 317.8, day: { h: 9, m: 56 }, year: { years: 11.9 }, moons: 115, temp: { clouds: -110 }, gravity: 23.1 },
  Saturn: { host: "saturn", color: "#e6d09c", diameter: 120536, mass: 95.2, day: { h: 10, m: 33 }, year: { years: 29.4 }, moons: 293, temp: { clouds: -140 }, gravity: 9.0 },
  Uranus: { host: "uranus", color: "#9fd8de", diameter: 51118, mass: 14.5, day: { h: 17, m: 14, retro: true }, year: { years: 84 }, moons: 29, temp: { t: -195 }, gravity: 8.7 },
  Neptune: { host: "neptune", color: "#5878d8", diameter: 49528, mass: 17.1, day: { h: 16, m: 6 }, year: { years: 165 }, moons: 16, temp: { t: -200 }, gravity: 11.0 },
};

export const jdOf = ms => ms / 86400000 + 2440587.5;
export const jdNow = () => jdOf(Date.now());

export function heliocentric(name, jd) {
  const [b, r] = EL[name];
  const T = (jd - 2451545.0) / 36525;
  const [a, e, I, L, wbar, node] = b.map((v, i) => v + r[i] * T);
  const w = (wbar - node) * D;
  const M = ((((L - wbar + 180) % 360) + 360) % 360 - 180) * D;
  let E = M + e * Math.sin(M);
  for (let k = 0; k < 12; k++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const O = node * D, i = I * D;
  const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), ci = Math.cos(i), si = Math.sin(i);
  return [
    (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp,
    (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp,
    (sw * si) * xp + (cw * si) * yp,
  ];
}

const len = v => Math.hypot(v[0], v[1], v[2]);
const lon = v => ((Math.atan2(v[1], v[0]) / D) % 360 + 360) % 360;

export function planetView(name, jd) {
  const p = heliocentric(name, jd);
  if (name === "Earth") return { name, helio: p, sunAU: len(p), distAU: 0, lightMin: 0, elong: 0, where: "home" };
  const e = heliocentric("Earth", jd);
  const g = [p[0] - e[0], p[1] - e[1], p[2] - e[2]];
  const sun = [-e[0], -e[1], -e[2]];
  const dist = len(g);
  const elong = Math.acos(Math.max(-1, Math.min(1, (g[0] * sun[0] + g[1] * sun[1] + g[2] * sun[2]) / (dist * len(sun))))) / D;
  const east = ((lon(g) - lon(sun) + 540) % 360) - 180 > 0;
  const where = elong < 15 ? "hidden" : elong > 165 ? "all night" : east ? "evening" : "morning";
  return { name, helio: p, sunAU: len(p), distAU: dist, lightMin: dist * AU_KM / C_KM_S / 60, elong, where };
}

export function moonPhase(jd) {
  const age = (((jd - 2451550.1) % SYNODIC) + SYNODIC) % SYNODIC;
  const illum = (1 - Math.cos(2 * Math.PI * age / SYNODIC)) / 2;
  const names = ["New Moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full Moon", "Waning gibbous", "Last quarter", "Waning crescent"];
  const index = Math.floor(age / SYNODIC * 8 + 0.5) % 8;
  return { age, illum, index, name: names[index], waxing: age < SYNODIC / 2 };
}

