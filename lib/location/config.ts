import type { EngineConfig } from "./engine";

// read as literals because Next inlines NEXT_PUBLIC_ vars at build time
export const TRIGGER_CONFIG: EngineConfig = {
  dwellMs: Number(process.env.NEXT_PUBLIC_DWELL_MS ?? 3000),
  facingToleranceDeg: Number(process.env.NEXT_PUBLIC_FACING_TOLERANCE_DEG ?? 60),
  approachBufferM: Number(process.env.NEXT_PUBLIC_APPROACH_BUFFER_M ?? 25),
  dwellDriftM: Number(process.env.NEXT_PUBLIC_DWELL_DRIFT_M ?? 1.5),
  rearmBufferM: Number(process.env.NEXT_PUBLIC_REARM_BUFFER_M ?? 10),
  rearmMs: Number(process.env.NEXT_PUBLIC_REARM_MS ?? 3000),
};

// how far a real fix has to jump before we believe the Visitor moved rather than the satellites
export const GPS_SETTLE_M = Number(process.env.NEXT_PUBLIC_GPS_SETTLE_M ?? 6);
