import { sites } from "@/content/sites";
import ExploreMap from "./explore-map";

export const metadata = { title: "Explore - VIRASAT" };

export default function ExplorePage() {
  return <ExploreMap sites={sites} />;
}
