import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/nizamuddin-chaunsath-khamba";

export const chaunsathKhamba: HeritagePoint = {
  id: "nizamuddin/chaunsath-khamba",
  siteId: "nizamuddin-basti",
  name: "Chaunsath Khamba",
  nameLocal: "चौंसठ खंभा",
  tags: ["architecture", "history"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "Kokaltash, kinship made by milk",
    text: "The man buried here was called Kokaltash, which means foster brother. Akbar was nursed by Ji Ji Anagah, so her son Mirza Aziz grew up as the emperor's brother and was treated as one for life. Milk kinship was a working institution at the Mughal court: it made families out of servants and gave a nurse's husband, Atgah Khan, the chancellorship of an empire. Nothing like it survives at any court, and the hall he built over his own grave is most of what is left of it.",
    status: "lost",
    image: IMAGES["traditions/kokaltash"],
  },
};
