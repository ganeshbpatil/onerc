# 02 — Opportunity Analysis

## The strategic reframe (challenge to the brief)

The brief asks for "luxury", but the product is a **490 sq.ft. 1 BHK**. If the site markets it as opulent, the visit will not match the website and site-visit-to-booking conversion will drop. The defensible premium has three parts:

1. **The address.** Cantonment, Empress Garden (1838) opposite, and a heritage that money can't replicate.
2. **The intelligence.** Measured daylight and ventilation multiples over the National Building Code, and two homes per wing.
3. **Intent over size.** "The measure of good design was never size. It was always intent." This is the brand's own best line.

Positioning: **a premium address with an engineered home, for buyers who value where and how they live over how much floor they own.** Likely audiences, to be validated with CRM data: first-home professionals working in Magarpatta, Kharadi or Camp; couples; downsizers already living in the Cantonment; and investors seeking rental yield near Magarpatta and Kharadi.

## Retain
- Heritage timeline (1817–1948) and nature figures (from the brochure, rendered as text and not as 0→N counters).
- Site A amenity copy and Site B voice.
- The day/night plan comparison from Site B.
- Max Light™ / Air Tech™, now expressed as data.
- RERA disclosures (after correcting them).

## Improve
- Location: replace the static image with indexable, category-filtered drive times plus a lightweight map.
- Unit plan: show real dimensions, and gate the high-resolution plan behind a light-touch form so it becomes a lead signal.
- Amenities: replace a list of six cards with an explorer (one image, one idea, one sentence).

## Remove
- Elementor popups (8+), animated zero-counters, duplicate headings, screenshots used as content, 2048px PNGs, the ungated brochure link, the "Pentagon Club 45,000 sq.ft." claim, and every 5 Racecourse carry-over.

## Reinvent
- **The intelligence section as proof.** Lux and ACH bars against NBC minimums give the brand a "show, don't tell" premium signal that no Pune competitor site uses.
- **The conversion model.** Three intents (Visit, Brochure, Price) share one form component and one lead service. Brochure and price requests are progressive asks that capture a mobile number and nothing more.
- **Information architecture.** One story page for paid traffic, plus depth pages for organic search.

## Conversion opportunities (ranked)

| # | Opportunity | Impact | Effort | Why |
|---|---|---|---|---|
| 1 | Sticky mobile action bar (Call · WhatsApp · Visit) | High | Low | More than 75% of Indian RE traffic is mobile, and both sites lack this |
| 2 | Gated brochure and price on request (mobile only, OTP optional) | High | Low | Today the brochure leaks without a lead |
| 3 | Server-side lead API, then CRM, plus Meta CAPI and GA4 MP with dedup `event_id` | High | Medium | Recovers 15–30% of conversions lost to iOS and ad blockers, and improves bidding signal quality |
| 4 | Lead-quality fields (`preferred_time`, `intent`, UTM, `gclid`/`fbclid`) | High | Low | Enables offline conversion import of qualified leads, so ad platforms optimise for site visits and not form fills |
| 5 | Intent-specific landing variants (`/visit?src=meta-carousel`) | Medium | Low | Supports campaign-level message match |
| 6 | WhatsApp click-to-chat with prefilled context | Medium | Low | Lower-friction channel for the 25–35 age segment |

## Mobile
Mobile-first type scale (54px hero at 390px), a single-column flow, horizontally scrollable timeline and filters, a 72px sticky action bar, 44px touch targets, and native `tel:` / `wa.me` links.

## SEO
SSG for every page. Target clusters: "1 BHK in Pune Camp / Racecourse / Wanowrie / Sopan Baug", "flats near Empress Garden", "new launch Pune Cantonment". Add schema (`ApartmentComplex`, `Residence`/`Accommodation`, `Organization`, `BreadcrumbList`, `FAQPage`) and an indexable location page with text distances.

## Performance
Next.js SSG served at the edge (Cloudflare), AVIF/WebP via `next/image`, one hero image preloaded, self-hosted fonts via `next/font` (three families, subsetted), zero third-party scripts before interaction (GTM loaded `afterInteractive`, Pixel through GTM), and CSS-only motion where possible. Targets: LCP < 2.0s on 4G, INP < 150ms, CLS < 0.05.

## Premium-brand opportunities
Drawing-sheet visual language (annotations, product codes, north points), explicit CGI labelling (honesty is a premium signal), architect and landscape-designer credits, and no stock imagery.

## AI and automation opportunities (post-launch)
- **Lead-scoring agent.** The `/api/leads` webhook goes to an n8n or Claude agent that enriches the lead (source, page path, time on page, intent) and routes hot leads to WhatsApp within 60 seconds.
- **WhatsApp concierge.** A Claude-powered first responder grounded only in `content/*.ts` and the brochure, so it does not hallucinate prices, plus a site-visit booking tool backed by Google Calendar.
- **Creative feedback loop.** BigQuery (GA4 export plus CRM stage) drives a weekly agent report on which creative leads to visits and then bookings.
