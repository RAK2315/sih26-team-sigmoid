import type { FactSheet } from '../../lib/types';
import { diwanIAamFactSheet } from './diwan-i-aam';
import { diwanIKhasFactSheet } from './diwan-i-khas';
import { lahoriGateFactSheet } from './lahori-gate';
import { rangMahalFactSheet } from './rang-mahal';

export const ALL_FACT_SHEETS: FactSheet[] = [
  diwanIAamFactSheet,
  diwanIKhasFactSheet,
  lahoriGateFactSheet,
  rangMahalFactSheet
];
