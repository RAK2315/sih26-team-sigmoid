import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const UA = "THRESHOLD-SIH2026/1.0 (rehtrooper@gmail.com; SIH heritage project)";
const OUT = join("public", "images", "then-now");

// Wikimedia Commons only. Archival photography is public domain by age, modern photography is
// CC-BY-SA and credited at point of use. No generated image of a real monument, ever.
// crop is a fraction box for plates that sit inside a scanned album page.
interface Wanted {
  name: string;
  title: string;
  crop?: [number, number, number, number];
}

const wanted: Wanted[] = [
  {
    name: "red-fort-lahori-gate.then.jpg",
    title: "File:The Lahore Gate (Western-Gate) of the Red Fort in 1858.jpg",
  },
  { name: "red-fort-lahori-gate.now.jpg", title: "File:RedFort Lahori Gate.jpg" },
  { name: "red-fort-naubat-khana.then.jpg", title: "File:Naqqar Khana Red Fort 1858.jpg" },
  {
    name: "red-fort-naubat-khana.now.jpg",
    title: "File:20191203 Naubat Khana, Red Fort, Delhi 0453 6340 DxO.jpg",
  },
  {
    name: "red-fort-diwan-i-aam.then.jpg",
    title: "File:Reminiscences of Imperial Delhi The Diwan-i \u2018Am from the west.png",
  },
  { name: "red-fort-diwan-i-aam.now.jpg", title: "File:Deewan-e-aam front.jpg" },
  {
    name: "red-fort-diwan-i-khas.then.jpg",
    title:
      "File:Interieur van de Diwan-i-Khas in het Rode Fort in Delhi The Dewan-i-Khas, or hall of audience (titel op object), RP-F-2001-7-1124-19.jpg",
    crop: [0.238, 0.598, 0.762, 0.836],
  },
  {
    name: "red-fort-diwan-i-khas.now.jpg",
    title:
      "File:PXL 20231129 084741587 Diwan-i-Khas Lal Qila, Old Delhi, New Delhi, Delhi, 110006 05.jpg",
  },
];

function plain(html: string | undefined): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const titles = wanted.map((w) => w.title).join("|");
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    `&iiprop=url|extmetadata&iiurlwidth=2600&titles=${encodeURIComponent(titles)}`;
  const body = await (await fetch(api, { headers: { "User-Agent": UA } })).json();

  const byTitle = new Map<string, Record<string, unknown>>();
  for (const key of Object.keys(body.query.pages)) {
    const page = body.query.pages[key];
    if (page.imageinfo?.[0]) byTitle.set(page.title, page.imageinfo[0]);
  }

  const credits: string[] = [];
  for (const item of wanted) {
    const info = byTitle.get(item.title) as
      | { thumburl: string; descriptionurl: string; extmetadata: Record<string, { value: string }> }
      | undefined;
    if (!info) {
      console.log(`missing on commons: ${item.title}`);
      continue;
    }

    const res = await fetch(info.thumburl, { headers: { "User-Agent": UA } });
    const raw = join(OUT, `${item.name}.raw`);
    await writeFile(raw, Buffer.from(await res.arrayBuffer()));

    const crop = item.crop ? item.crop.join(",") : "";
    await run("python", [join("scripts", "shrink-image.py"), raw, join(OUT, item.name), crop]);

    const meta = info.extmetadata;
    credits.push(
      `${item.name}\n  ${plain(meta.Artist?.value)} | ${plain(meta.DateTimeOriginal?.value).slice(0, 30)} | ` +
        `${plain(meta.LicenseShortName?.value)}\n  ${info.descriptionurl}`,
    );
    console.log(`wrote ${item.name}`);
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\npaste these into the thenNow blocks:\n\n${credits.join("\n\n")}`);
}

main();
