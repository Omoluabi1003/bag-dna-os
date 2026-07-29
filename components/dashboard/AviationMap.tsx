"use client";

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
          <p className="mt-4 text-[10px] font-semibold tracking-[0.18em] text-white/55">
            INITIALIZING AVIATION GLOBE
          </p>
        </div>
      </div>
    ),
  },
);

export default function AviationMap({ aircraft = [] }: { aircraft?: AircraftTrack[] }) {
  return <RealisticAviationGlobe aircraft={aircraft} />;
}
