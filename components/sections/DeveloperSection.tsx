import { developer } from "@/content/developer";
import { cn } from "@/lib/utils";

export function DeveloperSection({ standalone = false }: { standalone?: boolean }) {
  const H = standalone ? "h1" : "h2";
  return (
    <section id="developer" aria-labelledby="h-dev" className="container-arch section-y">
      <div className="flex flex-wrap gap-x-20 gap-y-10 border-t border-rule pt-8">
        <div className="flex-[1_1_320px]">
          <p className="eyebrow text-secondary">06 — The developer</p>
          <H id="h-dev" className="mt-4 font-display text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.02]">{developer.heading}</H>
          <p className="mt-6 max-w-[460px] text-secondary">{developer.body}</p>
        </div>
        <dl className="grid min-w-0 flex-[999_1_560px] sm:grid-cols-2 lg:grid-cols-3">
          {developer.proof.map((p) => (
            <div key={p.label} className="border-b border-border py-5 pr-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-secondary">{p.label}</dt>
              <dd className={cn("mt-1.5", "required" in p && p.required && "font-mono text-highlight-text")}>{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {standalone ? (
        <div className="mt-20">
          <h2 className="t-h3 border-b border-rule pb-3">Selected work</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
            {developer.portfolio.map((p) => (
              <li key={p.name} className="flex justify-between gap-4 border-b border-border py-4 pr-4">
                <span>{p.name} <span className="text-secondary">· {p.place}</span></span>
                <span className="font-mono text-xs uppercase text-secondary">{p.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
