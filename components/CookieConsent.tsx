"use client";
import { useEffect, useState } from "react";
import { captureAttribution } from "@/lib/analytics/attribution";

const KEY = "orc_consent";

function update(granted: boolean) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
  const state = granted ? "granted" : "denied";
  const args = ["consent", "update", { ad_storage: state, ad_user_data: state, ad_personalization: state, analytics_storage: state }];
  if (w.gtag) w.gtag(...args);
  else (w.dataLayer ??= []).push(args);
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    captureAttribution();
    let pending = false;
    try {
      pending = !localStorage.getItem(KEY);
    } catch {
      /* storage blocked: stay with denied defaults, no banner loop */
    }
    if (!pending) return;
    // Consent defaults are "denied", so asking can wait until the visitor engages:
    // keeps the hero and its primary CTA unobstructed on first paint.
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(KEY, granted ? "granted" : "denied");
    } catch {}
    update(granted);
    setShow(false);
  };

  return (
    <section aria-label="Cookie preferences" className="fixed inset-x-4 bottom-[88px] z-40 border border-rule bg-surface p-5 text-sm sm:right-auto sm:w-[400px] lg:bottom-6 lg:left-6">
      <p className="text-secondary">We use cookies to measure which pages help visitors and to improve our advertising. You can decline; the site works the same.</p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose(true)} className="btn btn-primary min-h-11 px-5 text-sm">Accept</button>
        <button type="button" onClick={() => choose(false)} className="btn btn-ghost min-h-11 px-5 text-sm">Decline</button>
      </div>
    </section>
  );
}
