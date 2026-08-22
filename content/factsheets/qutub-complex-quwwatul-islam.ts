import type { FactSheet } from "@/lib/types";

const V3 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. III (1922)";

export const quwwatulIslamFactSheet: FactSheet = {
  id: "fs_qutub_complex_quwwatul_islam",
  pointId: "qutub-complex/quwwatul-islam",
  lines: [
    {
      id: "fs_qutub_complex_quwwatul_islam_l1",
      text: "The inscription on the eastern gateway records that the mosque was built in 587 A.H., 1191, by Qutbuddin Aibak.",
      source: `${V3}, p. 9`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l2",
      text: "The same inscription says the materials of 27 temples were used in its construction.",
      source: `${V3}, p. 9`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l3",
      text: "The mosque is a quadrangular court 142 feet by 108 feet, enclosed by colonnades of grey stone four pillars deep on the east and three deep on the north and south.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l4",
      text: "The prayer chamber on the west is 147 feet by 40 feet and contains five rows of pillars.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l5",
      text: "Its front is the great arched screen, pierced by five ogee shaped arches in red and yellow sandstone, carved with Hindu patterns and with inscribed bands of naskh lettering.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l6",
      text: "Altamsh extended the enclosure and the screen in 1230, adding 115 feet to north and south and a colonnade 200 feet long.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l7",
      text: "About ninety years later Alauddin Khalji extended it again to twice its former size, which was uncovered in the excavations of 1911 to 1912.",
      source: `${V3}, p. 10`,
    },
    {
      id: "fs_qutub_complex_quwwatul_islam_l8",
      text: "Cunningham records that Qutbuddin Aibak dismantled the superstructure of the earlier temple, kept its foundations and plinth, and set the columns of the despoiled temples up again to form the colonnades.",
      source: `${V3}, p. 11`,
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
