import type { Metadata } from "next";
import { project, site } from "@/content/project";

export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} · ${project.name}`, description, url, siteName: `${project.name} by ${project.developerBrand}`, locale: site.locale, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} · ${project.name}`, description },
  };
}
