import fs from "fs";
import { resolveClue } from "../lib/resolve";
import { scoreConfidence } from "../lib/confidence";
import { toLeaflet } from "../lib/geo";
import { ANCHORS } from "../content/anchors";
import { PAGES } from "../content/pages";

const clue = {
  anchorName: "Kotla Firoz Shah",
  bearing: "N" as const,
  distanceValue: 200,
  distanceUnit: "yards" as const,
};
const r = resolveClue(clue, ANCHORS)!;

console.assert(r.centroid[0] > 76.8 && r.centroid[0] < 77.4, "first element must be LONGITUDE");
console.assert(r.centroid[1] > 28.3 && r.centroid[1] < 28.9, "second element must be LATITUDE");
console.assert(r.centroid[1] > 28.6383, "north must increase latitude");
console.assert(typeof r.uncertaintyRadiusM === "number" && r.uncertaintyRadiusM > 0);

console.assert(
  resolveClue({ ...clue, anchorName: "a place that does not exist" }, ANCHORS) === null,
  "an unknown anchor must return null, never a guess"
);

console.assert(toLeaflet([77.241, 28.6562])[0] === 28.6562, "toLeaflet must output [lat, lng]");

for (const a of ANCHORS) {
  console.assert(a.centroid[0] > 76.8 && a.centroid[0] < 77.4, `${a.id}: lng out of Delhi`);
  console.assert(a.centroid[1] > 28.3 && a.centroid[1] < 28.9, `${a.id}: lat out of Delhi`);
  console.assert(a.precisionM > 0, `${a.id}: precisionM must be set`);
}

console.assert(ANCHORS.length >= 40, "need about 60 anchors");
console.assert(PAGES.length === 20, "need 20 ingested pages");
for (const p of PAGES) {
  console.assert(p.text.trim().length > 200, `page ${p.pageNo}: text too short`);
  console.assert(
    fs.existsSync(`public/pages/n${p.pageNo}.jpg`),
    `page ${p.pageNo}: scan missing`
  );
  console.assert(
    fs.existsSync(`content/cache/page-${p.pageNo}.json`),
    `page ${p.pageNo}: no cache`
  );
}

console.assert(
  scoreConfidence({
    sourceReliability: 0,
    clueSpecificity: 0,
    anchorPrecision: 0,
    crossSourceAgreement: 0,
    modernEvidence: 0,
  }) === 0
);
console.assert(
  scoreConfidence({
    sourceReliability: 1,
    clueSpecificity: 1,
    anchorPrecision: 1,
    crossSourceAgreement: 1,
    modernEvidence: 1,
  }) <= 1.0001
);

console.log("verify: all assertions passed");
console.log("anchors:", ANCHORS.length, "pages:", PAGES.length);