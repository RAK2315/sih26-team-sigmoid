import type { Anchor, Mention } from "../lib/types";

export const FIXTURE_MENTIONS: Mention[] = [
  {
    id: "m_87_1",
    name: "Ruined serai",
    type: "caravanserai",
    period: "Mughal",
    passage: "a ruined serai about 200 yards north of the old road",
    passageOffset: [1204, 1256],
    spatialClue: {
      anchorName: "Kotla Firoz Shah",
      bearing: "N",
      distanceValue: 200,
      distanceUnit: "yards",
    },
  },
  {
    id: "m_87_2",
    name: "Small mosque",
    type: "mosque",
    period: null,
    passage: "a small mosque adjoining the eastern wall",
    passageOffset: [1400, 1440],
    spatialClue: {
      anchorName: "Kotla Firoz Shah",
      bearing: "adjacent",
      distanceValue: null,
      distanceUnit: null,
    },
  },
  {
    id: "m_87_3",
    name: "Old well",
    type: "well",
    period: "Lodi",
    passage: "an old well half a kos to the westward",
    passageOffset: [1600, 1638],
    spatialClue: {
      anchorName: "the old northern road",
      bearing: "W",
      distanceValue: 0.5,
      distanceUnit: "kos",
    },
  },
];

export const FIXTURE_ANCHORS: Anchor[] = [
  {
    id: "kotla-firoz-shah",
    name: "Kotla Firoz Shah",
    aliases: ["Firozabad", "Kotla"],
    centroid: [77.2432, 28.6383],
    precisionM: 120,
  },
];