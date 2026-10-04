"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { project } from "@/content/project";
import { track } from "@/lib/analytics/track";
import { cn, telHref, waHref } from "@/lib/utils";

/**
 * Mobile-only: appears after the hero leaves the viewport, hides while the
 * final enquiry form is on screen (no duplicate CTA next to the form).
 */
export function StickyActionBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    const form = document.getElementById("visit");
    let heroOut = !hero;
    let formIn = false;
    const update = () => setVisible(heroOut && !formIn);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroOut = !e.isIntersecting;
        if (e.target === form) formIn = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (form) io.observe(form);
    update();
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 grid grid-cols-[56px_56px_minmax(0,1fr)] gap-2 border-t border-border bg-background px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      <a href={telHref(project.contact.phone)} aria-label="Call the sales team" onClick={() => track("call_click", { cta_source: "sticky_bar" })} className="grid h-[52px] place-items-center border border-rule">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" /></svg>
      </a>
      <a href={waHref(project.contact.whatsapp, "Hi, I'd like to know more about One Racecourse.")} target="_blank" rel="noopener" aria-label="Chat on WhatsApp" onClick={() => track("whatsapp_click", { cta_source: "sticky_bar" })} className="grid h-[52px] place-items-center border border-rule">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
      </a>
      <Link href="/#visit" onClick={() => track("hero_cta_click", { cta: "sticky_visit" })} className="btn btn-primary h-[52px]">
        Schedule a visit
      </Link>
    </div>
  );
}
