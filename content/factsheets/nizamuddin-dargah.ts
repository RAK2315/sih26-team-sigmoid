import type { FactSheet } from "@/lib/types";

const V2 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. II (1919)";

export const nizamuddinDargahFactSheet: FactSheet = {
  id: "fs_nizamuddin_dargah",
  pointId: "nizamuddin/dargah",
  lines: [
    {
      id: "fs_nizamuddin_dargah_l1",
      text: "The tomb of Shaikh Nizamuddin Auliya is one of the most sacred shrines in India.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l2",
      text: "Nothing remains of the original building, which Firoz Shah Tughlaq repaired and decorated.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l3",
      text: "The present building was erected in 970 A.H., 1562 to 1563, by Faridun Khan.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l4",
      text: "It measures 31 feet 9 inches square outside, with a marble paved verandah 6 feet 9 inches wide and five arched openings on each side.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l5",
      text: "The dome is of bulbous type, springs from an octagonal drum, and is ornamented with vertical stripes of black marble.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l6",
      text: "Khalilullah Khan, governor of Shahjahanabad, built the verandah round the tomb in 1063 A.H., 1652 to 1653, in red sandstone and marble.",
      source: `${V2}, pp. 148 to 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l7",
      text: "Firoz Shah also erected a Jama'at Khana, a congregational chamber, which had not existed before.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l8",
      text: "The enclosure beside the tomb is called Yaran Chabutra, the platform of friends, and has been chosen as a burial place by people of all classes, so that the whole interior is now a graveyard.",
      source: `${V2}, p. 149`,
    },
    {
      id: "fs_nizamuddin_dargah_l9",
      text: "The marble balustrade round the grave was given by Khurshid Jah of Hyderabad in 1300 A.H., 1882 to 1883.",
      source: `${V2}, p. 148`,
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
