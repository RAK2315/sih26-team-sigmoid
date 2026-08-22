import type { FactSheet } from "@/lib/types";

const V3 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. III (1922)";

export const alaiMinarFactSheet: FactSheet = {
  id: "fs_qutub_complex_alai_minar",
  pointId: "qutub-complex/alai-minar",
  lines: [
    {
      id: "fs_qutub_complex_alai_minar_l1",
      text: "The Alai Minar is the incomplete minar projected by Alauddin Khalji, and it stands inside the last extension he made to the mosque.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_alai_minar_l2",
      text: "It was intended to double the proportions of the original Minar of Qutbuddin Aibak.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_alai_minar_l3",
      text: "Both its circumference and its height were to be double the corresponding dimensions of the Qutb Minar.",
      source: `${V3}, p. 14`,
    },
    {
      id: "fs_qutub_complex_alai_minar_l4",
      text: "The emperor did not live to see it finished and the construction was discontinued after his death.",
      source: `${V3}, p. 14`,
    },
    {
      id: "fs_qutub_complex_alai_minar_l5",
      text: "Tradition says it was to have been encased in marble, and that the unused material was afterwards used in Humayun's tomb.",
      source: `${V3}, p. 14`,
    },
    {
      id: "fs_qutub_complex_alai_minar_l6",
      text: "The survey notes that the architect clearly meant to face the exposed core with dressed stone or some better finished material.",
      source: `${V3}, p. 14`,
    },
  ],
  sources: [
    {
      label: "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. III, 1922",
      url: "https://archive.org/details/in.ernet.dli.2015.69531",
      kind: "archive",
    },
    { label: "Archaeological Survey of India, protected monument listing", kind: "asi" },
  ],
};
