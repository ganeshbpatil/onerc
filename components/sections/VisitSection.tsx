import { project } from "@/content/project";
import { telHref, waHref } from "@/lib/utils";
import { LeadDialog } from "../LeadDialog";
import { LeadForm } from "../LeadForm";
import { TrackedAnchor } from "../TrackedLink";

export function VisitSection({ standalone = false }: { standalone?: boolean }) {
  const H = standalone ? "h1" : "h2";
  return (
    <section id="visit" aria-labelledby="h-visit" className="bg-accent text-[#eef0ea]">
      <div className="container-arch section-y flex flex-wrap gap-x-20 gap-y-14">
        <div className="flex-[1_1_380px]">
          <p className="eyebrow text-[#b9c4b9]">Discover the address</p>
          <H id="h-visit" className="mt-[18px] font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.035em]">Walk the Racecourse with us.</H>
          <p className="mt-7 max-w-[440px] text-accent-100">A private visit, a conversation on availability and pricing, and the plan in person. {project.contact.hours}.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px]">
            <TrackedAnchor href={telHref(project.contact.phone)} event="call_click" params={{ cta_source: "visit_section" }} className="link-u py-2.5">Call {project.contact.phoneDisplay}</TrackedAnchor>
            <TrackedAnchor href={waHref(project.contact.whatsapp, "Hi, I'd like to schedule a visit to One Racecourse.")} target="_blank" rel="noopener" event="whatsapp_click" params={{ cta_source: "visit_section" }} className="link-u py-2.5">WhatsApp</TrackedAnchor>
            <LeadDialog intent="brochure" source="visit_section" className="btn-outline-light min-h-11 px-5 text-sm">Download brochure</LeadDialog>
          </div>
        </div>
        <div className="flex-[1_1_420px]">
          <LeadForm intent="visit" tone="dark" source={standalone ? "visit_page" : "home_final"} />
          <noscript>
            <p className="mt-6">Please call {project.contact.phoneDisplay} to schedule a visit.</p>
          </noscript>
        </div>
      </div>
    </section>
  );
}
