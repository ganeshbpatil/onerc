import { Breadcrumbs } from "@/components/Breadcrumbs";
import { project } from "@/content/project";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "MahaRERA registration & disclosures",
  description: `One Racecourse is registered with MahaRERA under ${project.rera.number}. Statutory disclosures and documents.`,
  path: "/rera",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "RERA", path: "/rera" }]} />
      <section aria-labelledby="h-rera" className="container-arch section-y pt-12">
        <h1 id="h-rera" className="t-h2">MahaRERA</h1>
        <dl className="mt-12 max-w-[720px] border-t border-rule">
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Project</dt><dd>{project.name}</dd></div>
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Registration</dt><dd className="font-mono">{project.rera.number}</dd></div>
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Promoter</dt><dd>{project.developerEntity}</dd></div>
          <div className="flex justify-between gap-4 border-b border-border py-4"><dt className="text-secondary">Portal</dt><dd><a href={project.rera.portal} target="_blank" rel="noopener" className="link-u">maharera.maharashtra.gov.in ↗</a></dd></div>
        </dl>
        <h2 className="t-h3 mt-16">Documents</h2>
        <ul className="mt-6 max-w-[720px] border-t border-rule">
          {project.disclosures.map((d) => (
            <li key={d.label} className="flex justify-between gap-4 border-b border-border py-4">
              <span>{d.label}</span>
              {d.href ? <a href={d.href} className="link-u" target="_blank" rel="noopener">PDF ↗</a> : <span className="font-mono text-sm text-highlight-text">[CONTENT REQUIRED]</span>}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
