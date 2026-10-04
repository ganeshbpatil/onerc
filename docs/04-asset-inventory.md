# 04 — Asset Inventory

> **How assets reach the site:** `scripts/fetch-assets.mjs` downloads everything listed in `scripts/assets.manifest.mjs` from the reference sites on the server, during `deploy/install.sh` and every release. Files are saved under **local names** in `shared/images/`. To use SKYi's Google Drive originals instead, drop files with the same local names into that folder. Local name → source:
>
> | Local name | Source file (Site A `wp-content/uploads`) | Used in |
> |---|---|---|
> | `hero-desktop.webp` / `hero-mobile.webp` | `2026/10/1plus-by-skyi-laptop-1.webp` / `1-plus-by-skyi-mobile-1.webp` | Hero (art-directed) |
> | `living-room.webp` | `2026/10/before-gallery-Living-Room-Banner-laptop-1.webp` | Design section, gallery |
> | `plan-day.webp` / `plan-night.webp` / `unit-plan.webp` | `iso-day.webp` / `iso-night.webp` / `2024/08/unit-plan.webp` | Floor-plan viewer, gallery |
> | `gallery-01…12.webp` | `2026/10/Gallery-Laptop-1*.webp` | Gallery |
> | `club-gym / club-games / club-hall / club-kids / club-track.webp` | `gym / table-tennis / hall / kids-play-area / jogging-track.webp` | Club One explorer |
> | `location-map.webp` | `2026/10/Location-Connectivity-Laptop.webp` | Location |
> | `heritage-*.webp`, `heritage-srpf.png`, `racecourse-ground.png` | `2024/09/*` heritage photos | Address section, heritage timeline, gallery |
> | `diagram-*.webp`, `skyi-logo.svg`, `one-plus-mark.webp` | `2024/09/*`, `2024/08/sky-i.svg`, `plus.webp` | Reserved (downloaded, not yet placed) |
> | `One-Racecourse-Brochure.pdf` → `shared/private/` | Site B `/uploads/One-Racecourse-Brochure.pdf` | Gated brochure |
>
> **Review needed:** the twelve `Gallery-Laptop` files have no descriptive names on the source site, so their alt text is generic ("One Plus Home interior, view N"). Replace the alt text in `content/gallery.ts` once someone has looked at them.

All assets are hosted on the reference sites. The listed dimensions are WordPress size variants taken from the filenames. Originals must be re-sourced from SKYi at master resolution; do not scrape the derivative copies. Every render must carry a "Computer-generated image" label, and externally sourced neighbourhood photos must say so (the brochure disclaimer already requires this).

Base A = `https://mediumpurple-squirrel-394820.hostingersite.com/wp-content/uploads`

