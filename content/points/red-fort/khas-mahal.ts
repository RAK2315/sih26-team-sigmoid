import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-khas-mahal";

export const khasMahal: HeritagePoint = {
  id: "red-fort/khas-mahal",
  siteId: "red-fort",
  name: "Khas Mahal",
  nameLocal: "ख़ास महल",
  tags: ["history", "architecture"],
  importance: 3,
  zone,
  centroid,
  livingTradition: {
    name: "Jaali, the cut marble screen",
    text: "The screens across the north and south walls here were cut out of single slabs of marble, a craft called jaali work. It is still done by hand around Agra and Makrana, mostly for temple and mosque commissions and for the tourist trade. The pattern on the northern screen is not decoration: it is the Mizan-i-Adl, the scales of justice, and it was put where petitioners would see it.",
    status: "living",
    image: IMAGES["traditions/jaali"],
  },
};
