import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IntelligenceSection } from "@/components/sections/IntelligenceSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Design — Max Light™ & Air Tech™ daylight and ventilation",
  description: "Homes planned to the sun path and the site's wind path: daylight and air changes well above National Building Code minimums. Architecture by Mind Manifestation, landscape by Treow Design Studio.",
  path: "/design",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Design", path: "/design" }]} />
      <IntelligenceSection standalone />
      <VisitSection />
    </>
  );
}
