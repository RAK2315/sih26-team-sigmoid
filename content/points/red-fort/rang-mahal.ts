import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-rang-mahal";

export const rangMahal: HeritagePoint = {
  id: "red-fort/rang-mahal",
  siteId: "red-fort",
  name: "Rang Mahal",
  nameLocal: "रंग महल",
  tags: ["history", "architecture", "culture_traditions"],
  importance: 3,
  zone,
  centroid,
  livingTradition: {
    name: "Naqqashi, the painted surface",
    text: "The hall takes its name from the painted decoration that once covered its inner walls, laid on by naqqash who worked in colour and gold over plaster. Almost none of it survives here. The craft itself did survive, in the hands of a small number of families in Delhi and Jaipur who still paint ceilings and manuscript borders by the same method.",
    status: "dormant",
    image: IMAGES["traditions/naqqashi"],
  },
};
