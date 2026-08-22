import { DISCOVERY_CACHE } from "@/content/discovery-cache";
import volume from "@/content/pages/zafar-hasan-v2.json";
import Discover from "./discover";

export const metadata = { title: "Discover - VIRASAT" };

export default function DiscoverPage() {
  return (
    <Discover
      volumeId={volume.volumeId}
      title={volume.title}
      sourceUrl={volume.sourceUrl}
      licence={volume.licence}
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
