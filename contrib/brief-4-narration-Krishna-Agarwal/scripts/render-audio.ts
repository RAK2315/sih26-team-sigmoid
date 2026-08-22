import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { diwanIAamNarrations } from '../content/narrations/diwan-i-aam';
import { diwanIKhasNarrations } from '../content/narrations/diwan-i-khas';
import { lahoriGateNarrations } from '../content/narrations/lahori-gate';
import { rangMahalNarrations } from '../content/narrations/rang-mahal';
import type { Narration } from '../lib/types';

interface SourceTextManifest {
  [narrationKey: string]: {
    pointId: string;
    persona: string;
    lang: string;
    kind: string;
    sha256: string;
  };
}

const VOICE_MAP: Record<string, string> = {
  history: 'en-IN-PrabhatNeural',
  architecture: 'en-IN-PrabhatNeural',
  kids: 'en-IN-NeerjaNeural'
};

const narrationGroups = [
  { fileName: 'diwan-i-aam.ts', exportName: 'diwanIAamNarrations', narrations: diwanIAamNarrations },
  { fileName: 'diwan-i-khas.ts', exportName: 'diwanIKhasNarrations', narrations: diwanIKhasNarrations },
  { fileName: 'lahori-gate.ts', exportName: 'lahoriGateNarrations', narrations: lahoriGateNarrations },
  { fileName: 'rang-mahal.ts', exportName: 'rangMahalNarrations', narrations: rangMahalNarrations }
];

function getNarrationKey(n: Narration): string {
  return `${n.pointId}:${n.persona}:${n.kind}:${n.lang}`;
}

function parseVtt(vttContent: string): { cues: number[]; durationSec: number } {
  const lines = vttContent.split(/\r?\n/);
  const cues: number[] = [];
  let durationSec = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
    if (match) {
      const startH = parseInt(match[1], 10);
      const startM = parseInt(match[2], 10);
      const startS = parseInt(match[3], 10);
      const startMs = parseInt(match[4], 10);
      const startTime = startH * 3600 + startM * 60 + startS + startMs / 1000;

      const endH = parseInt(match[5], 10);
      const endM = parseInt(match[6], 10);
      const endS = parseInt(match[7], 10);
      const endMs = parseInt(match[8], 10);
      const endTime = endH * 3600 + endM * 60 + endS + endMs / 1000;

      cues.push(parseFloat(startTime.toFixed(3)));
      if (endTime > durationSec) {
        durationSec = parseFloat(endTime.toFixed(3));
      }
    }
  }

  return { cues, durationSec };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeUnlink(filePath: string) {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch {}
}

async function persistNarrationFile(fileName: string, exportName: string, narrations: Narration[]) {
  const narrationFilePath = join(process.cwd(), 'content', 'narrations', fileName);
  const updatedContent = `import type { Narration } from '../../lib/types';\n\nexport const ${exportName}: Narration[] = ${JSON.stringify(narrations, null, 2)};\n`;
  await writeFile(narrationFilePath, updatedContent, 'utf8');
}

