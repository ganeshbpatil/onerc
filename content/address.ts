import type { ImageAsset } from "./types";

export const addressIntro = {
  heading: "The Racecourse doesn't need an introduction.",
  body: "An address was never about how loudly it announces itself. Only how long it's been known. One Racecourse begins there — at Uday Baug, opposite Sopan Baug, inside the Cantonment's quiet standing.",
  image: {
    alt: "Century-old trees along a pathway in the Empress Botanical Garden, Pune",
    ref: "Empress Botanical Garden · externally sourced",
    file: "heritage-empress-garden-1.webp",
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
  { year: 1817, name: "The Camp", file: "heritage-the-camp-1.webp" },
  { year: 1838, name: "Empress Botanical Garden", file: "heritage-empress-garden-2.webp" },
  { year: 1850, name: "Uday & Sopan Baug", file: "heritage-uday-sopan-baug-1.webp" },
  { year: 1855, name: "St. Patrick's Cathedral", file: "heritage-st-patricks-1.webp" },
  { year: 1895, name: "The Southern Command", file: "heritage-southern-command-1.webp" },
  { year: 1948, name: "The SRPF", file: "heritage-srpf.png" },
] as const;

export const heritageIntro =
  "From the Peshwa era to the Cantonment, the neighbourhood kept a balance of history and modernity that gives it its character.";
