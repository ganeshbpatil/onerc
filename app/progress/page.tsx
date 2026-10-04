import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VisitSection } from "@/components/sections/VisitSection";
import { project } from "@/content/project";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Construction progress",
  description: "Construction updates for One Racecourse by SKYi, MahaRERA P52100079680.",
  path: "/progress",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Progress", path: "/progress" }]} />
      <section aria-labelledby="h-progress" className="container-arch section-y pt-12">
        <p className="eyebrow text-secondary">Construction</p>
        <h1 id="h-progress" className="t-h2 mt-4 max-w-[16ch]">Built to hold its ground — on the record.</h1>
        <dl className="mt-14 max-w-[720px] border-t border-rule">
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Status</dt><dd className="font-mono text-highlight-text">{project.constructionStatus}</dd></div>
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Possession</dt><dd className="font-mono text-highlight-text">{project.possession}</dd></div>
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Quarterly updates</dt><dd><a href={project.rera.portal} target="_blank" rel="noopener" className="link-u">MahaRERA portal ↗</a></dd></div>
        </dl>
        <p className="mt-8 max-w-[640px] text-secondary">Monthly site photography will be published here once construction begins. [CONTENT REQUIRED]</p>
      </section>
      <VisitSection />
    </>
  );
}
