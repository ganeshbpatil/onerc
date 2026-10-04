import type { ImageAsset } from "./types";

export const addressIntro = {
  heading: "The Racecourse doesn't need an introduction.",
  body: "An address was never about how loudly it announces itself. Only how long it's been known. One Racecourse begins there — at Uday Baug, opposite Sopan Baug, inside the Cantonment's quiet standing.",
  image: {
    alt: "Century-old trees along a pathway in the Empress Botanical Garden, Pune",
    ref: "Empress-Botanical-Garden_1.webp · externally sourced",
    kind: "photo-external",
  } satisfies ImageAsset,
};

/** Source: brochure p.72–73 — neighbourhood figures, not project land. */
export const natureStats = [
  { value: "85+", label: "species of birds" },
  { value: "150+", label: "species of trees" },
  { value: "1,000+", label: "acres of open space" },
  { value: "10,000+", label: "trees" },
] as const;

/** Source: Site A heritage section. */
export const heritage = [
  { year: 1817, name: "The Camp" },
  { year: 1838, name: "Empress Botanical Garden" },
  { year: 1850, name: "Uday & Sopan Baug" },
  { year: 1855, name: "St. Patrick's Cathedral" },
  { year: 1895, name: "The Southern Command" },
  { year: 1948, name: "The SRPF" },
] as const;

export const heritageIntro =
  "From the Peshwa era to the Cantonment, the neighbourhood kept a balance of history and modernity that gives it its character.";
