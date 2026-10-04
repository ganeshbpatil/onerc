import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { StickyActionBar } from "@/components/StickyActionBar";
import { project, site } from "@/content/project";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import "./globals.css";

// Reference typography (SKYi site): Google Sans for display + text, Montserrat for labels/data.
// Google Sans (SIL OFL 1.1, app/fonts/GoogleSans-OFL.txt) is self-hosted as a single Latin variable
// file (400–700, 36 KB): Google Fonts' build adds a control-character subset that delays first paint.
const googleSans = localFont({
  src: "./fonts/GoogleSans-Latin-Variable.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-google-sans",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Arial", "sans-serif"],
});
const montserrat = Montserrat({ subsets: ["latin"], weight: "variable", variable: "--font-montserrat", display: "swap", preload: false });

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
    <html lang="en-IN" className={`${googleSans.variable} ${montserrat.variable}`}>
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
