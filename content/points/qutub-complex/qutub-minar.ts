import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/qutub-complex-qutub-minar";

export const qutubMinar: HeritagePoint = {
  id: "qutub-complex/qutub-minar",
  siteId: "qutub-complex",
  name: "Qutub Minar",
  nameLocal: "क़ुतुब मीनार",
  tags: ["architecture", "history", "religion"],
  importance: 1,
  zone,
  centroid,
  livingTradition: {
    name: "The call from the tower",
    text: "The survey says the Minar was apparently built as a mazina, the tower of a mosque, from which the crier called the faithful to prayer at the Quwwatul Islam beside it. Nobody has called from it since that mosque went out of use. The call itself is made five times a day across Delhi from towers that are still working, so the practice is alive and this tower is simply no longer where it happens.",
    status: "dormant",
    image: IMAGES["sites/qutub-complex"],
  },
};
