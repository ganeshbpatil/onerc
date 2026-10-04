# One Racecourse by SKYi — launch website

Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui-style Radix primitives). Every page is statically generated. Leads route through Zoho Forms, with Zoho CRM API, webhook and log fallbacks.

```bash
cp .env.example .env.local   # fill values; works with none (leads go to the log adapter)
npm ci
npm run dev                  # http://localhost:3000
npm run check                # lint + typecheck + unit tests
npm run build && npm start
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

To add real imagery, place the files in `public/images/` and set `src` on the matching asset in `content/*.ts`. `ImageFrame` then switches from the labelled placeholder to an optimised `next/image` (AVIF/WebP).

## QA

```bash
npm run build && PORT=3100 npm start &
BASE=http://localhost:3100 node tests/visual/qa.mjs     # screenshots + overflow/heading/target checks
BASE=http://localhost:3100 node tests/visual/a11y.mjs   # axe-core, exits non-zero on violations
```
