import { IMAGES } from "@/content/images";
import type { HeritageSite } from "@/lib/types";

export const qutubComplex: HeritageSite = {
  id: "qutub-complex",
  name: "Qutub Complex",
  nameLocal: "क़ुतुब परिसर",
  // the Minar itself is written; the rest of the complex is not, so the pin stays hollow
  depth: "shallow",
  period: "Slave dynasty onward, 1199 onward",
  centroid: [77.185885, 28.52478],
  bbox: [77.1825, 28.5225, 77.1895, 28.5275],
  pointIds: ["qutub-complex/qutub-minar"],
  blurb:
    "The first Muslim capital of Delhi, built from the stone of twenty-seven temples that stood on the same ground. Four dynasties added to it and none of them finished it.",
  representationScore: 0.95,
  coordSource: "osm:w818709474",
  image: IMAGES["sites/qutub-complex"],
};
