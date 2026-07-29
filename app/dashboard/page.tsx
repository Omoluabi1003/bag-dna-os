import { Activity, DatabaseZap, Fingerprint, Network, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, MetricCard, SectionHeading } from "@/components/ui";
import { LiveOperationsConsole } from "@/components/dashboard/LiveOperationsConsole";
import { OperationsOverview } from "@/components/dashboard/OperationsOverview";
import { calculateIntegrityScore, calculateIdentityConfidence, detectThreatPatterns } from "@/lib/intelligence";

export default function DashboardPage() {
  const integrity = calculateIntegrityScore();
  const identity = calculateIdentityConfidence();
  const threat = detectThreatPatterns();

  return (
    <AppShell title="BAG-DNA Operations Center" eyebrow="Live public aviation context · secure baggage identity workspace">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-cyan">Operational command environment</p>
          <h2 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-[-.045em] text-ivory md:text-6xl">A working aviation console, not a marketing page.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-mist">Current aircraft movement and airport weather are pulled from free public aviation feeds in the browser. BAG-DNA identity intelligence remains clearly separated as a controlled demonstration layer until airport and airline credentials are connected.</p>
        </div>
        <div className="flex flex-wrap gap-2"><Badge tone="emerald">Client feed polling</Badge><Badge>60-second refresh</Badge><Badge tone="gold">MIA · FLL · ATL corridor</Badge></div>
      </div>

      <LiveOperationsConsole/>

      <div className="mt-8"><OperationsOverview/></div>

      <section className="mt-8 rounded-[28px] border border-white/[.08] bg-[#071522] p-6 md:p-8">
        <SectionHeading eyebrow="Controlled BAG-DNA workspace" title="Identity and custody intelligence demonstration" action={<Badge tone="cyan">Sandbox data</Badge>}/>
        <p className="-mt-2 mb-6 max-w-3xl text-xs leading-6 text-mist">These cards exercise the BAG-DNA scoring engine against repository demonstration records. They are intentionally labelled sandbox data and are not presented as airline production events.</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Integrity score" value={`${integrity.score}`} change={integrity.band} detail="demonstration record set" icon={ShieldCheck}/>
          <MetricCard label="Identity confidence" value={`${identity.confidencePercentage}%`} change="Verified" detail="bag, route and custody signals" icon={Fingerprint}/>
          <MetricCard label="Threat pattern" value={threat.matchedThreats[0]?.id ?? "None"} change={`${threat.threatConfidence}%`} detail="rules-engine confidence" icon={Activity}/>
          <MetricCard label="Custody graph" value="Hash-linked" change="Active" detail="tamper-evident event model" icon={Network}/>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <article className="glass p-6 md:p-7">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-cyan">Integration boundary</p><h3 className="mt-2 text-xl font-semibold text-white">What becomes truly live next</h3></div><DatabaseZap className="text-cyan"/></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">{[
            ["Baggage reconciliation", "Airline BRS or IATA baggage messaging credentials"],
            ["Screening events", "Airport security and explosive-detection interfaces"],
            ["Passenger binding", "Departure control and identity-provider authorization"],
            ["Claims evidence", "Airline or insurer case-management API access"],
          ].map(([title, detail]) => <div key={title} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-xs font-semibold text-white">{title}</p><p className="mt-2 text-[10px] leading-5 text-mist">{detail}</p></div>)}</div>
        </article>
        <article className="glass p-6 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-gold">Production posture</p>
          <h3 className="mt-2 text-xl font-semibold text-white">No fabricated “live” baggage numbers</h3>
          <p className="mt-4 text-xs leading-6 text-mist">The console distinguishes public operational context, controlled BAG-DNA sandbox intelligence, and integrations that require stakeholder authorization. That makes the platform more credible during airport, airline, regulator, and investor review.</p>
          <div className="mt-6 space-y-3 text-[11px]">{[
            ["Public aviation context", "Live"],
            ["BAG-DNA scoring engine", "Sandbox"],
            ["Airport and airline systems", "Credential required"],
          ].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-white/[.06] pb-3"><span className="text-mist">{label}</span><b className="text-cyan">{value}</b></div>)}</div>
        </article>
      </section>
    <section className="mt-8 rounded-2xl border border-white/10 p-5 text-[10px] leading-5 text-mist"><b className="text-gold">Demonstration boundaries:</b> Public aircraft and weather data are supplied by third-party public sources. Baggage, passenger, custody and claims records shown are demonstration data. BAG-DNA OS does not claim ICAO approval, adoption or certification. Production airport and airline integrations require stakeholder authorization.</section></AppShell>
  );
}
