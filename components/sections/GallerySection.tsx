import Link from "next/link";
import { gallery } from "@/content/gallery";
import { Gallery } from "./Gallery";

export function GallerySection() {
  return (
    <section aria-labelledby="h-gal" className="container-arch pt-[clamp(80px,11vw,160px)]">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <h2 id="h-gal" className="font-display text-[clamp(2.25rem,4.4vw,4rem)] leading-none">The view was never going to stay outside.</h2>
        <Link href="/gallery" className="link-u py-2.5 text-[15px]">Open gallery ({gallery.length}) →</Link>
      </div>
      <Gallery preview />
      <p className="mt-3.5 text-xs text-secondary">Computer-generated images for representation. Furniture and fittings are not part of the offer.</p>
    </section>
  );
}
