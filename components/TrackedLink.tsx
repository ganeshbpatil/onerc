"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import type { AnalyticsEvent, EventParams } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

type Props = ComponentProps<typeof Link> & { event: AnalyticsEvent; params?: EventParams };

export function TrackedLink({ event, params, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}

export function TrackedAnchor({ event, params, onClick, ...props }: ComponentProps<"a"> & { event: AnalyticsEvent; params?: EventParams }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    />
  );
}
