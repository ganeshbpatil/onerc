import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/sections/Gallery";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Gallery — interiors, Club One and the neighbourhood",
  description: "Computer-generated views of the One Plus Home and Club One, and photographs of the Racecourse neighbourhood around Uday Baug.",
  path: "/gallery",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />
      <section aria-labelledby="h-gallery" className="container-arch section-y pt-12">
        <h1 id="h-gallery" className="t-h2 mb-14 max-w-[16ch]">The view was never going to stay outside.</h1>
        <Gallery />
        <p className="mt-6 text-xs text-secondary">Computer-generated images are for representation only. Neighbourhood photographs are externally sourced. Furniture and fittings are not part of the offer.</p>
      </section>
    </>
  );
}
