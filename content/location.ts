/** Source: brochure p.76. Indicative drive times; metro stations are proposed. */
export const locationIntro = {
  heading: "The pace of the Cantonment, at the centre of the city.",
  body: "One Racecourse sits at Uday Baug, opposite Sopan Baug inside the Racecourse neighbourhood. Not the pace of the city. The pace of the Cantonment, carried into a central address.",
  disclaimer: "Indicative drive times from the project brochure; subject to traffic and to infrastructure by the appropriate authorities. Metro stations are proposed.",
};

export type Place = { name: string; minutes: number };
export type PlaceCategory = { id: string; label: string; places: Place[] };

export const locationCategories: PlaceCategory[] = [
  { id: "connectivity", label: "Connectivity", places: [
    { name: "Fatima Nagar Metro (proposed)", minutes: 2 }, { name: "Ramtekadi Metro (proposed)", minutes: 6 },
    { name: "Pune Railway Station", minutes: 15 }, { name: "Swargate", minutes: 15 }, { name: "Pune Airport", minutes: 25 } ] },
  { id: "work", label: "Work", places: [
    { name: "Magarpatta City", minutes: 8 }, { name: "Cybercity, Magarpatta", minutes: 8 }, { name: "Mundhwa Chowk", minutes: 12 },
    { name: "Amanora Business Hub", minutes: 13 }, { name: "EON IT Park, Kharadi", minutes: 25 } ] },
  { id: "healthcare", label: "Healthcare", places: [
    { name: "Electricwala Hospital", minutes: 2 }, { name: "Inamdar Multispeciality Hospital", minutes: 5 }, { name: "Noble Hospital", minutes: 7 },
    { name: "Ruby Hall Clinic, Wanowrie", minutes: 10 }, { name: "Sahyadri Super Speciality Hospital", minutes: 12 } ] },
  { id: "schools", label: "Schools", places: [
    { name: "City International School, Wanowrie", minutes: 5 }, { name: "Army Public School", minutes: 5 }, { name: "VIBGYOR High", minutes: 6 },
    { name: "St. Joseph High School", minutes: 6 }, { name: "Rosary School & Junior College", minutes: 8 } ] },
  { id: "shopping", label: "Shopping", places: [
    { name: "93 Avenue Mall", minutes: 4 }, { name: "D Mart", minutes: 4 }, { name: "Dorabjee's", minutes: 7 },
    { name: "Amanora Mall", minutes: 15 }, { name: "Seasons Mall", minutes: 15 } ] },
  { id: "clubs", label: "Clubs", places: [
    { name: "Rajhans Cinemas, 93 Avenue", minutes: 3 }, { name: "Racecourse", minutes: 6 }, { name: "Turf Club", minutes: 6 },
    { name: "Race Sports Club", minutes: 10 }, { name: "Poona Club", minutes: 12 } ] },
];
