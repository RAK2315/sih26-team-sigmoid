import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/nizamuddin-atgah-khan";

export const atgahKhan: HeritagePoint = {
  id: "nizamuddin/atgah-khan",
  siteId: "nizamuddin-basti",
  name: "Tomb of Atgah Khan",
  nameLocal: "अतगा ख़ान का मक़बरा",
  tags: ["history", "architecture"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "Burial beside the saint",
    text: "Atgah Khan was murdered in Agra and carried to Delhi to be buried close to Nizamuddin Auliya. He was not unusual. The survey says the enclosure by the shrine was chosen as a resting place by people of all classes until the whole interior became a graveyard, and it names Jahanara Begum among them. People are still buried in this basti to be near the saint, which is why the lanes here are narrow and the ground is full.",
    status: "living",
    image: IMAGES["traditions/burial-beside-the-saint"],
  },
};
