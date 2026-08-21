import { walkingSeconds } from "../lib/planner";
import type { Coord } from "../lib/geo";
import type { HeritagePoint, Persona, Route } from "../lib/types";

function minutes(seconds: number): string {
  return `${(seconds / 60).toFixed(1)} min`;
}

export default function RoutePreview({
  route,
  points,
  persona,
  startAt,
}: {
  route: Route;
  points: HeritagePoint[];
  persona: Persona;
  startAt: Coord;
}) {
  const pointsById = new Map(points.map((point) => [point.id, point]));
  let previous = startAt;

  return (
    <section className="mt-10 border border-stone-300 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">Your Route</p>
          <h2 className="mt-1 text-3xl font-semibold text-stone-900">
            {route.pointIds.length} stops in {route.totalMin.toFixed(1)} minutes
          </h2>
        </div>
        <dl className="flex gap-4 text-sm text-stone-600">
          <div>
            <dt className="text-xs uppercase">Walking</dt>
            <dd className="font-semibold text-stone-900">{route.walkMin.toFixed(1)} min</dd>
          </div>
          <div>
            <dt className="text-xs uppercase">Listening</dt>
            <dd className="font-semibold text-stone-900">{route.listenMin.toFixed(1)} min</dd>
          </div>
        </dl>
      </div>

      {route.pointIds.length === 0 ? (
        <p className="mt-4 text-sm text-stone-600">No Heritage Points fit this time budget.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {route.pointIds.map((id, index) => {
            const point = pointsById.get(id);
            if (!point) return null;
            const walkSec = walkingSeconds(previous, point.centroid);
            previous = point.centroid;

            return (
              <li key={id} className="flex gap-3 border-l-2 border-amber-700 pl-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-stone-900">{point.name}</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Walk {minutes(walkSec)} · Listen {minutes(point.narrationSec[persona])}
                  </p>
                  <p className="mt-1 text-xs text-stone-600">{point.tags.join(" · ")}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {route.droppedIds.length > 0 && (
        <div className="mt-6 border-t border-stone-200 pt-4">
          <p className="text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase">
            Not in this Route
          </p>
          <p className="mt-1 text-sm text-stone-600">
            These matched your interests but did not fit the selected time.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {route.droppedIds.map((id) => {
              const point = pointsById.get(id);
              return (
                <li key={id} className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-500 line-through">
                  {point?.name ?? id}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
