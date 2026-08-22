import type { LivingTradition } from '../../lib/types';
import { diwanIAamLivingTradition } from './diwan-i-aam';
import { diwanIKhasLivingTradition } from './diwan-i-khas';
import { lahoriGateLivingTradition } from './lahori-gate';
import { rangMahalLivingTradition } from './rang-mahal';

export const ALL_LIVING_TRADITIONS: Record<string, LivingTradition> = {
  'red-fort/diwan-i-aam': diwanIAamLivingTradition,
  'red-fort/diwan-i-khas': diwanIKhasLivingTradition,
  'red-fort/lahori-gate': lahoriGateLivingTradition,
  'red-fort/rang-mahal': rangMahalLivingTradition
};