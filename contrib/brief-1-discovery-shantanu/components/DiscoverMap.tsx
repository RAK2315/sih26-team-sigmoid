"use client";

import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { toLeaflet } from "@/lib/geo";
import "leaflet/dist/leaflet.css";

export interface MapStage {
  centroid: [number, number] | null;
  radiusM: number | null;
  status: string;
  matchedName: string | null;
  animate: boolean;
}

interface Props {
  stages: MapStage[];
  activeIndex: number;
  initialCenter: [number, number];
}

const PIN_ICON = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:#dc2626;border:2px solid white;border-radius:50%;box-shadow:0 0 0 2px rgba(0,0,0,.3)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface AnimState {
  stageKey: number;
  radius: number;
  showPin: boolean;
}

const CONTRACT_MS = 600;

export default function DiscoverMap({ stages, activeIndex, initialCenter }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [anim, setAnim] = useState<AnimState | null>(null);

  const stage = stages[activeIndex] ?? null;
  const stageKey = stage?.centroid
    ? `${activeIndex}:${stage.centroid[0].toFixed(5)}:${stage.centroid[1].toFixed(5)}`
    : null;
  const centroid = stage?.centroid ?? null;
  const radiusM = stage?.radiusM ?? null;

  useEffect(() => {
    if (!centroid || radiusM == null) return;
    const start = radiusM * 1.6;
    const end = radiusM;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / CONTRACT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      const radius = start + (end - start) * eased;
      setAnim({ stageKey: activeIndex, radius, showPin: false });
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setAnim({ stageKey: activeIndex, radius: end, showPin: true });
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stageKey, activeIndex, centroid, radiusM]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !centroid) return;
    map.flyTo(toLeaflet(centroid), 15, { duration: 1.2 });
  }, [stageKey, activeIndex, centroid]);

  return (
    <MapContainer
      ref={mapRef}
      center={toLeaflet(initialCenter)}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* previously resolved stages stay as final circles and pins */}
      {stages.slice(0, activeIndex).map((s, i) => {
        if (!s.centroid || s.radiusM == null) return null;
        const key = i;
        const isAnimating = anim?.stageKey === i;
        const radius = isAnimating ? anim.radius : s.radiusM;
        const showPin =
          isAnimating ? anim.showPin : s.status !== "extracted";
        return (
          <div key={key}>
            <Circle
              center={toLeaflet(s.centroid)}
              radius={radius}
              pathOptions={{
                color: "#dc2626",
                fillColor: "#dc2626",
                fillOpacity: 0.12,
                weight: 2,
              }}
            />
            {showPin && <Marker position={toLeaflet(s.centroid)} icon={PIN_ICON} />}
          </div>
        );
      })}
      {/* the active stage animates */}
      {stage &&
        stage.centroid &&
        stage.radiusM != null && (
          <>
            <Circle
              center={toLeaflet(stage.centroid)}
              radius={anim?.stageKey === activeIndex ? anim.radius : stage.radiusM}
              pathOptions={{
                color: "#dc2626",
                fillColor: "#dc2626",
                fillOpacity: 0.12,
                weight: 2,
              }}
            />
            {anim?.stageKey === activeIndex &&
              anim.showPin &&
              stage.status !== "extracted" && (
                <Marker position={toLeaflet(stage.centroid)} icon={PIN_ICON} />
              )}
          </>
        )}
    </MapContainer>
  );
}