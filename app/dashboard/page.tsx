import { AlertTriangle, BriefcaseBusiness, Plane, ScanLine } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, MetricCard, Progress, SectionHeading, StatusDot } from "@/components/ui";
import { alerts, flights } from "@/lib/data";

export default function DashboardPage() {
  return (
    <AppShell title="Aviation Operations Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs text-mist">Live operating picture · 15 June 2026 · 17:02 UTC</p></div>
        <div className="flex gap-2"><Badge tone="emerald"><StatusDot/> Live</Badge><Badge>Last sync 4 sec ago</Badge></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Bags in operation" value="12,847" change="+4.2%" detail="vs. daily avg" icon={BriefcaseBusiness}/>
        <MetricCard label="Active flights" value="186" change="+2.8%" detail="42 international" icon={Plane}/>
        <MetricCard label="Custody compliance" value="99.84%" change="+0.12%" detail="30-day trend" icon={ScanLine}/>
        <MetricCard label="Open exceptions" value="17" change="−18.1%" detail="4 high priority" icon={AlertTriangle}/>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_.8fr]">
        <section className="glass p-5">
          <SectionHeading eyebrow="Departure bank 03" title="Flight load progression" action={<button className="text-[9px] font-bold uppercase tracking-wider text-cyan">View all flights →</button>}/>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead><tr className="border-b border-white/[.08] text-[9px] uppercase tracking-[.15em] text-mist"><th className="pb-3 font-medium">Flight</th><th className="pb-3 font-medium">Departure</th><th className="pb-3 font-medium">Gate</th><th className="pb-3 font-medium">Load progression</th><th className="pb-3 text-right font-medium">Status</th></tr></thead>
              <tbody>{flights.map((f) => <tr key={f.code} className="border-b border-white/[.05] text-xs">
                <td className="py-4"><p className="font-bold text-ivory">{f.code}</p><p className="mt-1 text-[9px] text-mist">{f.route}</p></td>
                <td className="py-4 font-mono text-mist">{f.departure}</td><td className="py-4 text-mist">{f.gate}</td>
                <td className="w-[32%] py-4"><div className="mb-2 flex justify-between text-[9px]"><span className="text-mist">{f.loaded} / {f.bags} bags</span><span>{Math.round(f.loaded/f.bags*100)}%</span></div><Progress value={f.loaded/f.bags*100}/></td>
                <td className="py-4 text-right"><Badge tone={f.status === "Boarding" ? "emerald" : "cyan"}>{f.status}</Badge></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="glass p-5">
          <SectionHeading eyebrow="Action queue" title="Live exceptions" action={<span className="text-[10px] text-red-300">4 urgent</span>}/>
          <div className="space-y-1">{alerts.map((a,i) => <div key={a.id} className="group border-l-2 border-white/10 bg-white/[.02] p-3 hover:border-gold hover:bg-white/[.04]">
            <div className="flex items-start justify-between"><p className="text-[11px] font-bold text-ivory">{a.title}</p><span className="text-[9px] text-mist">{a.time}</span></div>
            <p className="mt-1.5 text-[9px] text-mist">{a.detail}</p>
            <div className="mt-3 flex items-center justify-between"><span className="font-mono text-[8px] text-mist/60">{a.id}</span><Badge tone={i===0?"red":i===1?"amber":"slate"}>{a.severity}</Badge></div>
          </div>)}</div>
        </section>
      </div>
      <section className="glass mt-6 p-5"><SectionHeading eyebrow="System throughput" title="24-hour baggage event volume"/>
        <div className="flex h-32 items-end gap-1">{[31,28,22,19,17,23,41,67,84,72,64,77,89,93,84,76,82,91,96,88,71,58,46,38].map((v,i)=><div key={i} className="group relative flex-1 bg-cyan/15 hover:bg-cyan/40" style={{height:`${v}%`}}><span className="absolute -top-5 hidden text-[8px] text-cyan group-hover:block">{v}k</span></div>)}</div>
        <div className="mt-2 flex justify-between font-mono text-[8px] text-mist"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
      </section>
    </AppShell>
  );
}
