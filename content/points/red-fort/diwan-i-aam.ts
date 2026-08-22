import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-diwan-i-aam";

export const diwanIAam: HeritagePoint = {
  id: "red-fort/diwan-i-aam",
  siteId: "red-fort",
  name: "Diwan-i-Aam",
  nameLocal: "दीवान-ए-आम",
  tags: ["history", "architecture"],
  importance: 3,
  zone,
  centroid,
  thenNow: {
    then: {
      url: "/images/then-now/red-fort-diwan-i-aam.then.jpg",
      alt: "A watercolour of 1843 showing the Diwan-i-Aam from the west, nine engrailed arches under a wide eave, a chhatri at each end, the marble jharokha at the centre, and a red painted railing across the front of the court with guards standing at the steps.",
      year: "1843",
      author: "Sir Thomas Metcalfe, 4th Baronet",
      licence: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Reminiscences_of_Imperial_Delhi_The_Diwan-i_%E2%80%98Am_from_the_west.png",
    },
    now: {
      url: "/images/then-now/red-fort-diwan-i-aam.now.jpg",
      alt: "The same hall from the same side in 2012, the nine arches and both chhatris still there, standing alone on cut grass with a paved walkway and a green iron fence leading up to it, and visitors walking through.",
      year: "2012",
      author: "Ritzyritz",
      licence: "CC BY-SA 3.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Deewan-e-aam_front.jpg",
    },
    note: "The hall is intact. The court around it is not: the enclosing wall and the red railing that made this a room have gone, and the hall now stands in open lawn.",
  },
  livingTradition: {
    name: "Darshan from the jharokha",
    text: "Every morning the Emperor showed himself to whoever had come, from a balcony above this hall, and the day could not begin until he did. Anyone could stand in the court below and be seen. The Mughal court ended in 1857 and the daily appearance ended with it, though it was staged once more in December 1911 for George V.",
    status: "lost",
    image: IMAGES["traditions/jharokha"],
  },
};
