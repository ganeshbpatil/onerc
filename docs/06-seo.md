# 06 — SEO

## Architecture
- **Every page is prerendered (SSG).** Crawlers receive complete HTML; Site B exposed about 30 lines.
- **Information architecture:** a story homepage plus nine indexable depth pages (`/the-address`, `/residences/one-plus`, `/design`, `/club-one`, `/location`, `/gallery`, `/progress`, `/developer`, `/visit`) and `/rera`. `/thank-you` is `noindex`; `/api/` is disallowed.
- **Canonical URLs:** each page sets its own canonical through `lib/seo/metadata.ts`, based on `NEXT_PUBLIC_SITE_URL`.
- **Files:** `app/sitemap.ts` produces `/sitemap.xml` and `app/robots.ts` produces `/robots.txt`.

## Metadata per page

| Path | Title intent | Primary query cluster |
|---|---|---|
| `/` | Brand + "1 BHK One Plus Homes at Uday Baug, Pune Cantonment" | one racecourse skyi, new launch pune cantonment |
| `/the-address` | Neighbourhood / heritage | flats near empress garden, sopan baug, racecourse pune |
| `/residences/one-plus` | Product (490 sq.ft. 1 BHK) | 1 bhk pune camp, 1 bhk racecourse pune, 1 bhk wanowrie |
| `/design` | Max Light™ / Air Tech™ | well ventilated homes pune, igbc gold residential pune |
| `/club-one` | Amenities | — (supports conversion) |
| `/location` | Connectivity (all 30 destinations as text) | near magarpatta, near fatima nagar metro |
| `/developer` | Trust | skyi developers |
| `/rera` | Compliance | one racecourse rera P52100079680 |

Each page also carries an Open Graph and X/Twitter card. **[CONTENT REQUIRED]** a 1200×630 OG image (`app/opengraph-image.png`); Next picks it up automatically.

## Structured data (`lib/seo/schema.ts`)

| Schema | Where | Notes |
|---|---|---|
| `Organization` (SKYi, legal name, founding date, sameAs) | All pages | |
| `WebSite` | All pages | |
| `ApartmentComplex` with `containsPlace: Apartment` (490 sq ft / `FTK`, 1 room, 2 baths), `amenityFeature`, MahaRERA `identifier` | Home | `geo` and `postalCode` are emitted only once they are supplied (**[CONTENT REQUIRED]**) |
| `BreadcrumbList` | All depth pages | |
| `FAQPage` | Home | Only verified answers. Price and possession entries are excluded automatically while they are `[CONTENT REQUIRED]` |

No `Offer` or price schema is emitted until pricing is approved, because invented prices in rich results are a RERA risk.

Validate after deploy with the Google Rich Results Test and the Schema.org validator.

## On-page rules
- One H1 per page, with no skipped levels (enforced by `tests/visual/qa.mjs`).
- Copy is real and no keywords are stuffed. Location data is plain text, not baked into images.
- Image `alt` text describes the scene, and every render is labelled as CGI.

## Local SEO (off-site, high ROI)
1. A **Google Business Profile** for the sales gallery or site office ("One Racecourse by SKYi"), with category *Real estate developer*, the same NAP as the site, photos and weekly posts.
2. Consistent NAP across 99acres, MagicBricks, Housing and NoBroker listings, each linking to `/residences/one-plus` with UTM tags.
3. Review generation after site visits (a WhatsApp automation link to the GBP review URL).

## Monitoring
Google Search Console (domain property) with the sitemap submitted; Bing Webmaster Tools; a monthly Search Console export to BigQuery for query-level reporting.
