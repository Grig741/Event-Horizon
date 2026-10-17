import { t } from "./i18n.js";
// The host: the object that presents each story.
// A black hole is drawn by a WebGL shader; every other host (planets, the Sun, a galaxy, a comet)
// is drawn in Canvas 2D. All hosts "speak": they brighten, spin faster and breathe with the text.

const VS="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
const FS=[
"precision highp float;",
"uniform vec2 uRes;uniform vec2 uC;uniform float uR;uniform float uT;uniform float uPh;uniform float uE;uniform float uDpr;",
"float h21(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}",
"float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
" float a=h21(i),b=h21(i+vec2(1.,0.)),c=h21(i+vec2(0.,1.)),d=h21(i+vec2(1.,1.));",
" return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}",
"float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return s;}",
"vec3 stars(vec2 q,float cell,float dens,float seed){",
" vec2 g=q/cell;vec2 id=floor(g);vec2 f=fract(g);float h=h21(id+seed);",
" if(h>dens)return vec3(0.);",
" vec2 o=.2+.6*vec2(h21(id+1.3+seed),h21(id+7.7+seed));",
" float d=length((f-o)*cell);",
" float m=h21(id+4.1+seed);",
" float b=exp(-d*d*1.6)*(.35+1.4*m*m)+exp(-d*.9)*.05*m;",
" float tw=.85+.15*sin(uT*(1.+3.*m)+m*40.);",
" vec3 tint=mix(vec3(1.,.82,.62),vec3(.78,.86,1.),h21(id+2.2+seed));",
" return tint*b*tw;}",
"vec3 heat(float x){x=clamp(x,0.,3.2);",
" vec3 c=mix(vec3(.30,.05,.01),vec3(.98,.47,.13),smoothstep(0.,.6,x));",
" c=mix(c,vec3(1.,.83,.56),smoothstep(.55,1.3,x));",
" c=mix(c,vec3(.93,.96,1.),smoothstep(1.3,2.5,x));",
" return c*x;}",
"void main(){",
" vec2 fc=gl_FragCoord.xy/uDpr;",
" vec2 p=(fc-uC)/uR;float r=length(p);float ri=max(r,1e-3);",
" vec3 col=vec3(0.);",
" float tE=1.8;",
" vec2 beta=p-p/ri*(tE*tE/ri);",
" vec2 q=beta*uR+vec2(uT*2.2,uT*.4);",
" if(r>1.){",
"  col+=stars(q,26.,.11,0.)+stars(q,9.,.045,3.)*.5;",
"  float n=fbm(q*.0035+vec2(3.,uT*.003));",
"  col+=vec3(.11,.065,.04)*pow(n,3.)*1.8+vec3(.025,.04,.07)*pow(fbm(q*.006+5.),3.)*1.4;",
" }",
" float sx=p.x/ri,sy=p.y/ri;",
" float gain=1.+.85*uE;",
/* lensed image of the far side of the disk, wrapped over the shadow */
" float band=smoothstep(1.02,1.08,r)*(1.-smoothstep(1.32,1.85,r));",
" if(band>0.){",
"  float aH=atan(p.y,p.x)-uPh*.55;",
"  float rdH=1.2+(r-1.03)*3.6;",
"  vec2 hc=vec2(cos(aH),sin(aH))*(1.6+rdH);",
"  float tx=.5+.9*fbm(hc*1.4+rdH*2.);",
"  float w=smoothstep(-.35,.6,sy)+.28;",
"  float dop=1.-.48*sx;",
"  float I=band*w*tx*pow(dop,2.4)*pow(1.2/rdH,1.2)*.95*gain;",
"  vec3 hcl=heat(I);",
"  hcl=mix(hcl,hcl*vec3(.82,.95,1.25),clamp((dop-1.)*1.5,0.,1.));",
"  col+=hcl;",
" }",
" if(r<1.)col=vec3(0.);",
/* photon ring */
" float pr=exp(-pow((r-1.)/.013,2.))*1.15+step(1.,r)*exp(-(r-1.)/.07)*.28;",
" col+=vec3(1.,.86,.64)*pr*(.65+.55*(1.-.45*sx))*(1.+uE*.9);",
/* primary disk */
" float k=.19;",
" vec2 dp=vec2(p.x,p.y/k);float rd=length(dp);",
" float rin=1.2,rout=4.7;",
" float prof=smoothstep(rin,rin+.14,rd)*(1.-smoothstep(rout*.5,rout,rd))*pow(rin/max(rd,rin),1.35);",
" if(prof>.001){",
"  float ang=atan(dp.y,dp.x);",
"  float a2=ang-uPh*pow(max(rd,rin),-1.5);",
"  vec2 nc=vec2(cos(a2),sin(a2))*rd;",
"  float tx=fbm(nc*1.7+vec2(rd*2.3));tx=.4+1.1*tx*tx;",
"  tx*=.9+.1*sin(rd*11.+fbm(nc*.9)*6.);",
"  float dopD=1.-.5*cos(ang)*sqrt(rin/max(rd,rin));",
"  float I=prof*tx*pow(dopD,2.6)*1.15*gain;",
"  vec3 dc=heat(I*1.25);",
"  dc=mix(dc,dc*vec3(.8,.95,1.28),clamp((dopD-1.)*1.6,0.,1.));",
"  dc=mix(dc,dc*vec3(1.1,.72,.55),clamp((1.-dopD)*1.6,0.,1.));",
"  float vis=p.y<0.?1.:step(1.,r);",
"  float aD=clamp(prof*1.5,0.,.92)*vis;",
"  col=col*(1.-aD)+dc*vis;",
" }",
/* anamorphic streak, cinematic glare */
" float fl=exp(-abs(fc.y-uC.y)/1.8)*exp(-abs(p.x)/3.2)*.16*(1.+uE*1.2);",
" col+=vec3(.95,.72,.48)*fl;",
" col=1.-exp(-col*1.15);",
" vec2 uv=gl_FragCoord.xy/uRes;",
" float vg=mix(.25,1.,smoothstep(1.05,.25,length((uv-.5)*vec2(1.25,1.))));",
" col*=vg;",
" col+=(h21(gl_FragCoord.xy+fract(uT*7.)*91.)-.5)*.035;",
" gl_FragColor=vec4(max(col,0.),1.);",
"}"].join("\n");

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

