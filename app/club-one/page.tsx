import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ClubSection } from "@/components/sections/ClubSection";
import { VisitSection } from "@/components/sections/VisitSection";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Club One — 13,500+ sq.ft. clubhouse",
  description: "Fitness studio, indoor games lounge, multipurpose hall, children's play area and a walking track — a smaller set of spaces designed to actually be used.",
  path: "/club-one",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Club One", path: "/club-one" }]} />
      <ClubSection standalone />
      <VisitSection />
    </>
  );
}
