"""Entry point: one process runs the website, the API, the news refresher and the Telegram bot.

    python -m server.main
"""
import asyncio
import logging

import aiohttp
from aiohttp import web

from . import config, db
from .bot import build, digest_loop
from .news import cache
from .webapi import build_app

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
log = logging.getLogger("main")


async def main():
    await db.connect()
    bot, dp = build() if config.BOT_TOKEN else (None, None)
    session = aiohttp.ClientSession(headers={"User-Agent": "EventHorizon/1.0"})
    tasks = [asyncio.create_task(cache.run(session))]

    runner = web.AppRunner(build_app(bot))
    await runner.setup()
    await web.TCPSite(runner, "0.0.0.0", config.PORT).start()
    log.info("web on :%s", config.PORT)

    if config.BOT_TOKEN:
        me = await bot.get_me()
        if not config.BOT_USERNAME:
            config.BOT_USERNAME = me.username
        if config.PUBLIC_URL.startswith("https://"):
            from aiogram.types import MenuButtonWebApp, WebAppInfo
            await bot.set_chat_menu_button(menu_button=MenuButtonWebApp(
                text="Open", web_app=WebAppInfo(url=config.PUBLIC_URL + "/")))
        tasks.append(asyncio.create_task(digest_loop(bot)))
        tasks.append(asyncio.create_task(dp.start_polling(bot, handle_signals=False)))
        log.info("bot @%s polling", me.username)
    else:
        log.warning("BOT_TOKEN is not set: running the website only")

    try:
        await asyncio.Event().wait()
    finally:
        for t in tasks:
            t.cancel()
        await runner.cleanup()
        await session.close()
        if bot:
            await bot.session.close()
        await db.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
