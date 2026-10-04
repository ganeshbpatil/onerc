# 03 — Design System: "Precision Within Nature"

Visual reference: Design canvas, boards 02 (Directions) and 03 (Design system).

## Brand personality
Quiet · architectural · exact · rooted · candid · unhurried · daylit.

## Directions explored

| | A · Editorial Heritage | **B · Precision Within Nature** | C · Nocturne |
|---|---|---|---|
| Type | Cormorant + Manrope | **Google Sans + Montserrat (SKYi reference fonts)** | Syne |
| Colour | Parchment, brass, umber | **Lime plaster, basalt, banyan green, one brass note** | Near-black, champagne |
| Imagery | Archival, centred | **Full-bleed CGI with annotation, rules and grids** | Dusk renders, video |
| Density | Low | **Low–medium, data-rich** | Very low |
| Risk | Over-promises for a 1 BHK; generic "royal" Pune look | Needs discipline to avoid looking sparse | Contradicts Max Light (a daylight product); needs film assets |
| Score (Premium/Fit/Conv/Diff) | 4/2/3/2 = 11 | **5/5/4/5 = 19** | 4/2/2/3 = 11 |

**Selected: B.** The direction comes straight from the project: the landscape architect's principle "precision within nature" and its stated palette ("grey, beige, stone, concrete"). It makes compactness a virtue and lets the NBC data act as the premium signal.

> Tooling note: `ui-ux-pro-max`, Anthropic `frontend-design` and `/design-review` are not installed in this cloud session, and the egress policy blocks GitHub clones of third-party skill repos. The direction was derived manually against the same criteria (product type, luxury real-estate UX, type pairing, palette, landing structure, accessibility and Core Web Vitals). Install the skills locally and re-run them as a check before Phase 18.

## Colour tokens

### Primitive
```
--lime-plaster: #ECEAE4   --paper: #F6F5F1    --stone: #D6D2C8
--concrete:     #8C8B84   --basalt: #191B19   --slate-moss: #4E514B
--banyan:       #22392C   --banyan-300: #8FA394
--brass:        #A9742B   --brass-ink: #8A5D1F  --brass-light: #C9A46A
--night:        #121412   --night-raised: #1E211E
--mist:         #E9E7E1   --mist-2: #A7A9A1
--signal-error: #9B2C1F
```

### Semantic
```
--color-background      var(--lime-plaster)
--color-surface         var(--paper)
--color-surface-inverse var(--night)
--color-text-primary    var(--basalt)
--color-text-secondary  var(--slate-moss)
--color-text-inverse    var(--mist)
--color-text-inverse-2  var(--mist-2)
--color-accent          var(--banyan)
--color-highlight       var(--brass)      /* graphics and focus only on light grounds */
--color-highlight-text  var(--brass-ink)
--color-border          var(--stone)
--color-rule            var(--basalt)
--color-focus           var(--brass)
--color-overlay         rgb(18 20 18 / 0.55)
```

### Component (examples)
```
--button-primary-bg  var(--color-accent)   --button-primary-fg var(--paper)
--button-ghost-border var(--color-rule)
--field-border       var(--concrete)       --field-border-error var(--signal-error)
--stat-number        var(--color-text-primary)
```

### Contrast (WCAG 2.1 AA)
| Pair | Ratio |
|---|---|
| Basalt / lime plaster | 15.6:1 |
| Slate moss / lime plaster | 7.3:1 |
| Paper / banyan | 11.9:1 |
| Brass ink / lime plaster | 5.1:1 |
| Mist-2 / night | 8.0:1 |

## Typography (reference fonts — unchanged from the SKYi site)

The live SKYi/Elementor site (Reference Website 1) sets `--e-global-typography-*-font-family: "Google Sans"` (self-hosted, 400/500/600/700) and loads **Montserrat** from Google Fonts. Those exact families are used here, self-hosted: Google Sans (SIL OFL 1.1) as one 36 KB Latin variable woff2 in `app/fonts/` via `next/font/local` (Google Fonts' build adds a control-character subset that delayed first paint by ~1 s), and Montserrat via `next/font/google`. No runtime calls to Google.

| Role | Family | Size (375 → 1440) | Weight | Tracking |
|---|---|---|---|---|
| Display (hero) | Google Sans | 44 → 104 | 500 | −3.5% |
| H2 | Google Sans | 34 → 64 | 500 | −3% |
| H3 | Google Sans | 24 → 30 | 500 | −1.5% |
| Lead / body | Google Sans | 16 → 19 | 400 | 0 |
| Nav / button | Google Sans | 14 → 15 | 500 | +1% |
| Eyebrow / data / RERA / legal | Montserrat | 11 → 13 | 400–500 | +16%, uppercase for eyebrows; tabular figures |
| Stat numerals | Google Sans | 38 → 46 | 500 | −3% |

Reference Website 2 (React) renders its fonts client-side, so its families could not be read from this environment. If its typography differs and should take precedence, change the two `next/font` imports in `app/layout.tsx`; every component uses the `--font-display` / `--font-sans` / `--font-mono` tokens.

## Space, grid and shape
- 4pt base. Section padding is `clamp(80px, 11vw, 160px)`. Gutter is `clamp(16px, 4vw, 40px)`. Container max is 1360px.
- 12-column grid; the section pattern is a label column (≈1/4) plus a content column (≈3/4).
- **Radius 0.** No shadows. Structure comes from 1px rules (basalt for primary, stone for secondary), not from cards.
- Image placeholders and loading states use a 135° hairline hatch ("drawing-sheet" texture).

## Components
Header (sticky, 64px) · MobileNav (full-screen, serif links) · StickyActionBar (mobile) · Hero · SectionHeading (number + eyebrow + H2 + lead) · StatGrid · HeritageTimeline · PersonaRow · FloorPlanViewer (day/night) · SpecList (dl) · IntelligenceChart (lux/ACH bars) · AmenityExplorer · LocationExplorer (tabs + list + map) · Gallery + Lightbox · DeveloperProof · LeadForm (visit / brochure / price) · Footer (RERA) · CookieConsent.

## Interaction and motion
- Easing `cubic-bezier(.2,.7,.1,1)`, 600ms for reveals and 200ms for UI.
- Allowed: hero image 1.04→1 scale-in, line-mask text reveal on H2s (once), and an image clip-path reveal.
- Not allowed: counters, bounce, parallax on text, autoplay carousels.
- `prefers-reduced-motion: reduce` disables every transform and transition over 0ms.
- Focus: a 2px brass outline with 3px offset, which is visible on light and dark grounds.

## Voice
Short declaratives. Use the brand's own lines first. Never use "dream home", "welcome to" or "experience luxury". Facts always appear in mono, with source footnotes where a claim needs them.
