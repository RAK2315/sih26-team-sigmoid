export type Persona = 'history' | 'architecture' | 'kids';
export type Lang = 'en' | 'hi';
export type NarrationKind = 'approach' | 'inside';
export type TraditionStatus = 'living' | 'dormant' | 'lost';

export interface FactSheetLine {
  id: string;
  text: string;
  source: string;
}

export interface FactSheet {
  id: string;
  pointId: string;
  lines: FactSheetLine[];
  sources: {
    label: string;
    url?: string;
    kind: 'asi' | 'archive' | 'book' | 'wikipedia';
  }[];
}

export interface Narration {
  pointId: string;
  persona: Persona;
  lang: Lang;
  kind: NarrationKind;
  audioUrl: string;
  durationSec: number;
  sentences: string[];
  cues: number[];
  factSheetId: string;
}

export interface LivingTradition {
  name: string;
  text: string;
  status: TraditionStatus;
}
