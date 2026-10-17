#!/usr/bin/env bash
# One-time setup on a fresh Ubuntu server. Run from the project folder:  bash deploy/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null; then
  echo "Installing Docker…"
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER" || true
fi

# Open ports 80/443 in the server firewall (Oracle images block them by default)
if command -v iptables >/dev/null; then
  sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
  sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
  command -v netfilter-persistent >/dev/null && sudo netfilter-persistent save || true
fi

IP=$(curl -fsS https://api.ipify.org)
DOMAIN="${DOMAIN:-${IP//./-}.sslip.io}"   # free domain that points to this server's IP

if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s#^PUBLIC_URL=.*#PUBLIC_URL=https://$DOMAIN#" .env
  sed -i "s#^DB_PATH=.*#DB_PATH=/data/event_horizon.db#" .env
  chmod 600 .env
  echo
  echo "Created .env (readable only by you). Fill in BOT_TOKEN, BOT_USERNAME, ADMIN_IDS, NASA_API_KEY:"
  echo "   nano .env"
  echo "Then run this script again."
  exit 0
fi

grep -qE '^BOT_TOKEN=\s*$' .env && { echo "Put your real BOT_TOKEN into .env first (nano .env)."; exit 1; }

cd deploy
DOMAIN="$DOMAIN" sudo -E docker compose up -d --build
echo
echo "Done. Site and Mini App: https://$DOMAIN"
echo "Health check:            https://$DOMAIN/health"
echo "Logs:                    cd deploy && sudo docker compose logs -f app"
