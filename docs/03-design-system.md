# 03 — Design System: "Precision Within Nature"

Visual reference: Design canvas, boards 02 (Directions) and 03 (Design system).

## Brand personality
Quiet · architectural · exact · rooted · candid · unhurried · daylit.

## Directions explored

| | A · Editorial Heritage | **B · Precision Within Nature** | C · Nocturne |
|---|---|---|---|
| Type | Cormorant + Manrope | **Instrument Serif + Hanken Grotesk + IBM Plex Mono** | Syne |
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

## Typography

| Role | Family | Size (375 → 1440) | Line height | Tracking |
|---|---|---|---|---|
| Display | Instrument Serif | 52 → 132 | 0.94 | −2.5% |
| H2 | Instrument Serif | 40 → 84 | 1.0 | −2% |
| H3 | Instrument Serif | 28 → 36 | 1.15 | 0 |
| Lead | Hanken Grotesk 400 | 18 → 19 | 1.6 | 0 |
| Body | Hanken Grotesk 400 | 16 → 17 | 1.6 | 0 |
| Nav / button | Hanken Grotesk 500 | 14 → 15 | 1.2 | +2% |
| Eyebrow / data / RERA | IBM Plex Mono 400 | 11 → 13 | 1.4 | +12–14%, uppercase |
| Stat numerals | Instrument Serif | 40 → 52 | 1.0 | tabular |

Rationale: Instrument Serif gives editorial authority with a narrow, architectural cut. Hanken Grotesk is a warm grotesk that is readable at 16px and avoids Inter, Roboto and Poppins. Plex Mono reads like drawing annotations and carries all data and legal text, which separates fact from voice. All three load through `next/font/google` with `display: swap` and Latin subsets.

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
