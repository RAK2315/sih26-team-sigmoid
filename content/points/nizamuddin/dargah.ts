import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/nizamuddin-dargah";

export const nizamuddinDargah: HeritagePoint = {
  id: "nizamuddin/dargah",
  siteId: "nizamuddin-basti",
  name: "Tomb of Hazrat Nizamuddin Auliya",
  nameLocal: "हज़रत निज़ामुद्दीन औलिया की दरगाह",
  tags: ["religion", "culture_traditions", "history"],
  importance: 1,
  zone,
  centroid,
  livingTradition: {
    name: "Qawwali, the singing at the shrine",
    text: "Firoz Shah Tughlaq built a Jama'at Khana here, a hall for the congregation, and the survey records it as an addition that had not existed before. Qawwals still sit in front of the shrine and sing, most of all on Thursday evenings, and the form they sing is the one Amir Khusrau is held to have shaped at this dargah seven hundred years ago. It is the loudest surviving argument that heritage is something people do.",
    status: "living",
    image: IMAGES["plates/qawwali-nizamuddin"],
  },
};
