import { addressIntro, heritage, heritageIntro, natureStats } from "@/content/address";
import { ImageFrame } from "../ImageFrame";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function AddressSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section id="address" aria-labelledby="h-address" className="container-arch section-y">
      <SectionHeading index="01" eyebrow="The Address" id="h-address" title={addressIntro.heading} as={standalone ? "h1" : "h2"}>
        <p>{addressIntro.body}</p>
      </SectionHeading>

      <Reveal className="mt-20 grid gap-4 lg:grid-cols-3">
        <ImageFrame image={addressIntro.image} sizes="(min-width: 1024px) 66vw, 100vw" className="min-h-[320px] md:min-h-[420px] lg:col-span-2 lg:min-h-[460px]" />
        <div className="flex min-h-[420px] flex-col justify-between gap-8 bg-accent p-8 text-on-inverse">
          <p className="eyebrow text-[11px] text-[#b9c4b9]">Around One Racecourse</p>
          <dl className="grid grid-cols-2 gap-x-5 gap-y-7">
            {natureStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1.5 text-sm text-[#c7cfc6]">{s.label}</dt>
                <dd className="font-display text-[38px] font-medium leading-none tracking-[-0.03em] tabular-nums lg:text-[32px] xl:text-[42px]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-[#b9c4b9]">Source: project brochure. Neighbourhood figures, not project land.</p>
        </div>
      </Reveal>

      <div className="mt-28 border-t border-rule">
        <div className="flex flex-wrap justify-between gap-4 pb-8 pt-5">
          {standalone ? <h2 className="t-h3">A rich heritage, still standing.</h2> : <h3 className="t-h3">A rich heritage, still standing.</h3>}
          <p className="max-w-[520px] text-secondary">{heritageIntro}</p>
        </div>
        <ol tabIndex={0} aria-label="Heritage timeline" className="flex snap-x snap-mandatory overflow-x-auto border-t border-border md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
          {heritage.map((h) => (
            <li key={h.year} className="min-w-[200px] shrink-0 snap-start border-b border-border py-5 pr-5 md:min-w-0">
              <ImageFrame image={{ file: h.file, alt: h.name, ref: h.name, kind: "photo-external" }} caption={false} sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 200px" className="mb-4 aspect-[4/3] w-full" />
              <span className="font-mono text-[13px] text-highlight-text">EST. {h.year}</span>
              <br />
              <span className="text-lg">{h.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
