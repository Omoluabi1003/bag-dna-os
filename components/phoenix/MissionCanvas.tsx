"use client";

import dynamic from "next/dynamic";
import { CloudRain, MapPin, Navigation } from "lucide-react";
import type { ReplayEvent } from "@/types/phoenix";
import { resolveCorridorAirports, type OperationalCorridor } from "@/lib/operations/corridors";

const MissionControlGeospatialEngine = dynamic(
  () => import("@/components/dashboard/MissionControlGeospatialEngine"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-[#02070d]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#d7a84b]" />
          <p className="mt-3 text-[8px] font-semibold tracking-[.16em] text-white/45">INITIALIZING GEOSPATIAL ENGINE</p>
        </div>
      </div>
    ),
  },
);

export function MissionCanvas({ event, index, total, corridor, hasCaseData }: { event: ReplayEvent; index: number; total: number; corridor: OperationalCorridor; hasCaseData: boolean }) {
  const progress = total > 1 ? Math.round((index / (total - 1)) * 100) : 0;
  const { origin, destination } = resolveCorridorAirports(corridor);

  return (
    <section className="mission-canvas" aria-label="BAG-DNA Mission Control operational map">
      <div className="absolute inset-0">
        <MissionControlGeospatialEngine corridor={corridor} />
      </div>

      <div className="map-toolbar">
        <span><Navigation /> {corridor.displayName} OPERATIONAL VIEW</span>
        <span><CloudRain /> {destination.iataCode} · PUBLIC WEATHER CONTEXT</span>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-12 z-20 w-48 -translate-x-1/2 rounded-md border border-white/10 bg-[#071019]/88 px-3 py-2 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-[7px] tracking-[.1em] text-white/55">
          <span>{hasCaseData ? "JOURNEY REPLAY" : "CORRIDOR PREVIEW · NO CASE EVIDENCE"}</span><b className="text-[#27d3b7]">{hasCaseData ? `${progress}%` : corridor.category.toUpperCase()}</b>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#27d3b7] transition-[width] duration-500" style={{ width: `${hasCaseData ? progress : 100}%` }} />
        </div>
      </div>

      <div className="map-coordinates">{destination.latitude.toFixed(4)}° / {destination.longitude.toFixed(4)}°<br />{origin.city} → {destination.city} · DEMO OVERLAY</div>
      <div className="map-focus"><span><MapPin /> {hasCaseData ? "CURRENT ZONE" : "CORRIDOR PREVIEW"}</span><b>{hasCaseData ? `${event.airport} · ${event.zone}` : `${origin.iataCode} ${origin.city} → ${destination.iataCode} ${destination.city}`}</b><small>{hasCaseData ? `${event.holder} · Scan confidence ${event.confidence}%` : `Estimated duration ${corridor.estimatedDurationMinutes} min · No investigation evidence attached`}</small></div>
      {hasCaseData && <div className="map-legend"><span><i className="verified" />Verified path</span><span><i className="missing" />Missing event</span><span><i className="untrusted" />Untrusted signal</span></div>}
    </section>
  );
}
