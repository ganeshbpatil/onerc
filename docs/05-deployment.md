# 05 — Deployment (InMotion VPS)

```
Visitor → (Cloudflare, optional) → NGINX :80/:443 (Let's Encrypt) → PM2 → Next.js standalone server 127.0.0.1:3000
                                                                           ├→ /api/leads    → Zoho Forms → Zoho CRM
                                                                           └→ /api/brochure → signed, expiring PDF link
```

## Quick start (one command)

**Requirements:** root SSH access to a VPS running Ubuntu 22.04/24.04, Debian 12 or AlmaLinux/Rocky 8–9, and the domain's DNS **A record** pointing to the VPS IP (for SSL).

```bash
# 1. Upload the package from your computer
scp one-racecourse-deploy-0.1.0.tar.gz root@YOUR_SERVER_IP:/root/

# 2. On the server
ssh root@YOUR_SERVER_IP
tar -xzf one-racecourse-deploy-0.1.0.tar.gz && cd one-racecourse
DOMAIN=oneracecourse.com EMAIL=it@skyi.com bash deploy/install.sh
```

That single command:
1. Installs NGINX, Node.js 22 LTS, PM2 and certbot, and adds 2 GB of swap on small VPSes.
2. Creates a locked-down system user `oneracecourse` and the folder `/var/www/one-racecourse/{releases,shared,logs}`.
3. Writes `/var/www/one-racecourse/shared/.env.production` with generated secrets and your domain.
4. **Downloads every image and the brochure from the reference sites** into `shared/images` and `shared/private` (about 45 files, kept across releases).
5. Builds the site, starts it under PM2 on `127.0.0.1:3000`, and health-checks it. If the check fails, it rolls back to the previous release.
6. Configures NGINX for `DOMAIN` and `www.DOMAIN`, opens the firewall, and requests a **Let's Encrypt** certificate with automatic renewal.
7. Enables PM2 on boot.

Open `https://www.oneracecourse.com`. Total time is about 5 minutes on a 2 vCPU / 2 GB VPS.

| Option | Default | Meaning |
|---|---|---|
| `DOMAIN` | — (required) | Apex domain without `www` |
| `EMAIL` | — | Turns on Let's Encrypt SSL (omit to stay on HTTP, for example behind Cloudflare Flexible) |
| `WWW` | `1` | Serve `www.` as the canonical host (`0` = apex only) |
| `PORT` | `3000` | Internal Node port (never public) |
| `SSL` | `letsencrypt` if `EMAIL` set | `none` to skip |

If SSL fails because DNS isn't live yet, fix DNS and **run the same command again**. Every re-run is safe.

## Updating the site
Upload the new package, extract it over the old folder and re-run the same `install.sh` command. Or, for config changes only:

```bash
sudo nano /var/www/one-racecourse/shared/.env.production
sudo -u oneracecourse APP_DIR=/var/www/one-racecourse bash /var/www/one-racecourse/current/deploy/release.sh /var/www/one-racecourse/source
```

Each release builds in its own folder. Traffic switches only after the health check passes, and the last four releases are kept. Manual rollback:

```bash
cd /var/www/one-racecourse && ls releases/
sudo -u oneracecourse ln -sfn /var/www/one-racecourse/releases/<older> current
sudo -u oneracecourse APP_DIR=/var/www/one-racecourse pm2 reload current/deploy/ecosystem.config.cjs --update-env
```

## Images and the brochure
- Downloaded automatically from the reference sites; the list is in `scripts/assets.manifest.mjs`.
- **Using the SKYi Google Drive originals instead** (recommended for quality): copy the files into `/var/www/one-racecourse/shared/images/` **using the same file names** (for example `hero-desktop.webp`, `club-gym.webp`; full list in docs/04), run `chown -R oneracecourse: /var/www/one-racecourse/shared`, then run the update command above. Any image format works if the name matches; `.jpg` or `.png` files need the name changed in `content/*.ts`.
- If a file is missing, its slot shows a labelled placeholder instead of a broken image.
- Brochure: `shared/private/One-Racecourse-Brochure.pdf`. It is never public. Visitors get a 24-hour signed link only after submitting the form.

## Leads → Zoho (check before launch)
`.env.production` ships pointing at **SKYi's live Zoho web form**, the same CRM field schema as the 5 Racecourse form. Each lead carries these hidden routing fields:

```
Project=One Racecourse · Sales Project=ONE RACECOURSE · Lead Source=DIGITAL · Sub Source=SKYi Websites · Origin=Digital
```

plus UTM ×5, gclid, fbclid, landing page and referrer.

**Ask SKYi's CRM admin to clone that form as "One Racecourse"** and paste the new URL into `ZOHO_FORMS_SUBMIT_URL`. Until then, leads arrive through the 5 Racecourse form but are tagged One Racecourse.

If Zoho is unreachable, leads are never lost: they fall back to the webhook (if set) and then to the log. Find them with:

```bash
grep lead.fallback /var/www/one-racecourse/logs/out.log
```

## cPanel / WHM servers
If the VPS runs cPanel, Apache owns ports 80/443 and the installer stops with a notice rather than breaking the server. Options:

1. **Recommended:** ask InMotion for a plain Ubuntu "Cloud VPS" and use the quick start.
2. **cPanel → Setup Node.js App** (CloudLinux/Passenger):
   - Upload and extract the package to `~/one-racecourse`. In cPanel Terminal, run:
     ```bash
     cd ~/one-racecourse && cp deploy/env.production.template .env.production   # edit DOMAIN/secrets
     npm ci && npm run build
     ```
   - In *Setup Node.js App*: Node 22, Application root `one-racecourse/.next/standalone`, startup file `server.js`, application URL = your domain. Add the variables from `.env.production` under *Environment variables*, then click **Restart**.
   - Builds need about 1.5 GB of RAM. If the cPanel account is limited, build on your computer (`npm ci && npm run build`) and upload `.next/standalone` instead.

## Behind Cloudflare
Set SSL mode to **Full (strict)** once Let's Encrypt is installed. Then uncomment `include /etc/nginx/snippets/cloudflare-realip.conf;` in `/etc/nginx/sites-available/one-racecourse.conf` so rate limits see real visitor IPs, and reload NGINX.

## Operations

| Task | Command |
|---|---|
| Status / logs | `sudo -u oneracecourse pm2 ls` · `sudo -u oneracecourse pm2 logs one-racecourse` |
| Restart | `sudo -u oneracecourse pm2 restart one-racecourse` |
| NGINX logs | `/var/log/nginx/one-racecourse.{access,error}.log` |
| Renew SSL (automatic) | `certbot renew --dry-run` to test |
| Backups | The app is stateless (leads live in Zoho). Back up `/var/www/one-racecourse/shared/` (env, images, brochure) and turn on InMotion snapshots |

## Security in place
- Node listens only on `127.0.0.1` and runs as an unprivileged user.
- Secrets live only in `shared/.env.production` (chmod 600).
- Security headers: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy and Permissions-Policy.
- Lead endpoint protection: rate limits at NGINX and in the app, server-side Zod validation, a honeypot, a minimum time-to-submit, and an Origin check against CSRF.
- The brochure link is HMAC-signed and expires.

## CI/CD (optional)
`.github/workflows/ci.yml` runs lint, typecheck, tests and a build on every PR. To enable auto-deploy on `main`:
1. Clone the repo into `/var/www/one-racecourse/source` on the server, as `oneracecourse`, with a read-only deploy key.
2. Add `VPS_HOST`, `VPS_USER` (`oneracecourse`), `VPS_SSH_KEY` and `VPS_PORT` secrets to the GitHub `production` environment.
