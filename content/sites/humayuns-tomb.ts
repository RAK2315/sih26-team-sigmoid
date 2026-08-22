import { IMAGES } from "@/content/images";
import type { HeritageSite } from "@/lib/types";

export const humayunsTomb: HeritageSite = {
  id: "humayuns-tomb",
  name: "Humayun's Tomb Complex",
  nameLocal: "हुमायूँ का मक़बरा",
  // the mausoleum itself is written; the rest of the complex is not, so the pin stays hollow
  depth: "shallow",
  period: "Mughal, 1565 to 1572",
  centroid: [77.248651, 28.592963],
  bbox: [77.2445, 28.5895, 77.2535, 28.5965],
  pointIds: ["humayuns-tomb/mausoleum"],
  blurb:
    "Commissioned by a widow for her husband, and the first garden tomb in India. Everything the Taj Mahal would later do was tried here first.",
  representationScore: 0.93,
  coordSource: "osm:r2914318",
  image: IMAGES["sites/humayuns-tomb"],
};
