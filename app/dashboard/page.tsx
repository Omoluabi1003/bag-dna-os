import { AppShell } from "@/components/shell";
import { IncidentMissionControl } from "@/components/dashboard/IncidentMissionControl";

export default function DashboardPage() {
  return (
    <AppShell title="BAG-DNA Mission Control" eyebrow="Operational incident demonstration · MIA to ATL">
      <IncidentMissionControl />
      <section className="mt-4 rounded-xl border border-white/10 bg-[#07131f] px-4 py-3 text-[9px] leading-5 text-slate-400">
        <b className="text-gold">Demonstration boundary:</b> Aircraft and weather context may come from public third-party feeds. The baggage identity, passenger reference, custody events, flight assignment, anomaly and operator decisions shown in this scenario are controlled demonstration data. BAG-DNA OS does not claim airport deployment, airline integration or ICAO certification.
      </section>
    </AppShell>
  );
}
