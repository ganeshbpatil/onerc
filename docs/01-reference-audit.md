# 01 — Reference Audit

**Project:** One Racecourse by SKYi, Uday Baug (opposite Sopan Baug), Pune Cantonment
**Audited:** 2026-10-04
**Sources:**
- **Site A**: https://mediumpurple-squirrel-394820.hostingersite.com/
- **Site B**: https://lightsteelblue-wombat-180288.hostingersite.com/
- **Brochure**: `/uploads/One-Racecourse-Brochure.pdf` on Site B. This is the most authoritative source available and is treated as the source of truth for facts.

> Method: both sites were fetched through a rendering crawler (rendered DOM, outbound links, image inventory and head metadata). Direct curl, Playwright and Lighthouse were blocked by the environment's egress policy, so the performance notes below are inferred from markup and assets, not measured. Re-run Lighthouse against both sites from an unrestricted network before the leadership review.

---

## Site A: WordPress 7.1.2 + Elementor

| Area | Finding |
|---|---|
| Technology | WordPress 7.1.2, Elementor with popups (`#elementor-action:popup:open`), Meta Pixel `1070154164521178`, `wp-content/uploads`. |
| Page structure | A single long page with anchors: `#location`, `#Design`, `#life`, `#amen`. |
| Navigation | Four anchor links, duplicated for desktop and mobile. Brochure and enquiry open in Elementor popups (8+ popup IDs). |
| Hero | No H1. The first H2 is "The Racecourse doesn't need an introduction." |
| Typography | Template defaults. Multiple duplicate H2s ("Sustainable Living" appears twice). |
| Colour | Not themed by tokens. Brand colours are hard-coded in Elementor widgets. |
| Images | About 300 image variants. Heritage photos run in triplets. Large PNGs are served up to 2048px (`SRPF-5-RC-min.png`, `RC-Ground-min-1.png`, `Army-Tank-…png`). Some screenshots are used as content (`Screenshot-2024-10-04-192620.png`). |
| Animation | Counters animate from `0+`. Crawlers and no-JS users see **"0+ species of birds"**. |
| Content hierarchy | Address → nature counters → heritage timeline (1817–1948) → connectivity → One Plus Home → personas (One+1, One+2) → Max Light / Air Tech → Day/Night gallery → unit plan → design philosophy → amenities (six, with good copy) → brochure. |
| Property info | "725 L" product, 1+ plan. No carpet area, price or RERA in the copy. |
| Amenities | Gymnasium, Indoor Games Room, Multipurpose Hall, Kids' Play Area, Jogging Track, Yoga & Meditation Deck. Each has strong one-paragraph copy. |
| Location | A static connectivity image (`Location-Connectivity-Laptop.webp`). No text distances, so nothing is indexable. |
| Gallery | Twelve laptop and twelve mobile images with a Day/Night toggle. |
| Unit plans | One image (`unit-plan.webp`) in a popup. |
| Forms | Popup-based, so field details are not visible in the DOM. |
| CTA strategy | Download Brochure, Contact Us and phone `8855862268`. No sticky mobile CTA. No WhatsApp. |
| Footer | Social links, other SKYi projects (Songbirds, Manas Lake, Star City, 5 by SKYi), RERA documents: Form V, Six-Monthly Compliance Report, EC Letter 2023. |
| SEO | Title is "SkyI". No meta description, no OG image and no structured data. Canonical is set. `robots: max-image-preview:large`. |
| Performance (inferred) | Elementor CSS/JS weight, many popup templates, multi-MB PNGs and Meta Pixel loaded synchronously. A poor LCP is likely on 4G. |
| Conversion UX | Popups interrupt the flow. There is no clear primary action and no lead-source capture visible. |
| **Risk** | Asset filenames reference **5 Racecourse Phase II (P52100077439)**, and the footer PDFs may belong to 5 Racecourse. A wrong RERA disclosure is a legal exposure. |

## Site B: React SPA

