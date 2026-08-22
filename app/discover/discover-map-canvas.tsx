"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Circle, CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toLeaflet } from "@/lib/location/geometry";
import type { Candidate, Coord } from "@/lib/types";
import { useReducedMotion } from "../use-reduced-motion";
import type { PinPoint } from "./evidence-thread";

const DELHI: [number, number] = [28.605, 77.215];

const VERDICT_COLOUR: Record<Candidate["evidence"]["baselineVerdict"], string> = {
  matched_existing: "#6B21A8",
  representation_gap: "#9A3412",
  inconclusive: "#9A8F7C",
};

const CONTRACT_MS = 900;

// the map holds whatever the last Analyse produced, so it has to move when that changes
function FitToCandidates({ candidates }: { candidates: Candidate[] }) {
  const map = useMap();

  useEffect(() => {
    if (candidates.length === 0) return;
    const points = candidates.map((c) => toLeaflet(c.centroid));
    map.fitBounds(points as [number, number][], { padding: [40, 40], maxZoom: 15 });
  }, [candidates, map]);

  return null;
}

// the line drawn from the passage to the pin needs to know where the pin is in pixels
function ReportPin({ at, onPoint }: { at: Coord | null; onPoint: (pin: PinPoint | null) => void }) {
  const map = useMap();

  useEffect(() => {
    if (at === null) {
      onPoint(null);
      return;
    }
    const report = () => {
      const point = map.latLngToContainerPoint(toLeaflet(at));
      onPoint({ x: point.x, y: point.y });
    };
    report();
    map.on("move zoom resize", report);
    return () => {
      map.off("move zoom resize", report);
    };
  }, [map, at, onPoint]);

  return null;
}

// the circle lands wider than the evidence supports and closes onto its real size
function useContraction(reveal: boolean, candidates: Candidate[], reduced: boolean): number {
  const [closed, setClosed] = useState(1);

  useLayoutEffect(() => {
    if (!reveal || reduced || candidates.length === 0) {
      setClosed(1);
      return;
    }
    setClosed(0);
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now: number) {
      const t = Math.min(1, (now - start) / CONTRACT_MS);
      setClosed(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [reveal, candidates, reduced]);

  return closed;
}

export default function DiscoverMapCanvas({
  candidates,
  openId,
  onOpen,
  reveal,
  onPinPoint,
}: {
  candidates: Candidate[];
  openId: string | null;
  onOpen: (mentionId: string) => void;
  reveal: boolean;
  onPinPoint: (pin: PinPoint | null) => void;
}) {
  const reduced = useReducedMotion();
  const closed = useContraction(reveal, candidates, reduced);

  const pinAt = useMemo(() => {
    const open = candidates.find((c) => c.mentionId === openId);
    return open ? open.centroid : null;
  }, [candidates, openId]);

  return (
    <MapContainer center={DELHI} zoom={11} scrollWheelZoom className="h-full w-full bg-paper-sunk">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
      />
      <FitToCandidates candidates={candidates} />
      <ReportPin at={pinAt} onPoint={onPinPoint} />

      {reveal &&
        candidates.map((c) => {
          const colour = VERDICT_COLOUR[c.evidence.baselineVerdict];
          const isOpen = c.mentionId === openId;
          const slack = Math.min(c.uncertaintyRadiusM * 1.5, 500);
          return (
            <div key={c.id}>
              {/* the line back to the Anchor is the claim: this is what it was measured from */}
              {isOpen && (
                <Polyline
                  positions={[toLeaflet(c.evidence.anchorCentroid), toLeaflet(c.centroid)]}
                  pathOptions={{ color: "#1F1B16", weight: 1, dashArray: "3 4", opacity: 0.7 * closed }}
                />
              )}
              <Circle
                center={toLeaflet(c.centroid)}
                radius={c.uncertaintyRadiusM + slack * (1 - closed)}
                pathOptions={{
                  color: colour,
                  weight: 1,
                  opacity: 0.35 + 0.65 * closed,
                  fillColor: colour,
                  fillOpacity: (isOpen ? 0.18 : 0.08) * closed,
                }}
                eventHandlers={{ click: () => onOpen(c.mentionId) }}
              />
              <CircleMarker
                center={toLeaflet(c.centroid)}
                radius={isOpen ? 6 : 4}
                pathOptions={{
                  color: colour,
                  weight: 2,
                  opacity: closed,
                  fillColor: colour,
                  fillOpacity: closed,
                }}
                eventHandlers={{ click: () => onOpen(c.mentionId) }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  {Math.round(c.uncertaintyRadiusM)} m radius
                </Tooltip>
              </CircleMarker>
              {isOpen && (
                <CircleMarker
                  center={toLeaflet(c.evidence.anchorCentroid)}
                  radius={4}
                  pathOptions={{
                    color: "#1F1B16",
                    weight: 2,
                    opacity: closed,
                    fillColor: "#FAF6EE",
                    fillOpacity: closed,
                  }}
                >
                  <Tooltip direction="top" offset={[0, -6]}>
                    {c.evidence.anchorName}
                  </Tooltip>
                </CircleMarker>
              )}
            </div>
          );
        })}
    </MapContainer>
  );
}
