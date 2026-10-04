import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LocationSection } from "@/components/sections/LocationSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Location & connectivity — Racecourse, Pune Camp",
  description: "Indicative drive times from One Racecourse: Fatima Nagar metro (proposed) 2 min, Magarpatta 8 min, Pune Railway Station 15 min, Pune Airport 25 min. Schools, hospitals and clubs nearby.",
  path: "/location",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Location", path: "/location" }]} />
      <LocationSection standalone fullList />
      <VisitSection />
    </>
  );
}
