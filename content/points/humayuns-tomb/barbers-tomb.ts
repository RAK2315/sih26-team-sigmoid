import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/humayuns-tomb-barbers-tomb";

export const barbersTomb: HeritagePoint = {
  id: "humayuns-tomb/barbers-tomb",
  siteId: "humayuns-tomb",
  name: "The Barber's Tomb",
  nameLocal: "नाई का गुम्बद",
  tags: ["architecture", "history"],
  importance: 3,
  zone,
  centroid,
  livingTradition: {
    name: "A name with nothing behind it",
    text: "Two people are buried here, inside the emperor's own garden, on a platform seventy six feet square. One grave carries the year 999 of the Hijri calendar and neither carries a name. Somebody at some point began calling it the barber's tomb, and the survey says plainly that it is not known how. The habit of naming an unnamed building after whoever it might plausibly have belonged to is alive across Delhi, and it is how a place keeps a story after it has lost its facts.",
    status: "living",
  },
};
