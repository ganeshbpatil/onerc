"use client";
import { useState, type KeyboardEvent } from "react";
import { amenities } from "@/content/amenities";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { ImageFrame } from "../ImageFrame";

/** WAI-ARIA tabs: arrow keys move between amenities, one panel at a time. */
export function AmenityExplorer({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Sub = headingLevel;
  const [active, setActive] = useState(0);
  const current = amenities[active]!;

  const select = (i: number) => {
    setActive(i);
    track("amenity_interaction", { amenity: amenities[i]!.id });
  };
  const onKey = (e: KeyboardEvent) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + amenities.length) % amenities.length;
    select(next);
    document.getElementById(`amenity-tab-${amenities[next]!.id}`)?.focus();
  };

  return (
    <div className="mt-[72px] flex flex-wrap gap-10">
      <div role="tablist" aria-label="Club One amenities" aria-orientation="vertical" onKeyDown={onKey} className="flex flex-[1_1_300px] flex-col border-t border-rule">
        {amenities.map((a, i) => (
          <button
            key={a.id}
            id={`amenity-tab-${a.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="amenity-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={cn("flex items-baseline justify-between gap-3 border-b border-border py-5 text-left transition-colors", i === active ? "text-primary" : "text-secondary hover:text-primary")}
          >
            <span className="font-display text-[22px] font-medium leading-tight tracking-[-0.015em] lg:text-[26px]">{a.name}</span>
            <span className={cn("font-mono text-xs", i === active ? "text-highlight-text" : "text-secondary")}>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <div id="amenity-panel" role="tabpanel" aria-labelledby={`amenity-tab-${current.id}`} className="min-w-0 flex-[999_1_560px]">
        <ImageFrame key={current.id} image={current.image} sizes="(min-width: 1024px) 60vw, 100vw" className="anim-rise aspect-[16/10] w-full" />
        <div className="mt-6 flex flex-wrap justify-between gap-x-10 gap-y-4">
          <div>
            <p className="eyebrow text-[11px] text-secondary">{current.category}</p>
            <Sub className="t-h3 mt-1">{current.name}</Sub>
          </div>
          <p className="max-w-[480px] text-secondary">{current.copy}</p>
        </div>
      </div>
    </div>
  );
}
