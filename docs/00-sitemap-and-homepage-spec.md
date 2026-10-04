# 00 — Sitemap & Homepage Experience Spec

## Sitemap

```
/                      Story page (paid-traffic landing)
├── /the-address       Cantonment, Empress Garden, heritage timeline, nature figures
├── /residences/one-plus   725 L plan, day/night viewer, specs, personas
├── /design            Max Light™ / Air Tech™ data, architects, landscape, IGBC
├── /club-one          Amenity explorer (13,500+ sq.ft.: verify)
├── /location          Six-category drive times, map, neighbourhood
├── /gallery           Filterable gallery and lightbox (CGI labelled)
├── /progress          Construction status [CONTENT REQUIRED]
├── /developer         SKYi credentials, portfolio, partners
├── /visit             Schedule visit · brochure · price request
├── /rera              MahaRERA P52100079680, Form V, compliance, EC
├── /privacy  /terms
└── /thank-you         noindex; fires conversion events
```

Rationale: one story page for paid traffic, where message match and speed matter most. Depth pages capture long-tail organic intent and serve as shareable deep links for sales (for example, a WhatsApp link to /location). The FAQ is embedded on the relevant pages with `FAQPage` schema rather than siloed on its own page.

## Homepage journey (as drawn on canvas board 04)

| # | Section | Job | Primary action | Data source |
|---|---|---|---|---|
| 0 | Header | Orientation, phone, persistent visit CTA | Schedule a visit | n/a |
| 1 | Opening | "Not built to impress. Built to hold its ground." Location, four facts, RERA at first fold | Explore the home / Schedule a private visit | Brochure p.20 |
| 2 | The Address | Make the location emotionally valuable: Garden photo, nature figures, heritage ledger | n/a | Site A, brochure p.72 |
| 3 | The One Plus Home (big idea) | One home, three life stages: 1+, 1+1, 1+2. Plan viewer (day/night), spec list, price [CONTENT REQUIRED] | Request floor plan & price | Brochure p.40–57 |
| 4 | Invisible intelligence | Proof: lux and ACH vs NBC; architect and landscape credits; IGBC | n/a | Brochure p.12–35 |
| 5 | Club One | Lifestyle: amenity explorer with one image, one idea and one line | n/a | Site A copy, brochure p.58–69 |
| 6 | Location | Six tabs, five destinations each, with indicative times | n/a | Brochure p.76 |
| 7 | Gallery | "The view was never going to stay outside." Mosaic leading to the lightbox | Open gallery | Site A assets |
| 8 | Developer / trust | SKYi since 2004, awards, memberships, finance partners, possession and status [CONTENT REQUIRED] | n/a | Brochure p.88 |
| 9 | Final conversion | "Walk the Racecourse with us." Five-field form, call, WhatsApp, brochure | Schedule a private visit | n/a |
| 10 | Footer | RERA, disclosures, developer entity, disclaimer | n/a | Brochure p.92 |

Mobile adds a sticky bar (Call · WhatsApp · Schedule a visit) that appears after the hero leaves the viewport and hides when the final form is in view.

## Form spec
Fields: name, mobile (+91, validated), email (optional), preferred time (select), and consent (required, with a DND override line). Hidden fields: intent (`visit|brochure|price`), UTM ×5, gclid, fbclid, landing path, referrer, and `event_id` (for CAPI dedup). That is five visible fields, and only name, mobile and consent are required.
