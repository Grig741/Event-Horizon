"""HTTP side: serves the site and a small JSON API.

Identity comes only from Telegram Mini App initData (signed by Telegram with the bot token),
sent in the X-Telegram-Init-Data header. Pro content is checked here, never only in the browser.
"""
import re
import time

from aiogram import Bot
from aiogram.utils.web_app import safe_parse_webapp_init_data
from aiohttp import web

from . import config, db
from .bot import make_invoice_link
from .news import cache

FREE_NEWS_DEPTH = 24
MAX_INIT_AGE = 24 * 3600
LESSON_RX = re.compile(r"^[a-z0-9-]{1,40}$")


def tg_user(request: web.Request):
    raw = request.headers.get("X-Telegram-Init-Data", "")
    if not raw or not config.BOT_TOKEN:
        return None
    try:
        data = safe_parse_webapp_init_data(config.BOT_TOKEN, raw)
    except ValueError:
        return None
    if time.time() - data.auth_date.timestamp() > MAX_INIT_AGE:
        return None
    return data.user


async def viewer_is_pro(request: web.Request) -> bool:
    u = tg_user(request)
    return bool(u and await db.is_pro(u.id))


async def api_config(request: web.Request):
    return web.json_response({"bot": config.BOT_USERNAME, "price": config.PRO_PRICE_STARS})


async def api_news(request: web.Request):
    try:
        limit = max(1, min(30, int(request.query.get("limit", 12))))
        offset = max(0, int(request.query.get("offset", 0)))
    except ValueError:
        raise web.HTTPBadRequest(text="limit and offset must be numbers")
    host = request.query.get("host") or None
    pro = await viewer_is_pro(request)
    locked = False
    if not pro and offset + limit > FREE_NEWS_DEPTH:
        limit = max(0, FREE_NEWS_DEPTH - offset)
        locked = True
    items = cache.latest(limit, offset, host) if limit else []
    return web.json_response({"items": items, "updated": cache.updated, "locked": locked, "pro": pro},
                             headers={"Cache-Control": "no-store"})


async def api_apod(request: web.Request):
    if not cache.apod:
        raise web.HTTPServiceUnavailable(text="Picture of the day is loading")
    return web.json_response(cache.apod, headers={"Cache-Control": "public, max-age=600"})


async def api_me(request: web.Request):
    u = tg_user(request)
    if not u:
        return web.json_response({"user": None, "pro": False, "price": config.PRO_PRICE_STARS})
    await db.upsert_user(u.id, u.username, u.first_name, u.language_code)
    until = await db.pro_until(u.id)
    return web.json_response({"user": {"id": u.id, "first_name": u.first_name},
                              "pro": until > time.time(), "pro_until": until, "price": config.PRO_PRICE_STARS},
                             headers={"Cache-Control": "no-store"})


async def api_invoice(request: web.Request):
    u = tg_user(request)
    if not u:
        raise web.HTTPUnauthorized(text="Open the app inside Telegram to subscribe")
    bot: Bot = request.app["bot"]
    if bot is None:
        raise web.HTTPServiceUnavailable(text="Payments are not configured")
    return web.json_response({"link": await make_invoice_link(bot)})


async def api_lesson(request: web.Request):
    name = request.match_info["name"]
    if not LESSON_RX.match(name):
        raise web.HTTPNotFound()
    path = config.PRO_LESSONS_DIR / f"{name}.js"
    if not path.is_file():
        raise web.HTTPNotFound()
    if not await viewer_is_pro(request):
        raise web.HTTPPaymentRequired(text="Pro lesson")
    return web.Response(text=path.read_text("utf-8"), content_type="text/javascript",
                        headers={"Cache-Control": "private, no-store"})


async def index(request: web.Request):
    return web.FileResponse(config.WEB_DIR / "index.html", headers={"Cache-Control": "no-cache"})


async def health(request: web.Request):
    return web.json_response({"ok": True, "news": len(cache.items)})


@web.middleware
async def security_headers(request, handler):
    resp = await handler(request)
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return resp


def build_app(bot: Bot) -> web.Application:
    app = web.Application(middlewares=[security_headers])
    app["bot"] = bot
    app.router.add_get("/", index)
    app.router.add_get("/health", health)
    app.router.add_get("/api/config", api_config)
    app.router.add_get("/api/news", api_news)
    app.router.add_get("/api/apod", api_apod)
    app.router.add_post("/api/me", api_me)
    app.router.add_post("/api/invoice", api_invoice)
    app.router.add_get("/api/lesson/{name}.js", api_lesson)
    app.router.add_static("/", config.WEB_DIR, show_index=False)
    return app
