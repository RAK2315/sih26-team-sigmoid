"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LivingTraditionCard from "./living-tradition-card";
import NarrationPlayer from "./narration-player";
import ThenNowCard from "./then-now";
import AskBox from "./ask-box";
import TriggerPanel from "./trigger-panel";
import { useGpsLocation } from "./use-gps-location";
import { useSimLocation } from "./use-sim-location";
import { TRIGGER_CONFIG } from "@/lib/location/config";
import { initialState, prepare, step, type TriggerStatus } from "@/lib/location/engine";
import { moveBy } from "@/lib/location/geometry";
import { planRoute } from "@/lib/route/planner";
import { PLAN_KEY, type PlanChoices } from "@/lib/route/plan-choices";
import type {
  Coord,
  FactSheet,
  HeritagePoint,
  HeritageSite,
  Narration,
  NarrationKind,
  Persona,
} from "@/lib/types";

const WALK_SPEED_MS = 1.2;

// Red Fort is in Delhi and a demo usually is not, so this slides the whole site under the
// Visitor's real position. The tracking stays completely real: real satellites, real compass,
// real engine. Only the coordinates are translated, and the screen says so while it is on.
function shiftTo(points: HeritagePoint[], from: Coord, to: Coord): HeritagePoint[] {
  const dLng = to[0] - from[0];
  const dLat = to[1] - from[1];
  const move = (c: Coord): Coord => [c[0] + dLng, c[1] + dLat];
  return points.map((point) => ({
    ...point,
    centroid: move(point.centroid),
    zone: {
      ...point.zone,
      coordinates: point.zone.coordinates.map((ring) => ring.map((c) => move(c as Coord))),
    },
  }));
}

// leaflet reads window while it loads, so it must never render on the server
const TourMapCanvas = dynamic(() => import("./tour-map-canvas"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-paper-sunk" />,
});

