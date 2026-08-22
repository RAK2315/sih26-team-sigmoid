import type { FactSheet } from "@/lib/types";

const V2 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. II (1919)";

export const isaKhanFactSheet: FactSheet = {
  id: "fs_humayuns_tomb_isa_khan",
  pointId: "humayuns-tomb/isa-khan",
  lines: [
    {
      id: "fs_humayuns_tomb_isa_khan_l1",
      text: "The tomb stands in the Kotla of Isa Khan, immediately to the south of Bu Halima's garden.",
      source: `${V2}, p. 134`,
    },
    {
      id: "fs_humayuns_tomb_isa_khan_l2",
      text: "A slab over the mihrab records that it was built in the reign of Islam Shah, son of Sher Shah, by Masnad Ali Isa Khan, son of Niyaz Aghwan, in 954 A.H., 1547 to 1548.",
      source: `${V2}, p. 134`,
    },
    {
      id: "fs_humayuns_tomb_isa_khan_l3",
      text: "It is octagonal, with a verandah shaded by a deep chajja carried on heavy stone brackets and sloping buttresses at the eight corners.",
      source: `${V2}, p. 135`,
    },
    {
      id: "fs_humayuns_tomb_isa_khan_l4",
      text: "Eight chattris on red sandstone columns stand at roof level, and the low squat dome springs from a sixteen sided drum.",
      source: `${V2}, p. 135`,
    },
    {
      id: "fs_humayuns_tomb_isa_khan_l5",
      text: "Six graves lie in the central chamber. Isa Khan's is probably the middle of the three towards the north, in marble and red sandstone, 8 feet 6 inches by 4 feet 7 inches.",
      source: `${V2}, p. 135`,
    },
    {
      id: "fs_humayuns_tomb_isa_khan_l6",
      text: "Isa Khan Niyazi was a noble of influence at the court of Sher Shah Sur, and it was largely due to him that Islam Shah held the throne of Delhi against his elder brother.",
      source: `${V2}, p. 135`,
    },
    {
      id: "fs_humayuns_tomb_isa_khan_l7",
      text: "The tomb and its enclosure were crowded with village huts until the Archaeological Department took it in hand in 1905 and laid out the garden.",
      source: `${V2}, p. 135`,
    },
  ],
  sources: [
    {
      label: "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. II, 1919",
      url: "https://archive.org/details/in.ernet.dli.2015.69530",
      kind: "archive",
    },
    { label: "Archaeological Survey of India, protected monument listing", kind: "asi" },
  ],
};
