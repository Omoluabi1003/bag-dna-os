"use client";

import dynamic from "next/dynamic";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";
import { defaultOperationalCorridor, type OperationalCorridor } from "@/lib/operations/corridors";

const MissionControlGeospatialEngine = dynamic(
  () => import("@/components/dashboard/MissionControlGeospatialEngine"),
  { ssr: false, loading: () => <div className="h-[540px] min-h-[440px] animate-pulse rounded-2xl bg-[#02070d]" aria-label="Initializing geospatial view" /> },
);

export default function AviationMap({ aircraft = [], corridor = defaultOperationalCorridor }: { aircraft?: AircraftTrack[]; corridor?: OperationalCorridor }) {
  return <div className="space-y-3">
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#27d3b7]">BAG-DNA geospatial engine</p>
      <p className="mt-1 text-xs text-white/50">Global context and route-fitted operational corridor · {corridor.displayName}</p>
    </div>
    <div className="relative h-[560px] min-h-[460px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,.55)]">
      <MissionControlGeospatialEngine aircraft={aircraft} corridor={corridor} initialView="GLOBAL" />
    </div>
  </div>;
}
