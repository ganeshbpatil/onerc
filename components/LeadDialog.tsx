"use client";
import { useState, type ReactNode } from "react";
import { CloseIcon, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { track } from "@/lib/analytics/track";
import type { LeadIntent } from "@/lib/leads/schema";
import { cn } from "@/lib/utils";
import { LeadForm } from "./LeadForm";

const copy: Record<Exclude<LeadIntent, "enquiry" | "visit">, { title: string; body: string }> = {
  brochure: { title: "The brochure", body: "Share a mobile number and the brochure opens right away. No calls unless you ask." },
  price: { title: "Price & floor plan", body: "We'll share current pricing, availability and the dimensioned plan." },
};

/** Gated brochure / price request. Opened from any CTA; one shared form component. */
export function LeadDialog({ intent, source, className, children }: { intent: "brochure" | "price"; source: string; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) track(intent === "brochure" ? "brochure_click" : "floorplan_open", { cta_source: source });
      }}
    >
      <DialogTrigger className={cn("btn", className)}>{children}</DialogTrigger>
      <DialogContent className="inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto bg-surface p-6 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(560px,calc(100vw-32px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-10">
        <div className="mb-8 flex items-start justify-between gap-6 border-b border-rule pb-5">
          <div>
            <DialogTitle className="t-h3">{copy[intent].title}</DialogTitle>
            <DialogDescription className="mt-2 text-secondary">{copy[intent].body}</DialogDescription>
          </div>
          <DialogClose aria-label="Close" className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center">
            <CloseIcon />
          </DialogClose>
        </div>
        <LeadForm intent={intent} tone="light" compact source={source} />
      </DialogContent>
    </Dialog>
  );
}
