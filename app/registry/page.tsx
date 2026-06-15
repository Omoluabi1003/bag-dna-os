import { Database, Fingerprint, Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, MetricCard, Progress, SectionHeading, StatusDot } from "@/components/ui";
import { bags } from "@/lib/data";

export default function RegistryPage() {
  return <AppShell title="Digital Baggage Identity Registry">
    <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Registered identities" value="2.84M" change="+12.8%" detail="this month" icon={Fingerprint}/><MetricCard label="Verified today" value="18,492" change="+5.6%" detail="across ATL" icon={ShieldCheck}/><MetricCard label="Registry health" value="99.99%" change="+0.01%" detail="globally available" icon={Database}/></div>
    <section className="glass mt-6 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4"><SectionHeading eyebrow="Authoritative identity layer" title="Active baggage records"/>
        <div className="mb-5 flex items-center gap-2 border border-white/10 bg-ink/50 px-3 py-2 text-[10px] text-mist"><Search size={13}/> Search DNA ID, bag tag or passenger…</div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left">
        <thead><tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-mist"><th className="pb-3">DNA identity</th><th className="pb-3">Passenger</th><th className="pb-3">Journey</th><th className="pb-3">Current zone</th><th className="pb-3">Trust score</th><th className="pb-3 text-right">State</th></tr></thead>
        <tbody>{bags.map((b)=><tr key={b.id} className="border-b border-white/[.05] text-xs hover:bg-white/[.02]">
          <td className="py-4"><p className="font-mono font-bold text-cyan">{b.id}</p><p className="mt-1 text-[9px] text-mist">{b.tag}</p></td><td><p className="text-ivory">{b.passenger}</p><p className="mt-1 text-[9px] text-mist">Identity verified</p></td>
          <td><p className="font-bold">{b.flight}</p><p className="mt-1 text-[9px] text-mist">{b.route}</p></td><td className="text-mist">{b.zone}</td>
          <td className="w-36"><div className="mb-2 flex justify-between text-[9px]"><span>Confidence</span><span>{100-b.risk}%</span></div><Progress value={100-b.risk} tone={b.risk>65?"red":"emerald"}/></td>
          <td className="text-right"><Badge tone={b.status==="Exception"?"red":b.color}><StatusDot tone={b.color}/>{b.status}</Badge></td></tr>)}</tbody>
      </table></div>
    </section>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      {["Identity provenance","Journey attributes","Security attestations"].map((x,i)=><div key={x} className="glass p-5"><p className="text-[9px] font-bold uppercase tracking-widest text-gold">Registry layer 0{i+1}</p><h3 className="mt-3 font-display text-lg">{x}</h3><p className="mt-2 text-[11px] leading-5 text-mist">{["Immutable linkage between passenger, bag tag, physical signature and journey record.","Flight, route, handling class, ULD assignment and live operational state.","Screening results, custody signatures and automated trust evaluations."][i]}</p></div>)}
    </div>
  </AppShell>
}
