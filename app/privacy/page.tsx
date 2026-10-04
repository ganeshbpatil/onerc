import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: "Privacy policy", description: "How One Racecourse by SKYi collects and uses enquiry data.", path: "/privacy" });

export default function Page() {
  return (
    <section className="container-arch section-y max-w-[820px]">
      <h1 className="t-h2">Privacy policy</h1>
      <p className="mt-10 font-mono text-highlight-text">[CONTENT REQUIRED] — legal-approved policy covering: data collected via enquiry forms (name, mobile, email, preferred time, attribution), processors (Zoho, Google, Meta), retention, consent withdrawal, DPDP Act 2023 rights and grievance officer contact.</p>
    </section>
  );
}
