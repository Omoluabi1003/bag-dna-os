import { Layers3, LocateFixed, Radio, Route } from "lucide-react";
import { AirportMap } from "@/components/airport-map";
import { AppShell } from "@/components/shell";
import { Badge, SectionHeading } from "@/components/ui";
import { zones } from "@/lib/data";

export default function DigitalTwinPage() {
  return <AppShell title="GIS Digital Twin">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-mist">ATL airside · Operational topology and live asset telemetry</p><div className="flex gap-2"><Badge tone="emerald"><Radio size={10}/> 1,482 live assets</Badge><Badge><Layers3 size={10}/> 8 layers</Badge></div></div>
    <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
      <div className="relative"><AirportMap/><div className="absolute left-4 top-4 flex gap-1 bg-ink/85 p-1 backdrop-blur">{["Operations","Custody","Risk","Flow"].map((x,i)=><button key={x} className={`px-3 py-2 text-[9px] font-bold uppercase tracking-wider ${i===0?"bg-gold text-ink":"text-mist"}`}>{x}</button>)}</div><div className="absolute right-4 top-4 grid gap-1"><button className="grid h-9 w-9 place-items-center bg-ink/85 text-cyan"><LocateFixed size={15}/></button><button className="grid h-9 w-9 place-items-center bg-ink/85 text-cyan"><Route size={15}/></button></div></div>
      <section className="glass p-5"><SectionHeading eyebrow="Live topology" title="Airport zones"/>
        <div className="space-y-2">{zones.map(z=><div key={z.code} className="border border-white/[.07] p-3"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold">{z.name}</p><p className="mt-1 font-mono text-[8px] text-mist">ZONE_{z.code}</p></div><Badge tone={z.status==="Elevated"?"red":z.status==="Watch"?"amber":"emerald"}>{z.status}</Badge></div><div className="mt-3 h-1 bg-white/10"><div className={`h-full ${z.load>90?"bg-red-400":z.load>80?"bg-amber-400":"bg-cyan"}`} style={{width:`${z.load}%`}}/></div><p className="mt-2 text-right text-[8px] text-mist">{z.load}% utilization</p></div>)}</div>
        <button className="mt-4 w-full border border-cyan/20 py-3 text-[9px] font-bold uppercase tracking-wider text-cyan">Open GIS layer manager</button>
      </section>
    </div>
  </AppShell>
}
