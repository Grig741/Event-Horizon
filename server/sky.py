"""Planet positions from JPL's "Keplerian Elements for Approximate Positions of the Major Planets"
(E. M. Standish, Table 1, valid 1800-2050). Accurate to well under a degree, enough to say
which planets are in the evening or morning sky. Mirrors web/js/sky.js.
"""
import math
import time

# name: (a, e, I, L, long.peri, long.node) and rates per Julian century
ELEMENTS = {
    "Mercury": ((0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593),
                (0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081)),
    "Venus": ((0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255),
              (0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418)),
    "Earth": ((1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0),
              (0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0)),
    "Mars": ((1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891),
             (0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343)),
    "Jupiter": ((5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909),
                (-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106)),
    "Saturn": ((9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448),
               (-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794)),
    "Uranus": ((19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503),
               (-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589)),
    "Neptune": ((30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574),
                (0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664)),
}
AU_KM = 149_597_870.7
LIGHT_KM_S = 299_792.458
SYNODIC_MONTH = 29.530588853
NAKED_EYE = ("Mercury", "Venus", "Mars", "Jupiter", "Saturn")


def julian_day(ts: float | None = None) -> float:
    return (time.time() if ts is None else ts) / 86400.0 + 2440587.5


def heliocentric(name: str, jd: float) -> tuple[float, float, float]:
    base, rate = ELEMENTS[name]
    T = (jd - 2451545.0) / 36525.0
    a, e, I, L, wbar, node = (b + r * T for b, r in zip(base, rate))
    w = math.radians(wbar - node)
    M = math.radians(((L - wbar + 180) % 360) - 180)
    E = M + e * math.sin(M)
    for _ in range(12):
        dE = (E - e * math.sin(E) - M) / (1 - e * math.cos(E))
        E -= dE
        if abs(dE) < 1e-10:
            break
    xp = a * (math.cos(E) - e)
    yp = a * math.sqrt(1 - e * e) * math.sin(E)
    O, i = math.radians(node), math.radians(I)
    cw, sw, cO, sO, ci, si = math.cos(w), math.sin(w), math.cos(O), math.sin(O), math.cos(i), math.sin(i)
    x = (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp
    y = (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp
    z = (sw * si) * xp + (cw * si) * yp
    return x, y, z


def _lon(v):
    return math.degrees(math.atan2(v[1], v[0])) % 360


def planet_view(name: str, jd: float) -> dict:
    p = heliocentric(name, jd)
    e = heliocentric("Earth", jd)
    g = (p[0] - e[0], p[1] - e[1], p[2] - e[2])
    sun = (-e[0], -e[1], -e[2])
    dist = math.sqrt(sum(c * c for c in g))
    rs = math.sqrt(sum(c * c for c in sun))
    cosel = sum(a * b for a, b in zip(g, sun)) / (dist * rs)
    elong = math.degrees(math.acos(max(-1.0, min(1.0, cosel))))
    east = ((_lon(g) - _lon(sun) + 540) % 360) - 180 > 0
    if elong < 15:
        where = "hidden"
    elif elong > 165:
        where = "all night"
    else:
        where = "evening" if east else "morning"
    return {
        "name": name,
        "distance_au": dist,
        "light_minutes": dist * AU_KM / LIGHT_KM_S / 60,
        "elongation": elong,
        "where": where,
        "sun_distance_au": math.sqrt(sum(c * c for c in p)),
    }


def moon_phase(jd: float) -> dict:
    age = (jd - 2451550.1) % SYNODIC_MONTH
    illum = (1 - math.cos(2 * math.pi * age / SYNODIC_MONTH)) / 2
    names = ["New Moon", "Waxing crescent", "First quarter", "Waxing gibbous",
             "Full Moon", "Waning gibbous", "Last quarter", "Waning crescent"]
    return {"age_days": age, "illumination": illum, "name": names[int((age / SYNODIC_MONTH) * 8 + 0.5) % 8]}


def tonight_text(ts: float | None = None) -> str:
    jd = julian_day(ts)
    lines = []
    groups = {"evening": [], "morning": [], "all night": [], "hidden": []}
    for n in NAKED_EYE:
        v = planet_view(n, jd)
        groups[v["where"]].append(v)
    if groups["all night"]:
        lines.append("🌌 All night: " + ", ".join(v["name"] for v in groups["all night"]))
    if groups["evening"]:
        lines.append("🌇 Evening sky (west after sunset): " + ", ".join(v["name"] for v in groups["evening"]))
    if groups["morning"]:
        lines.append("🌅 Morning sky (east before sunrise): " + ", ".join(v["name"] for v in groups["morning"]))
    if groups["hidden"]:
        lines.append("☀️ Too close to the Sun: " + ", ".join(v["name"] for v in groups["hidden"]))
    m = moon_phase(jd)
    lines.append(f"🌙 Moon: {m['name']}, {m['illumination'] * 100:.0f}% lit")
    far = planet_view("Mars", jd)
    lines.append(f"🔴 Light from Mars takes {far['light_minutes']:.1f} min to reach you right now.")
    return "\n".join(lines)
