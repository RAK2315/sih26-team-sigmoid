import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-diwan-i-khas";

export const diwanIKhas: HeritagePoint = {
  id: "red-fort/diwan-i-khas",
  siteId: "red-fort",
  name: "Diwan-i-Khas",
  nameLocal: "दीवान-ए-ख़ास",
  tags: ["history", "architecture"],
  importance: 3,
  zone,
  centroid,
  thenNow: {
    then: {
      url: "/images/then-now/red-fort-diwan-i-khas.then.jpg",
      alt: "The inside of the Diwan-i-Khas photographed between 1860 and 1877, marble piers and cusped arches covered in painted floral ornament, a dark patterned ceiling above, and the floor worked in a repeating flower pattern.",
      year: "1860 to 1877",
      author: "Rijksmuseum",
      licence: "CC0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Interieur_van_de_Diwan-i-Khas_in_het_Rode_Fort_in_Delhi_The_Dewan-i-Khas,_or_hall_of_audience_(titel_op_object),_RP-F-2001-7-1124-19.jpg",
    },
    now: {
      url: "/images/then-now/red-fort-diwan-i-khas.now.jpg",
      alt: "The same hall in 2023, the piers still carrying their inlaid flower panels but the painted colour largely gone, the marble floor bare and reflecting daylight from a screened opening at the back.",
      year: "2023",
      author: "Sourabh.biswas003",
      licence: "CC BY-SA 4.0",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:PXL_20231129_084741587_Diwan-i-Khas_Lal_Qila,_Old_Delhi,_New_Delhi,_Delhi,_110006_05.jpg",
    },
    note: "The stone inlay survived. The painted and gilded surface over it did not, and the hall reads as white marble now where it once read as colour.",
  },
  livingTradition: {
    name: "Parchin kari, stone set into stone",
    text: "The lower parts of these piers are inlaid with coloured stone cut to fit sockets chiselled out of the marble, a craft the Mughals called parchin kari. It is slow work and it is still done. Workshops in Agra cut and set the same stones by hand today, mostly for tabletops and panels sold to visitors, using tools that would be recognisable to the men who worked on this hall.",
    status: "living",
    image: IMAGES["traditions/parchin-kari"],
  },
};
