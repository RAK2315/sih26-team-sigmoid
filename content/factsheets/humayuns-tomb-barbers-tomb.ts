import type { FactSheet } from "@/lib/types";

const V2 = "Zafar Hasan, List of Muhammadan and Hindu Monuments, Delhi Province, Vol. II (1919)";

export const barbersTombFactSheet: FactSheet = {
  id: "fs_humayuns_tomb_barbers_tomb",
  pointId: "humayuns-tomb/barbers-tomb",
  lines: [
    {
      id: "fs_humayuns_tomb_barbers_tomb_l1",
      text: "The survey lists this only as a tomb commonly called the tomb of the Barber, standing at the south east corner of the enclosure of Humayun's tomb.",
      source: `${V2}, p. 124`,
    },
    {
      id: "fs_humayuns_tomb_barbers_tomb_l2",
      text: "There are two grave stones. One, of a woman, carries the figures 999, which seem to stand for the year, about 1590 to 1591.",
      source: `${V2}, p. 124`,
    },
    {
      id: "fs_humayuns_tomb_barbers_tomb_l3",
      text: "It stands on a platform 8 feet high and 76 feet square, built of Delhi quartzite picked out with red sandstone, reached by steps on the south side.",
      source: `${V2}, p. 124`,
    },
    {
      id: "fs_humayuns_tomb_barbers_tomb_l4",
      text: "The tomb itself is red sandstone, 24 feet square inside, with recessed arches on all four sides and red sandstone jali screens closing three of them.",
      source: `${V2}, p. 124`,
    },
    {
      id: "fs_humayuns_tomb_barbers_tomb_l5",
      text: "The dome stands on a sixteen sided drum and the corners of the roof are marked by square chattris.",
      source: `${V2}, p. 124`,
    },
    {
      id: "fs_humayuns_tomb_barbers_tomb_l6",
      text: "Traces of old blue painting in floral designs are still visible on the soffit of the dome.",
      source: `${V2}, p. 124`,
    },
    {
      id: "fs_humayuns_tomb_barbers_tomb_l7",
      text: "It is not known how this building came to be called the tomb of the barber.",
      source: `${V2}, p. 124`,
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
