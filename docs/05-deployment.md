# 05 — Deployment: InMotion VPS

```
Visitor → Cloudflare (DNS, WAF, CDN, TLS) → NGINX :443 (Origin cert, limit_req) → PM2 → Next.js 127.0.0.1:3000
                                                                                            └→ /api/leads → Zoho Forms → Zoho CRM
```

Node is never exposed publicly; NGINX is the only listener on 80/443.

## 1. Server baseline (Ubuntu 22.04/24.04)

```bash
# as root
adduser deploy && usermod -aG sudo deploy
apt update && apt -y upgrade
apt -y install nginx git ufw fail2ban unattended-upgrades
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
# SSH: key-only, no root login
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/; s/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && systemctl reload ssh

# Node.js LTS (22.x) via NodeSource, then PM2
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt -y install nodejs
npm i -g pm2 && pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 20M && pm2 set pm2-logrotate:retain 14
```

**Hardening option:** restrict 443 to Cloudflare IP ranges in `ufw` so the origin cannot be hit directly.

## 2. App directories and secrets

```bash
sudo mkdir -p /var/www/one-racecourse/{releases,shared} /var/log/one-racecourse
sudo chown -R deploy:deploy /var/www/one-racecourse /var/log/one-racecourse
# as deploy
cp .env.example /var/www/one-racecourse/shared/.env.production   # fill real values
chmod 600 /var/www/one-racecourse/shared/.env.production
cp deploy/deploy.sh /var/www/one-racecourse/deploy.sh && chmod +x /var/www/one-racecourse/deploy.sh
```

Give the VPS a read-only GitHub **deploy key** (`ssh-keygen -t ed25519`, add the public key under repo → Settings → Deploy keys).

## 3. TLS and Cloudflare
1. Set the domain's DNS in Cloudflare with an orange-cloud A record pointing to the VPS IP.
2. Under SSL/TLS, choose **Full (strict)**. Create an **Origin Certificate** and save it to `/etc/ssl/cloudflare/origin.{pem,key}` (key `chmod 600`).
3. Enable *Always Use HTTPS* and *HSTS* only after verifying the site. Cache rule: bypass `/api/*`; cache everything else per origin headers.
4. Under WAF, add a rate-limiting rule on `POST /api/leads` (for example, 10/min/IP) as the outer layer.

Alternative without Cloudflare: `certbot --nginx -d www.example.com` (Let's Encrypt), then adjust the cert paths in `nginx.conf`.

## 4. NGINX

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/one-racecourse
sudo cp deploy/next-proxy.conf /etc/nginx/snippets/next-proxy.conf
sudo ln -s /etc/nginx/sites-available/one-racecourse /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Populate `/etc/nginx/snippets/cloudflare-realip.conf` with `set_real_ip_from` lines for each Cloudflare range, then uncomment the include. Without it, every visitor shares Cloudflare's IP in rate limiting.

## 5. First deploy and PM2 boot persistence

```bash
/var/www/one-racecourse/deploy.sh main        # npm ci → check → build → symlink → pm2 reload → health check
pm2 startup systemd -u deploy --hp /home/deploy   # run the printed sudo command once
pm2 save
```

`deploy.sh` builds each release in its own directory, so the live site keeps serving during the build. It refuses to go live if lint, typecheck or tests fail, rolls back automatically if the health check fails, and keeps the last five releases. Manual rollback: `ln -sfn <older release> current && pm2 reload one-racecourse`.

## 6. CI/CD
`.github/workflows/ci.yml` runs on every PR and on push to `main`: lint → typecheck → unit tests → build. Only after all of these pass on `main` does the `deploy` job SSH to the VPS and run `deploy.sh <sha>`.

Required GitHub secrets (in the `production` environment, ideally with required reviewers): `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`.

## 7. Operations

| Concern | Setup |
|---|---|
| Logs | `pm2 logs one-racecourse`; files in `/var/log/one-racecourse` (rotated). Fallback leads are logged as `lead.fallback`, so grep for that string daily until a monitoring alert covers it |
| Uptime | Use Better Stack / UptimeRobot to check `/` every minute, plus a synthetic `POST /api/leads` from a monitoring IP weekly |
| Backups | The app is stateless (leads live in Zoho). Back up `/var/www/one-racecourse/shared/.env.production` and `/etc/nginx` to encrypted off-site storage. Turn on InMotion VPS snapshots weekly |
| Updates | `unattended-upgrades` for the OS; run `npm outdated` monthly, then deploy through CI |
| Security | Secure headers (CSP, HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`; rate limiting at Cloudflare, NGINX and the app; Zod validation server-side; honeypot plus time-to-submit check; Origin check (CSRF); secrets only in `.env.production` (never `NEXT_PUBLIC_*`) |

## 8. Pre-launch checklist
- [ ] `NEXT_PUBLIC_SITE_URL` set to the final domain (canonical URLs, sitemap and OG all depend on it)
- [ ] Zoho Forms submit URL and field map verified with a test lead that reaches CRM, including UTM fields
- [ ] Zoho form CAPTCHA disabled (server-side posting) and a notification email configured
- [ ] `BROCHURE_URL` points to a compressed PDF on a CDN
- [ ] GTM container published (see 07); consent mode verified in Tag Assistant
- [ ] All `[CONTENT REQUIRED]` items resolved: `grep -rn "CONTENT REQUIRED" content app components`
- [ ] Real imagery placed in `/public/images` and `src` set in `content/*.ts`
- [ ] Legal sign-off on RERA disclosures, privacy policy and terms
