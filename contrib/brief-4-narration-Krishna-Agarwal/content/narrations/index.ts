import type { Narration } from '../../lib/types';
import { diwanIAamNarrations } from './diwan-i-aam';
import { diwanIKhasNarrations } from './diwan-i-khas';
import { lahoriGateNarrations } from './lahori-gate';
import { rangMahalNarrations } from './rang-mahal';

export const ALL_NARRATIONS: Narration[] = [
  ...diwanIAamNarrations,
  ...diwanIKhasNarrations,
  ...lahoriGateNarrations,
  ...rangMahalNarrations
];