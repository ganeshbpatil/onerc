/**
 * Source: brochure p.34–35. VERIFY: p.35 attributes the lux claim to "5 Racecourse";
 * confirm these are One Racecourse simulation results before launch.
 */
export const intelligence = {
  heading: "Light and air, treated as materials.",
  body: "Max Light™ and Air Tech™ by SKYi study the sun path and the site's wind path before a single wall is drawn. Comfort here is engineered, not assumed.",
  lux: {
    title: "Max Light™ · daylight",
    unit: "LUX · achieved vs NBC",
    max: 1500,
    rows: [
      { zone: "Living – dining", achieved: [700, 1400], nbc: [100, 150] },
      { zone: "Bedrooms", achieved: [700, 1200], nbc: [60, 100] },
      { zone: "Kitchen", achieved: [500, 600], nbc: [150, 200] },
    ],
  },
  ach: {
    title: "Air Tech™ · ventilation",
    unit: "Air changes / hour",
    max: 11,
    rows: [
      { zone: "Living – dining", achieved: [7, 7], achievedLabel: "> 7 ACH", nbc: [3, 6] },
      { zone: "Bedrooms", achieved: [9, 9], achievedLabel: "> 9 ACH", nbc: [2, 4] },
      { zone: "Kitchen", achieved: [6, 6], achievedLabel: "> 6 ACH", nbc: [4.5, 4.5] },
    ],
  },
  credits: [
    { role: "Architecture", value: "Mind Manifestation Architecture — Pawan Gosavi, Chetan Lahoti, Anand Deshmukh" },
    { role: "Landscape", value: "Treow Design Studio — Swapnil Dhamane" },
    { role: "Green building", value: "Designed to IGBC Gold (targeted)" },
  ],
  principle: "Precision within nature.",
  planning:
    "A three-wing layout keeps just two homes to each wing, limiting shared spaces and improving ventilation, light and quiet. East-to-west facing entrances mean every home receives its share of both morning and evening light.",
  planningVerify: "Brochure also states '2 Independent Wings' (p.30). Confirm wing count.",
} as const;