| Asset | Source | Max size seen | Format | Type | Recommended section | Optimisation |
|---|---|---|---|---|---|---|
| `2024/08/sky-i.svg`, `skyi_logo.webp` | A | 300×86 variant | SVG / WebP | Brand | Header, footer | Request a vector master; inline SVG |
| `2026/10/1plus-by-skyi-laptop-1.webp` / `1-plus-by-skyi-mobile-1.webp` | A | 1536×960 / 1229×1536 | WebP | CGI | Hero (art-directed desktop and mobile) | AVIF 1920/1280/828, preload, `priority` |
| `2026/10/before-gallery-Living-Room-Banner-{laptop,mobile}-1.webp` | A | 1536×960 | WebP | CGI interior | Gallery lead and home section | AVIF responsive |
| `2026/10/Gallery-Laptop-1…copy-11.webp` (12) | A | n/a | WebP | CGI day/night | Gallery and lightbox | Rename semantically; AVIF; lazy |
| `2026/10/Gallery-Mobile-1…copy-11.webp` (12) | A | n/a | WebP | CGI mobile crops | Gallery (`<picture>` art direction) | Same as above |
| `2026/10/iso-day.webp`, `iso-night.webp` | A, B | 768×767 | WebP | Iso plan | FloorPlanViewer | Request 2000px+ masters; ideally SVG plans |
| `2024/08/unit-plan.webp` | A | 768×768 | WebP | 2D plan | FloorPlanViewer (2D tab) | Request vector or PDF; gate high-resolution version |
| `2026/10/gym*.webp` | A | 1536×960 / 1229×1536 | WebP | CGI | Club One: Fitness Studio | AVIF, lazy |
| `2026/10/table-tennis*.webp` | A | 1536×960 | WebP | CGI | Club One: Indoor Games | AVIF, lazy |
| `2026/10/hall*.webp` | A | 1536×960 | WebP | CGI | Club One: Multipurpose Hall | AVIF, lazy |
| `2026/10/kids-play-area*.webp` | A | 1536×960 | WebP | CGI | Club One: Kids' play | AVIF, lazy |
| `2026/10/jogging-track.webp`, `jogging-ttrack.webp` | A | 1536×960 | WebP | CGI | Club One: Walking Track | Fix filename typo |
| `2026/10/Location-Connectivity-{Laptop,Mobile}.webp` | A | 2048×1153 | WebP | Map graphic | Reference only; rebuild as SVG or interactive map | Do not ship as content (not indexable) |
| `2024/09/Empress-Botanical-Garden_{1,2,3}.webp` | A | 1024×533 | WebP | Photo (external) | The Address | Label "externally sourced"; check licence |
| `2024/09/ST-Patricks-Cathedral_{1-3}.webp` | A | 1024×533 | WebP | Photo (external) | Heritage timeline | Same as above |
| `2024/09/Uday-Sopan-Baug_{1-3}.webp` | A | 1024×533 | WebP | Photo (external) | Heritage timeline | Same as above |
| `2024/09/the-camp_{1-3}.webp` | A | 1024×533 | WebP | Photo (external) | Heritage timeline | Same as above |
| `2024/08/The-Southern-Command{,_2,_3}.webp`, `-logo.webp` | A | 1024×533 | WebP | Photo / insignia | Heritage timeline | **Legal check:** use of military insignia |
| `2024/09/SRPF-5-RC-min.png`, `RC-Ground-min-1.png`, `Army-Tank-5-RC-2-min-1-1.png` | A | 2048px | PNG | Photo | Heritage (optional) | Convert to AVIF (≈90% smaller); legal check |
| `2024/09/max-light*.webp`, `more-light-less-heat.webp`, `Large-Windows.webp`, `Shadow-Range-{Dec,May}-21.webp` | A | n/a | WebP | Diagram | Intelligence section | Rebuild as SVG or charts for clarity and scale |
| `2024/09/air-tech.webp`, `wind-2.webp`, `Wind-Path-Oriented-Homes.webp`, `more-air-changes.webp` | A | n/a | WebP | Diagram | Intelligence section | Same as above |
| `2024/09/Five-Racecourse-video.webp` | A | 1024×574 | WebP | Video poster | **Do not use.** This is the 5 Racecourse video | n/a |
| `2024/08/5-RaceCourse-By-Skyi-Phase-II-P52100077439-Tower-B-min.png` | A | 2048×2048 | PNG | 5 RC asset | **Do not use** | n/a |
| `2024/09/Screenshot-*.png/jpeg` (4) | A | n/a | PNG/JPEG | Screenshots | **Do not use** | n/a |
| `2024/08/features_2-1.webp`, `Page-no-9-{1-5}.webp` | A | n/a | WebP | Brochure crops | Replace with live components | n/a |
| `uploads/One-Racecourse-Brochure.pdf` | B | 95 pp | PDF | Brochure | Gated download | Compress (likely > 20MB); host on R2/CDN; serve a signed link after lead submission |
| `2026/02/Form-V.pdf`, `Six-Monthly-Compliance-Report.pdf`, `EC-Letter_2023.pdf` | A | n/a | PDF | Legal | /rera | **Confirm they belong to P52100079680** |

## Gaps: [CONTENT REQUIRED]
- Real site and neighbourhood photography (commission a half-day shoot: golden hour at Empress Garden, Sopan Baug and Racecourse).
- Construction progress photos, refreshed monthly, for `/progress`.
- Walkthrough film (15s loop for the hero and 60s full).
- Vector floor plans with dimensions approved by the architect.
- Club One renders for: Yoga & Meditation Deck, Multipurpose Court, Library, Banquet.
- OG share image (1200×630) and favicon set.

AI-generated imagery: none is used. If the team ever uses AI imagery for mood, it must be stored in `/public/images/generated/`, labelled "Illustrative, AI-generated", and never presented as the project.
