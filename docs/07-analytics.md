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
1. Create the form "One Racecourse — Website" with these fields. Link names are set under field properties → *Field Link Name*:

| Our field | Zoho field type | Suggested link name |
|---|---|---|
| firstName / lastName | Name | `Name_First` / `Name_Last` |
| mobile | Phone (with country code) | `PhoneNumber_countrycode` |
| email | Email | `Email` |
| preferredTime | Dropdown (4 options as in `PREFERRED_TIMES`) | `Dropdown1` |
| intent | Single line (hidden) | `SingleLine` |
| consent | Decision box | `DecisionBox` |
| utmSource … utmTerm, gclid, fbclid, landingPath, referrer, eventId | Single line (hidden) | `SingleLine1` … `SingleLine10` |

2. Go to Share → Embed → **HTML** and copy the `action` URL (`…/formperma/<key>/htmlRecords/submit`) into `ZOHO_FORMS_SUBMIT_URL`.
3. If any link names differ from the defaults, update `ZOHO_FORMS_FIELD_MAP` (JSON).
4. Under Settings → Spam control, **turn off Zoho's CAPTCHA**. The server posts the form, and abuse is handled upstream by the rate limits, honeypot, time-to-submit check, Origin check and Zod validation.
5. Under Integrations → **Zoho CRM**, map to the *Leads* module with Lead Source "Website – One Racecourse", map the UTM fields to CRM custom fields, and turn on assignment rules / round robin.
6. Notifications: an instant email or Cliq message to sales, and an optional WhatsApp auto-reply through Zoho's integration.
7. Test: submit from staging, confirm the lead appears in CRM with UTMs, then submit again with a bad Zoho URL and confirm the webhook or log fallback catches it.

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
