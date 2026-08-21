import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-lahori-gate";

export const lahoriGate: HeritagePoint = {
  id: "red-fort/lahori-gate",
  siteId: "red-fort",
  name: "Lahori Gate",
  nameLocal: "लाहौरी दरवाज़ा",
  tags: ["history", "military"],
  importance: 3,
  zone,
  centroid,
  thenNow: {
    then: {
      url: "/images/then-now/red-fort-lahori-gate.then.jpg",
      alt: "The Lahori Gate photographed from the west in 1858, its three chhatris above a plain screen wall, with bare ground and a broken wall in the foreground and three men sitting on the earth.",
      year: "1858",
      author: "Dr. John Murray",
      licence: "Public domain",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_Lahore_Gate_(Western-Gate)_of_the_Red_Fort_in_1858.jpg",
    },
    now: {
      url: "/images/then-now/red-fort-lahori-gate.now.jpg",
      alt: "The same gate in 2016, cleaned red sandstone against a blue sky, the ditch below it grassed and paved, a railing along the front and a queue of visitors at the arch.",
      year: "2016",
      author: "Sugeesh",
      licence: "CC BY-SA 4.0",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:RedFort_Lahori_Gate.jpg",
    },
    note: "The gate itself has barely moved. What changed is the ground in front of it, from open earth to a lawn, a moat wall and a ticket queue.",
  },
  livingTradition: {
    name: "The address from the ramparts",
    text: "Every fifteenth of August since 1947 the Prime Minister has spoken to the country from the rampart above this gate, and the flag goes up before the speech. It is the one Mughal building in Delhi whose most important use is younger than the Republic.",
    status: "living",
  },
};
