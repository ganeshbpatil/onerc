import { CONTENT_REQUIRED, type ImageAsset } from "./types";

export const onePlus = {
  slug: "one-plus",
  name: "One Plus Home",
  productCode: "725 L",
  configuration: "1 BHK",
  heading: "One home. Enough for more than one story.",
  intro:
    "A home is usually named for its rooms. One Plus is named for its reach. The same walls that hold one life today make room for another tomorrow — not by growing larger, but by never having been small to begin with.",
  specs: [
    { label: "Carpet area*", value: "490 sq.ft.", mono: true },
    { label: "Configuration", value: "1 BHK · 2 washrooms", mono: true },
    { label: "Floor-space efficiency", value: "65%", mono: true },
    { label: "Rooms", value: "Lobby, living, balcony, bedroom, kitchen + dining, utility" },
    { label: "Price", value: CONTENT_REQUIRED, mono: true },
  ],
  carpetNote:
    "*Includes RERA carpet area with permissible enclosed balcony and utility area, if applicable. Typical plan; orientation and openings may vary. Furniture shown is indicative and not part of the offer.",
  personas: [
    { mark: "1+", title: "A first address", body: "For one person. A fold-down desk turns the living room into a studio by day and folds away by evening." },
    { mark: "1+1", title: "A first home together", body: "Or a quieter one, later in life. Less home to manage, more life to enjoy." },
    { mark: "1+2", title: "Room for what comes next", body: "The child arrives; the home was already ready. A sofa that folds into a bed, a bunk that turns one room into enough room." },
  ],
  plan: {
    day: { image: { file: "plan-day.webp", fit: "contain", alt: "Isometric plan of the One Plus Home arranged for daytime work and living", ref: "iso-day.webp", kind: "plan" } satisfies ImageAsset, caption: "By day the bedroom becomes a work-and-play room — desk, reading chair, floor space — while the living room stays open." },
    night: { image: { file: "plan-night.webp", fit: "contain", alt: "Isometric plan of the One Plus Home arranged for night, with the bed unfolded", ref: "iso-night.webp", kind: "plan" } satisfies ImageAsset, caption: "By night the desk vanishes and a bed appears; the wardrobe hides an entire office." },
  },
  /** Source: brochure p.70 */
  specifications: {
    "Doors & windows": ["Premium laminated main door with digital lock (Yale or equivalent)", "Premium laminated washroom doors with round lock", "Premium aluminium windows with mosquito mesh"],
    Flooring: ["Gloss-finish vitrified flooring 600×600", "Anti-skid vitrified flooring in balconies and washrooms", "Washroom dado tiles 600×600 and 300×300"],
    Electrical: ["Havells, Legrand, Schneider, Wipro or equivalent switches", "Concealed Polycab or equivalent wiring", "TV points in living and all bedrooms", "AC points in living and all bedrooms"],
    Bathroom: ["Jaquar or equivalent CP and sanitary fittings", "Wall mixer with overhead shower", "Provision for exhaust fan and geyser"],
    Building: ["4 high-speed lifts + 1 service lift (Johnson or equivalent)", "Seismic-resistant design", "Fire hydrants on each floor; fire staircase and refuge area", "Access control at entrance lobby; CCTV at key points"],
  },
  kitchenNote: "Standard kitchen offering excludes platform, sink, CP fittings, dado and modular cabinets (brochure T&C).",
} as const;
