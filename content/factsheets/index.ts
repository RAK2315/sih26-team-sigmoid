import type { FactSheet } from "@/lib/types";
import { barbersTombFactSheet } from "./humayuns-tomb-barbers-tomb";
import { isaKhanFactSheet } from "./humayuns-tomb-isa-khan";
import { humayunsTombFactSheet } from "./humayuns-tomb-mausoleum";
import { atgahKhanFactSheet } from "./nizamuddin-atgah-khan";
import { chaunsathKhambaFactSheet } from "./nizamuddin-chaunsath-khamba";
import { nizamuddinDargahFactSheet } from "./nizamuddin-dargah";
import { alaiMinarFactSheet } from "./qutub-complex-alai-minar";
import { qutubMinarFactSheet } from "./qutub-complex-qutub-minar";
import { quwwatulIslamFactSheet } from "./qutub-complex-quwwatul-islam";
import { chattaChowkFactSheet } from "./red-fort-chatta-chowk";
import { diwanIAamFactSheet } from "./red-fort-diwan-i-aam";
import { diwanIKhasFactSheet } from "./red-fort-diwan-i-khas";
import { hammamFactSheet } from "./red-fort-hammam";
import { hayatBakhshBaghFactSheet } from "./red-fort-hayat-bakhsh-bagh";
import { khasMahalFactSheet } from "./red-fort-khas-mahal";
import { lahoriGateFactSheet } from "./red-fort-lahori-gate";
import { motiMasjidFactSheet } from "./red-fort-moti-masjid";
import { mumtazMahalFactSheet } from "./red-fort-mumtaz-mahal";
import { naubatKhanaFactSheet } from "./red-fort-naubat-khana";
import { rangMahalFactSheet } from "./red-fort-rang-mahal";

export const factSheets: FactSheet[] = [
  lahoriGateFactSheet,
  chattaChowkFactSheet,
  naubatKhanaFactSheet,
  diwanIAamFactSheet,
  rangMahalFactSheet,
  khasMahalFactSheet,
  diwanIKhasFactSheet,
  hammamFactSheet,
  motiMasjidFactSheet,
  hayatBakhshBaghFactSheet,
  mumtazMahalFactSheet,
  nizamuddinDargahFactSheet,
  atgahKhanFactSheet,
  chaunsathKhambaFactSheet,
  qutubMinarFactSheet,
  quwwatulIslamFactSheet,
  alaiMinarFactSheet,
  isaKhanFactSheet,
  humayunsTombFactSheet,
  barbersTombFactSheet,
];

export function factSheetForPoint(pointId: string): FactSheet | undefined {
  return factSheets.find((f) => f.pointId === pointId);
}
