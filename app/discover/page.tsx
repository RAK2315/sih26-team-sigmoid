import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import volume from "@/content/pages/zafar-hasan-v2.json";
import Discover from "./discover";
import type { Gap } from "./gaps";

export const metadata = { title: "Discover - VIRASAT" };

const printedOf = new Map(volume.pages.map((p) => [p.pageNo, p.printedPageNo]));

// a Representation Gap is a Candidate with nothing from the Modern Baseline inside its circle,
// and one of the five has no name the page can be read for, so it is left out rather than shown
// as "Unknown"
const gaps: Gap[] = Object.entries(DISCOVERY_CACHE)
  .flatMap(([key, result]) => {
    const pageNo = Number(key.slice(key.lastIndexOf("-") + 1));
    return result.candidates
      .filter((c) => c.evidence.baselineVerdict === "representation_gap")
      .map((c) => {
        const mention = result.mentions.find((m) => m.id === c.mentionId);
        return { candidate: c, mention, pageNo };
      });
  })
  .filter((row) => row.mention !== undefined && row.mention.name.toLowerCase() !== "unknown")
  .map(({ candidate, mention, pageNo }) => ({
    id: candidate.id,
    name: mention!.name.replace(/\.$/, ""),
    structureType: mention!.type,
    period: mention!.period,
    passage: mention!.passage,
    anchorName: candidate.evidence.anchorName,
    radiusM: candidate.uncertaintyRadiusM,
    confidence: candidate.confidence.total,
    pageNo,
    printedPageNo: printedOf.get(pageNo) ?? null,
  }))
  .sort((a, b) => a.radiusM - b.radiusM);

export default function DiscoverPage() {
  return (
    <Discover
      volumeId={volume.volumeId}
      title={volume.title}
      sourceUrl={volume.sourceUrl}
      licence={volume.licence}
      gaps={gaps}
      // scan order, which is the order the volume is bound in. the printed numbers restart
      // partway through, so sorting by those puts page 1 after page 10.
      pages={[...volume.pages]
        .sort((a, b) => a.pageNo - b.pageNo)
        .map((p) => ({
          pageNo: p.pageNo,
          printedPageNo: p.printedPageNo,
          imageUrl: p.imageUrl,
          text: p.text,
          placed: DISCOVERY_CACHE[`${volume.volumeId}-${p.pageNo}`]?.candidates.length ?? 0,
        }))}
    />
  );
}
