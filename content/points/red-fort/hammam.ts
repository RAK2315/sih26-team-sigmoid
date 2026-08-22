import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-hammam";

export const hammam: HeritagePoint = {
  id: "red-fort/hammam",
  siteId: "red-fort",
  name: "Hammam",
  nameLocal: "हम्माम",
  tags: ["architecture", "history"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "Gulab jal, the rose water still",
    text: "One of the three fountains in the undressing room ran rose water. It was distilled from petals in copper stills over a wood fire, a process called deg and bhapka. Kannauj still makes it that way, in the same copper vessels, and it is still what gets sprinkled on guests at a north Indian wedding.",
    status: "living",
    image: IMAGES["traditions/gulab-jal"],
  },
};
