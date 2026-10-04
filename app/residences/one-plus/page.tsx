import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HomeSection } from "@/components/sections/HomeSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { onePlus } from "@/content/residences";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "One Plus Home — 1 BHK, 490 sq.ft., floor plan & specifications",
  description: "The 725 L One Plus Home: a 490 sq.ft.* 1 BHK with two washrooms and 65% floor-space efficiency, planned to adapt from one life to the next. Plan, specifications and pricing on request.",
  path: "/residences/one-plus",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Residences", path: "/residences/one-plus" }, { name: "One Plus", path: "/residences/one-plus" }]} />
      <HomeSection standalone />
      <section aria-labelledby="h-spec" className="container-arch section-y">
        <h2 id="h-spec" className="t-h2">Specifications</h2>
        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(onePlus.specifications).map(([group, items]) => (
            <section key={group} aria-labelledby={`spec-${group}`}>
              <h3 id={`spec-${group}`} className="eyebrow border-b border-rule pb-3 text-secondary">{group}</h3>
              <ul>
                {items.map((i) => (
                  <li key={i} className="border-b border-border py-3 text-[15px]">{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 max-w-[760px] text-xs text-secondary">{onePlus.kitchenNote} Brands are indicative; equivalent make and quality may be used as per availability.</p>
      </section>
      <VisitSection />
    </>
  );
}
