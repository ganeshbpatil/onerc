#!/usr/bin/env bash
# Atomic release deploy: build in a fresh release dir, flip the symlink, reload PM2.
# Usage (on the VPS, as the deploy user): ./deploy.sh <git-ref>
set -euo pipefail

APP=/var/www/one-racecourse
REPO=${REPO:-git@github.com:ganeshbpatil/onerc.git}
REF=${1:-main}
RELEASE=$APP/releases/$(date +%Y%m%d%H%M%S)
KEEP=5

mkdir -p "$APP/releases" "$APP/shared" /var/log/one-racecourse
# fetch works for branches, tags and commit SHAs alike
git init -q "$RELEASE"
git -C "$RELEASE" fetch -q --depth 1 "$REPO" "$REF"
git -C "$RELEASE" checkout -q FETCH_HEAD
ln -sfn "$APP/shared/.env.production" "$RELEASE/.env.production"

cd "$RELEASE"
npm ci --no-audit --no-fund
npm run check            # lint + typecheck + unit tests — abort before touching live
npm run build

ln -sfn "$RELEASE" "$APP/current"
pm2 startOrReload "$RELEASE/deploy/ecosystem.config.cjs" --update-env
pm2 save

# health check; roll back on failure
sleep 3
if ! curl -fsS -o /dev/null http://127.0.0.1:3000/; then
  echo "Health check failed — rolling back" >&2
  PREV=$(ls -1dt "$APP"/releases/* | sed -n 2p)
  ln -sfn "$PREV" "$APP/current"
  pm2 startOrReload "$PREV/deploy/ecosystem.config.cjs" --update-env
  exit 1
fi

ls -1dt "$APP"/releases/* | tail -n +$((KEEP + 1)) | xargs -r rm -rf
echo "Deployed $REF → $RELEASE"
