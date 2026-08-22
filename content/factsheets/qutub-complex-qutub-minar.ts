import type { FactSheet } from "@/lib/types";

const V3 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. III (1922)";

export const qutubMinarFactSheet: FactSheet = {
  id: "fs_qutub_complex_qutub_minar",
  pointId: "qutub-complex/qutub-minar",
  lines: [
    {
      id: "fs_qutub_complex_qutub_minar_l1",
      text: "The Qutb Minar is a tapering shaft 234 feet high, built of red and buff sandstone with marble used in the fourth and fifth storeys.",
      source: `${V3}, p. 7`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l2",
      text: "It is divided into five storeys by five decorated balconies and carries bands of inscription intertwined with foliated designs.",
      source: `${V3}, p. 7`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l3",
      text: "The diameter is 47 feet 3 inches at the bottom and 9 feet at the top.",
      source: `${V3}, p. 7`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l4",
      text: "The lowest storey is a polygon of 24 facets formed of alternate angular and semi-circular flutes.",
      source: `${V3}, p. 7`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l5",
      text: "It was begun by Qutbuddin Aibak, who built the lowest storey, and finished by Shamsuddin Iltutmish.",
      source: `${V3}, p. 7`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l6",
      text: "An inscription on the fifth storey records that the Minar was injured by lightning in the year 770 A.H. and that Firoz Shah rebuilt that portion.",
      source: `${V3}, p. 1`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l7",
      text: "A cupola stood on top until an earthquake threw it down in 1803, and the sandstone replacement was removed by order of Lord Hardinge in 1848.",
      source: `${V3}, pp. 7 to 8`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l8",
      text: "It was apparently intended as a mazina, the tower of a mosque from which the crier proclaims the hour of prayer, attached to the Quwwatul Islam mosque.",
      source: `${V3}, p. 8`,
    },
    {
      id: "fs_qutub_complex_qutub_minar_l9",
      text: "Local tradition holds that Prithvi Raj built it so his daughter could see the river, but Cunningham countered every argument for that and showed the work to be Muhammadan, though the earlier storeys were built by Hindu masons.",
      source: `${V3}, p. 8`,
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
