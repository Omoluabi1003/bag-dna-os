import { Activity, BrainCircuit, Gauge, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, MetricCard, Progress, SectionHeading } from "@/components/ui";
import { bags, riskFactors } from "@/lib/data";

export default function RiskPage() {
  return <AppShell title="AI Risk Scoring Dashboard">
    <div className="grid gap-4 sm:grid-cols-3"><MetricCard label="Assets evaluated" value="12,847" change="+8.1%" detail="live journeys" icon={BrainCircuit}/><MetricCard label="Elevated risk" value="43" change="−5.3%" detail="0.33% of total" icon={ShieldAlert}/><MetricCard label="Model precision" value="96.2%" change="+1.4%" detail="30-day rolling" icon={Gauge}/></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
      <section className="glass p-6"><SectionHeading eyebrow="Selected asset · BD-5D04-6209" title="Composite risk profile" action={<Badge tone="red">Critical · 91</Badge>}/>
        <div className="mx-auto my-8 grid h-48 w-48 place-items-center rounded-full border-[14px] border-red-400/10 bg-[conic-gradient(#f87171_0_91%,rgba(255,255,255,.06)_91%)] p-[10px]"><div className="grid h-full w-full place-items-center rounded-full bg-[#0c2436] text-center"><div><p className="font-display text-5xl font-semibold">91</p><p className="text-[9px] uppercase tracking-widest text-red-300">Risk index</p></div></div></div>
        <div className="space-y-4">{riskFactors.map(f=><div key={f.label}><div className="mb-2 flex justify-between text-[10px]"><span className="text-mist">{f.label}</span><span>{f.value} <small className="ml-2 text-mist">{f.trend}</small></span></div><Progress value={f.value} tone={f.tone}/></div>)}</div>
        <div className="mt-6 border-l-2 border-gold bg-gold/[.05] p-4"><p className="text-[10px] font-bold text-gold">AI RECOMMENDATION</p><p className="mt-2 text-[11px] leading-5 text-mist">Initiate secondary physical reconciliation at Hold E-7. Custody signature is inconsistent with expected handler sequence.</p></div>
      </section>
      <section className="glass p-6"><SectionHeading eyebrow="Prioritized decision queue" title="Assets requiring review" action={<span className="flex items-center gap-2 text-[9px] text-emerald-300"><Activity size={12}/> Model online</span>}/>
        <div className="space-y-2">{bags.slice().sort((a,b)=>b.risk-a.risk).map((b,i)=><div key={b.id} className="grid grid-cols-[42px_1fr_auto] items-center gap-4 border border-white/[.07] bg-white/[.02] p-4">
          <div className={`grid h-10 w-10 place-items-center font-display text-lg ${b.risk>80?"bg-red-400/10 text-red-300":b.risk>50?"bg-amber-400/10 text-amber-300":"bg-emerald-400/10 text-emerald-300"}`}>{b.risk}</div>
          <div><div className="flex flex-wrap items-center gap-2"><p className="font-mono text-[11px] font-bold text-cyan">{b.id}</p><Badge tone={b.risk>80?"red":b.risk>50?"amber":"emerald"}>{b.level}</Badge></div><p className="mt-1.5 text-[10px] text-mist">{b.flight} · {b.zone} · {b.passenger}</p></div>
          <button className="text-[9px] font-bold uppercase tracking-wider text-gold">Review →</button></div>)}</div>
      </section>
    </div>
  </AppShell>
}
