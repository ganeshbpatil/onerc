import { Breadcrumbs } from "@/components/Breadcrumbs";
import { VisitSection } from "@/components/sections/VisitSection";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Schedule a private visit",
  description: "Book a private visit to One Racecourse at Uday Baug, Pune Cantonment. Mon–Sat, 10am–7pm.",
  path: "/visit",
});

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Visit", path: "/visit" }]} />
      <div className="h-8" />
      <VisitSection standalone />
    </>
  );
}
