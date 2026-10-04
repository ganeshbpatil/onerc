import { CONTENT_REQUIRED } from "./types";

/** Only questions answerable from verified sources; others flagged. */
export const faq = [
  { q: "Where is One Racecourse?", a: "At Uday Baug, opposite Sopan Baug, in the Racecourse neighbourhood of Pune Cantonment." },
  { q: "What homes are available?", a: "1 BHK One Plus Homes (product 725 L) of 490 sq.ft., including RERA carpet area with permissible enclosed balcony and utility area, with two washrooms." },
  { q: "What is the MahaRERA registration number?", a: "P52100079680. Details are available on the MahaRERA portal." },
  { q: "How many homes share a floor?", a: "The plan keeps two homes to each wing, with east-to-west facing entrances." },
  { q: "What is the clubhouse?", a: "Club One, a 13,500+ sq.ft. clubhouse with a fitness studio, indoor games lounge, multipurpose hall, children's play area and walking track." },
  { q: "What is the price?", a: `${CONTENT_REQUIRED} — request current pricing and availability through the enquiry form.` },
  { q: "When is possession?", a: `${CONTENT_REQUIRED}` },
] as const;
