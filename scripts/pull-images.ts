import { execFile } from "node:child_process";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const UA = "VIRASAT-SIH2026/1.0 (rehtrooper@gmail.com; SIH heritage project)";
const OUT = join("public", "images");

// Wikimedia Commons only. Archival material is public domain by age, modern photography is
// Creative Commons and credited both here and beside the image. No generated image of a real
// monument, ever. The alt text is written by hand because a scraped caption is not a description.
interface Wanted {
  key: string;
  title: string;
  alt: string;
  crop?: [number, number, number, number];
}

const wanted: Wanted[] = [
  {
    key: "sites/red-fort",
    title: "File:Red Fort Front.jpg",
    alt: "The long red sandstone front of the Red Fort seen across the road, its wall running the full width of the frame with the Lahori Gate at the centre.",
  },
  {
    key: "sites/qutub-complex",
    title: "File:Qutb complex -Delhi -Delhi -SSI 0003.jpg",
    alt: "The Qutub Minar rising in five tapering storeys of fluted red sandstone above the ruined arcades of the Quwwat-ul-Islam mosque.",
  },
  {
    key: "sites/humayuns-tomb",
    title: "File:Side View of Humayun’s Tomb from the Gardens.jpg",
    alt: "Humayun's Tomb from the garden, red sandstone banded with white marble under a high central dome, reflected in the water channel.",
  },
  {
    key: "sites/agrasen-ki-baoli",
    title: "File:Agrasen ki Baoli 3.jpg",
    alt: "The stepwell at Agrasen ki Baoli, a long flight of stone steps descending between arcaded walls to a dry chamber at the bottom.",
  },
  {
    key: "sites/feroz-shah-kotla",
    title: "File:Ashokan Pillar at Feroz Shah Kotla Fort.jpg",
    alt: "The polished Ashokan pillar standing on the stepped stone platform Feroz Shah built for it inside Feroz Shah Kotla.",
  },
  {
    key: "sites/rajon-ki-baoli",
    title: "File:Rajon Ki Baoli 102.jpg",
    alt: "Rajon ki Baoli in Mehrauli, three storeys of arcaded stone galleries stepping down around a rectangular well shaft.",
  },
  {
    key: "sites/zafar-mahal",
    title: "File:Sunset at Zafar Mahal (Lal Mahal), Mehrauli, Delhi.jpg",
    alt: "The high red gateway of Zafar Mahal in Mehrauli at sunset, its arch deep enough to have taken an elephant.",
  },
  {
    key: "sites/bhuli-bhatiyari-ka-mahal",
    title: "File:Bhuli Bhatyari Ka Mahal 06.jpg",
    alt: "The rubble stone walls and empty arched doorways of Bhuli Bhatiyari ka Mahal, standing in scrub on the Central Ridge.",
  },
  {
    key: "sites/satpula",
    title: "File:Satpula - stream side.jpg",
    alt: "The seven arched sluices of Satpula seen from the stream bed, the dam wall running across the frame in coursed stone.",
  },
  {
    key: "sites/chausath-khamba",
    title: "File:Chausath Khamba N-DL-123.JPG",
    alt: "Chausath Khamba at Nizamuddin, a low white marble hall whose flat roof rests on rows of square marble pillars.",
  },
  {
    key: "sites/lal-gumbad",
    title: "File:Lal Gumbad.jpg",
    alt: "Lal Gumbad, a small red sandstone tomb with a single dome, standing on open ground in south Delhi.",
  },

  {
    key: "traditions/covered-bazaar",
    title: "File:Chatta Chowk, Red Fort, Delhi.jpg",
    alt: "The vaulted arcade of Chatta Chowk inside the Red Fort, shops open on both sides under a long barrel roof.",
  },
  {
    key: "traditions/jharokha",
    title:
      "File:Emperor Aurangzeb at a jharokha window, two noblemen in the foregroundIn 1710 San Diego Museum of Art.jpg",
    alt: "A Mughal painting of about 1710 showing the emperor Aurangzeb framed in a jharokha window above two noblemen standing below.",
  },
  {
    key: "traditions/parchin-kari",
    title: "File:Cenotaphs and the interior of the tomb of Itimad-ud-Daulah.jpg",
    alt: "Marble inlaid with coloured stone in flowering patterns, photographed at Itimad-ud-Daulah in Agra, the same craft the Red Fort halls carry.",
  },
  {
    key: "traditions/gulab-jal",
    title: "File:Camel skin Perfume Bottles from Kannauj.jpg",
    alt: "Perfume bottles from Kannauj, where the distilling of flowers into attar and rose water is still a working trade.",
  },
  {
    key: "traditions/charbagh",
    title: "File:Fountain at the centre of the Charbagh, surrounding Humayun's Tomb.jpg",
    alt: "A stone fountain at the crossing of the water channels that quarter the charbagh garden around Humayun's Tomb.",
  },
  {
    key: "traditions/jaali",
    title: "File:Sun from Mihrab at Humayun's Tomb.JPG",
    alt: "Sunlight coming through a carved stone jali screen at Humayun's Tomb, the cut pattern thrown across the floor.",
  },
  {
    key: "traditions/ramparts-address",
    title: "File:PM Nehru addresses the nation from the Red Fort on 15 August 1947.jpg",
    alt: "Jawaharlal Nehru addressing the country from the ramparts of the Red Fort on 15 August 1947, the crowd filling the ground below.",
  },
  {
    key: "traditions/private-chapel",
    title: "File:20191203 Moti Masjid, Red Fort, Delhi 0502 6354 DxO.jpg",
    alt: "The Moti Masjid inside the Red Fort, a small mosque cut entirely in white marble with three bulbous domes.",
  },
  {
    key: "traditions/zenana",
    title: "File:Mumtaz Mahal Red Fort.jpg",
    alt: "The Mumtaz Mahal in the Red Fort, one of the palaces of the zenana, now standing empty and used as a museum.",
  },
  {
    key: "traditions/naubat",
    title: "File:Musicians of the naqqāra-khāna celebrate the birth of Prince Salim.jpg",
    alt: "A Mughal painting of about 1590 showing the musicians of the naqqara khana playing drums and horns from a gallery.",
  },
  {
    key: "traditions/naqqashi",
    title: "File:Ceiling of Rang Mahal, Red Fort, Delhi.jpg",
    alt: "The painted and gilded ceiling of the Rang Mahal in the Red Fort, patterned in panels of colour and gold.",
  },

  {
    key: "sites/nizamuddin-basti",
    title: "File:Nizamuddin Dargah -Delhi -Delhi -DSC 0001.jpg",
    alt: "The dargah of Hazrat Nizamuddin Auliya, its marble verandah and striped dome rising over the crowded courtyard of the basti.",
  },
  {
    key: "traditions/kokaltash",
    title: "File:Marble Pillars in Chausath Khamba.jpg",
    alt: "Rows of square marble pillars inside Chaunsath Khamba, the hall Mirza Aziz Kokaltash built over his own grave.",
  },
  {
    key: "traditions/burial-beside-the-saint",
    title:
      "File:Jahanara Begum's Tomb- Hazrat Nizamuddin Dargah- Delhi-MVIMG 20200318 150326-01.jpg",
    alt: "The open marble grave of Jahanara Begum in the enclosure at Nizamuddin, one of thousands of people buried as close to the saint as they could get.",
  },
  {
    key: "plates/palace-from-metcalfe-house",
    title:
      "File:Reminiscences of Imperial Delhi View of the Delhi palace from Metcalfe House.png",
    alt: "An 1843 watercolour of the Delhi palace seen at a distance across open ground from Metcalfe House, its walls low along the horizon.",
  },
  {
    key: "plates/east-face",
    title: "File:Reminiscences of Imperial Delhi East face of the palace of the Red Fort Delhi.png",
    alt: "An 1843 watercolour of the east face of the Red Fort palace, its river front drawn in a long line of pavilions and towers.",
  },
  {
    key: "plates/musamman-burj",
    title: "File:Reminiscences of Imperial Delhi The Musamman Burj.png",
    alt: "An 1843 watercolour of the Musamman Burj, the octagonal tower on the river wall of the Red Fort from which the emperor showed himself.",
  },
  {
    key: "plates/chandni-chowk-1858",
    title: "File:Chandni Chowk, Delhi, 1858.jpg",
    alt: "Felice Beato's 1858 photograph of Chandni Chowk, the street running away between low shopfronts with a canal down its centre.",
  },
  {
    key: "plates/shah-jahan-court",
    title: "File:Shah Jahan holding court.jpg",
    alt: "A Mughal painting of about 1650 showing Shah Jahan holding court, the emperor raised in a jharokha with ranks of courtiers below.",
  },
  {
    key: "plates/jahangir-darbar",
    title: "File:Jahangir in Darbar.jpg",
    alt: "A Mughal painting of about 1624 of Jahangir's darbar, the assembled court standing in rows before the emperor.",
  },
  {
    key: "plates/qawwali-nizamuddin",
    title: "File:Qawwali hazrat nizamuddin delhi.jpg",
    alt: "Qawwals singing at the dargah of Hazrat Nizamuddin in Delhi, seated in a group with harmonium and tabla among the listeners.",
  },
];

