import { AlertOctagon, Eye, RadioTower, ShieldCheck } from "lucide-react";
import { AirportMap } from "@/components/airport-map";
import { AppShell } from "@/components/shell";
import { Badge, MetricCard, SectionHeading } from "@/components/ui";
import { alerts } from "@/lib/data";

export default function IntelligencePage() {
  return <AppShell title="Security Intelligence Center" eyebrow="BAG-DNA Fusion Operations">
    <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Threat posture" value="Guarded" change="+1 level" detail="regional baseline" icon={ShieldCheck}/><MetricCard label="Signals monitored" value="48.2K" change="+7.2%" detail="events / minute" icon={RadioTower}/><MetricCard label="Active incidents" value="4" change="−20.0%" detail="1 critical" icon={AlertOctagon}/></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
      <section className="glass p-5"><SectionHeading eyebrow="Spatiotemporal analysis" title="Incident concentration map" action={<Badge tone="amber"><Eye size={10}/> Live analysis</Badge>}/><AirportMap heat/></section>
      <section className="glass p-5"><SectionHeading eyebrow="Correlated signals" title="Intelligence feed"/><div className="space-y-2">{alerts.map((a,i)=><div key={a.id} className="border border-white/[.07] bg-white/[.02] p-4"><div className="flex justify-between gap-2"><Badge tone={i===0?"red":i===1?"amber":"slate"}>{a.severity}</Badge><span className="text-[8px] text-mist">{a.time} ago</span></div><p className="mt-3 text-[11px] font-bold">{a.title}</p><p className="mt-1 text-[9px] text-mist">{a.detail}</p><div className="mt-3 flex justify-between border-t border-white/[.06] pt-2 font-mono text-[8px] text-mist/60"><span>{a.id}</span><span>CONF {(98-i*7)}%</span></div></div>)}</div></section>
    </div>
  </AppShell>
}
