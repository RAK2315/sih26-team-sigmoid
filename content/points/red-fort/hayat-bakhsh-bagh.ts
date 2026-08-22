import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-hayat-bakhsh-bagh";

export const hayatBakhshBagh: HeritagePoint = {
  id: "red-fort/hayat-bakhsh-bagh",
  siteId: "red-fort",
  name: "Hayat Bakhsh Bagh",
  nameLocal: "हयात बख़्श बाग़",
  tags: ["architecture", "culture_traditions", "history"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "The charbagh, a garden in four parts",
    text: "A Mughal garden is quartered by water channels, so the plan is a cross and the water is what organises it. The form came from Persia, and it is still the plan used when a garden is laid out at a dargah or a new memorial in Delhi. The channels here had to be dug back out of the ground before anyone could see the shape again.",
    status: "living",
    image: IMAGES["traditions/charbagh"],
  },
};
