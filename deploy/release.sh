#!/usr/bin/env bash
# Builds a new release from SOURCE_DIR, switches traffic atomically, rolls back on failure.
# Runs as the app user. Usage: deploy/release.sh [SOURCE_DIR]   (default: the folder this script is in/..)
set -euo pipefail

APP_DIR=${APP_DIR:-/var/www/one-racecourse}
PORT=${PORT:-3000}
SOURCE_DIR=${1:-$(cd "$(dirname "$0")/.." && pwd)}
RELEASE="$APP_DIR/releases/$(date +%Y%m%d%H%M%S)"
KEEP=${KEEP:-4}
log() { printf '\033[1;32m▸ %s\033[0m\n' "$*"; }

[ -f "$APP_DIR/shared/.env.production" ] || { echo "Missing $APP_DIR/shared/.env.production — run deploy/install.sh first" >&2; exit 1; }
mkdir -p "$APP_DIR/releases" "$APP_DIR/shared/images" "$APP_DIR/shared/private" "$APP_DIR/logs"

log "Copying source → $RELEASE"
mkdir -p "$RELEASE"
tar -C "$SOURCE_DIR" --exclude=node_modules --exclude=.next --exclude=.git --exclude='*.tar.gz' -cf - . | tar -C "$RELEASE" -xf -

# Shared, persistent assets (downloaded once, reused by every release)
rm -rf "$RELEASE/public/images" "$RELEASE/private"
ln -sfn "$APP_DIR/shared/images" "$RELEASE/public/images"
ln -sfn "$APP_DIR/shared/private" "$RELEASE/private"
ln -sfn "$APP_DIR/shared/.env.production" "$RELEASE/.env.production"

cd "$RELEASE"
log "Installing dependencies"
npm ci --no-audit --no-fund --loglevel=error
log "Downloading images + brochure from the reference sites (kept between releases)"
node scripts/fetch-assets.mjs
log "Building (TypeScript is checked during next build)"
NODE_OPTIONS="--max-old-space-size=${BUILD_MEMORY_MB:-2048}" ASSETS_OFFLINE=1 npm run build

PREV=$(readlink -f "$APP_DIR/current" 2>/dev/null || true)
ln -sfn "$RELEASE" "$APP_DIR/current"
log "Starting / reloading PM2"
APP_DIR="$APP_DIR" PORT="$PORT" pm2 startOrReload "$RELEASE/deploy/ecosystem.config.cjs" --update-env
pm2 save >/dev/null

log "Health check"
ok=0
for _ in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/"; then ok=1; break; fi
  sleep 2
done
if [ "$ok" != 1 ]; then
  echo "✗ Health check failed — see $APP_DIR/logs/error.log" >&2
  if [ -n "$PREV" ] && [ -d "$PREV" ]; then
    ln -sfn "$PREV" "$APP_DIR/current"
    APP_DIR="$APP_DIR" PORT="$PORT" pm2 startOrReload "$PREV/deploy/ecosystem.config.cjs" --update-env
    echo "↺ Rolled back to $PREV" >&2
  fi
  exit 1
fi

ls -1dt "$APP_DIR"/releases/* | tail -n +$((KEEP + 1)) | xargs -r rm -rf
log "Live: release $(basename "$RELEASE") · images: $(ls "$APP_DIR/shared/images" | wc -l) · brochure: $([ -f "$APP_DIR/shared/private/One-Racecourse-Brochure.pdf" ] && echo yes || echo NO)"