export const HOSTS = {
  blackhole: { name: "A black hole" },
  sun: { name: "The Sun" },
  mercury: { name: "Mercury", base: "#9b9089", dark: "#5e5650", size: 0.62, craters: 26 },
  venus: { name: "Venus", base: "#e6cf98", dark: "#b8945a", size: 0.9, bands: ["#efdcae", "#dcbf84", "#e9d5a2", "#d2b075"], haze: "#f6e6bd" },
  earth: { name: "Earth", base: "#245a96", size: 0.92, earth: true },
  moon: { name: "The Moon", base: "#bdb7ad", dark: "#6f6a63", size: 0.7, craters: 22, maria: true },
  mars: { name: "Mars", base: "#c4562f", dark: "#7c2f18", size: 0.75, craters: 6, mars: true },
  jupiter: { name: "Jupiter", base: "#d8c2a0", size: 1.15, bands: ["#e8dcc6", "#b9865c", "#e2cfae", "#a7714a", "#efe4d0", "#c49470", "#ddc7a4", "#9c6a46"], spot: "#c0563a" },
  saturn: { name: "Saturn", base: "#e2cc97", size: 0.92, bands: ["#eddcb0", "#d7bb83", "#e6d2a2", "#cdb07a", "#f0e2bd"], rings: true },
  uranus: { name: "Uranus", base: "#9fd8de", size: 0.85, bands: ["#a7dde2", "#98d1d8", "#a3dadf"], thinRings: true },
  neptune: { name: "Neptune", base: "#3e62c6", size: 0.85, bands: ["#4a6fd0", "#3858b5", "#4769cd", "#3352a8"], spot: "#1f347a" },
  galaxy: { name: "A galaxy" },
  exoplanet: { name: "An exoplanet" },
  comet: { name: "A comet" },
};

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function hashStr(t) { let h = 2166136261; for (const c of t) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

export class HostStage {
  /** @param {HTMLElement} wrap  @param {() => {cx:number, cy:number, r:number}} place */
  constructor(wrap, place, opts = {}) {
    this.wrap = wrap;
    this.place = place;
    this.kind = "blackhole";
    this.energy = 0; this.voice = 0; this.gulpE = 0; this.phase = 0; this.t = 0;
    this.speaking = false; this.fade = 1; this.running = false; this.visible = true; this.last = 0;
    this.c2 = document.createElement("canvas");
    this.c2.className = "host-2d";
    this.cgl = document.createElement("canvas");
    this.cgl.className = "host-gl";
    for (const c of [this.c2, this.cgl]) { c.setAttribute("aria-hidden", "true"); wrap.appendChild(c); }
    this.ctx = this.c2.getContext("2d");
    this.gl = null; this.U = {};
    if (opts.gl !== false) this.initGL();
    this.features = {};
    this.stars = [];
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(wrap);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; this.wake(); });
    this.io.observe(wrap);
    document.addEventListener("visibilitychange", () => this.wake());
    this.setKind("blackhole", true);
    this.wake();
  }

  initGL() {
    try {
      const g = this.cgl.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
      if (!g) return;
      const sh = (type, src) => {
        const s = g.createShader(type); g.shaderSource(s, src); g.compileShader(s);
        if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s));
        return s;
      };
      const p = g.createProgram();
      g.attachShader(p, sh(g.VERTEX_SHADER, VS)); g.attachShader(p, sh(g.FRAGMENT_SHADER, FS)); g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p));
      g.useProgram(p);
      const buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
      const loc = g.getAttribLocation(p, "a"); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
      for (const n of ["uRes", "uC", "uR", "uT", "uPh", "uE", "uDpr"]) this.U[n] = g.getUniformLocation(p, n);
      this.gl = g;
      this.cgl.addEventListener("webglcontextlost", e => { e.preventDefault(); this.gl = null; this.applyLayers(); });
    } catch (err) {
      console.warn("WebGL host unavailable, using 2D:", err.message);
      this.gl = null;
    }
  }

  resize() {
    const rc = this.wrap.getBoundingClientRect();
    this.W = Math.max(1, rc.width); this.H = Math.max(1, rc.height);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.dpr2 = dpr; this.dprGL = Math.min(dpr, 1.5);
    this.c2.width = Math.round(this.W * dpr); this.c2.height = Math.round(this.H * dpr);
    this.cgl.width = Math.round(this.W * this.dprGL); this.cgl.height = Math.round(this.H * this.dprGL);
    if (this.gl) this.gl.viewport(0, 0, this.cgl.width, this.cgl.height);
    const r = rng(7);
    this.stars = Array.from({ length: Math.round(this.W * this.H / 2400) }, () => ({ x: r() * this.W, y: r() * this.H, b: Math.pow(r(), 2.2), w: r() < 0.3, tw: r() * 6 }));
    this.draw();
  }

  applyLayers() {
    const gl = this.kind === "blackhole" && this.gl;
    this.cgl.hidden = !gl;
    this.c2.hidden = !!gl;
  }

  setKind(kind, instant = false) {
    if (!HOSTS[kind]) kind = "earth";
    if (kind === this.kind && !instant) return;
    this.kind = kind;
    this.fade = instant || reduce ? 1 : 0;
    if (!this.features[kind]) this.features[kind] = this.makeFeatures(kind);
    this.applyLayers();
    this.wake();
  }

  /** Called once per typed character. */
  speak(ch) {
    // vowels in English, Spanish, Russian and Armenian give the strongest pulse
    if (/[aeiouyáéíóúаеёиоуыэюяաեէըիոօ]/i.test(ch)) this.voice = Math.min(1.4, this.voice + 0.22);
    else if (/[\p{L}\p{N}]/u.test(ch)) this.voice = Math.min(1.4, this.voice + 0.1);
  }
  setSpeaking(on) { this.speaking = on; this.wake(); }
  gulp() { this.gulpE = Math.min(1, this.gulpE + 0.6); this.wake(); }

  wake() {
    if (this.running || document.hidden || !this.visible) return;
    this.running = true; this.last = 0;
    requestAnimationFrame(ts => this.frame(ts));
  }

  frame(ts) {
    if (document.hidden || !this.visible) { this.running = false; return; }
    const dt = Math.min(0.05, (ts - (this.last || ts)) / 1000); this.last = ts;
    const rate = reduce ? 0.15 : 1;
    this.voice *= Math.pow(0.02, dt);
    const target = this.speaking ? 0.55 + 0.55 * Math.min(1, this.voice) : (reduce ? 0.25 : 0);
    this.energy += (target - this.energy) * Math.min(1, dt * 4);
    this.gulpE *= Math.pow(0.15, dt);
    this.t += dt * rate;
    this.phase += dt * rate * (0.9 + 1.8 * this.energy + 1.5 * this.gulpE);
    this.fade = Math.min(1, this.fade + dt * 1.6);
    this.draw();
    requestAnimationFrame(t2 => this.frame(t2));
  }

  geometry() {
    const p = this.place(this.W, this.H);
    const breath = reduce ? 1 : 1 + 0.012 * Math.sin(this.t * 0.8) + 0.02 * this.energy + 0.012 * this.voice;
    const ease = 1 - Math.pow(1 - this.fade, 3);
    return { cx: p.cx, cy: p.cy, R: p.r * breath * (0.85 + 0.15 * ease), alpha: ease };
  }

  draw() {
    if (!this.W) return;
    const g = this.geometry();
    if (this.kind === "blackhole" && this.gl) return this.drawGL(g);
    const c = this.ctx;
    c.setTransform(this.dpr2, 0, 0, this.dpr2, 0, 0);
    c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
    c.fillStyle = "#000"; c.fillRect(0, 0, this.W, this.H);
    this.drawStars(c, g);
    c.globalAlpha = g.alpha;
    const k = this.kind;
    if (k === "blackhole") this.drawBlackHole2D(c, g);
    else if (k === "sun") this.drawSun(c, g);
    else if (k === "galaxy") this.drawGalaxy(c, g);
    else if (k === "exoplanet") this.drawExoplanet(c, g);
    else if (k === "comet") this.drawComet(c, g);
    else this.drawPlanet(c, g, HOSTS[k], this.features[k]);
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  }

  drawGL(g) {
    const gl = this.gl, U = this.U;
    gl.uniform2f(U.uRes, this.cgl.width, this.cgl.height);
    gl.uniform2f(U.uC, g.cx, this.H - g.cy);
    gl.uniform1f(U.uR, g.R * 0.62);
    gl.uniform1f(U.uT, this.t);
    gl.uniform1f(U.uPh, this.phase);
    gl.uniform1f(U.uE, Math.min(1.6, this.energy + this.gulpE));
    gl.uniform1f(U.uDpr, this.dprGL);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  drawStars(c) {
    for (const s of this.stars) {
      const tw = 0.8 + 0.2 * Math.sin(this.t * (1 + s.tw) + s.tw * 9);
      c.globalAlpha = Math.min(1, (0.18 + s.b * 0.8) * tw);
      c.fillStyle = s.w ? "#cfdcf2" : "#f2dcc0";
      const sz = s.b > 0.7 ? 1.6 : 1;
      c.fillRect(((s.x + this.t * 1.5) % this.W + this.W) % this.W, s.y, sz, sz);
    }
    c.globalAlpha = 1;
  }

  makeFeatures(kind) {
    const h = HOSTS[kind] || {};
    const r = rng(hashStr(kind));
    const f = { craters: [], blobs: [], clouds: [], spots: [] };
    for (let i = 0; i < (h.craters || 0); i++) f.craters.push({ lon: r() * Math.PI * 2, lat: (r() - 0.5) * 2.6, s: 0.03 + Math.pow(r(), 2) * 0.13 });
    if (h.maria) for (let i = 0; i < 7; i++) f.blobs.push({ lon: r() * Math.PI * 2, lat: (r() - 0.5) * 1.6, s: 0.12 + r() * 0.2, col: "rgba(80,76,72,.55)" });
    if (h.mars) for (let i = 0; i < 9; i++) f.blobs.push({ lon: r() * Math.PI * 2, lat: (r() - 0.5) * 1.4, s: 0.08 + r() * 0.22, col: "rgba(110,40,20,.5)" });
    if (h.earth) {
      for (let i = 0; i < 16; i++) f.blobs.push({ lon: r() * Math.PI * 2, lat: (r() - 0.5) * 2.2, s: 0.1 + r() * 0.24, col: r() < 0.6 ? "rgba(74,118,58,.95)" : "rgba(176,150,102,.95)" });
      for (let i = 0; i < 22; i++) f.clouds.push({ lon: r() * Math.PI * 2, lat: (r() - 0.5) * 2.6, s: 0.05 + r() * 0.16, w: 1.6 + r() * 2.4 });
    }
    return f;
  }

  // Projects a surface point (lon, lat) on a sphere that rotates with phase.
  proj(g, lon, lat, spin) {
    const a = lon - this.phase * spin;
    const x = Math.sin(a) * Math.cos(lat), z = Math.cos(a) * Math.cos(lat), y = Math.sin(lat);
    return { x: g.cx + x * g.R, y: g.cy - y * g.R, z, sx: Math.max(0.05, Math.abs(z)) };
  }

  drawPlanet(c, g0, h, f) {
    const g = { ...g0, R: g0.R * (h.size || 0.85) };
    const { cx, cy, R } = g;
    const E = Math.min(1.6, this.energy + this.gulpE);
    const spin = 0.35;
    // rings behind the planet
    if (h.rings) this.drawRings(c, g, false);
    if (h.thinRings) this.drawThinRings(c, g, false);
    // atmosphere glow, brighter while speaking
    const glowCol = h.earth ? "120,170,255" : h.base === "#3e62c6" ? "90,130,255" : "255,220,170";
    const ag = c.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * (1.35 + 0.25 * E));
    ag.addColorStop(0, `rgba(${glowCol},${0.18 + 0.25 * E})`); ag.addColorStop(1, `rgba(${glowCol},0)`);
    c.fillStyle = ag; c.beginPath(); c.arc(cx, cy, R * (1.35 + 0.25 * E), 0, Math.PI * 2); c.fill();

    c.save();
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    c.fillStyle = h.base; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    if (h.bands) {
      const n = h.bands.length * 2;
      for (let i = 0; i < n; i++) {
        const y0 = cy - R + (i / n) * 2 * R;
        const wob = Math.sin(this.t * 0.6 + i * 1.7) * R * 0.012;
        c.fillStyle = h.bands[i % h.bands.length];
        c.fillRect(cx - R, y0 + wob, 2 * R, 2 * R / n + 1);
      }
    }
    if (h.spot) {
      const p = this.proj(g, 1.2, -0.38, spin);
      if (p.z > 0) { c.fillStyle = h.spot; c.beginPath(); c.ellipse(p.x, p.y, R * 0.16 * p.sx, R * 0.09, 0, 0, Math.PI * 2); c.fill(); }
    }
    for (const b of f.blobs) {
      const p = this.proj(g, b.lon, b.lat, spin);
      if (p.z <= 0) continue;
      c.fillStyle = b.col; c.beginPath(); c.ellipse(p.x, p.y, R * b.s * p.sx, R * b.s * Math.cos(b.lat) * 0.9 + R * 0.02, 0, 0, Math.PI * 2); c.fill();
    }
    for (const cr of f.craters) {
      const p = this.proj(g, cr.lon, cr.lat, spin);
      if (p.z <= 0) continue;
      c.fillStyle = h.dark || "rgba(0,0,0,.3)"; c.globalAlpha = g.alpha * 0.55;
      c.beginPath(); c.ellipse(p.x, p.y, R * cr.s * p.sx, R * cr.s, 0, 0, Math.PI * 2); c.fill();
      c.strokeStyle = "rgba(255,255,255,.22)"; c.lineWidth = Math.max(0.5, R * 0.006);
      c.beginPath(); c.ellipse(p.x - R * cr.s * 0.15 * p.sx, p.y - R * cr.s * 0.15, R * cr.s * p.sx, R * cr.s, 0, Math.PI * 0.9, Math.PI * 1.7); c.stroke();
      c.globalAlpha = g.alpha;
    }
    if (h.mars) { c.fillStyle = "rgba(245,240,235,.9)"; c.beginPath(); c.ellipse(cx, cy - R * 0.97, R * 0.32, R * 0.1, 0, 0, Math.PI * 2); c.fill(); }
    for (const cl of f.clouds) {
      const p = this.proj(g, cl.lon, cl.lat, spin * 1.25);
      if (p.z <= 0) continue;
      c.fillStyle = "rgba(255,255,255,.75)";
      c.beginPath(); c.ellipse(p.x, p.y, R * cl.s * cl.w * p.sx * 0.5, R * cl.s * 0.35, 0, 0, Math.PI * 2); c.fill();
    }
    if (h.haze) { c.fillStyle = h.haze; c.globalAlpha = g.alpha * 0.35; c.fillRect(cx - R, cy - R, 2 * R, 2 * R); c.globalAlpha = g.alpha; }
    // day/night shading, light from the upper left; the lit side brightens while the host speaks
    const sg = c.createRadialGradient(cx - R * 0.45, cy - R * 0.4, R * 0.1, cx, cy, R * 1.12);
    sg.addColorStop(0, `rgba(255,250,240,${0.12 + 0.18 * E})`);
    sg.addColorStop(0.55, "rgba(0,0,0,0)");
    sg.addColorStop(0.85, "rgba(0,0,0,.55)");
    sg.addColorStop(1, "rgba(0,0,0,.9)");
    c.fillStyle = sg; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    c.restore();
    if (h.earth) { // thin blue limb
      c.strokeStyle = `rgba(140,190,255,${0.5 + 0.3 * E})`; c.lineWidth = Math.max(1, R * 0.025);
      c.beginPath(); c.arc(cx, cy, R * 1.01, Math.PI * 0.7, Math.PI * 1.75); c.stroke();
    }
    if (h.rings) this.drawRings(c, g, true);
    if (h.thinRings) this.drawThinRings(c, g, true);
    if (h.name === "Earth" && this.kind === "earth") this.drawSatellite(c, g);
  }

  drawRings(c, g, front) {
    const { cx, cy, R } = g;
    c.save();
    c.beginPath();
    if (front) c.rect(cx - R * 3, cy, R * 6, R * 3); else c.rect(cx - R * 3, cy - R * 3, R * 6, R * 3);
    c.clip();
    c.translate(cx, cy); c.rotate(-0.32); c.scale(1, 0.3);
    const bands = [[1.25, 1.52, "rgba(200,180,140,.55)"], [1.55, 1.95, "rgba(230,214,176,.85)"], [2.0, 2.05, "rgba(20,15,10,.6)"], [2.06, 2.3, "rgba(214,196,156,.7)"]];
    for (const [a, b, col] of bands) {
      c.fillStyle = col; c.beginPath(); c.arc(0, 0, R * b, 0, Math.PI * 2); c.arc(0, 0, R * a, 0, Math.PI * 2, true); c.fill("evenodd");
    }
    c.restore();
  }

  drawThinRings(c, g, front) {
    const { cx, cy, R } = g;
    c.save();
    c.beginPath();
    if (front) c.rect(cx, cy - R * 3, R * 3, R * 6); else c.rect(cx - R * 3, cy - R * 3, R * 3, R * 6);
    c.clip();
    c.translate(cx, cy); c.rotate(1.35); c.scale(1, 0.22);
    c.strokeStyle = "rgba(200,235,240,.35)"; c.lineWidth = 1;
    for (const k of [1.6, 1.75, 1.9]) { c.beginPath(); c.arc(0, 0, R * k, 0, Math.PI * 2); c.stroke(); }
    c.restore();
  }

  drawSatellite(c, g) {
    const a = this.t * 0.9;
    const x = g.cx + Math.cos(a) * g.R * 1.45, y = g.cy + Math.sin(a) * g.R * 0.35;
    if (Math.sin(a) < 0 && Math.hypot(x - g.cx, y - g.cy) < g.R) return;
    c.fillStyle = "#dfe8f5"; c.fillRect(x - 2, y - 1.5, 4, 3);
    c.fillStyle = "#6f8fc4"; c.fillRect(x - 8, y - 1, 5, 2); c.fillRect(x + 3, y - 1, 5, 2);
  }

  drawSun(c, g) {
    const { cx, cy } = g, R = g.R * 0.82, E = Math.min(1.6, this.energy + this.gulpE);
    c.globalCompositeOperation = "lighter";
    const cor = c.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * (2.6 + 0.6 * E));
    cor.addColorStop(0, `rgba(255,190,90,${0.55 + 0.25 * E})`); cor.addColorStop(0.4, "rgba(255,120,40,.18)"); cor.addColorStop(1, "rgba(255,90,20,0)");
    c.fillStyle = cor; c.beginPath(); c.arc(cx, cy, R * (2.6 + 0.6 * E), 0, Math.PI * 2); c.fill();
    // prominences / rays
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2 + this.phase * 0.05;
      const len = R * (0.18 + 0.14 * Math.sin(this.t * 1.3 + i * 2.1) + 0.12 * E);
      c.strokeStyle = "rgba(255,150,60,.35)"; c.lineWidth = R * 0.05;
      c.beginPath(); c.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      c.quadraticCurveTo(cx + Math.cos(a + 0.08) * (R + len * 1.2), cy + Math.sin(a + 0.08) * (R + len * 1.2), cx + Math.cos(a + 0.16) * R, cy + Math.sin(a + 0.16) * R);
      c.stroke();
    }
    c.globalCompositeOperation = "source-over";
    const disc = c.createRadialGradient(cx - R * 0.2, cy - R * 0.2, R * 0.1, cx, cy, R);
    disc.addColorStop(0, "#fff6d8"); disc.addColorStop(0.6, "#ffc75a"); disc.addColorStop(1, "#f07a1c");
    c.fillStyle = disc; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();
    // granulation flicker
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    const r = rng(Math.floor(this.t * 4));
    c.fillStyle = "rgba(200,90,20,.18)";
    for (let i = 0; i < 70; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R; c.beginPath(); c.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, R * 0.04, 0, Math.PI * 2); c.fill(); }
    c.restore();
  }

  drawGalaxy(c, g) {
    const { cx, cy } = g, R = g.R * 1.9, E = Math.min(1.6, this.energy + this.gulpE);
    if (!this.galaxyPts) {
      const r = rng(42); this.galaxyPts = [];
      for (let i = 0; i < 1800; i++) {
        const arm = i % 2, d = Math.pow(r(), 0.7);
        const a = arm * Math.PI + d * 5.2 + (r() - 0.5) * 0.7 * (1 - d * 0.4);
        this.galaxyPts.push({ d, a, b: r(), blue: d > 0.35 && r() < 0.45 });
      }
    }
    c.globalCompositeOperation = "lighter";
    const core = c.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
    core.addColorStop(0, `rgba(255,230,190,${0.75 + 0.2 * E})`); core.addColorStop(1, "rgba(255,200,140,0)");
    c.fillStyle = core; c.beginPath(); c.arc(cx, cy, R * 0.35, 0, Math.PI * 2); c.fill();
    const rot = this.phase * 0.06;
    for (const p of this.galaxyPts) {
      const a = p.a + rot / Math.max(0.25, p.d);
      const x = cx + Math.cos(a) * p.d * R, y = cy + Math.sin(a) * p.d * R * 0.42;
      c.fillStyle = p.blue ? `rgba(170,200,255,${0.35 + 0.4 * p.b})` : `rgba(255,220,180,${0.25 + 0.35 * p.b})`;
      c.fillRect(x, y, 1.3, 1.3);
    }
    c.globalCompositeOperation = "source-over";
  }

  drawExoplanet(c, g) {
    const { cx, cy } = g, R = g.R * 0.75, E = Math.min(1.6, this.energy + this.gulpE);
    c.globalCompositeOperation = "lighter";
    const glow = c.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 2.2);
    glow.addColorStop(0, `rgba(255,170,110,${0.45 + 0.2 * E})`); glow.addColorStop(1, "rgba(255,120,60,0)");
    c.fillStyle = glow; c.beginPath(); c.arc(cx, cy, R * 2.2, 0, Math.PI * 2); c.fill();
    c.globalCompositeOperation = "source-over";
    const disc = c.createRadialGradient(cx, cy, 0, cx, cy, R);
    disc.addColorStop(0, "#ffe7c4"); disc.addColorStop(0.75, "#ff9f5a"); disc.addColorStop(1, "#d8602a");
    c.fillStyle = disc; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();
    // a planet crossing the star: a transit, how most exoplanets are found
    const per = 9, u = ((this.t % per) / per) * 2 - 1;
    const px = cx + u * R * 1.6, py = cy + R * 0.18, pr = R * 0.14;
    c.fillStyle = "#0b0807"; c.beginPath(); c.arc(px, py, pr, 0, Math.PI * 2); c.fill();
    // light curve under the star
    const w = R * 2.4, y0 = cy + R * 1.55, x0 = cx - w / 2;
    // the curve is drawn up to "now": flat, then a dip while the planet covers part of the star
    const DIP = 7, inTransit = uu => Math.abs(uu * R * 1.6) < R - pr * 0.5;
    c.strokeStyle = "rgba(236,229,214,.55)"; c.lineWidth = 1.2; c.beginPath();
    const steps = Math.max(1, Math.round((u + 1) / 2 * 120));
    for (let i = 0; i <= steps; i++) {
      const uu = i / 120 * 2 - 1, yy = y0 + (inTransit(uu) ? DIP : 0);
      if (i === 0) c.moveTo(x0, yy); else c.lineTo(x0 + i / 120 * w, yy);
    }
    c.stroke();
    const dip = inTransit(u);
    c.fillStyle = dip ? "rgba(175,200,230,.95)" : "rgba(236,229,214,.6)";
    c.font = "11px Archivo, Arial, sans-serif";
    c.fillText(dip ? t("host.transit") : t("host.brightness"), x0, y0 + DIP + 18);
    c.beginPath(); c.arc(x0 + (u + 1) / 2 * w, y0 + (dip ? DIP : 0), 2.5, 0, Math.PI * 2); c.fill();
  }

  drawComet(c, g) {
    const { cx, cy } = g, R = g.R * 0.2, E = Math.min(1.6, this.energy + this.gulpE);
    c.globalCompositeOperation = "lighter";
    const dir = -0.35;
    for (const [col, spread, len] of [["160,200,255", 0.05, 5.2], ["255,225,170", 0.16, 3.8]]) {
      for (let i = 0; i < 40; i++) {
        const t = i / 40, a = Math.PI + dir + (Math.sin(this.t * 0.7 + i) * spread) * t;
        const L = g.R * len * t * (1 + 0.15 * E);
        c.fillStyle = `rgba(${col},${0.09 * (1 - t)})`;
        c.beginPath(); c.arc(cx + Math.cos(a) * L, cy + Math.sin(a) * L, R * (1 + t * 3), 0, Math.PI * 2); c.fill();
      }
    }
    const coma = c.createRadialGradient(cx, cy, 0, cx, cy, R * (3 + E));
    coma.addColorStop(0, "rgba(255,255,240,.95)"); coma.addColorStop(0.3, "rgba(190,230,255,.45)"); coma.addColorStop(1, "rgba(120,180,255,0)");
    c.fillStyle = coma; c.beginPath(); c.arc(cx, cy, R * (3 + E), 0, Math.PI * 2); c.fill();
    c.globalCompositeOperation = "source-over";
  }

  drawBlackHole2D(c, g) { // fallback when WebGL is unavailable
    const { cx, cy } = g, R = g.R * 0.62, E = Math.min(1.6, this.energy + this.gulpE), gain = 1 + 0.85 * E;
    c.globalCompositeOperation = "lighter";
    const hg = c.createLinearGradient(cx - 1.6 * R, 0, cx + 1.6 * R, 0);
    hg.addColorStop(0, `rgba(255,226,180,${0.75 * Math.min(1, gain / 1.4)})`); hg.addColorStop(0.5, "rgba(236,140,60,.45)"); hg.addColorStop(1, "rgba(120,30,10,.18)");
    c.strokeStyle = hg; c.lineWidth = 0.38 * R;
    c.beginPath(); c.arc(cx, cy, 1.24 * R, Math.PI * 1.02, Math.PI * 1.98); c.stroke();
    const disk = top => {
      c.save(); c.beginPath();
      if (top) c.rect(0, 0, this.W, cy); else c.rect(0, cy, this.W, this.H - cy);
      c.clip(); c.translate(cx, cy); c.scale(1, 0.19);
      const rg = c.createRadialGradient(0, 0, 1.2 * R, 0, 0, 4.7 * R);
      rg.addColorStop(0, `rgba(255,236,200,${Math.min(1, 0.9 * gain / 1.3)})`); rg.addColorStop(0.15, "rgba(245,150,60,.85)");
      rg.addColorStop(0.5, "rgba(160,50,14,.35)"); rg.addColorStop(1, "rgba(60,10,0,0)");
      c.fillStyle = rg; c.beginPath(); c.arc(0, 0, 4.7 * R, 0, Math.PI * 2); c.arc(0, 0, 1.2 * R, 0, Math.PI * 2, true); c.fill("evenodd");
      c.restore();
    };
    disk(true);
    c.globalCompositeOperation = "source-over";
    c.fillStyle = "#000"; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();
    c.globalCompositeOperation = "lighter";
    c.strokeStyle = `rgba(255,222,170,${Math.min(1, 0.7 * gain)})`; c.lineWidth = Math.max(1, R * 0.03);
    c.beginPath(); c.arc(cx, cy, R * 1.01, 0, Math.PI * 2); c.stroke();
    disk(false);
  }
}
