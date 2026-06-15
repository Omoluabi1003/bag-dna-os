import { Check, Clock3, Fingerprint, MapPin, UserRoundCheck } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, SectionHeading } from "@/components/ui";
import { custodyEvents } from "@/lib/data";

export default function CustodyPage() {
  return <AppShell title="Chain-of-Custody Timeline">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="font-mono text-sm font-bold text-cyan">BD-7A92-1184</p><p className="mt-1 text-xs text-mist">Amara Okafor · DL 184 · ATL → LHR</p></div><div className="flex gap-2"><Badge tone="emerald">Chain intact</Badge><Badge>18.4 kg</Badge><Badge>Priority</Badge></div></div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
      <section className="glass p-5 md:p-7"><SectionHeading eyebrow="Verifiable event ledger" title="Journey custody record" action={<span className="text-[9px] text-mist">6 events · UTC−4</span>}/>
        <div className="relative ml-2 mt-7"><div className="absolute bottom-8 left-[15px] top-3 w-px bg-white/10"/>
          {custodyEvents.map((e)=><div key={e.title} className="relative grid grid-cols-[32px_80px_1fr] gap-3 pb-7">
            <div className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border ${e.state==="complete"?"border-emerald-400/40 bg-emerald-400/10 text-emerald-300":e.state==="active"?"border-gold bg-gold/10 text-gold":"border-white/10 bg-panel text-mist"}`}>{e.state==="complete"?<Check size={13}/>:<Clock3 size={13}/>}</div>
            <span className="pt-2 font-mono text-[9px] text-mist">{e.time}</span>
            <div className={`border p-4 ${e.state==="active"?"border-gold/30 bg-gold/[.04]":"border-white/[.07] bg-white/[.02]"}`}><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-xs font-bold text-ivory">{e.title}</h3><p className="mt-1 text-[9px] text-cyan">{e.place}</p></div><Badge tone={e.state==="active"?"amber":e.state==="complete"?"emerald":"slate"}>{e.state}</Badge></div><p className="mt-3 text-[10px] text-mist">{e.detail}</p><p className="mt-3 flex items-center gap-2 text-[9px] text-mist/70"><UserRoundCheck size={11}/>{e.actor}</p></div>
          </div>)}
        </div>
      </section>
      <div className="space-y-6">
        <section className="glass p-5"><SectionHeading eyebrow="Bag DNA" title="Identity assurance"/><div className="flex items-center gap-5"><div className="grid h-20 w-20 place-items-center border border-cyan/20 bg-cyan/5"><Fingerprint size={36} className="text-cyan"/></div><div><p className="font-display text-3xl font-semibold">98.7%</p><p className="mt-1 text-[10px] text-emerald-300">High confidence match</p></div></div><div className="mt-5 space-y-3">{[["Passenger binding","Verified"],["Tag integrity","Verified"],["Physical signature","Matched"],["Journey record","Active"]].map(([a,b])=><div key={a} className="flex justify-between border-b border-white/[.06] pb-2 text-[10px]"><span className="text-mist">{a}</span><span className="text-ivory">{b}</span></div>)}</div></section>
        <section className="map-grid relative h-64 overflow-hidden border border-white/[.08] p-5"><p className="relative z-10 text-[9px] font-bold uppercase tracking-widest text-gold">Live location</p><div className="absolute left-[58%] top-[48%]"><span className="pulse-ring absolute -inset-4 rounded-full border border-cyan"/><MapPin className="relative text-cyan" size={22}/></div><div className="absolute bottom-4 left-4 right-4 bg-ink/80 p-3 backdrop-blur"><p className="text-xs font-bold">Ramp B-14</p><p className="mt-1 text-[9px] text-mist">Last position update 4 sec ago</p></div></section>
      </div>
    </div>
  </AppShell>
}
