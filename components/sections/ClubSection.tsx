import { club } from "@/content/amenities";
import { SectionHeading } from "../SectionHeading";
import { AmenityExplorer } from "./AmenityExplorer";

export function ClubSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="club" aria-labelledby="h-club" className="container-arch section-y">
      <SectionHeading index="04" eyebrow={`${club.name} · ${club.area}`} id="h-club" title={club.heading} as={standalone ? "h1" : "h2"}>
        <p>{club.body}</p>
      </SectionHeading>
      <AmenityExplorer headingLevel={standalone ? "h2" : "h3"} />
      <p className="mt-6 text-xs text-secondary">Computer-generated images for representation. Final amenities as per the Agreement for Sale.</p>
    </section>
  );
}
