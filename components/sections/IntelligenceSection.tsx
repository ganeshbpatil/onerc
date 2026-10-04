import { intelligence } from "@/content/intelligence";
import type { ImageAsset } from "@/content/types";
import { ImageFrame } from "../ImageFrame";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

type Row = { zone: string; achieved: readonly [number, number]; nbc: readonly [number, number]; achievedLabel?: string };

const fmt = (n: number) => n.toLocaleString("en-IN");
const range = ([a, b]: readonly [number, number]) => (a === b ? fmt(a) : `${fmt(a)}–${fmt(b)}`);

function Bar({ from, to, max, className }: { from: number; to: number; max: number; className: string }) {
  const left = (from / max) * 100;
  const width = Math.max(((to - from) / max) * 100, 1.2);
  return (
    <div className="relative h-1.5 bg-[rgb(233_231_225/0.08)]" aria-hidden="true">
      <div className={`absolute inset-y-0 ${className}`} style={{ left: `${left}%`, width: `${width}%` }} />
    </div>
  );
}

function Chart({ title, unit, max, rows, accent, bar, unitShort }: { title: string; unit: string; max: number; rows: readonly Row[]; accent: string; bar: string; unitShort: string }) {
  return (
    <figure>
      <figcaption className="flex flex-wrap justify-between gap-3 border-b border-[rgb(233_231_225/0.2)] pb-3.5">
        <span className="font-display text-[30px]">{title}</span>
        <span className="self-center font-mono text-xs uppercase text-on-inverse-2">{unit}</span>
      </figcaption>
      <ul>
        {rows.map((r) => (
          <li key={r.zone} className="border-b border-[rgb(233_231_225/0.1)] py-5">
            <p className="sr-only">
              {r.zone}: achieved {r.achievedLabel ?? `${range(r.achieved)} ${unitShort}`}, National Building Code requirement {range(r.nbc)} {unitShort}.
            </p>
            <div className="flex justify-between gap-3 text-[15px]" aria-hidden="true">
              <span>{r.zone}</span>
              <span className={`font-mono ${accent}`}>{r.achievedLabel ?? `${range(r.achieved)} ${unitShort}`}</span>
            </div>
            <div className="mt-2.5 flex flex-col gap-1">
              <Bar from={0} to={r.nbc[1]} max={max} className="bg-[#6e716a]" />
              <Bar from={0} to={r.achieved[1]} max={max} className={bar} />
            </div>
            <p className="mt-2 font-mono text-[11px] text-on-inverse-2" aria-hidden="true">NBC REQUIRED {range(r.nbc)} {unitShort.toUpperCase()}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

const landscape: ImageAsset = { alt: "Landscape axis with layered planting between the wings", ref: "RENDER · landscape axis · Treow Design Studio", kind: "cgi" };

export function IntelligenceSection({ standalone = false }: { standalone?: boolean }) {
  const { lux, ach } = intelligence;
  return (
    <section id="intelligence" aria-labelledby="h-intel" className="bg-inverse text-on-inverse">
      <div className="container-arch section-y">
        <SectionHeading index="03" eyebrow="Invisible intelligence" id="h-intel" title={intelligence.heading} inverse as={standalone ? "h1" : "h2"}>
          <p>{intelligence.body}</p>
        </SectionHeading>
        <Reveal className="mt-20 grid gap-14 md:grid-cols-2">
          <Chart title={lux.title} unit={lux.unit} max={lux.max} rows={lux.rows} accent="text-highlight-light" bar="bg-highlight-light" unitShort="lux" />
          <Chart title={ach.title} unit={ach.unit} max={ach.max} rows={ach.rows} accent="text-[#9fc0a8]" bar="bg-[#9fc0a8]" unitShort="ACH" />
        </Reveal>
        <p className="mt-8 flex flex-wrap gap-x-7 gap-y-2.5 font-mono text-[11px] text-on-inverse-2">
          <span>▬ GREY: NATIONAL BUILDING CODE</span>
          <span>▬ COLOUR: ACHIEVED (SKYi, PROJECT BROCHURE)</span>
        </p>

        <div className="mt-24 grid gap-4 md:grid-cols-3">
          <ImageFrame image={landscape} tone="dark" sizes="(min-width: 768px) 66vw, 100vw" className="min-h-[300px] md:col-span-2 md:min-h-[360px]" />
          <div className="flex flex-col gap-5 border border-[rgb(233_231_225/0.18)] p-7">
            <p className="font-display text-[26px] leading-tight">“{intelligence.principle}”</p>
            {intelligence.credits.map((c) => (
              <div key={c.role}>
                <p className="eyebrow text-[11px] text-on-inverse-2">{c.role}</p>
                <p className="mt-1 text-[15px]">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 max-w-[760px] text-[#bdbeb7]">{intelligence.planning}</p>
      </div>
    </section>
  );
}
