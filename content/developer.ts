import { CONTENT_REQUIRED } from "./types";

/** Source: brochure p.88–91. */
export const developer = {
  heading: "SKYi. Building in Pune since 2004.",
  body: "Over seven million square feet of homes and commercial spaces delivered — from Songbirds and Manas Lake to Five Racecourse, next door.",
  proof: [
    { label: "Award", value: "Best Residential Project — CNBC Awaaz" },
    { label: "Recognition", value: "Top 100 India's Projects — Realty Plus" },
    { label: "Membership", value: "CREDAI Pune · MBVA" },
    { label: "Finance partners", value: "HDFC, ICICI, Tata Capital, Aditya Birla Finance, Piramal, Motilal Oswal, Avenue Partners" },
    { label: "Possession", value: CONTENT_REQUIRED, required: true },
    { label: "Construction status", value: CONTENT_REQUIRED, required: true },
  ],
  portfolio: [
    { name: "Nilay", place: "Aundh", status: "Completed" },
    { name: "Songbirds", place: "Paud Road", status: "Phase completed" },
    { name: "Manas Lake", place: "Paud Road", status: "Phase completed" },
    { name: "Star City", place: "Dhayari", status: "Phase completed" },
    { name: "Five Maidan", place: "Baner", status: "Ongoing" },
    { name: "Five Racecourse", place: "Sopan Baug", status: "Ongoing" },
    { name: "Five Aguada", place: "Bandra, Mumbai", status: "Ongoing" },
  ],
} as const;
