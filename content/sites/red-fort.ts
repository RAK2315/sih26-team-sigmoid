import { IMAGES } from "@/content/images";
import type { HeritageSite } from "@/lib/types";

export const redFort: HeritageSite = {
  id: "red-fort",
  name: "Red Fort",
  nameLocal: "लाल क़िला",
  depth: "deep",
  period: "Mughal, 1639 to 1648",
  centroid: [77.240743, 28.655724],
  bbox: [77.237, 28.6535, 77.246, 28.66],
  pointIds: [
    "red-fort/lahori-gate",
    "red-fort/chatta-chowk",
    "red-fort/naubat-khana",
    "red-fort/diwan-i-aam",
    "red-fort/rang-mahal",
    "red-fort/khas-mahal",
    "red-fort/diwan-i-khas",
    "red-fort/hammam",
    "red-fort/moti-masjid",
    "red-fort/hayat-bakhsh-bagh",
    "red-fort/mumtaz-mahal",
  ],
  blurb:
    "Shah Jahan's citadel at Shahjahanabad, begun in 1639 and finished in 1648. The halls behind its walls held the working machinery of an empire, and the archive records each of them by name.",
  representationScore: 0.98,
  coordSource: "osm:w264863907",
  image: IMAGES["sites/red-fort"],
};
