import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { JsonLd } from "./JsonLd";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="container-arch pt-8">
        <ol className="flex flex-wrap gap-2 font-mono text-xs tracking-[0.08em] text-secondary">
          <li><Link href="/" className="hover:text-primary">HOME</Link></li>
          {items.map((it, i) => (
            <li key={it.path} className="flex gap-2">
              <span aria-hidden="true">/</span>
              {i === items.length - 1 ? <span aria-current="page">{it.name.toUpperCase()}</span> : <Link href={it.path}>{it.name.toUpperCase()}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
