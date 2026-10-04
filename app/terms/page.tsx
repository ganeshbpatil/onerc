import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: "Terms & disclaimer", description: "Terms of use and disclaimer for the One Racecourse website.", path: "/terms" });

export default function Page() {
  return (
    <section className="container-arch section-y max-w-[820px]">
      <h1 className="t-h2">Terms &amp; disclaimer</h1>
      <div className="mt-10 flex flex-col gap-5 text-secondary">
        <p>This website is a marketing communication and not a legal offering. It is not an offer, an invitation to offer or a contract, and it forms no part of any Agreement for Sale. Plans, specifications, designs, features, facilities and services shown are indicative and may change at the developer&apos;s discretion, subject to applicable law.</p>
        <p>Computer-generated images and furniture shown are illustrations for reference only and are not part of the home sold. All dimensions are unfinished structural dimensions. Distances and drive times are indicative and depend on traffic and infrastructure provided by the appropriate authorities.</p>
        <p>Nothing on this website limits any right a purchaser has under the Real Estate (Regulation and Development) Act, 2016.</p>
        <p className="font-mono text-sm text-highlight-text">[CONTENT REQUIRED] full legal-approved terms of use.</p>
      </div>
    </section>
  );
}
