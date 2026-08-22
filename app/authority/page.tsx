import volume from "@/content/pages/zafar-hasan-v2.json";
import Authority from "./authority";

export const metadata = { title: "Authority - VIRASAT" };

export default function AuthorityPage() {
  return (
    <Authority
      volumeTitle={volume.title}
      pages={volume.pages.map((p) => ({
        pageNo: p.pageNo,
        printedPageNo: p.printedPageNo,
        imageUrl: p.imageUrl,
        text: p.text,
        placed: 0,
      }))}
    />
  );
}
