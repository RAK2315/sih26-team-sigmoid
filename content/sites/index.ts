import type { HeritageSite } from "@/lib/types";
import { humayunsTomb } from "./humayuns-tomb";
import { nizamuddinBasti } from "./nizamuddin-basti";
import { qutubComplex } from "./qutub-complex";
import { redFort } from "./red-fort";
import { shallowSites } from "./shallow";

export const sites: HeritageSite[] = [
  redFort,
  qutubComplex,
  humayunsTomb,
  nizamuddinBasti,
  ...shallowSites,
];

export function siteById(id: string): HeritageSite | undefined {
  return sites.find((s) => s.id === id);
}
