import { onePlus } from "@/content/residences";
import { CONTENT_REQUIRED } from "@/content/types";
import { cn } from "@/lib/utils";
import { LeadDialog } from "../LeadDialog";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { FloorPlanViewer } from "./FloorPlanViewer";

export function HomeSection({ standalone = false }: { standalone?: boolean }) {
  const Sub = standalone ? "h2" : "h3";
  return (
    <section id="home" aria-labelledby="h-home" className="border-y border-border bg-surface">
      <div className="container-arch section-y">
        <SectionHeading index="02" eyebrow="The One Plus Home" id="h-home" title={onePlus.heading} as={standalone ? "h1" : "h2"}>
          <p>{onePlus.intro}</p>
        </SectionHeading>

        <Reveal as="ul" className="mt-[72px] grid border-t border-rule md:grid-cols-3">
          {onePlus.personas.map((p) => (
            <li key={p.mark} className="border-b border-border py-7 pr-7">
              <p className="font-display text-[52px] font-medium leading-none tracking-[-0.04em] text-accent">{p.mark}</p>
              <Sub className="mb-2 mt-4 text-lg font-semibold">{p.title}</Sub>
              <p className="text-base text-secondary">{p.body}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-[72px] flex flex-wrap gap-10">
          <div className="min-w-0 flex-[999_1_560px]">
            <FloorPlanViewer />
          </div>
          <aside className="flex flex-[1_1_300px] flex-col gap-7" aria-label="Home specifications">
            <dl className="border-t border-rule">
              {onePlus.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 border-b border-border py-4">
                  <dt className="text-secondary">{s.label}</dt>
                  <dd className={cn("text-right", "mono" in s && s.mono && "font-mono", s.value === CONTENT_REQUIRED && "text-highlight-text")}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-secondary">{onePlus.carpetNote}</p>
            <div className="flex flex-col gap-2.5">
              <LeadDialog intent="price" source="home_specs" className="btn-primary w-full">Request the floor plan &amp; price</LeadDialog>
              <LeadDialog intent="brochure" source="home_specs" className="btn-ghost w-full">Download brochure</LeadDialog>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
