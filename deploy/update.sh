#!/usr/bin/env bash
# Pull the latest code and restart. Run from the project folder:  bash deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --ff-only
IP=$(curl -fsS https://api.ipify.org)
cd deploy && DOMAIN="${DOMAIN:-${IP//./-}.sslip.io}" sudo -E docker compose up -d --build