export default function Tour({
  site,
  points: sitePoints,
  narrations,
  factSheets,
}: {
  site: HeritageSite;
  points: HeritagePoint[];
  narrations: Narration[];
  factSheets: FactSheet[];
}) {
  // sessionStorage is not there on the server, so the plan arrives one render late
  const [plan, setPlan] = useState<PlanChoices | null>(null);
  useEffect(() => {
    const saved = sessionStorage.getItem(PLAN_KEY);
    if (saved) setPlan(JSON.parse(saved) as PlanChoices);
  }, []);

  const [persona, setPersona] = useState<Persona>("history");
  useEffect(() => {
    if (plan) setPersona(plan.persona);
  }, [plan]);
  // where the Visitor stood when they asked for the site to be brought to them
  const [broughtHere, setBroughtHere] = useState<Coord | null>(null);
  const points = useMemo(
    () => (broughtHere === null ? sitePoints : shiftTo(sitePoints, sitePoints[0].centroid, broughtHere)),
    [sitePoints, broughtHere],
  );

  // start south of the first Heritage Point, outside its ring, looking at it
  const start = useMemo<Coord>(() => moveBy(points[0].centroid, 70, 180), [points]);

  // CONTEXT.md: a Persona changes how a Heritage Point is told, never which ones exist. so the
  // Route is budgeted on the longest telling and switching Persona cannot rearrange the walk.
  const route = useMemo(() => {
    const narrationSecByPoint: Record<string, number> = {};
    for (const point of points) {
      const longest = narrations
        .filter((n) => n.pointId === point.id && n.kind === "approach")
        .reduce((most, n) => Math.max(most, n.durationSec), 0);
      narrationSecByPoint[point.id] = longest || 45;
    }
    return planRoute({
      points,
      narrationSecByPoint,
      interests: plan?.interests ?? [],
      budgetSec: (plan?.budgetMinutes ?? 30) * 60,
      start,
      walkSpeedMs: WALK_SPEED_MS,
    });
  }, [points, narrations, plan, start]);

  const routePoints = useMemo(
    () => route.stops.flatMap((stop) => points.filter((p) => p.id === stop.pointId)),
    [route, points],
  );
  const prepared = useMemo(() => prepare(routePoints, TRIGGER_CONFIG), [routePoints]);

  const [wantGps, setWantGps] = useState(false);
  const gps = useGpsLocation(wantGps);
  const sim = useSimLocation(start, 0, gps.fix === null);
  // until the phone has given us something, the simulated marker is what is on screen and the
  // panel says so, rather than the map going blank
  const live = gps.fix !== null;
  const fix = live ? gps.fix! : sim.fix;
  const { moveTo, walking, setWalking, speedMs, setSpeedMs } = sim;
  const engine = useRef(initialState());
  const [statuses, setStatuses] = useState<TriggerStatus[]>([]);
  const [selected, setSelected] = useState<HeritagePoint>(sitePoints[0]);
  // what is being said, which is not the same as what the panel is showing
  const [speaking, setSpeaking] = useState<{ pointId: string; kind: NarrationKind } | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [started, setStarted] = useState(false);

  const audio = useRef<HTMLAudioElement>(null);
  const walkId = useRef<string>("");
  if (walkId.current === "") walkId.current = `w_${Math.random().toString(36).slice(2, 10)}`;
  const [unsent, setUnsent] = useState(0);
  const wantedPoint = speaking?.pointId ?? selected.id;
  const wantedKind = speaking?.kind ?? "approach";
  // only the history Persona has an inside telling, so the others fall back to the approach one
  // rather than emptying the panel under a Heritage Point that is speaking
  const narration =
    narrations.find(
      (n) => n.pointId === wantedPoint && n.persona === persona && n.kind === wantedKind,
    ) ??
    narrations.find(
      (n) => n.pointId === wantedPoint && n.persona === persona && n.kind === "approach",
    );
  const factSheet = factSheets.find((f) => f.pointId === selected.id);

  useEffect(() => {
    const result = step(engine.current, fix, prepared, TRIGGER_CONFIG);
    engine.current = result.state;
    setStatuses(result.statuses);

    // a Narration runs until the Visitor walks out of that Heritage Point's ring
    if (speaking && !result.statuses.find((s) => s.pointId === speaking.pointId)?.withinReach) {
      audio.current?.pause();
      setSpeaking(null);
    }

    const crossing = result.crossings[0];
    if (!crossing || !started) return;
    const point = routePoints.find((p) => p.id === crossing.pointId);
    if (!point) return;
    setSelected(point);
    setSpeaking({ pointId: point.id, kind: crossing.kind });
    setShowEvidence(false);

    // fire and forget. if the log is unreachable the Walk carries on and the count says so
    fetch("/api/walk/crossing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walkId: walkId.current,
        pointId: crossing.pointId,
        siteId: site.id,
        persona,
        kind: crossing.kind,
        locationSource: fix.source,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (!r.stored) setUnsent((n) => n + 1);
      })
      .catch(() => setUnsent((n) => n + 1));
  }, [fix, prepared, routePoints, started, speaking, site.id, persona]);

  // the element reloads when src changes, so playback can only start after that has landed
  useEffect(() => {
    if (speaking === null) return;
    audio.current?.play().catch(() => undefined);
  }, [speaking, narration?.audioUrl]);

  useEffect(() => {
    if (routePoints.length > 0 && !routePoints.some((p) => p.id === selected.id)) {
      setSelected(routePoints[0]);
    }
  }, [routePoints, selected.id]);

  function beginTour() {
    setStarted(true);
    // browsers only allow programmatic playback after a real gesture has played this element
    const element = audio.current;
    if (!element) return;
    void element
      .play()
      .then(() => {
        element.pause();
        element.currentTime = 0;
      })
      .catch(() => undefined);
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
      <audio ref={audio} src={narration?.audioUrl} preload="auto" />

      <div className="h-72 shrink-0 lg:h-auto lg:min-h-0 lg:flex-1">
        <TourMapCanvas
          site={site}
          points={routePoints}
          prepared={prepared}
          statuses={statuses}
          fix={fix}
          selectedId={selected.id}
          onSelect={(p) => {
            setSelected(p);
            setShowEvidence(false);
          }}
          onMoveVisitor={moveTo}
          routeLine={[start, ...routePoints.map((p) => p.centroid)]}
          live={live}
        />
      </div>

      <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-y-auto border-t border-ink-faint/40 bg-paper p-4 lg:w-[26rem] lg:border-t-0 lg:border-l">
        <div className="flex items-baseline justify-between">
          <p className="font-archive text-xs tracking-widest text-ink-faint uppercase">
            {site.name}
          </p>
          {started && (
            <div className="flex items-center gap-2">
              {live && (
                <button
                  type="button"
                  onClick={() =>
                    setBroughtHere(broughtHere === null ? [fix.lng, fix.lat] : null)
                  }
                  className={`border px-2 py-1 font-archive text-xs ${
                    broughtHere !== null
                      ? "border-indigo bg-indigo text-paper"
                      : "border-ink-faint/50 text-ink-muted hover:border-indigo hover:text-indigo"
                  }`}
                >
                  {broughtHere !== null ? "Put it back" : "Bring it here"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setWantGps(!wantGps)}
                className={`border px-2 py-1 font-archive text-xs ${
                  wantGps
                    ? "border-madder bg-madder text-paper"
                    : "border-ink-faint/50 text-ink-muted hover:border-madder hover:text-madder"
                }`}
              >
                {wantGps ? "Phone" : "Simulated"}
              </button>
              {!wantGps && (
                <>
              <button
                type="button"
                onClick={() => setWalking(!walking)}
                className="border border-ink-faint/50 px-2 py-1 font-archive text-xs text-ink-muted hover:border-madder hover:text-madder"
              >
                {walking ? "Stop" : "Walk"}
              </button>
              <input
                type="range"
                min={0.4}
                max={3}
                step={0.2}
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="w-20 accent-madder"
                aria-label="Walking speed"
              />
              <span className="font-archive text-xs text-ink-faint">{speedMs.toFixed(1)} m/s</span>
                </>
              )}
            </div>
          )}
        </div>

        <p className="font-archive mt-2 text-xs text-ink-faint">
          {routePoints.length} Heritage {routePoints.length === 1 ? "Point" : "Points"} &middot; about{" "}
          {Math.round(route.totalSec / 60)} minutes including the walking
          {route.droppedPointIds.length > 0 &&
            ` · ${route.droppedPointIds.length} left out to fit the time`}
          {unsent > 0 && ` · ${unsent} crossings not logged`}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {routePoints.map((point) => (
            <button
              key={point.id}
              type="button"
              onClick={() => {
                setSelected(point);
                setSpeaking(null);
                setShowEvidence(false);
              }}
              className={`border px-3 py-1.5 text-sm ${
                point.id === selected.id
                  ? "border-madder bg-madder text-paper"
                  : "border-ink-faint/50 text-ink-muted hover:border-madder hover:text-madder"
              }`}
            >
              {point.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-archive text-[11px] tracking-widest text-ink-faint uppercase">
            Told for
          </span>
          {(["history", "architecture", "kids"] as Persona[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPersona(p)}
              className={`font-archive border px-2 py-1 text-[11px] ${
                p === persona
                  ? "border-madder text-madder"
                  : "border-ink-faint/40 text-ink-muted hover:bg-paper-sunk"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <h1 className="font-display mt-5 text-4xl leading-none text-ink">{selected.name}</h1>
        {selected.nameLocal && (
          <p className="font-deva text-lg text-ink-muted">{selected.nameLocal}</p>
        )}

        {broughtHere !== null && (
          <div className="mt-4 border-l-2 border-indigo bg-indigo/[0.06] p-3">
            <p className="font-archive text-[11px] tracking-[0.2em] text-indigo uppercase">
              Site moved to you
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Red Fort is in Delhi and you are not, so its Heritage Points have been slid under
              your real position, keeping every distance and bearing between them exactly as
              they are on site. Nothing about the tracking is faked: the position is coming from
              this device, the heading from its compass, and a Threshold Crossing still needs the
              Approach Ring, the Facing and the full Dwell. Walk about seventy metres and the
              first one will speak.
            </p>
          </div>
        )}

        {wantGps && (gps.message !== null || (live && !gps.hasCompass)) && (
          <div className="mt-4 border border-indigo/40 bg-paper-raised p-3">
            {gps.message !== null && (
              <p className="text-sm leading-relaxed text-ink-muted">{gps.message}</p>
            )}
            {live && !gps.hasCompass && (
              <p className="text-sm leading-relaxed text-ink-muted">
                No compass on this device - narration will trigger on proximity and dwell alone.
              </p>
            )}
          </div>
        )}

        {/* the rail is long and this is the thing a Visitor standing in front of a wall needs */}
        <div className="sticky top-0 z-20 mt-4 lg:static">
          <TriggerPanel points={routePoints} statuses={statuses} live={live} fix={fix} />
        </div>

        <div className="mt-4">
          {narration ? (
            <NarrationPlayer narration={narration} audio={audio} />
          ) : (
            <p className="border border-ink-faint/40 bg-paper-raised p-4 text-sm text-ink-muted">
              No Narration written for this Heritage Point yet.
            </p>
          )}
        </div>

        {selected.livingTradition && (
          <div className="mt-4">
            <LivingTraditionCard tradition={selected.livingTradition} />
          </div>
        )}

        {selected.thenNow && (
          <div className="mt-4">
            <ThenNowCard thenNow={selected.thenNow} name={selected.name} />
          </div>
        )}

        {factSheet && (
          <div className="mt-4">
            <AskBox key={selected.id} pointId={selected.id} pointName={selected.name} />
          </div>
        )}

        {factSheet && (
          <div className="mt-4 border border-ink-faint/40 bg-paper-raised p-4">
            <button
              type="button"
              onClick={() => setShowEvidence(!showEvidence)}
              className="font-archive text-xs tracking-widest text-indigo uppercase hover:text-madder"
            >
              {showEvidence ? "Hide" : "Show"} evidence &middot; {factSheet.lines.length} sourced
              lines
            </button>
            {showEvidence && (
              <div className="mt-3 space-y-3">
                {factSheet.lines.map((line) => (
                  <div key={line.id}>
                    <p className="text-sm leading-relaxed text-ink">{line.text}</p>
                    <p className="font-archive mt-1 text-xs text-ink-faint">{line.source}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="font-archive mt-4 pb-2 text-xs leading-relaxed text-ink-faint">
          Zone footprints from OpenStreetMap, ODbL. Narration read by en-IN-PrabhatNeural.
        </p>
      </aside>

      {!started && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center bg-paper/80 backdrop-blur-[1px]">
          <div className="max-w-md border border-ink-faint/40 bg-paper-raised p-6 text-center shadow-paper">
            <h2 className="font-display text-3xl text-ink">{site.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Drag yourself around the map, or use the arrow keys to turn and step. When you are
              close to a structure, facing it, and have stood still for{" "}
              {TRIGGER_CONFIG.dwellMs / 1000} seconds, it will start speaking.
            </p>
            <button
              type="button"
              onClick={beginTour}
              className="mt-5 border border-madder px-6 py-2 text-madder hover:bg-madder hover:text-paper"
            >
              Begin tour
            </button>
            <p className="font-archive mt-3 text-xs text-ink-faint">
              This button also unlocks audio, which browsers block until you ask for it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
