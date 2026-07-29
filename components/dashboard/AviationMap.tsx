"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";

const RealisticAviationGlobe = dynamic(
  () => import("@/components/dashboard/RealisticAviationGlobe"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[540px] min-h-[440px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_42%,#13283d_0%,#071019_54%,#02060b_100%)]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#27d3b7]" />
          <p className="mt-4 text-[10px] font-semibold tracking-[0.18em] text-white/55">INITIALIZING AVIATION GLOBE</p>
        </div>
      </div>
    ),
  },
);

const WaveAtlasAviationMap = dynamic(
  () => import("@/components/dashboard/WaveAtlasAviationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[540px] min-h-[440px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#02070d]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#d7a84b]" />
          <p className="mt-4 text-[10px] font-semibold tracking-[0.18em] text-white/55">INITIALIZING WAVEATLAS MAP</p>
        </div>
      </div>
    ),
  },
);

type ViewMode = "GLOBE" | "MAP";

export default function AviationMap({ aircraft = [] }: { aircraft?: AircraftTrack[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("GLOBE");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#27d3b7]">Geospatial renderer</p>
          <p className="mt-1 text-xs text-white/50">Switch between the WaveAtlas-inspired globe and operational map.</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-white/10 bg-[#04111d]/90 p-1 shadow-xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode("GLOBE")}
            className={`rounded-lg px-4 py-2 text-[9px] font-semibold tracking-[.12em] transition ${viewMode === "GLOBE" ? "bg-white/12 text-white" : "text-white/45 hover:text-white"}`}
          >
            GLOBE
          </button>
          <button
            type="button"
            onClick={() => setViewMode("MAP")}
            className={`rounded-lg px-4 py-2 text-[9px] font-semibold tracking-[.12em] transition ${viewMode === "MAP" ? "bg-[#d7a84b]/18 text-[#f0c96e]" : "text-white/45 hover:text-white"}`}
          >
            MAP
          </button>
        </div>
      </div>

      {viewMode === "GLOBE" ? <RealisticAviationGlobe aircraft={aircraft} /> : <WaveAtlasAviationMap aircraft={aircraft} />}
    </div>
  );
}
