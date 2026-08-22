import { IMAGES } from "@/content/images";
import type { HeritageSite } from "@/lib/types";

export const qutubComplex: HeritageSite = {
  id: "qutub-complex",
  name: "Qutub Complex",
  nameLocal: "क़ुतुब परिसर",
  // no Heritage Points written yet, and a filled pin promises points a Visitor can walk between
  depth: "shallow",
  period: "Slave dynasty onward, 1199 onward",
  centroid: [77.185885, 28.52478],
  bbox: [77.1825, 28.5225, 77.1895, 28.5275],
  pointIds: [],
  blurb:
    "The first Muslim capital of Delhi, built from the stone of twenty-seven temples that stood on the same ground. Four dynasties added to it and none of them finished it.",
  representationScore: 0.95,
  coordSource: "osm:w818709474",
  image: IMAGES["sites/qutub-complex"],
};
