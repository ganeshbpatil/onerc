"use client";

const KEY = "orc_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;

export type Attribution = {
  utmSource?: string; utmMedium?: string; utmCampaign?: string; utmContent?: string; utmTerm?: string;
  gclid?: string; fbclid?: string; landingPath?: string; referrer?: string;
};

const camel = (k: string) => k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

/** Last non-direct touch wins within a session; landing path + referrer kept from first page of session. */
export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const existing: Attribution = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
    const fromUrl: Attribution = {};
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) (fromUrl as Record<string, string>)[camel(p)] = v.slice(0, 300);
    }
    const next: Attribution = {
      ...existing,
      ...fromUrl,
      landingPath: existing.landingPath ?? url.pathname + url.search,
      referrer: existing.referrer ?? (document.referrer || undefined),
    };
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked — attribution is best-effort */
  }
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
