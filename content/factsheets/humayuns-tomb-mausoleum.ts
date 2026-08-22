import type { FactSheet } from "@/lib/types";

const V2 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. II (1919)";

export const humayunsTombFactSheet: FactSheet = {
  id: "fs_humayuns_tomb_mausoleum",
  pointId: "humayuns-tomb/mausoleum",
  lines: [
    {
      id: "fs_humayuns_tomb_mausoleum_l1",
      text: "The grave of Humayun is a block of white marble 6 feet by 2 feet 9 inches, set at floor level and without ornament.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l2",
      text: "The walls of the central chamber are panelled in marble to a height of some six feet, the recesses inlaid with black marble and red sandstone stars.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l3",
      text: "The domed ceiling of the central chamber stands some 80 feet above the floor.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l4",
      text: "The marble outer dome is about 74 feet across and stands on a circular red sandstone drum 25 feet high, patterned with stars in yellow sandstone.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l5",
      text: "The finial is a series of copper vessels threaded loosely on a wooden upright, standing 18 feet above the crown of the dome, and it was taken down and refixed in 1912.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l6",
      text: "The finial does not spring from a lotus cresting, as is usually the case, but direct from the top of the dome.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l7",
      text: "The rooms on the roof and in the upper storeys are said to have been used as a college, at one time an institution of considerable importance.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l8",
      text: "There is no mosque here, which is unusual for a building of this size.",
      source: `${V2}, p. 121`,
    },
    {
      id: "fs_humayuns_tomb_mausoleum_l9",
      text: "The tomb has often been called the dormitory of the house of Timur, and besides the emperor it holds graves in the octagonal chambers on three sides.",
      source: `${V2}, p. 121`,
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
