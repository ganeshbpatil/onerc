# 08 — Check locally, then deploy on Hostinger Cloud

Hostinger **Cloud** plans (Startup, Professional, Enterprise) run Node.js apps from hPanel's **Websites → Add website → Node.js Apps** flow. You have no root access, so `deploy/install.sh` (the VPS installer) is **not** used here; Hostinger runs the build and keeps the app alive. Hostinger supports Next.js, Node 18–24, GitHub or archive upload, environment variables and one-click redeploys.

---

## Part 1 — Run it on your computer first (10 minutes)

**Install once:** [Node.js 22 LTS](https://nodejs.org) (Windows/macOS installer). Check it in a terminal: `node -v` should print v22.x.

```bash
# 1. Unzip the package (or git clone the repo) and open a terminal in that folder
cd one-racecourse

# 2. Install dependencies
npm ci

# 3. Local settings (optional — works without any; leads are then only logged in the terminal)
cp .env.example .env.local          # Windows PowerShell: copy .env.example .env.local

# 4. Download the real images + brochure from the reference sites into public/images and private/
npm run assets                      # expect: images on disk: 44 · brochure: true

# 5a. Development mode (hot reload)
npm run dev                         # open http://localhost:3000

# 5b. Production check (exactly what the server runs)
npm run build
npm start                           # open http://localhost:3000
```

### What to check locally
| Check | How |
|---|---|
| Images load (hero, plans, Club One, gallery) | Scroll the homepage; no hatched placeholders should remain |
| Fonts | Headings are in Google Sans, the small uppercase labels in Montserrat |
| Mobile | Chrome DevTools → device toolbar → iPhone 12/14 |
| Enquiry form | Submit "Schedule a private visit" → you land on /thank-you; the terminal prints `lead.fallback` (or the lead reaches Zoho if `ZOHO_FORMS_SUBMIT_URL` is set in `.env.local`) |
| Brochure gate | "Download brochure" → fill the form → the PDF opens |
| Pages | /the-address, /residences/one-plus, /design, /club-one, /location, /gallery, /visit, /rera |
| Quality (optional) | `npm run check` (lint + types + tests) |

> **Test Zoho locally without polluting CRM:** leave `ZOHO_FORMS_SUBMIT_URL` empty in `.env.local`. Set it only when you want to confirm a lead lands in Zoho, and use an obviously fake name such as "TEST - ignore".

---

## Part 2 — Deploy on Hostinger Cloud

### Option A — Upload archive (simplest)
1. **On your computer**, after `npm run assets` has downloaded the images, create the upload zip:
   ```bash
   npm run package:hostinger          # → one-racecourse-hostinger-0.1.0.zip (includes the images)
   ```
   On Windows without `zip`, select **all files inside** the project folder **except** `node_modules` and `.next`, then right-click → *Compress to ZIP*. `package.json` must sit at the top level of the zip.
2. In **hPanel → Websites → Add website → Node.js Apps**, choose **Upload your website files** and upload the zip.
3. **Build settings.** Hostinger detects Next.js; confirm or enter:

   | Field | Value |
   |---|---|
   | Framework | Next.js |
   | Node.js version | **22** |
   | Root directory | `/` (or `./`) |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Output directory | `.next` |
   | Start command / entry file | `npm start` (runs `node .next/standalone/server.js`). If the form asks for an entry file instead, use `.next/standalone/server.js`. Leaving Hostinger's default `next start` also works. |

4. **Environment variables.** Paste these, then edit the domain and the secret:
   ```
   NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
   NEXT_PUBLIC_PHONE=+918855862268
   NEXT_PUBLIC_WHATSAPP_NUMBER=918855862268
   LEAD_ADAPTERS=zoho_forms,log
   ZOHO_FORMS_SUBMIT_URL=https://forms.zohopublic.com/praxisinfosolutionscom/form/5Racecourse/formperma/_KnREVNTJsjB9RN4_pcVOwUj1DAvxQYQpddyErTpKfc/htmlRecords/submit
   ZOHO_FORMS_STATIC_FIELDS={"Project":"One Racecourse","SingleLine":"ONE RACECOURSE","SingleLine1":"Direct","SingleLine2":"DIGITAL","SingleLine3":"SKYi Websites","SingleLine8":"Digital"}
   BROCHURE_SIGNING_SECRET=<any long random string, e.g. 40+ letters/numbers>
   RATE_LIMIT_PER_MINUTE=5
   ```
   Optional: `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `GA4_API_SECRET`.

   ⚠ The Zoho URL is SKYi's live **5 Racecourse** form; leads are tagged *Project = One Racecourse*. Replace it with a dedicated One Racecourse form URL when the CRM team clones it.
5. Click **Deploy**. The build takes 2–4 minutes; it also tries to download any missing images.
6. **Domain:** hPanel → the app → *Domains* → connect your domain (or use the temporary `*.hostingersite.com` URL first). SSL is issued automatically.

### Option B — Connect GitHub (auto-deploy on every push)
1. hPanel → Add website → Node.js Apps → **Import Git repository** → authorise GitHub → repo `ganeshbpatil/onerc` → branch `claude/loving-johnson-njg3k8` (or `main` once merged).
2. Use the same build settings and environment variables as Option A.
3. Images aren't stored in git, so the build downloads them from the reference sites (`prebuild` runs `scripts/fetch-assets.mjs`). Check the build log for `[assets] … images on disk: 44`.

### After deploy — verify
- Open the site and run the same checks as Part 1. Use your phone on mobile data, not only desktop.
- Submit one test lead named "TEST - ignore" and confirm it reaches Zoho CRM, with Project = One Racecourse and UTM fields populated (add `?utm_source=test` to the URL first).
- Run `https://pagespeed.web.dev/` on the live URL.

### Updating the site
- Archive route: build a new zip, then go to hPanel → the app → **Redeploy**/upload.
- GitHub route: push to the branch; Hostinger redeploys automatically.
- Changing an environment variable needs a **Redeploy** (the `NEXT_PUBLIC_*` values are baked in at build time).

### Troubleshooting
| Symptom | Fix |
|---|---|
| Hatched image placeholders on the live site | The build couldn't download the images. Use Option A with `npm run assets` run locally first, so the zip carries them |
| "Brochure not available yet" | `private/One-Racecourse-Brochure.pdf` is missing. Run `npm run assets` locally and re-zip |
| Form says "couldn't submit" | Check that `ZOHO_FORMS_SUBMIT_URL` is set; check the runtime logs for `lead.all_adapters_failed` |
| Build fails with an out-of-memory error | Choose a larger Cloud plan, or build locally and deploy to a VPS with `deploy/install.sh` |
| Canonical links or sitemap show localhost | `NEXT_PUBLIC_SITE_URL` was missing at build time. Set it and redeploy |

### Hostinger Cloud vs a VPS

| | Hostinger Cloud (this guide) | VPS (`deploy/install.sh`) |
|---|---|---|
| Server admin | None (managed) | You (root) |
| Setup | hPanel clicks | One command |
| Auto-deploy from GitHub | Built in | Via GitHub Actions |
| Control (NGINX limits, logs, cron) | Limited | Full |
| Best for | Launch quickly, low maintenance | Scale, custom infra, several sites |
