import { Fragment } from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import { IMAGES } from "@/content/images";
import volume from "@/content/pages/zafar-hasan-v2.json";
import { points } from "@/content/points";
import type { ArchiveImage } from "@/lib/types";

export const metadata = { title: "Attributions - VIRASAT" };

const withImages = points.filter((p) => p.thenNow);

// read rather than imported because a .geojson import widens every tuple and enum
const baseline = JSON.parse(
  readFileSync(join(process.cwd(), "content", "baseline.geojson"), "utf8"),
) as { features: unknown[]; pulledAt: string };

function Row({ image, pointName, half }: { image: ArchiveImage; pointName: string; half: string }) {
  return (
    <tr className="border-t border-ink-faint/20 align-top">
      <td className="py-2 pr-4 text-sm text-ink">
        {pointName}
        <span className="font-archive block text-[11px] text-ink-faint">{half}</span>
      </td>
      <td className="py-2 pr-4 text-sm text-ink-muted">{image.author}</td>
      <td className="font-archive py-2 pr-4 text-xs text-ink-muted">{image.year}</td>
      <td className="font-archive py-2 pr-4 text-xs text-ink-muted">{image.licence}</td>
      <td className="py-2 text-xs">
        <a href={image.sourceUrl} className="text-indigo underline hover:text-madder">
          Wikimedia Commons
        </a>
      </td>
    </tr>
  );
}

export default function Attributions() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="font-archive text-xs tracking-[0.2em] text-ink-faint uppercase">Sources</p>
      <h1 className="font-display mt-2 text-5xl leading-none text-ink">Attributions</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
        Everything shown in VIRASAT came from somewhere, and this page says where. No image of a
        real monument in this project was generated. Archival photography is public domain by age;
        modern photography is Creative Commons and credited both here and beside the image itself.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-ink">Then and now photographs</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {withImages.length} Heritage Points, {withImages.length * 2} images, all from Wikimedia
          Commons.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left">
            <thead>
              <tr className="font-archive text-[11px] tracking-widest text-ink-faint uppercase">
                <th className="pb-2 pr-4 font-normal">Heritage Point</th>
                <th className="pb-2 pr-4 font-normal">Author</th>
                <th className="pb-2 pr-4 font-normal">Date</th>
                <th className="pb-2 pr-4 font-normal">Licence</th>
                <th className="pb-2 font-normal">File</th>
              </tr>
            </thead>
            <tbody>
              {withImages.map((point) => (
                <Fragment key={point.id}>
                  <Row image={point.thenNow!.then} pointName={point.name} half="then" />
                  <Row image={point.thenNow!.now} pointName={point.name} half="now" />
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-ink">Photographs and plates</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {Object.keys(IMAGES).length} images used across the site portraits, the Living
          Traditions and the printed plates. All from Wikimedia Commons.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left">
            <thead>
              <tr className="font-archive text-[11px] tracking-widest text-ink-faint uppercase">
                <th className="pb-2 pr-4 font-normal">Where it is used</th>
                <th className="pb-2 pr-4 font-normal">Author</th>
                <th className="pb-2 pr-4 font-normal">Date</th>
                <th className="pb-2 pr-4 font-normal">Licence</th>
                <th className="pb-2 font-normal">File</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(IMAGES).map(([key, image]) => (
                <tr key={key} className="border-t border-ink-faint/20 align-top">
                  <td className="font-archive py-2 pr-4 text-xs text-ink">{key}</td>
                  <td className="py-2 pr-4 text-sm text-ink-muted">{image.author}</td>
                  <td className="font-archive py-2 pr-4 text-xs text-ink-muted">{image.year}</td>
                  <td className="font-archive py-2 pr-4 text-xs text-ink-muted">{image.licence}</td>
                  <td className="py-2 text-xs">
                    <a href={image.sourceUrl} className="text-indigo underline hover:text-madder">
                      Wikimedia Commons
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-ink">The record</h2>
        <dl className="mt-4 space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="text-ink">{volume.title}</dt>
            <dd className="text-ink-muted">
              Maulvi Zafar Hasan, Archaeological Survey of India, 1919. {volume.licence}. Forty
              Pages ingested as scanned images and text.{" "}
              <a href={volume.sourceUrl} className="text-indigo underline hover:text-madder">
                archive.org
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-ink">Modern Baseline</dt>
            <dd className="text-ink-muted">
              {baseline.features.length} features pulled from OpenStreetMap through the Overpass API
              on {baseline.pulledAt}. OpenStreetMap contributors, ODbL.
            </dd>
          </div>
          <div>
            <dt className="text-ink">Zone footprints and Anchor positions</dt>
            <dd className="text-ink-muted">
              Traced from OpenStreetMap ways and nodes, each one recorded by its OSM id in the data.
              OpenStreetMap contributors, ODbL.
            </dd>
          </div>
          <div>
            <dt className="text-ink">Map tiles</dt>
            <dd className="text-ink-muted">
              CARTO Positron, built from OpenStreetMap data. OpenStreetMap contributors, ODbL, and
              CARTO. The sepia cast is a CSS filter applied by us, not part of the tiles.
            </dd>
          </div>
          <div>
            <dt className="text-ink">Narration audio</dt>
            <dd className="text-ink-muted">
              Written by us from the Fact Sheets, read by the Microsoft Edge neural voices
              en-IN-PrabhatNeural and en-IN-NeerjaNeural, rendered ahead of time and shipped as
              files.
            </dd>
          </div>
          <div>
            <dt className="text-ink">Type</dt>
            <dd className="text-ink-muted">
              Cormorant Garamond, IBM Plex Sans, IBM Plex Mono and Noto Serif Devanagari, all SIL
              Open Font License, served through Google Fonts.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 border-t border-ink-faint/40 pt-6">
        <h2 className="font-display text-3xl text-ink">What is not here</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          No generated imagery of any real place. No photograph whose author or licence we could not
          name. Nothing on screen that does not have a route back to a source in one step.
        </p>
        <p className="mt-6">
          <Link href="/" className="text-indigo underline hover:text-madder">
            Back to the start
          </Link>
        </p>
      </section>
    </main>
  );
}
