import { api, bus, refreshMe, state, tg, toast } from "./api.js";
import { Today } from "./today.js";
import { News } from "./news.js";
import { Planets } from "./planets.js";
import { Learn } from "./learn.js";
import { applyStatic, fmtDate, lang, LANG_NAMES, LANGS, onLang, setLang, t } from "./i18n.js";

if (tg) {
  document.body.classList.add("tg");
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor("#000000"); tg.setBackgroundColor("#000000"); } catch { /* older clients */ }
}

const views = {};
let current = "";

function route() {
  const [name, sub] = (location.hash.replace("#", "") || "today").split("/");
  const key = ["today", "news", "planets", "learn", "pro"].includes(name) ? name : "today";
  if (key === "pro" && document.documentElement.classList.contains("twa")) { location.replace("#today"); return; }
  document.querySelectorAll(".view").forEach(v => { v.hidden = v.dataset.view !== key; });
  document.querySelectorAll(".tabs a").forEach(a => a.setAttribute("aria-current", a.dataset.tab === key ? "page" : "false"));
  if (current !== key) {
    views[current]?.hide?.();
    current = key;
    views[key]?.show?.(sub);
    window.scrollTo({ top: 0 });
  } else {
    views[key]?.show?.(sub);
  }
  if (tg) {
    if (key === "learn" && sub) { tg.BackButton.show(); } else { tg.BackButton.hide(); }
  }
}

// ---------- Pro view ----------
const Pro = {
  init() {
    document.getElementById("buy").addEventListener("click", () => this.buy());
    bus.addEventListener("me", () => this.render());
    this.render();
  },
  render() {
    document.getElementById("price-line").innerHTML = t("pro.price", { price: state.price });
    const status = document.getElementById("pro-status"), buy = document.getElementById("pro-buy");
    if (state.pro) {
      const d = fmtDate(state.proUntil * 1000, { day: "numeric", month: "long", year: "numeric" });
      status.textContent = t("pro.active", { date: d });
      status.hidden = false; buy.hidden = true;
    } else {
      status.hidden = true; buy.hidden = false;
      document.getElementById("pro-hint").textContent = tg ? t("pro.hintTg") : t("pro.hintWeb");
    }
    document.querySelector(".pro-tab span").textContent = state.pro ? t("pro.tab") : t("nav.pro");
  },
  async buy() {
    const btn = document.getElementById("buy");
    if (!tg) {
      const bot = state.bot || "";
      if (!bot) return toast(t("toast.noBot"));
      window.open(`https://t.me/${bot}?start=pro`, "_blank", "noopener");
      return;
    }
    btn.disabled = true;
    try {
      const { link } = await api.invoice();
      tg.openInvoice(link, async status => {
        if (status === "paid") {
          toast(t("toast.paid"));
          // the bot records the payment a moment later
          for (let i = 0; i < 6 && !state.pro; i++) { await new Promise(r => setTimeout(r, 1200)); await refreshMe(); }
        } else if (status === "failed") toast(t("toast.failed"));
      });
    } catch (e) {
      toast(e.status === 401 ? t("toast.openBot") : t("toast.payErr"));
    } finally { btn.disabled = false; }
  },
};

function langSwitcher() {
  const sel = document.getElementById("lang-select");
  sel.innerHTML = LANGS.map(l => `<option value="${l}">${LANG_NAMES[l]}</option>`).join("");
  sel.value = lang;
  sel.addEventListener("change", () => setLang(sel.value));
  onLang(l => {
    sel.value = l;
    for (const v of Object.values(views)) v.relang?.();
    Pro.render();
  });
}

async function boot() {
  applyStatic();
  langSwitcher();
  try { const c = await api.config(); state.bot = c.bot; state.price = c.price; } catch { /* server offline */ }
  views.today = new Today();
  views.news = new News(item => { views.today.present(item); location.hash = "#today"; });
  views.planets = new Planets();
  views.learn = new Learn();
  views.pro = Pro;
  Pro.init();
  if (tg) tg.BackButton.onClick(() => { location.hash = "#learn"; });
  addEventListener("hashchange", route);
  route();
  await refreshMe();
}
boot();
