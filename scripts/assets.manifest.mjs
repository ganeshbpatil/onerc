// Source of every downloadable asset. `file` is the local name under public/ (or private/),
// so assets supplied from the SKYi Google Drive can be dropped in with the same name instead.
const A = "https://mediumpurple-squirrel-394820.hostingersite.com/wp-content/uploads";
const B = "https://lightsteelblue-wombat-180288.hostingersite.com";

export const images = [
  // hero / product
  ["hero-desktop.webp", `${A}/2026/10/1plus-by-skyi-laptop-1.webp`],
  ["hero-mobile.webp", `${A}/2026/10/1-plus-by-skyi-mobile-1.webp`],
  ["living-room.webp", `${A}/2026/10/before-gallery-Living-Room-Banner-laptop-1.webp`],
  ["living-room-mobile.webp", `${A}/2026/10/before-gallery-Living-Room-Banner-mobile-1.webp`],
  ["plan-day.webp", `${A}/2026/10/iso-day.webp`],
  ["plan-night.webp", `${A}/2026/10/iso-night.webp`],
  ["unit-plan.webp", `${A}/2024/08/unit-plan.webp`],
  ["one-plus-mark.webp", `${A}/2024/08/plus.webp`],
  // gallery (day / night interiors)
  ["gallery-01.webp", `${A}/2026/10/Gallery-Laptop-1.webp`],
  ["gallery-02.webp", `${A}/2026/10/Gallery-Laptop-1-copy.webp`],
  ...Array.from({ length: 10 }, (_, i) => [`gallery-${String(i + 3).padStart(2, "0")}.webp`, `${A}/2026/10/Gallery-Laptop-1-copy-${i + 2}.webp`]),
  // club
  ["club-gym.webp", `${A}/2026/10/gym.webp`],
  ["club-games.webp", `${A}/2026/10/table-tennis.webp`],
  ["club-hall.webp", `${A}/2026/10/hall.webp`],
  ["club-kids.webp", `${A}/2026/10/kids-play-area.webp`],
  ["club-track.webp", `${A}/2026/10/jogging-track.webp`],
  // location & neighbourhood (externally sourced photography)
  ["location-map.webp", `${A}/2026/10/Location-Connectivity-Laptop.webp`],
  ["location-map-mobile.webp", `${A}/2026/10/Location-Connectivity-Mobile.webp`],
  ["racecourse-ground.png", `${A}/2024/09/RC-Ground-min-1.png`],
  ["heritage-empress-garden-1.webp", `${A}/2024/09/Empress-Botanical-Garden_1.webp`],
  ["heritage-empress-garden-2.webp", `${A}/2024/09/Empress-Botanical-Garden_2.webp`],
  ["heritage-empress-garden-3.webp", `${A}/2024/09/Empress-Botanical-Garden_3.webp`],
  ["heritage-st-patricks-1.webp", `${A}/2024/09/ST-Patricks-Cathedral_1.webp`],
  ["heritage-uday-sopan-baug-1.webp", `${A}/2024/09/Uday-Sopan-Baug_1.webp`],
  ["heritage-the-camp-1.webp", `${A}/2024/09/the-camp_1.webp`],
  ["heritage-southern-command-1.webp", `${A}/2024/08/The-Southern-Command.webp`],
  ["heritage-srpf.png", `${A}/2024/09/SRPF-5-RC-min.png`],
  // Max Light / Air Tech diagrams
  ["diagram-max-light.webp", `${A}/2024/09/max-light-sun.webp`],
  ["diagram-more-light-less-heat.webp", `${A}/2024/09/more-light-less-heat.webp`],
  ["diagram-large-windows.webp", `${A}/2024/09/Large-Windows.webp`],
  ["diagram-air-tech.webp", `${A}/2024/09/air-tech.webp`],
  ["diagram-wind-path.webp", `${A}/2024/09/Wind-Path-Oriented-Homes.webp`],
  ["diagram-air-changes.webp", `${A}/2024/09/more-air-changes.webp`],
  // brand
  ["skyi-logo.svg", `${A}/2024/08/sky-i.svg`],
];

// Fonts are self-hosted by next/font (Google Sans + Montserrat) — nothing to download.
export const fonts = [];

// Gated: stored outside public/, streamed only via a signed /api/brochure link.
export const privateFiles = [["One-Racecourse-Brochure.pdf", `${B}/uploads/One-Racecourse-Brochure.pdf`]];
