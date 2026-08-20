import fs from "fs";
import path from "path";
import { PAGES } from "../content/pages";
import { extractMentions } from "../lib/extract";

const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2];
    }
  }
}

loadEnv();
process.env.GEMINI_TIMEOUT_MS = String(Number(process.env.GEMINI_TIMEOUT_MS ?? 8000) * 5);
const cacheDir = path.join(root, "content", "cache");

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  fs.mkdirSync(cacheDir, { recursive: true });

  for (const page of PAGES) {
    const out = path.join(cacheDir, `page-${page.pageNo}.json`);
    if (fs.existsSync(out)) {
      console.log(`page ${page.pageNo}: cache exists, skipping`);
      continue;
    }
    console.log(`page ${page.pageNo}: extracting...`);
    let mentions;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const res = await extractMentions(page.text, page.pageNo);
        mentions = res.mentions;
        break;
      } catch (e) {
        lastErr = e;
        console.warn(`  attempt ${attempt} failed, retrying in ${attempt * 5}s`);
        await sleep(attempt * 5000);
      }
    }
    if (mentions === undefined) {
      throw lastErr;
    }
    fs.writeFileSync(out, JSON.stringify({ mentions }, null, 2), "utf8");
    console.log(`page ${page.pageNo}: saved ${mentions.length} mentions`);
    await sleep(7000);
  }

  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});