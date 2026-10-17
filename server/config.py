"""All settings come from environment variables (see .env.example)."""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
BOT_USERNAME = os.environ.get("BOT_USERNAME", "")          # without @
PUBLIC_URL = os.environ.get("PUBLIC_URL", "").rstrip("/")  # https://your-app.up.railway.app
ADMIN_IDS = {int(x) for x in os.environ.get("ADMIN_IDS", "").replace(" ", "").split(",") if x}
NASA_API_KEY = os.environ.get("NASA_API_KEY", "DEMO_KEY")
PRO_PRICE_STARS = int(os.environ.get("PRO_PRICE_STARS", "150"))
DIGEST_HOUR_UTC = int(os.environ.get("DIGEST_HOUR_UTC", "6"))
DB_PATH = os.environ.get("DB_PATH", str(ROOT / "data" / "event_horizon.db"))
PORT = int(os.environ.get("PORT", "8080"))
WEB_DIR = ROOT / "web"
PRO_LESSONS_DIR = ROOT / "pro_lessons"

SUBSCRIPTION_SECONDS = 2592000  # Telegram allows only 30 days for Stars subscriptions
