export type StructureType =
  | 'mosque' | 'tomb' | 'gateway' | 'fort_wall' | 'palace' | 'pavilion'
  | 'stepwell' | 'caravanserai' | 'garden' | 'bridge' | 'well'
  | 'temple' | 'madrasa' | 'hammam' | 'tower' | 'other';

export type DistanceUnit = 'yards' | 'feet' | 'miles' | 'kos' | 'paces' | 'gaz';

export type BearingToken =
  | 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
  | 'adjacent' | 'within' | 'opposite';

export type CandidateStatus =
  | 'extracted' | 'geo_resolved' | 'candidate'
  | 'under_review' | 'verified' | 'rejected' | 'matched_existing';

export interface SpatialClue {
  anchorName: string;
  bearing: BearingToken | null;
  distanceValue: number | null;
  distanceUnit: DistanceUnit | null;
}

export interface Mention {
  id: string;                        // "m_87_1" = page 87, first mention
  name: string;
  type: StructureType;
  period: string | null;
  passage: string;                   // verbatim from the page text
  passageOffset: [number, number];   // char range into the page text
  spatialClue: SpatialClue | null;
}

export interface ConfidenceParts {
  sourceReliability: number;
  clueSpecificity: number;
  anchorPrecision: number;
  crossSourceAgreement: number;      // always 0 for now, reserved
  modernEvidence: number;
}

export interface Candidate {
  id: string;                        // "c_87_1", matches its Mention
  mentionId: string;
  centroid: [number, number] | null; // [lng, lat] GeoJSON order. null = unresolvable
  uncertaintyRadiusM: number | null;
  status: CandidateStatus;
  matchedBaselineFeature: { id: string; name: string; distanceM: number } | null;
  confidence: { total: number; parts: ConfidenceParts };
}

export interface Anchor {
  id: string;
  name: string;
  aliases: string[];
  centroid: [number, number];        // [lng, lat]
  precisionM: number;
}

export interface BaselineFeature {
  id: string;                        // "node/123456"
  name: string;
  centroid: [number, number];        // [lng, lat]
}