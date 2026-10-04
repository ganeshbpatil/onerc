import type { Metadata } from "next";
import Link from "next/link";
import { project } from "@/content/project";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = { title: "Thank you", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <section className="container-arch section-y">
      <p className="eyebrow text-secondary">Visit requested</p>
      <h1 className="t-h2 mt-4 max-w-[14ch]">Thank you. We&apos;ll call to confirm your visit.</h1>
      <p className="lead mt-8 max-w-[560px] text-secondary">Our team usually responds within working hours ({project.contact.hours}). If it&apos;s urgent, call <a className="link-u" href={telHref(project.contact.phone)}>{project.contact.phoneDisplay}</a>.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/location" className="btn btn-ghost">See how to get here</Link>
        <Link href="/" className="btn btn-primary">Back to the home page</Link>
      </div>
    </section>
  );
}
