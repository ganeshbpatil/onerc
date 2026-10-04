import Image from "next/image";
import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/utils";

const kindLabel: Record<ImageAsset["kind"], string> = {
  cgi: "Computer-generated image",
  "photo-external": "Externally sourced photograph",
  photo: "Photograph",
  plan: "Indicative plan",
  diagram: "Diagram",
};

/**
 * Real image when `src` exists, otherwise a drawing-sheet placeholder naming the
 * asset to source — so missing imagery is visible in review, never faked.
 */
export function ImageFrame({
  image,
  className,
  sizes = "100vw",
  priority = false,
  tone = "light",
}: {
  image: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
}) {
  return (
    <figure className={cn("relative overflow-hidden", image.src ? "bg-border" : tone === "dark" ? "hatch-dark" : "hatch", className)}>
      {image.src ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" quality={75} />
      ) : (
        <span role="img" aria-label={image.alt} className="absolute inset-0" />
      )}
      <figcaption className={cn("absolute bottom-3 left-4 right-4 font-mono text-[11px] tracking-[0.08em]", tone === "dark" || image.src ? "text-on-inverse-2" : "text-secondary")}>
        {image.src ? kindLabel[image.kind] : `[ ${image.ref} ]`}
      </figcaption>
    </figure>
  );
}
