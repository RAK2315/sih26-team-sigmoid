import type { HeritagePoint } from "@/lib/types";
import { humayunsTombMausoleum } from "./humayuns-tomb/mausoleum";
import { atgahKhan } from "./nizamuddin/atgah-khan";
import { chaunsathKhamba } from "./nizamuddin/chaunsath-khamba";
import { nizamuddinDargah } from "./nizamuddin/dargah";
import { qutubMinar } from "./qutub-complex/qutub-minar";
import { chattaChowk } from "./red-fort/chatta-chowk";
import { diwanIAam } from "./red-fort/diwan-i-aam";
import { diwanIKhas } from "./red-fort/diwan-i-khas";
import { hammam } from "./red-fort/hammam";
import { hayatBakhshBagh } from "./red-fort/hayat-bakhsh-bagh";
import { khasMahal } from "./red-fort/khas-mahal";
import { lahoriGate } from "./red-fort/lahori-gate";
import { motiMasjid } from "./red-fort/moti-masjid";
import { mumtazMahal } from "./red-fort/mumtaz-mahal";
import { naubatKhana } from "./red-fort/naubat-khana";
import { rangMahal } from "./red-fort/rang-mahal";

// visitor order, west to east
export const points: HeritagePoint[] = [
  lahoriGate,
  chattaChowk,
  naubatKhana,
  diwanIAam,
  rangMahal,
  khasMahal,
  diwanIKhas,
  hammam,
  motiMasjid,
  hayatBakhshBagh,
  mumtazMahal,
  nizamuddinDargah,
  atgahKhan,
  chaunsathKhamba,
  qutubMinar,
  humayunsTombMausoleum,
];

export function pointById(id: string): HeritagePoint | undefined {
  return points.find((p) => p.id === id);
}

export function pointsBySite(siteId: string): HeritagePoint[] {
  return points.filter((p) => p.siteId === siteId);
}
