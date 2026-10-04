"use client";
import { useState, type KeyboardEvent } from "react";
import { locationCategories } from "@/content/location";
import { project } from "@/content/project";
import type { ImageAsset } from "@/content/types";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { ImageFrame } from "../ImageFrame";

const mapImage: ImageAsset = {
  alt: "Stylised line map of Pune showing One Racecourse relative to Camp, Koregaon Park, Wanowrie and Magarpatta",
  ref: "LINE MAP · rebuild from Location-Connectivity-Laptop.webp as SVG",
  kind: "diagram",
};

const mapsQuery = encodeURIComponent(`${project.name} ${project.address.street} ${project.address.city}`);

export function LocationExplorer() {
  const [active, setActive] = useState(0);
  const cat = locationCategories[active]!;
  const select = (i: number) => {
    setActive(i);
    track("location_interaction", { category: locationCategories[i]!.id });
  };
  const onKey = (e: KeyboardEvent) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    const next = (active + delta + locationCategories.length) % locationCategories.length;
    select(next);
    document.getElementById(`loc-tab-${locationCategories[next]!.id}`)?.focus();
  };
  return (
    <>
      <div role="tablist" aria-label="Destination categories" onKeyDown={onKey} className="-mx-4 mt-16 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {locationCategories.map((c, i) => (
          <button
            key={c.id}
            id={`loc-tab-${c.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="loc-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={cn("min-h-11 shrink-0 border px-[18px] text-sm transition-colors", i === active ? "border-primary bg-primary text-paper" : "border-border-strong hover:border-primary")}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-10">
        <div className="min-w-0 flex-[999_1_560px]">
          <ImageFrame image={mapImage} sizes="(min-width: 1024px) 60vw, 100vw" className="min-h-[320px] md:min-h-[480px]" />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener"
            onClick={() => track("location_interaction", { action: "open_google_maps" })}
            className="link-u mt-4 inline-block py-2 text-[15px]"
          >
            Open in Google Maps ↗
          </a>
        </div>
        <div id="loc-panel" role="tabpanel" aria-labelledby={`loc-tab-${cat.id}`} className="flex-[1_1_320px] self-start">
        <ol className="border-t border-rule">
          {cat.places.map((p) => (
            <li key={p.name} className="flex justify-between gap-4 border-b border-border py-[18px]">
              <span>{p.name}</span>
              <span className="whitespace-nowrap font-mono text-accent">{p.minutes} min</span>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </>
  );
}
