"use client";

import { useEffect, useState } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { arc, ringToLeaflet, sector, toLeaflet } from "@/lib/location/geometry";
import { TRIGGER_CONFIG } from "@/lib/location/config";
import type { PreparedPoint, TriggerStatus } from "@/lib/location/engine";
import type { Coord, Fix, HeritagePoint, HeritageSite } from "@/lib/types";
import { useReducedMotion } from "@/app/use-reduced-motion";

const VISITOR_ICON = divIcon({
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#F4EDE0;border:2px solid #1F1B16;cursor:grab"></div>',
});

const DWELL_RING_M = 9;

// fixes arrive every 200 to 500 ms, which would make the ring step instead of sweep, so the
// seconds since the last fix are counted in and capped at the threshold the engine will use
function useDwellProgress(dwellMs: number, fixT: number, reduced: boolean): number {
  const stepped = Math.min(1, dwellMs / TRIGGER_CONFIG.dwellMs);
  const [smooth, setSmooth] = useState(stepped);

  useEffect(() => {
    if (reduced || dwellMs === 0 || stepped >= 1) {
      setSmooth(stepped);
      return;
    }
    let frame = requestAnimationFrame(function step() {
      const ahead = (dwellMs + (Date.now() - fixT)) / TRIGGER_CONFIG.dwellMs;
      setSmooth(Math.max(stepped, Math.min(1, ahead)));
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [dwellMs, fixT, stepped, reduced]);

  return reduced ? stepped : smooth;
}

// its own component, so sweeping the ring does not redraw every Zone on the map each frame
function DwellRing({ at, dwellMs, fixT }: { at: Coord; dwellMs: number; fixT: number }) {
  const reduced = useReducedMotion();
  const progress = useDwellProgress(dwellMs, fixT, reduced);
  if (progress <= 0) return null;
  const speaking = progress >= 1;

  return (
    <>
      {/* the whole three seconds, so the sweep has something to fill against */}
      <Polyline
        positions={arc(at, DWELL_RING_M, 0, 360).map(toLeaflet)}
        pathOptions={{ color: "#9A8F7C", weight: 1, opacity: 0.5, dashArray: "2 5" }}
        interactive={false}
      />
      <Polygon
        positions={ringToLeaflet(sector(at, DWELL_RING_M, 0, 360 * progress).coordinates[0])}
        pathOptions={{
          stroke: false,
          fillColor: speaking ? "#3F6B5E" : "#9A3412",
          fillOpacity: 0.08 + 0.12 * progress,
        }}
        interactive={false}
      />
      <Polyline
        positions={arc(at, DWELL_RING_M, 0, 360 * progress).map(toLeaflet)}
        pathOptions={{
          color: speaking ? "#3F6B5E" : "#9A3412",
          weight: 3,
          opacity: 0.95,
          lineCap: "round",
        }}
        interactive={false}
      />
      {/* it has spoken, and the halo says so without moving */}
      {speaking && (
        <Polyline
          positions={arc(at, DWELL_RING_M + 5, 0, 360).map(toLeaflet)}
          pathOptions={{ color: "#3F6B5E", weight: 1, opacity: 0.45 }}
          interactive={false}
        />
      )}
    </>
  );
}

// a real Visitor is wherever they actually are, which is usually not where the map opened
function FollowLive({ at, live }: { at: Coord; live: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (live) map.setView(toLeaflet(at), map.getZoom());
  }, [map, live, at]);
  return null;
}

const LIVE_ICON = divIcon({
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#9A3412;border:2px solid #F4EDE0;box-shadow:0 0 0 1px #1F1B16"></div>',
});

export default function TourMapCanvas({
  site,
  points,
  prepared,
  statuses,
  fix,
  selectedId,
  onSelect,
  onMoveVisitor,
  routeLine,
  live,
}: {
  site: HeritageSite;
  points: HeritagePoint[];
  prepared: PreparedPoint[];
  statuses: TriggerStatus[];
  fix: Fix;
  selectedId: string | null;
  onSelect: (point: HeritagePoint) => void;
  onMoveVisitor: (to: Coord) => void;
  routeLine: Coord[];
  live: boolean;
}) {
  const at: Coord = [fix.lng, fix.lat];
  const dwelling = statuses.filter((s) => s.dwellMs > 0).sort((a, b) => b.dwellMs - a.dwellMs)[0];

  const cone =
    fix.headingDeg === null
      ? null
      : sector(
          at,
          30,
          fix.headingDeg - TRIGGER_CONFIG.facingToleranceDeg,
          fix.headingDeg + TRIGGER_CONFIG.facingToleranceDeg,
        );

  return (
    <MapContainer
      center={toLeaflet(site.centroid)}
      zoom={18}
      scrollWheelZoom
      className="h-full w-full bg-paper-sunk"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={20}
      />

      {routeLine.length > 1 && (
        <Polyline
          positions={routeLine.map(toLeaflet)}
          pathOptions={{ color: "#9A3412", weight: 2, dashArray: "8 6" }}
          interactive={false}
        />
      )}

      {prepared.map((point) => (
        <Polygon
          key={`${point.pointId}-ring`}
          positions={ringToLeaflet(point.ring.coordinates[0])}
          pathOptions={{ color: "#9A8F7C", weight: 1, dashArray: "3 4", fill: false }}
          interactive={false}
        />
      ))}

      {points.map((point) => (
        <Polygon
          key={point.id}
          positions={ringToLeaflet(point.zone.coordinates[0])}
          pathOptions={{
            color: point.id === selectedId ? "#9A3412" : "#1E3A5F",
            weight: point.id === selectedId ? 2 : 1,
            fillColor: point.id === selectedId ? "#9A3412" : "#1E3A5F",
            fillOpacity: 0.12,
          }}
          eventHandlers={{ click: () => onSelect(point) }}
        >
          <Tooltip direction="top" sticky>
            {point.name}
          </Tooltip>
        </Polygon>
      ))}

      {cone && (
        <Polygon
          positions={ringToLeaflet(cone.coordinates[0])}
          pathOptions={{ color: "#9A3412", weight: 1, fillColor: "#9A3412", fillOpacity: 0.1 }}
          interactive={false}
        />
      )}

      <DwellRing at={at} dwellMs={dwelling?.dwellMs ?? 0} fixT={fix.t} />

      <FollowLive at={at} live={live} />

      {/* a real body cannot be dragged, so the marker only moves by hand in the simulation */}
      <Marker
        position={toLeaflet(at)}
        draggable={!live}
        icon={live ? LIVE_ICON : VISITOR_ICON}
        eventHandlers={{
          drag: (event) => {
            const { lat, lng } = event.target.getLatLng();
            onMoveVisitor([lng, lat]);
          },
        }}
      >
        <Tooltip direction="top" offset={[0, -10]}>
          {live ? `You, from the phone, give or take ${Math.round(fix.accuracyM)} m` : "You"}
        </Tooltip>
      </Marker>
    </MapContainer>
  );
}