function plain(html: string | undefined): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// commons dates arrive in a dozen shapes, so keep the year and drop the rest
function year(meta: Record<string, { value: string }>): string {
  const raw = plain(meta.DateTimeOriginal?.value) || plain(meta.DateTime?.value);
  const found = raw.match(/\d{4}/);
  return found ? found[0] : "date not recorded";
}

async function main() {
  const titles = wanted.map((w) => w.title);
  const found = new Map<string, Record<string, unknown>>();

  // the api takes fifty titles a call and we are well under, but batch anyway so it stays true
  for (let i = 0; i < titles.length; i += 25) {
    const api =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
      `&iiprop=url|extmetadata&iiurlwidth=2200&titles=${encodeURIComponent(titles.slice(i, i + 25).join("|"))}`;
    const body = await (await fetch(api, { headers: { "User-Agent": UA } })).json();
    for (const key of Object.keys(body.query.pages)) {
      const page = body.query.pages[key];
      if (page.imageinfo?.[0]) found.set(page.title, page.imageinfo[0]);
    }
  }

  const entries: string[] = [];
  for (const item of wanted) {
    const info = found.get(item.title) as
      | { thumburl: string; descriptionurl: string; extmetadata: Record<string, { value: string }> }
      | undefined;
    if (!info) {
      console.log(`missing on commons, skipped: ${item.title}`);
      continue;
    }

    const file = join(OUT, `${item.key}.jpg`);
    await mkdir(dirname(file), { recursive: true });
    // credits are read every run so they cannot drift, but a file already here is not refetched
    const have = await access(file).then(
      () => true,
      () => false,
    );
    if (!have) {
      const res = await fetch(info.thumburl, { headers: { "User-Agent": UA } });
      const raw = `${file}.raw`;
      await writeFile(raw, Buffer.from(await res.arrayBuffer()));
      await run("python", [
        join("scripts", "shrink-image.py"),
        raw,
        file,
        item.crop ? item.crop.join(",") : "",
      ]);
    }

    const meta = info.extmetadata;
    entries.push(
      `  "${item.key}": {\n` +
        `    url: "/images/${item.key}.jpg",\n` +
        `    alt: ${JSON.stringify(item.alt)},\n` +
        `    year: ${JSON.stringify(year(meta))},\n` +
        `    author: ${JSON.stringify(plain(meta.Artist?.value) || "author not recorded")},\n` +
        `    licence: ${JSON.stringify(plain(meta.LicenseShortName?.value) || "see Commons")},\n` +
        `    sourceUrl: ${JSON.stringify(info.descriptionurl)},\n` +
        `  },`,
    );
    console.log(`${have ? "kept" : "wrote"} ${item.key}`);
    if (!have) await new Promise((r) => setTimeout(r, 400));
  }

  const generated =
    `// generated by scripts/pull-images.ts, do not edit by hand\n` +
    `import type { ArchiveImage } from "@/lib/types";\n\n` +
    `export const IMAGES = {\n${entries.join("\n")}\n} satisfies Record<string, ArchiveImage>;\n\n` +
    `export type ImageKey = keyof typeof IMAGES;\n`;
  await writeFile(join("content", "images.ts"), generated);
  console.log(`\ncontent/images.ts written with ${entries.length} images`);
}

main();
