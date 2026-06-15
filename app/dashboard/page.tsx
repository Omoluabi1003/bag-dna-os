import { AlertTriangle, BriefcaseBusiness, Plane, ScanLine } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, MetricCard, Progress, SectionHeading, StatusDot } from "@/components/ui";
import { alerts, flights } from "@/lib/data";
import { CustodyChart } from "@/components/dashboard/CustodyChart";
import { IncidentTrend } from "@/components/dashboard/IncidentTrend";
import { RiskChart } from "@/components/dashboard/RiskChart";

const nigeriaSignals = [
  ["Lagos hub activity", "4,820 bags", "Peak international bank"],
  ["Abuja hub activity", "2,140 bags", "Domestic transfer pressure"],
  ["Lagos → Abuja", "14 risk", "High-volume domestic proof corridor"],
  ["Lagos → London", "31 risk", "Claims and customs intelligence value"],
  ["Abuja → Dubai", "27 risk", "International outbound watch"],
  ["Domestic baggage volume", "68%", "Nigeria network share"],
  ["Outbound risk", "2.7%", "Enhanced reconciliation candidates"],
  ["Claim dispute indicators", "43", "Evidence review opportunities"],
];

export default function DashboardPage() {
  return (
    <AppShell title="Aviation Operations Dashboard">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-cyan">Live operating picture</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-[-.04em] text-ivory md:text-5xl">Every bag. One clear view.</h2>
          <p className="mt-3 text-sm text-mist">Monday, June 15 · 17:02 UTC · Atlanta international operations</p>
        </div>
        <div className="flex gap-2"><Badge tone="emerald"><StatusDot/> Live</Badge><Badge>Last sync 4 sec ago</Badge></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Bags in operation" value="12,847" change="+4.2%" detail="vs. daily avg" icon={BriefcaseBusiness}/>
        <MetricCard label="Active flights" value="186" change="+2.8%" detail="42 international" icon={Plane}/>
        <MetricCard label="Custody compliance" value="99.84%" change="+0.12%" detail="30-day trend" icon={ScanLine}/>
        <MetricCard label="Open exceptions" value="17" change="−18.1%" detail="4 high priority" icon={AlertTriangle}/>
      </div>
      <section className="glass mt-7 p-6 md:p-7">
        <SectionHeading eyebrow="Nigeria Aviation Intelligence Hub" title="National corridor operating picture" action={<Badge tone="amber">Beta data mode</Badge>}/>
        <p className="-mt-2 mb-5 max-w-3xl text-xs leading-5 text-mist">A pilot-facing view for airport authorities, airlines, customs, security teams, and investors. Figures are simulated until governed operational feeds are connected.</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{nigeriaSignals.map(([label,value,detail])=><article key={label} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4"><p className="text-[10px] uppercase tracking-[.12em] text-mist">{label}</p><p className="mt-3 text-xl font-semibold text-ivory">{value}</p><p className="mt-1 text-[10px] leading-4 text-cyan">{detail}</p></article>)}</div>
      </section>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.55fr_.8fr]">
        <section className="glass p-6 md:p-7">
          <SectionHeading eyebrow="Departure bank 03" title="Flight load progression" action={<button className="text-[9px] font-bold uppercase tracking-wider text-cyan">View all flights →</button>}/>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead><tr className="border-b border-white/[.08] text-[10px] uppercase tracking-[.12em] text-mist"><th className="pb-4 font-medium">Flight</th><th className="pb-4 font-medium">Departure</th><th className="pb-4 font-medium">Gate</th><th className="pb-4 font-medium">Load progression</th><th className="pb-4 text-right font-medium">Status</th></tr></thead>
              <tbody>{flights.map((f) => <tr key={f.code} className="border-b border-white/[.05] text-xs">
                <td className="py-4"><p className="font-bold text-ivory">{f.code}</p><p className="mt-1 text-[9px] text-mist">{f.route}</p></td>
                <td className="py-4 font-mono text-mist">{f.departure}</td><td className="py-4 text-mist">{f.gate}</td>
                <td className="w-[32%] py-4"><div className="mb-2 flex justify-between text-[9px]"><span className="text-mist">{f.loaded} / {f.bags} bags</span><span>{Math.round(f.loaded/f.bags*100)}%</span></div><Progress value={f.loaded/f.bags*100}/></td>
                <td className="py-4 text-right"><Badge tone={f.status === "Boarding" ? "emerald" : "cyan"}>{f.status}</Badge></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="glass p-6 md:p-7">
          <SectionHeading eyebrow="Action queue" title="Live exceptions" action={<span className="text-[10px] text-red-300">4 urgent</span>}/>
          <div className="space-y-2">{alerts.map((a,i) => <div key={a.id} className="group rounded-2xl border border-white/[.06] bg-white/[.025] p-4 transition hover:border-white/[.12] hover:bg-white/[.045]">
            <div className="flex items-start justify-between"><p className="text-[11px] font-bold text-ivory">{a.title}</p><span className="text-[9px] text-mist">{a.time}</span></div>
            <p className="mt-1.5 text-[9px] text-mist">{a.detail}</p>
            <div className="mt-3 flex items-center justify-between"><span className="font-mono text-[8px] text-mist/60">{a.id}</span><Badge tone={i===0?"red":i===1?"amber":"slate"}>{a.severity}</Badge></div>
          </div>)}</div>
        </section>
      </div>
      <section className="glass mt-7 p-6 md:p-7"><SectionHeading eyebrow="System throughput" title="24-hour baggage event volume"/>
        <div className="flex h-32 items-end gap-1.5">{[31,28,22,19,17,23,41,67,84,72,64,77,89,93,84,76,82,91,96,88,71,58,46,38].map((v,i)=><div key={i} className="group relative flex-1 rounded-t-full bg-cyan/15 transition hover:bg-cyan/40" style={{height:`${v}%`}}><span className="absolute -top-5 hidden text-[8px] text-cyan group-hover:block">{v}k</span></div>)}</div>
        <div className="mt-2 flex justify-between font-mono text-[8px] text-mist"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>
      </section>
      <div className="mt-7 grid gap-7 xl:grid-cols-3">
        <section className="glass p-6"><SectionHeading eyebrow="Custody stages" title="Events by operational stage"/><CustodyChart/></section>
        <section className="glass p-6"><SectionHeading eyebrow="AI distribution" title="Portfolio risk bands"/><RiskChart/></section>
        <section className="glass p-6"><SectionHeading eyebrow="Security posture" title="Incident trend"/><IncidentTrend/><div className="grid grid-cols-2 gap-3 border-t border-white/[.07] pt-5 text-[11px]"><span className="text-mist">Avg custody confidence</span><b className="text-right text-emerald-300">97.8%</b><span className="text-mist">Misrouting risk</span><b className="text-right">0.18%</b><span className="text-mist">High-risk corridors</span><b className="text-right text-amber-300">3</b></div></section>
      </div>
    </AppShell>
  );
}
