import { locationCategories, locationIntro } from "@/content/location";
import { SectionHeading } from "../SectionHeading";
import { LocationExplorer } from "./LocationExplorer";

export function LocationSection({ standalone = false, fullList = false }: { standalone?: boolean; fullList?: boolean }) {
  return (
    <section id="location" aria-labelledby="h-loc" className="border-y border-border bg-surface">
      <div className="container-arch section-y">
        <SectionHeading index="05" eyebrow="Location" id="h-loc" title={locationIntro.heading} as={standalone ? "h1" : "h2"}>
          <p>{locationIntro.body}</p>
        </SectionHeading>
        <LocationExplorer />
        <p className="mt-5 text-xs text-secondary">{locationIntro.disclaimer}</p>
        {fullList ? (
          <div className="mt-20 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {locationCategories.map((c) => (
              <section key={c.id} aria-labelledby={`all-${c.id}`}>
                <h2 id={`all-${c.id}`} className="t-h3 border-b border-rule pb-3">{c.label}</h2>
                <ul>
                  {c.places.map((p) => (
                    <li key={p.name} className="flex justify-between gap-4 border-b border-border py-3 text-[15px]">
                      <span>{p.name}</span>
                      <span className="font-mono text-accent">{p.minutes} min</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
