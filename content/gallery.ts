import type { ImageAsset } from "./types";

export type GalleryItem = ImageAsset & { id: string; category: "Interiors" | "Club" | "Neighbourhood" | "Plans" };

/** Source: Site A uploads. Originals to be re-sourced at master resolution (docs/04). */
export const gallery: GalleryItem[] = [
  { id: "living", category: "Interiors", alt: "Living room of the One Plus Home in daylight", ref: "before-gallery-Living-Room-Banner-laptop-1.webp", kind: "cgi" },
  { id: "bedroom-night", category: "Interiors", alt: "Bedroom at night with the fold-away bed open", ref: "Gallery-Laptop-1-copy-2.webp", kind: "cgi" },
  { id: "balcony", category: "Interiors", alt: "Balcony with full-height windows", ref: "Gallery-Laptop-1-copy-3.webp", kind: "cgi" },
  { id: "kitchen", category: "Interiors", alt: "Kitchen and dining", ref: "Gallery-Laptop-1-copy-4.webp", kind: "cgi" },
  { id: "gym", category: "Club", alt: "Fitness studio", ref: "gym.webp", kind: "cgi" },
  { id: "games", category: "Club", alt: "Indoor games lounge", ref: "table-tennis.webp", kind: "cgi" },
  { id: "hall", category: "Club", alt: "Multipurpose hall", ref: "hall.webp", kind: "cgi" },
  { id: "garden", category: "Neighbourhood", alt: "Empress Botanical Garden", ref: "Empress-Botanical-Garden_2.webp · externally sourced", kind: "photo-external" },
  { id: "cathedral", category: "Neighbourhood", alt: "St. Patrick's Cathedral, Pune", ref: "ST-Patricks-Cathedral_1.webp · externally sourced", kind: "photo-external" },
  { id: "baug", category: "Neighbourhood", alt: "Uday and Sopan Baug", ref: "Uday-Sopan-Baug_1.webp · externally sourced", kind: "photo-external" },
  { id: "iso-day", category: "Plans", alt: "Isometric plan, day", ref: "iso-day.webp", kind: "plan" },
  { id: "iso-night", category: "Plans", alt: "Isometric plan, night", ref: "iso-night.webp", kind: "plan" },
];
