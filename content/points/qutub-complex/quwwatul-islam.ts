import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/qutub-complex-quwwatul-islam";

export const quwwatulIslam: HeritagePoint = {
  id: "qutub-complex/quwwatul-islam",
  siteId: "qutub-complex",
  name: "Quwwatul Islam Mosque",
  nameLocal: "क़ुव्वत-उल-इस्लाम मस्जिद",
  tags: ["architecture", "religion", "history"],
  importance: 1,
  zone,
  centroid,
  livingTradition: {
    name: "Building out of what was already standing",
    text: "The inscription over the east gate says the materials of twenty seven temples went into this mosque, and Cunningham found the earlier plinth still under it with the columns re-set as colonnades. Reusing dressed stone was ordinary practice, not an aberration: it is why the arches here are carved with lotus and bell-and-chain, and why a single courtyard can be read as two beliefs at once. Masons still cut replacement stone to match old work at conservation sites across Delhi.",
    status: "dormant",
  },
};
