"""SQLite storage for users and payments. One file; on Railway mount a volume at /data."""
import time
from pathlib import Path

import aiosqlite

from . import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  lang TEXT,
  pro_until INTEGER NOT NULL DEFAULT 0,
  digest INTEGER NOT NULL DEFAULT 1,
  created INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payments (
  charge_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  is_recurring INTEGER NOT NULL DEFAULT 0,
  expires INTEGER NOT NULL,
  refunded INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
"""

_db: aiosqlite.Connection | None = None


async def connect() -> aiosqlite.Connection:
    global _db
    Path(config.DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    _db = await aiosqlite.connect(config.DB_PATH)
    _db.row_factory = aiosqlite.Row
    await _db.executescript(SCHEMA)
    await _db.commit()
    return _db


async def close():
    if _db:
        await _db.close()


async def upsert_user(uid: int, username: str | None, first_name: str | None, lang: str | None):
    await _db.execute(
        """INSERT INTO users (id, username, first_name, lang, created) VALUES (?,?,?,?,?)
           ON CONFLICT(id) DO UPDATE SET username=excluded.username, first_name=excluded.first_name,
           lang=excluded.lang""",
        (uid, username, first_name, lang, int(time.time())),
    )
    await _db.commit()


async def get_user(uid: int):
    async with _db.execute("SELECT * FROM users WHERE id=?", (uid,)) as cur:
        return await cur.fetchone()


async def is_pro(uid: int) -> bool:
    u = await get_user(uid)
    return bool(u and u["pro_until"] > time.time())


async def pro_until(uid: int) -> int:
    u = await get_user(uid)
    return u["pro_until"] if u else 0


async def add_payment(charge_id: str, uid: int, amount: int, recurring: bool, expires: int) -> bool:
    """Returns False if this charge was already recorded (Telegram can resend updates)."""
    try:
        await _db.execute(
            "INSERT INTO payments (charge_id, user_id, amount, is_recurring, expires, created) VALUES (?,?,?,?,?,?)",
            (charge_id, uid, amount, int(recurring), expires, int(time.time())),
        )
    except aiosqlite.IntegrityError:
        return False
    await _db.execute("INSERT OR IGNORE INTO users (id, created) VALUES (?, ?)", (uid, int(time.time())))
    await _db.execute("UPDATE users SET pro_until=MAX(pro_until, ?) WHERE id=?", (expires, uid))
    await _db.commit()
    return True


async def get_payment(charge_id: str):
    async with _db.execute("SELECT * FROM payments WHERE charge_id=?", (charge_id,)) as cur:
        return await cur.fetchone()


async def mark_refunded(charge_id: str, uid: int):
    await _db.execute("UPDATE payments SET refunded=1 WHERE charge_id=?", (charge_id,))
    await _db.execute("UPDATE users SET pro_until=0 WHERE id=?", (uid,))
    await _db.commit()


async def set_digest(uid: int, on: bool):
    await _db.execute("UPDATE users SET digest=? WHERE id=?", (int(on), uid))
    await _db.commit()


async def digest_recipients() -> list[int]:
    async with _db.execute(
        "SELECT id FROM users WHERE pro_until>? AND digest=1", (int(time.time()),)
    ) as cur:
        return [r["id"] for r in await cur.fetchall()]


async def stats() -> dict:
    now = int(time.time())
    out = {}
    for key, q, args in [
        ("users", "SELECT COUNT(*) FROM users", ()),
        ("pro", "SELECT COUNT(*) FROM users WHERE pro_until>?", (now,)),
        ("stars_total", "SELECT COALESCE(SUM(amount),0) FROM payments WHERE refunded=0", ()),
    ]:
        async with _db.execute(q, args) as cur:
            out[key] = (await cur.fetchone())[0]
    return out
