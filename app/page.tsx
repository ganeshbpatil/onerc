import { JsonLd } from "@/components/JsonLd";
import { AddressSection } from "@/components/sections/AddressSection";
import { ClubSection } from "@/components/sections/ClubSection";
import { DeveloperSection } from "@/components/sections/DeveloperSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { HomeSection } from "@/components/sections/HomeSection";
import { IntelligenceSection } from "@/components/sections/IntelligenceSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { faqSchema, residenceSchema } from "@/lib/seo/schema";

export default function HomePage() {
  return (
    <>
      <JsonLd data={[residenceSchema(), faqSchema()]} />
      <Hero />
      <AddressSection />
      <HomeSection />
      <IntelligenceSection />
      <ClubSection />
      <LocationSection />
      <GallerySection />
      <DeveloperSection />
      <VisitSection />
    </>
  );
}