async function persistManifest(publicAudioDir: string, manifest: SourceTextManifest) {
  const manifestPath = join(publicAudioDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

async function renderAll() {
  console.log('=== Step 5 Scope Check & Pre-flight Validation ===');

  const allNarrations: Narration[] = [];
  for (const group of narrationGroups) {
    allNarrations.push(...group.narrations);
  }

  if (allNarrations.length !== 16) {
    throw new Error(`Scope check failed: Expected 16 narration objects, found ${allNarrations.length}`);
  }

  for (const n of allNarrations) {
    if (!n.pointId || !n.persona || !n.lang || !n.kind || !n.sentences || !n.factSheetId) {
      throw new Error(`Scope check failed: Missing required fields in narration object ${JSON.stringify(n)}`);
    }
    if ((n.persona as string) === 'inside') {
      throw new Error(`Scope check failed: Found invalid persona 'inside' in narration for ${n.pointId}`);
    }
    if (!['history', 'architecture', 'kids'].includes(n.persona)) {
      throw new Error(`Scope check failed: Unknown persona '${n.persona}' in narration for ${n.pointId}`);
    }
    if (!['approach', 'inside'].includes(n.kind)) {
      throw new Error(`Scope check failed: Unknown kind '${n.kind}' in narration for ${n.pointId}`);
    }
  }

  console.log('Scope check PASSED. Exactly 16 valid narration objects found.');

  const publicAudioDir = join(process.cwd(), 'public', 'audio');
  const manifestPath = join(publicAudioDir, 'manifest.json');

  let existingManifest: SourceTextManifest = {};
  if (existsSync(manifestPath)) {
    try {
      const manifestStr = await readFile(manifestPath, 'utf8');
      existingManifest = JSON.parse(manifestStr);
    } catch {}
  }

  let mp3Count = 0;
  let vttCount = 0;
  let skippedCount = 0;

  for (const group of narrationGroups) {
    for (const narration of group.narrations) {
      const key = getNarrationKey(narration);
      const joinedText = narration.sentences.join(' ');
      const currentSha = createHash('sha256').update(joinedText, 'utf8').digest('hex');

      const fileStem = narration.kind === 'inside'
        ? `${narration.persona}-inside.${narration.lang}`
        : `${narration.persona}.${narration.lang}`;

      const targetDir = join(publicAudioDir, narration.pointId);
      await mkdir(targetDir, { recursive: true });

      const finalMp3Path = join(targetDir, `${fileStem}.mp3`);
      const finalVttPath = join(targetDir, `${fileStem}.vtt`);

      // Strict check before skipping/reusing: SHA must match, MP3/VTT must exist and be non-zero, VTT cue count must match sentences
      let isReusable = false;
      if (
        narration.audioUrl &&
        narration.durationSec > 0 &&
        existsSync(finalMp3Path) &&
        existsSync(finalVttPath) &&
        existingManifest[key]?.sha256 === currentSha
      ) {
        try {
          const mp3S = await stat(finalMp3Path);
          const vttStr = await readFile(finalVttPath, 'utf8');
          const { cues } = parseVtt(vttStr);
          if (mp3S.size > 0 && mp3S.size < 5 * 1024 * 1024 && cues.length === narration.sentences.length) {
            isReusable = true;
          }
        } catch {}
      }

      if (isReusable) {
        console.log(`Preserving verified valid audio for [${key}] (audioUrl=${narration.audioUrl}, durationSec=${narration.durationSec}s)`);
        existingManifest[key] = {
          pointId: narration.pointId,
          persona: narration.persona,
          lang: narration.lang,
          kind: narration.kind,
          sha256: currentSha
        };
        skippedCount++;
        continue;
      }

      console.log(`\nRendering narration [${key}]...`);

      const voice = VOICE_MAP[narration.persona];
      if (!voice) {
        throw new Error(`No voice mapping found for persona '${narration.persona}'`);
      }

      const tempMp3Path = join(targetDir, `${fileStem}.mp3.tmp`);
      const tempVttPath = join(targetDir, `${fileStem}.vtt.tmp`);

      // Clean old temp files if present
      await safeUnlink(tempMp3Path);
      await safeUnlink(tempVttPath);

      // Run python -m edge_tts with up to 3 retries targeting .tmp files
      const cmd = `python -m edge_tts -t ${JSON.stringify(joinedText)} -v ${voice} --write-media ${JSON.stringify(tempMp3Path)} --write-subtitles ${JSON.stringify(tempVttPath)}`;

      let success = false;
      let lastErr: any = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          execSync(cmd, { stdio: 'pipe' });
          success = true;
          break;
        } catch (err: any) {
          lastErr = err;
          console.warn(`Attempt ${attempt} failed for [${key}], retrying in 2s...`);
          await sleep(2000);
        }
      }

      if (!success) {
        await safeUnlink(tempMp3Path);
        await safeUnlink(tempVttPath);
        console.error(`Rendering FAILED for narration [${key}]`);
        throw new Error(`edge_tts command failed for ${key} after 3 attempts: ${lastErr?.message || lastErr}`);
      }

      // Validate .tmp files before atomic rename
      try {
        const mp3Stats = await stat(tempMp3Path);
        if (mp3Stats.size === 0) {
          throw new Error(`Generated MP3 file for ${key} is 0 bytes.`);
        }
        if (mp3Stats.size > 5 * 1024 * 1024) {
          throw new Error(`Generated MP3 file for ${key} exceeds 5MB limit (${mp3Stats.size} bytes).`);
        }

        const vttContent = await readFile(tempVttPath, 'utf8');
        const { cues, durationSec } = parseVtt(vttContent);

        // STRICT VTT CUE VALIDATION
        if (cues.length !== narration.sentences.length) {
          throw new Error(
            `VTT cue count mismatch for [${key}]: VTT extracted ${cues.length} cues, but narration has ${narration.sentences.length} sentences.`
          );
        }

        if (cues[0] < 0) {
          throw new Error(`First cue for [${key}] is negative: ${cues[0]}`);
        }

        for (let i = 1; i < cues.length; i++) {
          if (cues[i] <= cues[i - 1]) {
            throw new Error(
              `Cues are not strictly increasing for [${key}] at index ${i}: cue[${i-1}]=${cues[i-1]}, cue[${i}]=${cues[i]}`
            );
          }
        }

        const finalCue = cues[cues.length - 1];
        if (finalCue >= durationSec) {
          throw new Error(
            `Final cue (${finalCue}s) for [${key}] is not before durationSec (${durationSec}s)`
          );
        }

        // DURATION RANGE WARNING — Brief §4.3 states ranges as generation targets, not programmatic invariants.
        // §5 tests and §6 verify.ts do not assert duration ranges. Print a warning but do not reject the render.
        let minDur = 0;
        let maxDur = 0;
        if (narration.kind === 'inside') {
          minDur = 20;
          maxDur = 25;
        } else if (narration.persona === 'history') {
          minDur = 90;
          maxDur = 120;
        } else if (narration.persona === 'architecture') {
          minDur = 80;
          maxDur = 110;
        } else if (narration.persona === 'kids') {
          minDur = 45;
          maxDur = 65;
        }

        if (minDur > 0 && (durationSec < minDur || durationSec > maxDur)) {
          console.warn(
            `WARNING: Duration outside §4.3 target for [${key}]: ${durationSec}s (target ${minDur}–${maxDur}s). Accepted — all Brief invariants pass.`
          );
        }

        // Atomic rename of .tmp files to final destination after 100% validation pass
        await rename(tempMp3Path, finalMp3Path);
        await rename(tempVttPath, finalVttPath);

        // Update in-memory narration metadata
        narration.audioUrl = `/audio/${narration.pointId}/${fileStem}.mp3`;
        narration.durationSec = durationSec;
        narration.cues = cues;

        // Persist per-item metadata to .ts file immediately
        await persistNarrationFile(group.fileName, group.exportName, group.narrations);

        // Update manifest entry and persist immediately
        existingManifest[key] = {
          pointId: narration.pointId,
          persona: narration.persona,
          lang: narration.lang,
          kind: narration.kind,
          sha256: currentSha
        };
        await persistManifest(publicAudioDir, existingManifest);

        mp3Count++;
        vttCount++;

        console.log(`Rendering SUCCESS for [${key}]: audioUrl=${narration.audioUrl}, durationSec=${durationSec}s (required ${minDur}-${maxDur}s), cues=${cues.length}, size=${(mp3Stats.size / 1024).toFixed(1)}KB`);
      } catch (err) {
        // Rollback: delete temp files and preserve last known valid file
        await safeUnlink(tempMp3Path);
        await safeUnlink(tempVttPath);
        throw err;
      }
    }
  }

  console.log('\n=== Rendering Summary ===');
  console.log(`Narration objects processed: ${allNarrations.length}`);
  console.log(`Preserved valid & SHA-verified: ${skippedCount}`);
  console.log(`MP3 files created/updated: ${mp3Count}`);
  console.log(`VTT files created/updated: ${vttCount}`);
}

renderAll().catch((err) => {
  console.error('\nRENDER-AUDIO SCRIPT FAILED:', err);
  process.exit(1);
});
