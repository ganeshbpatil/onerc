import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AddressSection } from "@/components/sections/AddressSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "The Address — Uday Baug, Pune Cantonment",
  description: "Opposite Sopan Baug and the Empress Botanical Garden, inside the Racecourse neighbourhood of Pune Cantonment. Heritage since 1817, 1,000+ acres of open space around.",
  path: "/the-address",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "The Address", path: "/the-address" }]} />
      <AddressSection standalone />
      <LocationSection />
      <VisitSection />
    </>
  );
}
