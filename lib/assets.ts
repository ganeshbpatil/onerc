import manifest from "@/content/assets.generated.json";
import type { ImageAsset } from "@/content/types";

type Manifest = { images: Record<string, { width?: number; height?: number }>; fonts: string[]; brochure: boolean };
const m = manifest as Manifest;

/** Resolves an asset to a servable src only if the file really exists (manifest written by scripts/fetch-assets.mjs). */
export function resolveImage(image: ImageAsset): { src: string; width?: number; height?: number } | undefined {
  if (image.src) return { src: image.src, width: image.width, height: image.height };
  if (!image.file) return undefined;
  const meta = m.images[image.file];
  return meta ? { src: `/images/${image.file}`, ...meta } : undefined;
}

export const hasImage = (file: string) => Boolean(m.images[file]);
export const brochureAvailable = () => m.brochure;