| Area | Finding |
|---|---|
| Technology | Client-rendered React SPA. `theme-color #111111`. OG title and description are present. |
| Page structure | Hero caption → The Address → SKYi Plus Technology (Max Light) → Product Design → More Life. Less Space. → Unit Plan (day/night drag compare) → Project Specification → Amenities → Location → Get In Touch. |
| Navigation | Every nav link resolves to `/`. This is effectively hash or JS-only routing, so nothing is crawlable. |
| Hero | Copy: "The tower catches the last light over Uday Baug as the city slows down." It works as a caption, but there is no H1 value proposition. |
| Typography | Editorial and restrained. |
| Colour | Dark (#111) system. |
| Images | The crawler extracted **zero** `<img>` elements, so images are background or JS-injected. No image SEO and no alt text. |
| Animation | A drag compare on the unit plan, which is a genuinely good interaction. |
| Content | Stronger voice. "The measure of good design was never size. It was always intent." |
| Amenities | "The Pentagon Club — 45,000 sq.ft … 45+ amenities". **This conflicts with the brochure (Club One, 13,500+ sq.ft.).** It is probably carried over from 5 Racecourse. |
| Location | "This isn't a claim that ages. It's a structural fact." No data. |
| Forms | A "Get In Touch" block with the phone number, hours (Mon–Sat 10am–7pm) and "Sopanbaug, Pune". |
| CTA strategy | Brochure PDF linked directly (an ungated download, so the lead is lost). |
| SEO | Crawler sees about 30 lines of text. No canonical, no sitemap and no structured data. |
| Performance (inferred) | The JS bundle must load before content appears, so LCP is tied to hydration. |
| Legal | No RERA number in the UI. A privacy-policy anchor exists. |

## Brochure (source of truth): verified facts

| Fact | Value |
|---|---|
| Product | 1 BHK "One Plus Home", product code **725 L** |
| Carpet area | **490 sq.ft.** (includes RERA carpet with permissible enclosed balcony and utility, if applicable) |
| Floor-space efficiency | 65% |
| Rooms | Lobby, Living, Balcony, Bedroom, Kitchen + Dining, Washroom ×2, Utility |
| Planning | "Three-wing layout keeps just two homes to each wing"; east-to-west entrances; vastu-friendly by design. **Conflict:** page 30 says "2 Independent Wings". |
| Architect | Mind Manifestation Architecture: Pawan Gosavi, Chetan Lahoti, Anand Deshmukh |
| Landscape | Treow Design Studio: Swapnil Dhamane ("precision within nature") |
| Club | **Club One, 13,500+ sq.ft.**: Gymnasium, Multipurpose Hall, Indoor Games, Multipurpose Court, Common Area; Fitness Studio; Walking Track; AC library; AC banquet hall; children's play area |
| Daylight (Max Light™) | Achieved: Living 700–1400 lux, Bedrooms 700–1200, Kitchen 500–600. NBC: 100–150 / 60–100 / 150–200 |
| Ventilation (Air Tech™) | Achieved: Living >7 ACH, Bedrooms >9, Kitchen >6. NBC: 3–6 / 2–4 / 4.5 |
| Green | Designed as IGBC Gold rated (targeting) |
| Lifts | 4 high-speed lifts plus 1 service lift (Johnson or equivalent) |
| Neighbourhood | 85+ bird species, 150+ tree species, 1000+ acres of open space, 10,000+ trees |
| Drive times | 30 destinations in six categories (see `content/location.ts` once implemented). All are indicative. |
| Developer | Enerrgia Skyi Ventures (SKYi). Founded 2004 in Pune, over 7 million sq.ft. delivered. CNBC Awaaz Best Residential Project; Realty Plus Top 100; CREDAI Pune; MBVA |
| RERA | **P52100079680** |
| Phone | Brochure: 8855 864 480. Websites: 8855862268. **Conflict.** |

## Content conflicts to resolve before launch

1. Club: 45,000 sq.ft. / 45+ amenities (Site B) vs 13,500+ sq.ft. (brochure).
2. Wings: three wings vs two independent wings.
3. RERA: Site A assets reference P52100077439 (5 Racecourse Ph II), while the brochure states P52100079680. Confirm which disclosure PDFs belong to One Racecourse.
4. Sales phone: 8855862268 vs 8855864480.
5. The brochure T&C block still names "SKYi 5 Racecourse" and "Enerrgia SKYi Landmarks" as the developer, alongside "Enerrgia Skyi Ventures". Legal review is needed.
6. "Homes at 5 Racecourse exceed…" appears in the One Racecourse brochure (p.35). Lux/ACH figures must be confirmed as One Racecourse simulations.

## Missing: [CONTENT REQUIRED]

Price or price band · possession date · construction status and photos · number of floors and homes · tower count · real photography · walkthrough video · approved amenity list · brochure gating decision · privacy policy · WhatsApp business number · CRM target and field mapping.
