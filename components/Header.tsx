import Link from "next/link";
import { nav, project } from "@/content/project";
import { telHref } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { TrackedAnchor, TrackedLink } from "./TrackedLink";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[rgb(236_234_228/0.94)] backdrop-blur-sm supports-[backdrop-filter]:bg-[rgb(236_234_228/0.82)]">
      <a href="#main" className="absolute left-4 -top-24 z-50 inline-flex min-h-11 items-center bg-paper px-4 focus:top-2.5">
        Skip to content
      </a>
      <div className="container-arch flex h-[var(--header-h)] items-center justify-between gap-8">
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
          <span className="font-display text-[21px] font-medium leading-none tracking-[-0.025em] lg:text-[23px]">{project.wordmark}</span>
          <span className="font-mono text-[11px] tracking-[0.12em] text-secondary">BY SKYi</span>
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-7 text-sm tracking-[0.02em]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="py-2.5 hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-5">
          <TrackedAnchor href={telHref(project.contact.phone)} event="call_click" params={{ cta_source: "header" }} className="hidden py-2.5 font-mono text-[13px] xl:inline">
            {project.contact.phoneDisplay}
          </TrackedAnchor>
          <TrackedLink href="/#visit" event="hero_cta_click" params={{ cta: "header_visit" }} className="btn btn-primary hidden min-h-11 px-5 text-sm sm:inline-flex">
            Schedule a visit
          </TrackedLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
