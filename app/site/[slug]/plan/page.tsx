import { notFound } from "next/navigation";
import { pointsBySite } from "@/content/points";
import { siteById, sites } from "@/content/sites";
import PlanForm from "./plan-form";

export function generateStaticParams() {
  return sites.filter((s) => s.pointIds.length > 0).map((s) => ({ slug: s.id }));
}

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = siteById(slug);
  const sitePoints = pointsBySite(slug);
  if (!site || sitePoints.length === 0) notFound();

  const traditions = sitePoints.flatMap((p) => (p.livingTradition ? [p.livingTradition] : []));

  return (
    <PlanForm
      site={site}
      traditions={{
        total: traditions.length,
        living: traditions.filter((t) => t.status === "living").length,
        dormant: traditions.filter((t) => t.status === "dormant").length,
        lost: traditions.filter((t) => t.status === "lost").length,
      }}
    />
  );
}
