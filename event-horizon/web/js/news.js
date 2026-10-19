import { api, bus, state, timeAgo } from "./api.js";
import { HOSTS } from "./host.js";
import { lang, t } from "./i18n.js";

const $ = id => document.getElementById(id);
const PAGE = 12;
const FILTERS = ["", "blackhole", "sun", "moon", "mars", "jupiter", "saturn", "galaxy", "exoplanet", "comet", "earth"];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export class News {
  constructor(onPresent) {
    this.onPresent = onPresent;
    this.host = ""; this.offset = 0; this.loaded = false; this.busy = false;
    const chips = $("chips");
    for (const key of FILTERS) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = t("f." + (key || "all")); b.dataset.host = key;
      b.setAttribute("aria-pressed", key === "" ? "true" : "false");
      b.addEventListener("click", () => this.filter(key));
      chips.appendChild(b);
    }
    bus.addEventListener("me", () => { if (this.loaded) this.reload(); });
  }

  show() { if (!this.loaded) this.reload(); }
  relang() {
    [...$("chips").children].forEach(c => { c.textContent = t("f." + (c.dataset.host || "all")); });
    if (this.loaded) this.reload();
  }
  hide() {}

  filter(key) {
    this.host = key;
    [...$("chips").children].forEach(c => c.setAttribute("aria-pressed", c.dataset.host === key ? "true" : "false"));
    this.reload();
  }

  reload() {
    this.offset = 0; this.loaded = true;
    $("feed").innerHTML = '<li class="skeleton"></li><li class="skeleton"></li><li class="skeleton"></li>';
    $("feed-foot").innerHTML = "";
    this.more(true);
  }

  async more(fresh = false) {
    if (this.busy) return;
    this.busy = true;
    const foot = $("feed-foot");
    try {
      const res = await api.news({ limit: PAGE, offset: this.offset, host: this.host });
      if (fresh) $("feed").innerHTML = "";
      res.items.forEach(it => $("feed").appendChild(this.card(it)));
      this.offset += res.items.length;
      foot.innerHTML = "";
      if (!this.offset) foot.innerHTML = `<p class="fine">${t("news.empty")}</p>`;
      if (res.locked) foot.appendChild(this.lockedBox());
      else if (res.items.length === PAGE) {
        const b = document.createElement("button");
        b.className = "btn"; b.type = "button"; b.textContent = t("news.more");
        b.addEventListener("click", () => this.more());
        foot.appendChild(b);
      }
    } catch {
      if (fresh) $("feed").innerHTML = "";
      foot.innerHTML = `<p class="fine">${t("news.offline")}</p>`;
      const b = document.createElement("button");
      b.className = "btn"; b.type = "button"; b.textContent = t("news.retry");
      b.addEventListener("click", () => this.reload());
      foot.appendChild(b);
    } finally { this.busy = false; }
  }

  card(it) {
    const li = document.createElement("li");
    li.className = "card";
    const name = t("host." + (HOSTS[it.host] ? it.host : "earth"));
    const label = t("news.toldBy", { name: lang === "en" ? name.replace(/^(The|A|An) /, m => m.toLowerCase()) : name });
    li.innerHTML = `<button type="button">
      ${it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ""}
      <span class="body"><span class="tag">${esc(label)}</span>
      <h3>${esc(it.title)}</h3><span class="src">${esc(it.site || "")} · ${esc(timeAgo(it.published))}</span></span></button>`;
    li.querySelector("button").addEventListener("click", () => this.onPresent(it));
    const img = li.querySelector("img");
    if (img) img.addEventListener("error", () => img.remove());
    return li;
  }

  lockedBox() {
    const d = document.createElement("div");
    d.className = "locked";
    d.innerHTML = `<p>${t("news.locked")}</p>
      <a class="btn primary" href="#pro">${esc(t("news.seePro", { price: state.price }))}</a>`;
    return d;
  }
}
