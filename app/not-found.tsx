import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-arch section-y">
      <p className="eyebrow text-secondary">404</p>
      <h1 className="t-h2 mt-4 max-w-[14ch]">This page isn&apos;t on the plan.</h1>
      <Link href="/" className="btn btn-primary mt-10">Back to One Racecourse</Link>
    </section>
  );
}
