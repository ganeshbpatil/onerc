# 07 — Analytics, attribution and lead routing

## Architecture

```
Browser ─ dataLayer.push(track()) ──► GTM ──► GA4 (web) · Meta Pixel · Google Ads
   │                                     ▲ Consent Mode v2 (default denied → CookieConsent)
   └─ POST /api/leads (event_id, UTM, gclid, fbclid)
            ├─► Zoho Forms (primary) ──► Zoho CRM Leads (native integration, assignment rules)
            │      ↳ fallback chain: zoho_crm (OAuth API) → webhook (HMAC) → log
            └─► after(): Meta CAPI "Lead" + GA4 Measurement Protocol "generate_lead"   (dedup by event_id)
```

- No analytics code is bundled into the app. `track()` writes to `dataLayer` only, and every vendor tag lives in GTM, so marketing can change tags without a deploy.
- GTM loads `afterInteractive`, after hydration, so it never blocks LCP.
- Server conversions run inside Next's `after()`, so they never add latency to the lead response.

## Event dictionary (`lib/analytics/events.ts`)

| Event | Fired when | Key params |
|---|---|---|
| `page_view` | GTM History Change / All Pages trigger | `page_path` |
| `hero_cta_click` | Hero, header or sticky CTA | `cta` (`explore_home`, `hero_visit`, `header_visit`, `sticky_visit`) |
| `brochure_click` | Brochure dialog opened | `cta_source` |
| `brochure_download` | Download link clicked after lead accepted | `form_source` |
| `call_click` / `whatsapp_click` | `tel:` / `wa.me` links | `cta_source` (`header`, `sticky_bar`, `visit_section`) |
| `form_start` | First focus in any lead form | `form_intent`, `form_source` |
| `form_submit` | Submit pressed | `form_intent`, `form_source` |
| `form_success` | API accepted the lead | `form_intent`, `form_source`, **`event_id`** |
| `form_error` | Validation, network or 5xx error | `error_type` |
| `schedule_visit_start` / `schedule_visit_submit` | Visit form only | `form_source` |
| `gallery_open` | Lightbox opened | `image` |
| `floorplan_open` | Day/night toggle or price dialog | `plan_mode` / `cta_source` |
| `amenity_interaction` | Amenity tab change | `amenity` |
| `location_interaction` | Category tab change or Maps link | `category` / `action` |
| `video_start` / `video_complete` | Reserved for the walkthrough film (**[CONTENT REQUIRED]**) | `video_title` |

## GTM container setup
1. **Variables:** Data Layer Variables for `form_intent`, `form_source`, `event_id`, `cta`, `cta_source`.
2. **GA4 Configuration:** a Google tag with `NEXT_PUBLIC_GA4_MEASUREMENT_ID`. Send every custom event as a GA4 event with the same name. Mark `form_success` (as the `generate_lead` key event), `call_click` and `whatsapp_click` as key events.
3. **Meta Pixel:** base code on All Pages (consent-gated). Fire `Lead` on `form_success` with `eventID = {{event_id}}`, which dedupes against the server-side CAPI Lead.
4. **Google Ads:** Conversion Linker, plus a conversion on `form_success` with Enhanced Conversions (user-provided data from the form, hashed by Google's tag).
5. **Consent:** set every tag to require `ad_storage` / `analytics_storage` as appropriate. Defaults are set to denied in the layout before GTM boots.

## Attribution capture
`lib/analytics/attribution.ts` stores the session's UTM ×5, `gclid`, `fbclid`, landing path and referrer in `sessionStorage`, and the values travel with the lead. The resulting Zoho records support:
- **Offline conversion import:** export Zoho leads that reach *Site Visit Done* or *Booked* with their `gclid`, and import them to Google Ads, so bidding optimises for visits and not just form fills. Do the same for Meta via CAPI using lead stage updates (an n8n flow on a Zoho webhook).
- Campaign → visit → booking reporting in BigQuery.

## Zoho Forms setup (primary lead path)
The adapter reproduces **SKYi's existing Zoho web-to-lead form**: the same field link names, multipart encoding and hidden routing fields as the live 5 Racecourse form on Reference Website 1. A clone of that form therefore works without any remapping.

| Our field | Zoho field link name |
|---|---|
| firstName / lastName | `Name_First` / `Name_Last` |
| email | `Email` |
| mobile (E.164 digits, e.g. 919876543210) | `PhoneNumber_countrycode` |
| utmSource / utmMedium / utmCampaign / utmTerm / utmContent | `utm_source` / `utm_medium` / `utm_campaign` / `utm_term` / `utm_content` |
| gclid / fbclid | `gclid` / `fbclid` |
| landingPath / referrer | `landing_page` / `referrer` |

Static routing fields (`ZOHO_FORMS_STATIC_FIELDS`, defaults shown):

| Field | Label in Zoho | Value |
|---|---|---|
| `Project` | Project | One Racecourse |
| `SingleLine` | Sales Project | ONE RACECOURSE |
| `SingleLine1` | Reference Source | Direct |
| `SingleLine2` | Lead Source | DIGITAL |
| `SingleLine3` | Sub Source | SKYi Websites |
| `SingleLine8` | Origin | Digital |

Steps for SKYi's CRM admin:
1. Duplicate the "5Racecourse" form as "OneRacecourse" and set its CRM integration to the same Leads layout.
2. Copy its Share → Embed → HTML `action` URL into `ZOHO_FORMS_SUBMIT_URL` in `shared/.env.production`, then run the update command in docs/05.
3. Keep Zoho's CAPTCHA off for this form, because the server posts it. Abuse is handled upstream: rate limits, honeypot, time-to-submit check, Origin check and validation.
4. Optional: add a *Preferred time* field and an *Enquiry type* field to the form, then add them to `ZOHO_FORMS_FIELD_MAP`, for example `{"preferredTime":"SingleLine9","intent":"SingleLine10"}`. The current SKYi form has no slot for either.
5. Test: submit from the site, then confirm the lead appears in CRM with the Project and UTM values.

## KPI dashboard (Looker Studio on GA4 + Zoho via BigQuery)

| Layer | Metric |
|---|---|
| Acquisition | Sessions by channel, CPC/CPM (ads), landing-page CVR |
| Engagement | Scroll to `#home`, `floorplan_open` rate, `amenity_interaction`, `location_interaction` |
| Conversion | `form_start → form_success` completion, lead CVR by intent, call and WhatsApp clicks |
| Quality | Lead → contacted (SLA under 15 min) → site visit → booking, by campaign (from Zoho) |
| Efficiency | CPL, cost per site visit, cost per booking, MER |

## Data-quality guardrails
- `event_id` is generated client-side per submit and shared by the browser Lead, the server CAPI Lead and the Zoho record, which gives an exact join key.
- Server-side, mobile numbers are normalised to E.164 (`+91XXXXXXXXXX`) before hashing or sending to CRM.
- Fallback leads go to stdout as `lead.fallback`; alert on any occurrence.
