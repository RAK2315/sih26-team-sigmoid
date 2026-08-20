import fs from "fs";
import path from "path";

const QUERY = `[out:json][timeout:60];
(node["historic"](28.40,76.84,28.88,77.35);
 way["historic"](28.40,76.84,28.88,77.35);
 node["heritage"](28.40,76.84,28.88,77.35);
 way["heritage"](28.40,76.84,28.88,77.35););
out center;`;

const root = path.resolve(__dirname, "..");

function toName(tags: Record<string, string>): string | null {
  return tags.name || tags["name:en"] || null;
}

async function main() {
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "User-Agent": "sih26-threshold-discovery-brief1/1.0",
    },
    body: new URLSearchParams({ data: QUERY }),
  });
  if (!res.ok) throw new Error(`overpass failed: ${res.status}`);
  const json = await res.json();

  const features: GeoJSON.Feature[] = [];
  for (const el of json.elements ?? []) {
    const name = toName(el.tags ?? {});
    if (!name) continue;
    let lon: number | undefined;
    let lat: number | undefined;
    if (el.type === "node") {
      lon = el.lon;
      lat = el.lat;
    } else if (el.center) {
      lon = el.center.lon;
      lat = el.center.lat;
    }
    if (lon === undefined || lat === undefined) continue;
    features.push({
      type: "Feature",
      id: `${el.type}/${el.id}`,
      properties: { name },
      geometry: { type: "Point", coordinates: [lon, lat] },
    });
  }

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  fs.writeFileSync(
    path.join(root, "content", "baseline.geojson"),
    JSON.stringify(geojson, null, 2),
    "utf8"
  );

  // Turbopack bundles `.json` natively but not `.geojson`, so keep an importable
  // copy alongside the canonical GeoJSON file.
  fs.writeFileSync(
    path.join(root, "content", "baseline.json"),
    JSON.stringify(geojson),
    "utf8"
  );

  // Record the query alongside for reproducibility, out of the file the app reads.
  fs.writeFileSync(
    path.join(root, "content", "baseline-query.txt"),
    QUERY,
    "utf8"
  );

  console.log(`Wrote ${features.length} named baseline features`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});