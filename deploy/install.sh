#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# One Racecourse — one-command server install (Ubuntu 22.04/24.04, Debian 12,
# AlmaLinux/Rocky 8–9). Run as root from the unpacked project folder:
#
#   sudo DOMAIN=oneracecourse.com EMAIL=it@skyi.com bash deploy/install.sh
#
# Safe to re-run: the second run just ships a new release of the code.
# Env options: DOMAIN (required) · EMAIL (enables Let's Encrypt SSL) · WWW=1|0
#              SSL=letsencrypt|none · PORT=3000 · APP_USER=oneracecourse
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN=${DOMAIN:-}
EMAIL=${EMAIL:-}
WWW=${WWW:-1}
SSL=${SSL:-$([ -n "$EMAIL" ] && echo letsencrypt || echo none)}
PORT=${PORT:-3000}
APP_USER=${APP_USER:-oneracecourse}
APP_DIR=${APP_DIR:-/var/www/one-racecourse}
SRC_DIR=$(cd "$(dirname "$0")/.." && pwd)

say()  { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" = 0 ] || die "Run as root (sudo)."
[ -n "$DOMAIN" ] || die "Set DOMAIN, e.g. sudo DOMAIN=oneracecourse.com EMAIL=you@skyi.com bash deploy/install.sh"
DOMAIN=${DOMAIN#http://}; DOMAIN=${DOMAIN#https://}; DOMAIN=${DOMAIN%/}

if [ -d /usr/local/cpanel ] && [ "${FORCE:-0}" != 1 ]; then
  cat <<MSG
This server runs cPanel/WHM (Apache owns ports 80/443), so this script will not install NGINX.
Use the cPanel route in docs/05-deployment.md ("cPanel / Setup Node.js App"), or re-run with FORCE=1
only if you know Apache is not serving this domain.
MSG
  exit 2
fi

# ── 1. System packages ──────────────────────────────────────────────────────
. /etc/os-release
say "Installing system packages on $PRETTY_NAME"
if command -v apt-get >/dev/null; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq curl ca-certificates git nginx rsync tar >/dev/null
  [ "$SSL" = letsencrypt ] && apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
  PKG=apt
elif command -v dnf >/dev/null; then
  dnf install -y -q epel-release >/dev/null 2>&1 || true
  dnf install -y -q curl ca-certificates git nginx rsync tar policycoreutils-python-utils >/dev/null
  [ "$SSL" = letsencrypt ] && dnf install -y -q certbot python3-certbot-nginx >/dev/null
  PKG=dnf
else
  die "Unsupported OS (need apt or dnf)."
fi

# ── 2. Node.js 22 LTS + PM2 ────────────────────────────────────────────────
need_node=1
if command -v node >/dev/null; then
  major=$(node -p 'process.versions.node.split(".")[0]')
  [ "$major" -ge 20 ] && need_node=0
fi
if [ $need_node = 1 ]; then
  say "Installing Node.js 22 LTS"
  if [ $PKG = apt ]; then curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null && apt-get install -y -qq nodejs >/dev/null
  else curl -fsSL https://rpm.nodesource.com/setup_22.x | bash - >/dev/null && dnf install -y -q nodejs >/dev/null; fi
fi
command -v pm2 >/dev/null || { say "Installing PM2"; npm install -g pm2 --silent >/dev/null; }
echo "node $(node -v) · npm $(npm -v) · pm2 $(pm2 -v)"

# ── 3. Swap (Next.js builds need ~1.5 GB RAM) ──────────────────────────────
mem_mb=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
if [ "$mem_mb" -lt 3000 ] && ! swapon --show | grep -q /swapfile; then
  say "Adding 2 GB swap (RAM ${mem_mb} MB)"
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none
  chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ── 4. App user, folders, secrets ───────────────────────────────────────────
say "Preparing $APP_DIR (user: $APP_USER)"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /bin/bash "$APP_USER"
mkdir -p "$APP_DIR"/{releases,shared/images,shared/private,logs}
ENV_FILE="$APP_DIR/shared/.env.production"
if [ ! -f "$ENV_FILE" ]; then
  s1=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  s2=$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  canonical=$([ "$WWW" = 1 ] && echo "www.$DOMAIN" || echo "$DOMAIN")
  sed -e "s/__DOMAIN__/$canonical/" -e "s/__SECRET1__/$s1/" -e "s/__SECRET2__/$s2/" "$SRC_DIR/deploy/env.production.template" > "$ENV_FILE"
  echo "Created $ENV_FILE"
else
  echo "Keeping existing $ENV_FILE"
fi
chmod 600 "$ENV_FILE"
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
# make the source readable by the app user
SRC_COPY="$APP_DIR/source"
rm -rf "${SRC_COPY:?}" && mkdir -p "$SRC_COPY"
tar -C "$SRC_DIR" --exclude=node_modules --exclude=.next --exclude=.git -cf - . | tar -C "$SRC_COPY" -xf -
chown -R "$APP_USER":"$APP_USER" "$SRC_COPY"

# ── 5. Build + start (as the app user) ─────────────────────────────────────
say "Building and starting the site (first run downloads ~45 images + brochure)"
# pass through outbound proxy / CA settings if this server needs them
PASS_ENV=()
for v in HTTPS_PROXY HTTP_PROXY NO_PROXY https_proxy http_proxy no_proxy NODE_EXTRA_CA_CERTS npm_config_https_proxy npm_config_proxy npm_config_noproxy npm_config_cafile; do
  [ -n "${!v:-}" ] && PASS_ENV+=("$v=${!v}")
done
sudo -u "$APP_USER" -H env "${PASS_ENV[@]}" APP_DIR="$APP_DIR" PORT="$PORT" bash "$SRC_COPY/deploy/release.sh" "$SRC_COPY"

# PM2 on boot (systemd hosts; skipped gracefully elsewhere)
HAS_SYSTEMD=0; [ -d /run/systemd/system ] && HAS_SYSTEMD=1
if [ $HAS_SYSTEMD = 1 ]; then
  pm2 startup systemd -u "$APP_USER" --hp "$(getent passwd "$APP_USER" | cut -d: -f6)" >/dev/null
else
  echo "⚠ systemd not detected — PM2 will not auto-start on reboot (fine for containers)."
fi
sudo -u "$APP_USER" -H pm2 save >/dev/null

# ── 6. NGINX reverse proxy ──────────────────────────────────────────────────
say "Configuring NGINX for $DOMAIN"
NAMES="$DOMAIN"; [ "$WWW" = 1 ] && NAMES="$DOMAIN www.$DOMAIN"
if [ -d /etc/nginx/sites-available ]; then CONF=/etc/nginx/sites-available/one-racecourse.conf; else CONF=/etc/nginx/conf.d/one-racecourse.conf; fi
mkdir -p /etc/nginx/snippets
cp "$SRC_DIR/deploy/next-proxy.conf" /etc/nginx/snippets/next-proxy.conf
cp "$SRC_DIR/deploy/cloudflare-realip.conf" /etc/nginx/snippets/cloudflare-realip.conf
sed -e "s/__SERVER_NAMES__/$NAMES/" -e "s/__PORT__/$PORT/" "$SRC_DIR/deploy/nginx.conf" > "$CONF"
# servers with IPv6 disabled cannot bind [::]:80
[ -s /proc/net/if_inet6 ] || sed -i '/listen \[::\]/d' "$CONF"
if [ -d /etc/nginx/sites-enabled ]; then ln -sfn "$CONF" /etc/nginx/sites-enabled/one-racecourse.conf; rm -f /etc/nginx/sites-enabled/default; fi
# SELinux (Alma/Rocky): allow NGINX → localhost:3000
command -v setsebool >/dev/null && setsebool -P httpd_can_network_connect 1 2>/dev/null || true
nginx -t
if [ $HAS_SYSTEMD = 1 ]; then
  systemctl enable --now nginx >/dev/null
  systemctl reload nginx
else
  nginx -s reload 2>/dev/null || nginx
fi

# ── 7. Firewall ─────────────────────────────────────────────────────────────
if command -v ufw >/dev/null && ufw status | grep -q active; then ufw allow 'Nginx Full' >/dev/null; ufw allow OpenSSH >/dev/null; fi
if command -v firewall-cmd >/dev/null && systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http --add-service=https >/dev/null && firewall-cmd --reload >/dev/null
fi

# ── 8. SSL ──────────────────────────────────────────────────────────────────
if [ "$SSL" = letsencrypt ]; then
  say "Requesting Let's Encrypt certificate"
  args=(-d "$DOMAIN"); [ "$WWW" = 1 ] && args+=(-d "www.$DOMAIN")
  if certbot --nginx "${args[@]}" -m "$EMAIL" --agree-tos -n --redirect; then
    echo "HTTPS enabled; auto-renewal is installed by certbot."
  else
    echo "⚠ Certificate request failed — the DNS A record must point to this server first. Re-run this script once DNS is live."
  fi
fi

say "Done"
echo "Site:      http$([ "$SSL" = letsencrypt ] && echo s)://$([ "$WWW" = 1 ] && echo www.)$DOMAIN"
echo "Config:    $ENV_FILE   (edit, then: sudo -u $APP_USER APP_DIR=$APP_DIR bash $APP_DIR/current/deploy/release.sh $APP_DIR/source)"
echo "Logs:      sudo -u $APP_USER pm2 logs one-racecourse"
echo "Images:    $(ls "$APP_DIR/shared/images" | wc -l) files in $APP_DIR/shared/images (drop Google Drive files here with the same names to replace)"
