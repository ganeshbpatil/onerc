import type { MetadataRoute } from "next";
import { site } from "@/content/project";

const routes = ["", "/the-address", "/residences/one-plus", "/design", "/club-one", "/location", "/gallery", "/progress", "/developer", "/visit", "/rera"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((r) => ({ url: `${site.url}${r}`, lastModified: now, changeFrequency: r === "/progress" ? "monthly" : "weekly", priority: r === "" ? 1 : 0.7 }));
}
