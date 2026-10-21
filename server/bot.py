"""Telegram bot: news, tonight's sky, Mini App button, and Pro via Telegram Stars subscription."""
import asyncio
import calendar
import html
import logging
import time

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import Command, CommandObject, CommandStart
from aiogram.types import (CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice, Message,
                           PreCheckoutQuery, WebAppInfo)

from . import config, db, sky
from .news import cache

log = logging.getLogger("bot")
router = Router()

HOST_EMOJI = {"blackhole": "🕳", "sun": "☀️", "moon": "🌙", "mercury": "☿", "venus": "♀", "earth": "🌍",
              "mars": "🔴", "jupiter": "🟠", "saturn": "🪐", "uranus": "🔵", "neptune": "🔷",
              "galaxy": "🌌", "exoplanet": "🌐", "comet": "☄️"}
PAYLOAD = "pro-30d"


def app_url(path: str = "") -> str:
    return f"{config.PUBLIC_URL}/{path}" if config.PUBLIC_URL else ""


def main_kb(pro: bool) -> InlineKeyboardMarkup:
    rows = []
    if config.PUBLIC_URL.startswith("https://"):
        rows.append([InlineKeyboardButton(text="🕳 Open Event Horizon", web_app=WebAppInfo(url=app_url()))])
    rows.append([InlineKeyboardButton(text="📰 Latest news", callback_data="news"),
                 InlineKeyboardButton(text="🔭 Tonight's sky", callback_data="sky")])
    if not pro:
        rows.append([InlineKeyboardButton(text=f"⭐ Get Pro · {config.PRO_PRICE_STARS} Stars / month",
                                          callback_data="pro")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def fmt_item(i: dict) -> str:
    e = HOST_EMOJI.get(i["host"], "✨")
    summ = i["summary"]
    if len(summ) > 260:
        summ = summ[:257].rsplit(" ", 1)[0] + "…"
    return (f"{e} <b>{html.escape(i['title'])}</b>\n{html.escape(summ)}\n"
            f"<a href=\"{html.escape(i['url'] or '')}\">{html.escape(i['site'] or 'Source')}</a>")


def news_text(n: int) -> str:
    items = cache.latest(n)
    if not items:
        return "News is loading. Try again in a minute."
    return "\n\n".join(fmt_item(i) for i in items) + "\n\n<i>News via Spaceflight News API</i>"


async def make_invoice_link(bot: Bot) -> str:
    return await bot.create_invoice_link(
        title="Event Horizon Pro",
        description="Daily space digest in Telegram, the full news archive and every Pro lesson. "
                    "Renews every 30 days; cancel any time in Telegram.",
        payload=PAYLOAD,
        currency="XTR",
        prices=[LabeledPrice(label="Pro, 30 days", amount=config.PRO_PRICE_STARS)],
        subscription_period=config.SUBSCRIPTION_SECONDS,
    )


@router.message(CommandStart())
async def start(m: Message, command: CommandObject, bot: Bot):
    u = m.from_user
    await db.upsert_user(u.id, u.username, u.first_name, u.language_code)
    if command.args == "pro":
        await send_pro_offer(m, bot)
        return
    pro = await db.is_pro(u.id)
    await m.answer(
        "🕳 <b>Event Horizon</b>\nAstronomy explained by a black hole.\n\n"
        "• /news: the latest space news\n• /sky: which planets you can see tonight\n"
        "• /pro: Pro subscription\n• /status: your plan\n• /digest: daily digest on or off\n"
        "• /paysupport: help with payments",
        reply_markup=main_kb(pro),
    )


@router.message(Command("news"))
async def cmd_news(m: Message):
    n = 5 if await db.is_pro(m.from_user.id) else 3
    await m.answer(news_text(n), disable_web_page_preview=True)


@router.message(Command("sky"))
async def cmd_sky(m: Message):
    await m.answer("🔭 <b>Tonight's sky</b>\n\n" + sky.tonight_text())


@router.callback_query(F.data == "news")
async def cb_news(c: CallbackQuery):
    n = 5 if await db.is_pro(c.from_user.id) else 3
    await c.message.answer(news_text(n), disable_web_page_preview=True)
    await c.answer()


@router.callback_query(F.data == "sky")
async def cb_sky(c: CallbackQuery):
    await c.message.answer("🔭 <b>Tonight's sky</b>\n\n" + sky.tonight_text())
    await c.answer()


async def send_pro_offer(m: Message, bot: Bot):
    if await db.is_pro(m.chat.id):
        until = time.strftime("%d %b %Y", time.gmtime(await db.pro_until(m.chat.id)))
        await m.answer(f"⭐ You already have Pro until {until}.")
        return
    link = await make_invoice_link(bot)
    kb = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(
        text=f"⭐ Subscribe for {config.PRO_PRICE_STARS} Stars / month", url=link)]])
    await m.answer(
        "⭐ <b>Event Horizon Pro</b>\n\n"
        "• A morning digest of the day's space news, presented by the right host\n"
        "• The full news archive on the site\n"
        "• All Pro lessons: Kepler's laws, the true scale of the Solar System\n\n"
        "Paid with Telegram Stars. Renews every 30 days, cancel any time.\n"
        "By paying you accept the /terms.",
        reply_markup=kb,
    )


@router.message(Command("pro"))
async def cmd_pro(m: Message, bot: Bot):
    await db.upsert_user(m.from_user.id, m.from_user.username, m.from_user.first_name, m.from_user.language_code)
    await send_pro_offer(m, bot)


