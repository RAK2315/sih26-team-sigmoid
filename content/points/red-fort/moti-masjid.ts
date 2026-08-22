import { IMAGES } from "@/content/images";
import type { HeritagePoint } from "@/lib/types";
import { centroid, zone } from "@/content/zones/red-fort-moti-masjid";

export const motiMasjid: HeritagePoint = {
  id: "red-fort/moti-masjid",
  siteId: "red-fort",
  name: "Moti Masjid",
  nameLocal: "मोती मस्जिद",
  tags: ["religion", "architecture", "history"],
  importance: 2,
  zone,
  centroid,
  livingTradition: {
    name: "The private chapel",
    text: "Aurangzeb built this for himself and the women of his household, so that the court need not leave the palace to pray. Prayer at the Fort stopped when the court did, in 1857, and the mosque has not been in regular use since. The Friday congregation it was built to avoid still meets at the Jama Masjid, a few hundred metres west.",
    status: "dormant",
    image: IMAGES["traditions/private-chapel"],
  },
};
