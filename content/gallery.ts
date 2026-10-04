import type { ImageAsset } from "./types";

export type GalleryItem = ImageAsset & { id: string; category: "Interiors" | "Club" | "Neighbourhood" | "Plans" };

/** Files downloaded by scripts/fetch-assets.mjs from the reference sites (see docs/04). */
export const gallery: GalleryItem[] = [
  { id: "living", category: "Interiors", file: "living-room.webp", alt: "Living room of the One Plus Home", ref: "living room", kind: "cgi" },
  ...Array.from({ length: 12 }, (_, i): GalleryItem => {
    const n = String(i + 1).padStart(2, "0");
    return { id: `interior-${n}`, category: "Interiors", file: `gallery-${n}.webp`, alt: `One Plus Home interior, view ${i + 1}`, ref: `interior ${n}`, kind: "cgi" };
  }),
  { id: "gym", category: "Club", file: "club-gym.webp", alt: "Club One fitness studio", ref: "fitness studio", kind: "cgi" },
  { id: "games", category: "Club", file: "club-games.webp", alt: "Club One indoor games lounge", ref: "games lounge", kind: "cgi" },
  { id: "hall", category: "Club", file: "club-hall.webp", alt: "Club One multipurpose hall", ref: "multipurpose hall", kind: "cgi" },
  { id: "kids", category: "Club", file: "club-kids.webp", alt: "Children's play area", ref: "kids' play area", kind: "cgi" },
  { id: "track", category: "Club", file: "club-track.webp", alt: "Walking track along the landscaped edge", ref: "walking track", kind: "cgi" },
  { id: "garden", category: "Neighbourhood", file: "heritage-empress-garden-3.webp", alt: "Empress Botanical Garden, opposite the address", ref: "Empress Garden", kind: "photo-external" },
  { id: "racecourse", category: "Neighbourhood", file: "racecourse-ground.png", alt: "The Pune Racecourse ground", ref: "Racecourse", kind: "photo-external" },
  { id: "cathedral", category: "Neighbourhood", file: "heritage-st-patricks-1.webp", alt: "St. Patrick's Cathedral, Pune", ref: "St. Patrick's", kind: "photo-external" },
  { id: "plan-day", category: "Plans", file: "plan-day.webp", fit: "contain", alt: "Isometric plan, day arrangement", ref: "plan day", kind: "plan" },
  { id: "plan-night", category: "Plans", file: "plan-night.webp", fit: "contain", alt: "Isometric plan, night arrangement", ref: "plan night", kind: "plan" },
  { id: "unit-plan", category: "Plans", file: "unit-plan.webp", fit: "contain", alt: "Typical unit plan, product 725 L", ref: "unit plan", kind: "plan" },
];
