import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-chatta-chowk";

export const chattaChowk: HeritagePoint = {
  id: "red-fort/chatta-chowk",
  siteId: "red-fort",
  name: "Chatta Chowk",
  nameLocal: "छत्ता चौक",
  tags: ["history", "architecture", "culture_traditions"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "The covered bazaar",
    text: "The thirty two arched rooms along this arcade were shops when the Fort was a palace, selling silk, brocade and jewellery to the court. They are shops now, selling to visitors. The trade changed completely and the use of the room did not.",
    status: "living",
    image: IMAGES["traditions/covered-bazaar"],
  },
};
