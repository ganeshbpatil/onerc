import Link from "next/link";
import { nav, project } from "@/content/project";

export function Footer() {
  return (
    <footer className="bg-inverse pb-24 text-sm text-on-inverse-2 lg:pb-0">
      <div className="container-arch pb-10 pt-[72px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
          <div>
            <p className="font-display text-[32px] leading-none text-on-inverse">{project.wordmark}</p>
            <address className="mt-3 not-italic">
              {project.address.street}, {project.address.locality}, {project.address.region}
            </address>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow text-[11px] text-on-inverse">Explore</p>
            <ul className="mt-2 flex flex-col">
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href} className="inline-block py-1 hover:text-on-inverse">{n.label}</Link></li>
              ))}
              <li><Link href="/gallery" className="inline-block py-1 hover:text-on-inverse">Gallery</Link></li>
              <li><Link href="/progress" className="inline-block py-1 hover:text-on-inverse">Construction progress</Link></li>
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-[11px] text-on-inverse">MahaRERA</p>
            <p className="mt-3 font-mono">{project.rera.number}</p>
            <p className="mt-1"><a href={project.rera.portal} target="_blank" rel="noopener" className="link-u inline-block py-1">maharera.maharashtra.gov.in</a></p>
            <p className="mt-1"><Link href="/rera" className="link-u inline-block py-1">Disclosures</Link></p>
          </div>
          <div>
            <p className="eyebrow text-[11px] text-on-inverse">Developer</p>
            <p className="mt-3">{project.developerEntity} · a {project.developerBrand} project</p>
            <p className="mt-1 flex gap-3"><Link href="/privacy" className="link-u inline-block py-1">Privacy</Link><Link href="/terms" className="link-u inline-block py-1">Terms</Link></p>
            <p className="mt-1 flex gap-3">
              <a href={project.social.instagram} target="_blank" rel="noopener" className="link-u inline-block py-1">Instagram</a>
              <a href={project.social.youtube} target="_blank" rel="noopener" className="link-u inline-block py-1">YouTube</a>
              <a href={project.social.facebook} target="_blank" rel="noopener" className="link-u inline-block py-1">Facebook</a>
            </p>
          </div>
        </div>
        <p className="mt-14 max-w-[980px] border-t border-[rgb(233_231_225/0.12)] pt-6 text-xs leading-relaxed">
          This website is a marketing communication and not a legal offering. Images are computer-generated or externally sourced and for representation only. Distances and drive times are indicative. Furniture and fittings shown are not part of the offer. Nothing here limits any right a purchaser has under the Real Estate (Regulation and Development) Act, 2016.
        </p>
      </div>
    </footer>
  );
}
