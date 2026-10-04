import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeveloperSection } from "@/components/sections/DeveloperSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "SKYi — building in Pune since 2004",
  description: "SKYi has delivered over seven million square feet of homes and commercial spaces in Pune since 2004, including Songbirds, Manas Lake and Five Racecourse.",
  path: "/developer",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Developer", path: "/developer" }]} />
      <DeveloperSection standalone />
      <VisitSection />
    </>
  );
}
