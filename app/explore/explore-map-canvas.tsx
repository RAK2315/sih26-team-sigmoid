"use client";

import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toLeaflet } from "@/lib/location/geometry";
import type { HeritageSite, StoredCandidate } from "@/lib/types";

const DELHI: [number, number] = [28.605, 77.215];

export default function ExploreMapCanvas({
  sites,
  verified,
  selectedId,
  onSelect,
  onOpenCandidate,
}: {
  sites: HeritageSite[];
  verified: StoredCandidate[];
  selectedId: string | null;
  onSelect: (site: HeritageSite) => void;
  onOpenCandidate: (candidate: StoredCandidate) => void;
}) {
  return (
    <MapContainer center={DELHI} zoom={12} scrollWheelZoom className="h-full w-full bg-paper-sunk">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
      />
      {/* a Candidate a Reviewer confirmed, drawn with the circle it was found inside. this is the
          only thing on this map that came out of the archive rather than being authored. */}
      {verified.map((c) => (
        <Circle
          key={`${c.id}-radius`}
          center={toLeaflet(c.centroid)}
          radius={c.uncertaintyRadiusM}
          pathOptions={{
            color: "#3F6B5E",
            weight: 1,
            dashArray: "3 4",
            fillColor: "#3F6B5E",
            fillOpacity: 0.07,
          }}
          interactive={false}
        />
      ))}
      {/* the only thing on this map that moves, because it is the only thing the archive found */}
      {verified.map((c) => (
        <CircleMarker
          key={`${c.id}-pulse`}
          center={toLeaflet(c.centroid)}
          radius={9}
          className="pin-pulse"
          pathOptions={{ color: "#3F6B5E", weight: 2, fill: false }}
          interactive={false}
        />
      ))}
      {verified.map((c) => (
        <CircleMarker
          key={c.id}
          center={toLeaflet(c.centroid)}
          radius={6}
          pathOptions={{ color: "#F4EDE0", weight: 2, fillColor: "#3F6B5E", fillOpacity: 1 }}
          eventHandlers={{ click: () => onOpenCandidate(c) }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            {c.name}
            <br />
            confirmed from Vol. 2, scan {c.pageNo}. Press for the Evidence.
          </Tooltip>
        </CircleMarker>
      ))}

      {/* a halo behind a deep site, so the pins you can walk read as bigger places */}
      {sites
        .filter((s) => s.depth === "deep")
        .map((site) => (
          <CircleMarker
            key={`${site.id}-halo`}
            center={toLeaflet(site.centroid)}
            radius={site.id === selectedId ? 22 : 16}
            pathOptions={{
              color: "#9A3412",
              weight: 1,
              opacity: 0.35,
              fillColor: "#9A3412",
              fillOpacity: 0.08,
            }}
            interactive={false}
            className="transition-all duration-500"
          />
        ))}

      {sites.map((site) => (
        <CircleMarker
          key={site.id}
          center={toLeaflet(site.centroid)}
          radius={site.id === selectedId ? 11 : site.depth === "deep" ? 9 : 6}
          className="transition-all duration-300"
          pathOptions={{
            color: site.id === selectedId ? "#1F1B16" : "#9A3412",
            weight: 2,
            fillColor: site.depth === "deep" ? "#9A3412" : "#FAF6EE",
            fillOpacity: site.depth === "deep" ? 0.8 : 1,
          }}
          eventHandlers={{ click: () => onSelect(site) }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            {site.name}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
