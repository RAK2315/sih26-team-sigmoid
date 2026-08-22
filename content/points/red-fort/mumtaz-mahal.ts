import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-mumtaz-mahal";

export const mumtazMahal: HeritagePoint = {
  id: "red-fort/mumtaz-mahal",
  siteId: "red-fort",
  name: "Mumtaz Mahal",
  nameLocal: "मुमताज़ महल",
  tags: ["history", "architecture"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "The zenana",
    text: "This was an apartment of the seraglio, the part of the palace the women of the household lived in and which men from outside it did not enter. The arrangement ended with the court in 1857. What the building has been since is a fair summary of what happened to the Fort: a prison, then a sergeants mess, and now a museum.",
    status: "lost",
    image: IMAGES["traditions/zenana"],
  },
};
