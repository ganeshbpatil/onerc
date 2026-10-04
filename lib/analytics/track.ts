"use client";
import type { AnalyticsEvent, EventParams } from "./events";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Pushes to the GTM dataLayer. Never throws; a no-op when GTM is absent or blocked. */
export function track(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...params, page_path: window.location.pathname });
  } catch {
    /* analytics must never break the page */
  }
}

export function newEventId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
