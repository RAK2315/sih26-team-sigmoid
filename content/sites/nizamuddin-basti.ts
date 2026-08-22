import { IMAGES } from "@/content/images";
import type { HeritageSite } from "@/lib/types";

export const nizamuddinBasti: HeritageSite = {
  id: "nizamuddin-basti",
  name: "Nizamuddin Basti",
  nameLocal: "निज़ामुद्दीन बस्ती",
  depth: "deep",
  period: "Sultanate to Mughal, from 1325",
  centroid: [77.24198, 28.59138],
  bbox: [77.2395, 28.5895, 77.2445, 28.5935],
  pointIds: ["nizamuddin/dargah", "nizamuddin/atgah-khan", "nizamuddin/chaunsath-khamba"],
  blurb:
    "A working neighbourhood built around one grave. People have been buried here to be near Nizamuddin Auliya for seven hundred years, until the enclosure became a graveyard and the lanes closed in around it. Qawwals still sing in front of the shrine.",
  representationScore: 0.58,
  coordSource: "osm:w103505909",
  image: IMAGES["sites/nizamuddin-basti"],
};
