"use client";
import { useState } from "react";
import { onePlus } from "@/content/residences";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { ImageFrame } from "../ImageFrame";

type Mode = "day" | "night";

export function FloorPlanViewer() {
  const [mode, setMode] = useState<Mode>("day");
  const plan = onePlus.plan[mode];
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-[0.1em] text-secondary">PRODUCT CODE {onePlus.productCode} · TYPICAL PLAN</p>
        <div role="group" aria-label="Plan mode" className="flex border border-rule">
          {(["day", "night"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m);
                track("floorplan_open", { plan_mode: m });
              }}
              className={cn("min-h-11 px-6 text-[13px] tracking-[0.1em] transition-colors", mode === m ? "bg-primary text-paper" : "hover:bg-border")}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <ImageFrame image={plan.image} tone={mode === "night" ? "dark" : "light"} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-square max-h-[640px] w-full" />
      <p aria-live="polite" className="mt-3.5 text-[15px] text-secondary">{plan.caption}</p>
    </div>
  );
}
