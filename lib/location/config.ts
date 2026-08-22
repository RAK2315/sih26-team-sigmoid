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

// a real fix has to clear the Dwell drift tolerance by a wide margin or standing still would
// look like walking, so this is derived from that number rather than set independently
export const GPS_SETTLE_M = TRIGGER_CONFIG.dwellDriftM * 4;
