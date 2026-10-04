import { CONTENT_REQUIRED } from "./types";

export const project = {
  name: "One Racecourse",
  wordmark: "one racecourse",
  developerBrand: "SKYi",
  developerEntity: "Enerrgia Skyi Ventures",
  tagline: "Not built to impress.",
  taglineEmphasis: "Built to hold its ground.",
  description:
    "One Plus Homes at the Racecourse — 1 BHK residences at Uday Baug, opposite Sopan Baug, Pune Cantonment. Designed around one discipline: nothing without purpose.",
  address: {
    street: "Uday Baug, opposite Sopan Baug",
    locality: "Pune Cantonment",
    city: "Pune",
    region: "Maharashtra",
    postalCode: CONTENT_REQUIRED,
    country: "IN",
    /** [CONTENT REQUIRED] exact site coordinates for schema + map pin */
    geo: undefined as { lat: number; lng: number } | undefined,
  },
  rera: {
    number: "P52100079680",
    source: "One Racecourse brochure, p.92",
    portal: "https://maharera.maharashtra.gov.in",
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE ?? "+918855862268",
    phoneDisplay: "+91 88558 62268",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "918855862268",
    hours: "Mon–Sat, 10am–7pm",
    /** Brochure lists 8855 864 480 — resolve before launch. */
    verify: "Phone differs between websites (8855862268) and brochure (8855864480).",
  },
  price: CONTENT_REQUIRED,
  possession: CONTENT_REQUIRED,
  constructionStatus: CONTENT_REQUIRED,
  social: {
    facebook: "https://www.facebook.com/skyidevelopers",
    instagram: "https://www.instagram.com/skyidevelopers/",
    youtube: "https://www.youtube.com/@skyidevelopers",
  },
  disclosures: [
    { label: "Form V", href: undefined as string | undefined, verify: "Confirm PDF belongs to P52100079680" },
    { label: "Six-monthly compliance report", href: undefined as string | undefined, verify: "Confirm PDF belongs to P52100079680" },
    { label: "Environmental clearance (2023)", href: undefined as string | undefined, verify: "Confirm PDF belongs to P52100079680" },
  ],
  heroFacts: [
    { label: "The home", value: "1 BHK One Plus · 490 sq.ft.*" },
    { label: "Privacy", value: "Two homes per wing" },
    { label: "Orientation", value: "East–west entrances" },
    { label: "MahaRERA", value: "P52100079680", mono: true },
  ],
} as const;

export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
};

export const nav = [
  { href: "/the-address", label: "The Address" },
  { href: "/residences/one-plus", label: "The Home" },
  { href: "/design", label: "Design" },
  { href: "/club-one", label: "Club One" },
  { href: "/location", label: "Location" },
  { href: "/developer", label: "SKYi" },
] as const;
