import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/humayuns-tomb-isa-khan";

export const isaKhanTomb: HeritagePoint = {
  id: "humayuns-tomb/isa-khan",
  siteId: "humayuns-tomb",
  name: "Tomb of Isa Khan",
  nameLocal: "ईसा ख़ान का मक़बरा",
  tags: ["architecture", "history"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "The village inside the monument",
    text: "Until 1905 this octagon and its garden were full of houses. People had simply lived in it, which is what happens to a walled enclosure nobody is guarding. The survey records the sum spent on acquiring it and moving the residents out. That trade, a cleared monument against a displaced neighbourhood, is still made at heritage sites in Delhi every year, and it is worth knowing it was made here first.",
    status: "living",
  },
};
