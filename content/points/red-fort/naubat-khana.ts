import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-naubat-khana";

export const naubatKhana: HeritagePoint = {
  id: "red-fort/naubat-khana",
  siteId: "red-fort",
  name: "Naubat Khana",
  nameLocal: "नौबत ख़ाना",
  tags: ["history", "architecture", "culture_traditions"],
  importance: 2,
  zone,
  centroid,
  thenNow: {
    then: {
      url: "/images/then-now/red-fort-naubat-khana.then.jpg",
      alt: "The Naubat Khana photographed head on in 1858, two chhatris on the roof and a central arch, with a long arcaded wall running away on both sides and three men seated on the empty court.",
      year: "1858",
      author: "Dr. John Murray",
      licence: "Public domain",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Naqqar_Khana_Red_Fort_1858.jpg",
    },
    now: {
      url: "/images/then-now/red-fort-naubat-khana.now.jpg",
      alt: "The same gate head on in 2019, the carving cleaned back to red sandstone, and on either side lawn and trees where the arcades used to run, with a paved path leading to the arch.",
      year: "2019",
      author: "Jakub Hałun",
      licence: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:20191203_Naubat_Khana,_Red_Fort,_Delhi_0453_6340_DxO.jpg",
    },
    note: "Same building, same angle, 161 years apart. The arcaded court that once enclosed it on both sides is gone, and lawn stands where it was.",
  },
  livingTradition: {
    name: "Naubat, the drums of the hours",
    text: "A band played from the gallery above this gate at fixed hours of the day and on state occasions. The naubat was a working clock and an announcement at once, and every Mughal palace had one. The instruments survive at a few dargahs, and the shehnai and naqqara are still played at weddings, but nobody keeps the hours with them any more.",
    status: "dormant",
  },
};
