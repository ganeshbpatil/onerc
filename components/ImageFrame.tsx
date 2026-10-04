import Image from "next/image";
import type { ImageAsset } from "@/content/types";
import { resolveImage } from "@/lib/assets";
import { cn } from "@/lib/utils";

const kindLabel: Record<ImageAsset["kind"], string> = {
  cgi: "Computer-generated image",
  "photo-external": "Externally sourced photograph",
  photo: "Photograph",
  plan: "Indicative plan",
  diagram: "Diagram",
};

/**
 * Real image when the file is present (public/images, via the asset manifest),
 * otherwise a drawing-sheet placeholder naming the file to supply — never a broken image.
 */
export function ImageFrame({
  image,
  className,
  sizes = "100vw",
  priority = false,
  tone = "light",
  caption = true,
}: {
  image: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
  caption?: boolean;
}) {
  const resolved = resolveImage(image);
  const contain = image.fit === "contain";
  return (
    <figure className={cn("relative overflow-hidden", resolved ? (contain ? "bg-paper" : "bg-border") : tone === "dark" ? "hatch-dark" : "hatch", className)}>
      {resolved ? (
        <Image
          src={resolved.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={75}
          unoptimized={resolved.src.endsWith(".svg")}
          className={contain ? "object-contain p-2" : "object-cover"}
        />
      ) : (
        <span role="img" aria-label={image.alt} className="absolute inset-0" />
      )}
      {caption && (
        <figcaption
          className={cn(
            "absolute bottom-3 left-4 right-4 font-mono text-[11px] tracking-[0.06em]",
            resolved ? (contain ? "text-secondary" : "text-paper [text-shadow:0_1px_2px_rgb(0_0_0/0.6)]") : tone === "dark" ? "text-on-inverse-2" : "text-secondary",
          )}
        >
          {resolved ? kindLabel[image.kind] : `[ ${image.file ?? image.ref} ]`}
        </figcaption>
      )}
    </figure>
  );
}
