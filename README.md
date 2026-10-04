# One Racecourse by SKYi — launch website

## Check locally → deploy

- **Hostinger Cloud (hPanel Node.js Apps):** see [docs/08-hostinger-and-local.md](docs/08-hostinger-and-local.md). Run `npm run assets && npm run package:hostinger` to build the upload zip.
- **Local check:** `npm ci && npm run assets && npm run build && npm start`, then open http://localhost:3000.

## Deploy to a VPS (one command)

```bash
scp one-racecourse-deploy-*.tar.gz root@SERVER:/root/ && ssh root@SERVER
tar -xzf one-racecourse-deploy-*.tar.gz && cd one-racecourse
DOMAIN=oneracecourse.com EMAIL=it@skyi.com bash deploy/install.sh
```

This installs NGINX, Node 22, PM2 and SSL, downloads every image and the brochure from the reference sites, builds, and starts the site. Details are in [docs/05-deployment.md](docs/05-deployment.md). Build the package with `npm run package`.

Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui-style Radix primitives), typeset in the SKYi reference fonts (Google Sans + Montserrat). Every page is statically generated. Leads route through Zoho Forms, with Zoho CRM API, webhook and log fallbacks.

```bash
cp .env.example .env.local   # fill values; works with none (leads go to the log adapter)
npm ci
npm run dev                  # http://localhost:3000
npm run check                # lint + typecheck + unit tests
npm run assets               # download images + brochure from the reference sites
npm run build && npm start   # standalone server on :3000
```

## Structure

```
app/                 routes (story homepage + depth pages), api/leads, sitemap, robots
components/          Header, MobileNav, StickyActionBar, LeadForm, LeadDialog, Footer, CookieConsent, Analytics …
components/sections/ Hero, Address, Home(+FloorPlanViewer), Intelligence, Club(+AmenityExplorer),
                     Location(+LocationExplorer), Gallery(+Lightbox), Developer, Visit
components/ui/       shadcn-style primitives (Dialog)
content/             all copy and facts, each with its source, plus [CONTENT REQUIRED] markers
lib/leads/           schema (zod) · service (adapter chain) · adapters/{zoho-forms, zoho-crm, webhook, log}
lib/analytics/       event dictionary · track() · attribution · server-side CAPI/GA4 MP
lib/seo/             metadata helper · JSON-LD builders
deploy/              NGINX, PM2, atomic deploy script
docs/                00 sitemap/spec · 01 audit · 02 opportunities · 03 design system · 04 assets · 05 deploy · 06 SEO · 07 analytics
tests/               unit tests (vitest) · visual/qa.mjs (responsive) · visual/a11y.mjs (axe WCAG 2.1 AA)
```

## Content rules
Never invent prices, dates, distances, awards or testimonials. Missing facts stay as `[CONTENT REQUIRED]` and render visibly. Find them with:

```bash
grep -rn "CONTENT REQUIRED\|VERIFY" content app components
```

Images are downloaded by `npm run assets` (also run automatically before every build) into `public/images/`, under the local names in `scripts/assets.manifest.mjs`. `ImageFrame` renders an optimised `next/image` (AVIF/WebP) when the file exists and a labelled placeholder when it doesn't.

## QA

```bash
npm run build && PORT=3100 npm start &
BASE=http://localhost:3100 node tests/visual/qa.mjs     # screenshots + overflow/heading/target checks
BASE=http://localhost:3100 node tests/visual/a11y.mjs   # axe-core, exits non-zero on violations
```