@router.callback_query(F.data == "pro")
async def cb_pro(c: CallbackQuery, bot: Bot):
    await send_pro_offer(c.message, bot)
    await c.answer()


@router.pre_checkout_query()
async def pre_checkout(q: PreCheckoutQuery):
    ok = q.invoice_payload == PAYLOAD and q.currency == "XTR"
    await q.answer(ok=ok, error_message=None if ok else "This invoice is no longer valid. Send /pro for a new one.")


@router.message(F.successful_payment)
async def paid(m: Message):
    sp = m.successful_payment
    u = m.from_user
    await db.upsert_user(u.id, u.username, u.first_name, u.language_code)
    expires = sp.subscription_expiration_date or int(time.time()) + config.SUBSCRIPTION_SECONDS
    fresh = await db.add_payment(sp.telegram_payment_charge_id, u.id, sp.total_amount,
                                 bool(sp.is_recurring), expires)
    if not fresh:
        return
    until = time.strftime("%d %b %Y", time.gmtime(expires))
    if sp.is_recurring and not sp.is_first_recurring:
        await m.answer(f"⭐ Pro renewed until {until}. Thank you!")
    else:
        await m.answer(f"🕳 Welcome to Pro! Active until {until}.\n"
                       "Your first digest arrives tomorrow morning. Pro lessons are open in the app.",
                       reply_markup=main_kb(True))


@router.message(Command("status"))
async def cmd_status(m: Message):
    until = await db.pro_until(m.from_user.id)
    if until > time.time():
        u = await db.get_user(m.from_user.id)
        d = "on" if u["digest"] else "off"
        await m.answer(f"⭐ Pro until {time.strftime('%d %b %Y', time.gmtime(until))}. Daily digest: {d}.\n"
                       "Manage or cancel the subscription in Telegram Settings → My Stars.")
    else:
        await m.answer("You are on the free plan. /pro to upgrade.")


@router.message(Command("digest"))
async def cmd_digest(m: Message):
    u = await db.get_user(m.from_user.id)
    if not u or u["pro_until"] <= time.time():
        await m.answer("The daily digest is part of Pro. /pro")
        return
    await db.set_digest(m.from_user.id, not u["digest"])
    await m.answer("Daily digest " + ("on ✅" if not u["digest"] else "off"))


@router.message(Command("paysupport"))
async def cmd_paysupport(m: Message):
    await m.answer("Payment problem? Describe it in one message starting with /paysupport and include the date "
                   "of the payment. We answer within 48 hours.")
    if m.text and len(m.text.split(maxsplit=1)) > 1:
        for admin in config.ADMIN_IDS:
            await m.bot.send_message(admin, f"💬 paysupport from {m.from_user.id} (@{m.from_user.username}):\n"
                                            f"{html.escape(m.text)}")


@router.message(Command("terms"))
async def cmd_terms(m: Message):
    await m.answer(
        "<b>Terms</b>\nEvent Horizon Pro is a digital subscription paid in Telegram Stars. It renews every 30 days "
        "until you cancel in Telegram. Content is educational. News summaries belong to their publishers and link "
        "to the original article. Refund requests: write /paysupport within 14 days of a payment; each request is reviewed.")


# ---------- admin ----------
@router.message(Command("stats"), F.from_user.id.in_(config.ADMIN_IDS))
async def cmd_stats(m: Message):
    s = await db.stats()
    await m.answer(f"Users: {s['users']}\nPro now: {s['pro']}\nStars received: {s['stars_total']}")


@router.message(Command("refund"), F.from_user.id.in_(config.ADMIN_IDS))
async def cmd_refund(m: Message, command: CommandObject, bot: Bot):
    charge = (command.args or "").strip()
    p = await db.get_payment(charge) if charge else None
    if not p:
        await m.answer("Usage: /refund <telegram_payment_charge_id>")
        return
    await bot.refund_star_payment(user_id=p["user_id"], telegram_payment_charge_id=charge)
    await db.mark_refunded(charge, p["user_id"])
    await m.answer(f"Refunded {p['amount']} Stars to {p['user_id']}.")


# ---------- daily digest ----------
async def digest_loop(bot: Bot):
    sent_day = ""
    while True:
        now = time.gmtime()
        day = time.strftime("%Y-%m-%d", now)
        if now.tm_hour >= config.DIGEST_HOUR_UTC and sent_day != day and cache.items:
            sent_day = day
            since = time.time() - 86400
            fresh = [i for i in cache.items if _ts(i["published"]) >= since][:6] or cache.latest(4)
            text = (f"🕳 <b>Your space morning, {time.strftime('%d %b', now)}</b>\n\n"
                    + "\n\n".join(fmt_item(i) for i in fresh)
                    + "\n\n🔭 <b>Tonight</b>\n" + sky.tonight_text())
            for uid in await db.digest_recipients():
                try:
                    await bot.send_message(uid, text, disable_web_page_preview=True)
                except Exception as e:
                    log.info("digest to %s failed: %s", uid, e)
                await asyncio.sleep(0.05)  # stay under Telegram's broadcast limit
        await asyncio.sleep(300)


def _ts(iso: str | None) -> float:
    if not iso:
        return 0
    try:
        return calendar.timegm(time.strptime(iso[:19], "%Y-%m-%dT%H:%M:%S"))
    except ValueError:
        return 0


def build() -> tuple[Bot, Dispatcher]:
    from aiogram.client.default import DefaultBotProperties
    from aiogram.enums import ParseMode
    bot = Bot(config.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()
    dp.include_router(router)
    return bot, dp
