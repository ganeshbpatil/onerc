/** Marker for facts that must be supplied by SKYi before launch. Rendered visibly in UI. */
export const CONTENT_REQUIRED = "[CONTENT REQUIRED]" as const;

/** Every factual claim carries its source so legal/sales can audit the site. */
export type Sourced<T> = { value: T; source: string; verify?: string };

export type ImageAsset = {
  /** Path under /public. Undefined → a labelled placeholder renders. */
  src?: string;
  alt: string;
  /** Shown as the placeholder label and used for asset sourcing. */
  ref: string;
  kind: "cgi" | "photo-external" | "photo" | "plan" | "diagram";
  width?: number;
  height?: number;
};
