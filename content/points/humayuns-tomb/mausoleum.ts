import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/humayuns-tomb-mausoleum";

export const humayunsTombMausoleum: HeritagePoint = {
  id: "humayuns-tomb/mausoleum",
  siteId: "humayuns-tomb",
  name: "Tomb of Humayun",
  nameLocal: "हुमायूँ का मक़बरा",
  tags: ["architecture", "history"],
  importance: 1,
  zone,
  centroid,
  livingTradition: {
    name: "The college on the roof",
    text: "The survey records that the rooms on the roof and in the upper storeys of this tomb are said to have been used as a college, at one time an institution of considerable importance. It does not say what was taught or when it stopped. Nobody studies here now, so this is written down as gone rather than dressed up as continuing.",
    status: "lost",
  },
};
