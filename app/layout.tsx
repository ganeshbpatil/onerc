import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { StickyActionBar } from "@/components/StickyActionBar";
import { project, site } from "@/content/project";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import "./globals.css";

const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
// Hanken is variable: one file covers 400–600. Mono and italic are not above the fold-critical path → no preload.
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-plex-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${project.name} by SKYi — 1 BHK One Plus Homes at Uday Baug, Pune Cantonment`, template: `%s · ${project.name}` },
  description: project.description,
  applicationName: project.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: `${project.name} by SKYi`, locale: site.locale, url: site.url, title: `${project.name} by SKYi`, description: project.description },
  twitter: { card: "summary_large_image", title: `${project.name} by SKYi`, description: project.description },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#eceae4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${instrument.variable} ${hanken.variable} ${plexMono.variable}`}>
      <body>
        <Analytics />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyActionBar />
        <CookieConsent />
      </body>
    </html>
  );
}
