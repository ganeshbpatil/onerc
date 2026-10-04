/** Single source of truth for the measurement plan (docs/07-analytics.md). */
export const ANALYTICS_EVENTS = [
  "page_view",
  "hero_cta_click",
  "brochure_click",
  "brochure_download",
  "call_click",
  "whatsapp_click",
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "schedule_visit_start",
  "schedule_visit_submit",
  "gallery_open",
  "floorplan_open",
  "amenity_interaction",
  "location_interaction",
  "video_start",
  "video_complete",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
export type EventParams = Record<string, string | number | boolean | undefined>;
