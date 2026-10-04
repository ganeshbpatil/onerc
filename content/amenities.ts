import { CONTENT_REQUIRED, type ImageAsset } from "./types";

/**
 * Source: brochure p.58–69 (Club One, 13,500+ sq.ft.) and Site A amenity copy.
 * VERIFY: Site B states "Pentagon Club — 45,000 sq.ft, 45+ amenities"; not used.
 */
export const club = {
  name: "Club One",
  area: "13,500+ sq.ft.",
  heading: "As many moods as an evening asks for.",
  body: "Not the longest amenity checklist — a smaller set of spaces designed to actually be used, by residents who know their neighbours' names.",
};

export type Amenity = { id: string; name: string; category: string; copy: string; image: ImageAsset };

export const amenities: Amenity[] = [
  { id: "fitness", name: "Fitness Studio", category: "Wellness", copy: "Equipped for both ends of a serious routine — and for the days you only have twenty minutes to give it.", image: { alt: "Air-conditioned fitness studio with free weights and machines", ref: "gym.webp", file: "club-gym.webp", kind: "cgi" } },
  { id: "games", name: "Indoor Games Lounge", category: "Social", copy: "Table tennis, carrom, chess, foosball, pool. A board left mid-game, a rematch that runs long, company that doesn't require an occasion.", image: { alt: "Indoor games lounge with a table-tennis table", ref: "table-tennis.webp", file: "club-games.webp", kind: "cgi" } },
  { id: "hall", name: "Multipurpose Hall", category: "Community", copy: "Not one occasion's room. Every occasion's room — a birthday, a meeting, a festival. It reconfigures around whatever the community gathers for.", image: { alt: "Multipurpose hall set for a community gathering", ref: "hall.webp", file: "club-hall.webp", kind: "cgi" } },
  { id: "kids", name: "Kids' Play Area", category: "Children", copy: "Built at a child's scale, not an afterthought at an adult's. Enclosed, and close enough that going out to play stays a small, easy step.", image: { alt: "Enclosed children's play area", ref: "kids-play-area.webp", file: "club-kids.webp", kind: "cgi" } },
  { id: "track", name: "Walking Track", category: "Nature", copy: "Laid along the club's green edge, for the lap that clears your head at whatever speed today allows.", image: { alt: "Walking track along landscaped greens", ref: "jogging-track.webp", file: "club-track.webp", kind: "cgi" } },
  { id: "yoga", name: "Yoga & Meditation Deck", category: "Wellness", copy: "An open-air corner set apart from the activity, because stillness needed its own space too.", image: { alt: "Open-air yoga and meditation deck", ref: `${CONTENT_REQUIRED} render`, kind: "cgi" } },
];
