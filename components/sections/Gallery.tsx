"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CloseIcon, Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { gallery, type GalleryItem } from "@/content/gallery";
import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { ImageFrame } from "../ImageFrame";

const CATS = ["All", ...Array.from(new Set(gallery.map((g) => g.category)))] as const;

export function Gallery({ preview = false }: { preview?: boolean }) {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [index, setIndex] = useState<number | null>(null);
  const items = useMemo(() => {
    const list = cat === "All" ? gallery : gallery.filter((g) => g.category === cat);
    return preview ? list.slice(0, 5) : list;
  }, [cat, preview]);

  const open = (i: number) => {
    setIndex(i);
    track("gallery_open", { image: items[i]!.id });
  };

  return (
    <>
      {!preview && (
        <div role="group" aria-label="Filter gallery" className="mb-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)} className={cn("min-h-11 border px-[18px] text-sm", c === cat ? "border-primary bg-primary text-paper" : "border-border-strong hover:border-primary")}>
              {c}
            </button>
          ))}
        </div>
      )}
      <ul className={cn("grid gap-4", preview ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
        {items.map((item, i) => {
          const lead = preview && i === 0;
          return (
          <li key={item.id} className={cn(lead && "col-span-2 lg:row-span-2")}>
            <button type="button" onClick={() => open(i)} className="group block h-full w-full text-left">
              <ImageFrame image={item} tone={item.id.includes("night") ? "dark" : "light"} sizes={lead ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} className={cn("w-full transition-opacity group-hover:opacity-90", lead ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[4/3]", preview && !lead && "[&>figcaption]:hidden sm:[&>figcaption]:block")} />
            </button>
          </li>
          );
        })}
      </ul>
      <Lightbox items={items} index={index} onIndex={setIndex} />
    </>
  );
}

function Lightbox({ items, index, onIndex }: { items: GalleryItem[]; index: number | null; onIndex: (i: number | null) => void }) {
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => index !== null && onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const item = index !== null ? items[index] : undefined;
  return (
    <Dialog open={index !== null} onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent
        overlayClassName="bg-[rgb(18_20_18/0.96)]"
        className="inset-0 flex flex-col p-4 text-on-inverse sm:p-8"
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          if (start !== null && end !== undefined && Math.abs(end - start) > 50) go(end < start ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs text-on-inverse-2" aria-live="polite">
            {index !== null ? `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}` : ""}
          </p>
          <button type="button" onClick={() => onIndex(null)} aria-label="Close gallery" className="grid size-11 place-items-center"><CloseIcon /></button>
        </div>
        {item && (
          <div className="relative flex min-h-0 flex-1 items-center justify-center py-4">
            <ImageFrame key={item.id} image={item} tone="dark" sizes="100vw" className="anim-rise h-full max-h-[80dvh] w-full max-w-[1400px]" />
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => go(-1)} className="btn btn-outline-light min-h-11" aria-label="Previous image">←</button>
          <div className="min-w-0 text-center">
            <DialogTitle className="truncate text-[15px]">{item?.alt}</DialogTitle>
            <DialogDescription className="font-mono text-[11px] text-on-inverse-2">{item?.category.toUpperCase()} · FOR REPRESENTATION</DialogDescription>
          </div>
          <button type="button" onClick={() => go(1)} className="btn btn-outline-light min-h-11" aria-label="Next image">→</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
