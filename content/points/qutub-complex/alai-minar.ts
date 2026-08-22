import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/qutub-complex-alai-minar";

export const alaiMinar: HeritagePoint = {
  id: "qutub-complex/alai-minar",
  siteId: "qutub-complex",
  name: "Alai Minar",
  nameLocal: "अलाई मीनार",
  tags: ["architecture", "history"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "The tower nobody finished",
    text: "Alauddin Khalji meant this to be twice the Qutub Minar in height and in girth. He died, the work stopped, and what stands is the rubble core that was never faced. The survey passes on the tradition that the marble meant for it went into Humayun's tomb instead, which if true means one building on this walk is partly made of another. Nothing was ever finished here and nothing was ever taken down.",
    status: "lost",
  },
};
