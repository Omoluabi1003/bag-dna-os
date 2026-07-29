"use client";

import dynamic from "next/dynamic";
import { CloudRain, MapPin, Navigation } from "lucide-react";
import type { ReplayEvent } from "@/types/phoenix";

const WaveAtlasAviationMap = dynamic(
  () => import("@/components/dashboard/WaveAtlasAviationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-[#02070d]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-[#d7a84b]" />
          <p className="mt-3 text-[8px] font-semibold tracking-[.16em] text-white/45">INITIALIZING MISSION MAP</p>
        </div>
      </div>
    ),
  },
);

export function MissionCanvas({ event, index, total }: { event: ReplayEvent; index: number; total: number }) {
  const progress = total > 1 ? Math.round((index / (total - 1)) * 100) : 0;

  return (
    <section className="mission-canvas" aria-label="WaveAtlas aviation corridor map">
      <div className="absolute inset-0 [&>div]:!h-full [&>div]:!min-h-0 [&>div]:!rounded-none [&>div]:!border-0">
        <WaveAtlasAviationMap />
      </div>

      <div className="map-toolbar">
        <span><Navigation /> MIA / ATL CORRIDOR · WAVEATLAS MAP</span>
        <span><CloudRain /> ATL · 27°C · VIS 10 mi</span>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-12 z-20 w-48 -translate-x-1/2 rounded-md border border-white/10 bg-[#071019]/88 px-3 py-2 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between text-[7px] tracking-[.1em] text-white/55">
          <span>JOURNEY REPLAY</span><b className="text-[#27d3b7]">{progress}%</b>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#27d3b7] transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="map-coordinates">33.6407°N / 84.4277°W<br />WAVEATLAS CONTEXT · DEMO OVERLAY</div>
      <div className="map-focus"><span><MapPin /> CURRENT ZONE</span><b>{event.airport} · {event.zone}</b><small>{event.holder} · Scan confidence {event.confidence}%</small></div>
      <div className="map-legend"><span><i className="verified" />Verified path</span><span><i className="missing" />Missing event</span><span><i className="untrusted" />Untrusted signal</span></div>
    </section>
  );
}
