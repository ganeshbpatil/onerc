/** Marker for facts that must be supplied by SKYi before launch. Rendered visibly in UI. */
export const CONTENT_REQUIRED = "[CONTENT REQUIRED]" as const;

/** Every factual claim carries its source so legal/sales can audit the site. */
export type Sourced<T> = { value: T; source: string; verify?: string };

export type ImageAsset = {
  /** File name under public/images (see scripts/assets.manifest.mjs). Missing on disk → labelled placeholder. */
  file?: string;
  /** Explicit src override (absolute path or URL). */
  src?: string;
  /** "cover" crops to fill (photos); "contain" shows the whole image (plans, maps, diagrams). */
  fit?: "cover" | "contain";
  alt: string;
  /** Shown as the placeholder label and used for asset sourcing. */
  ref: string;
  kind: "cgi" | "photo-external" | "photo" | "plan" | "diagram";
  width?: number;
  height?: number;
};
