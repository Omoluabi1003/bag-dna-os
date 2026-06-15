"use client";
import Link from "next/link";
import { Check, ChevronRight, LockKeyhole, MapPin, Plane, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";

const steps = [{t:"Checked in",d:"ATL Terminal South",time:"4:08 PM"},{t:"Security cleared",d:"Automated screening complete",time:"4:17 PM"},{t:"On the move",d:"Heading to flight DL 184",time:"4:43 PM"},{t:"Loaded on aircraft",d:"Gate F12",time:"Pending"}];

export default function TrackPage() {
  return <main className="grid-field min-h-screen bg-ink">
    <header className="border-b border-white/[.07] bg-ink/90"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6"><Logo/><div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-mist"><LockKeyhole size={12} className="text-emerald-300"/> Secure passenger portal</div></div></header>
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-gold">Passenger visibility</p><h1 className="mt-4 font-display text-4xl font-semibold leading-tight">Your bag.<br/><span className="text-cyan">Every step visible.</span></h1><p className="mt-5 text-sm leading-7 text-mist">Track your checked baggage with the same trusted operational data used by the airport.</p>
          <div className="mt-8 flex border border-white/10 bg-white/[.03] p-1"><div className="flex flex-1 items-center gap-3 px-3 text-xs text-ivory"><Search size={15} className="text-mist"/>DL004921</div><button className="bg-gold px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-ink">Track bag</button></div>
          <p className="mt-3 text-[9px] text-mist">Find your bag tag number on your baggage receipt.</p>
        </div>
        <section className="glass overflow-hidden">
          <div className="relative border-b border-white/[.07] bg-[#0c2639] p-6"><div className="absolute right-0 top-0 h-full w-1/2 dot-field opacity-30"/><div className="relative flex flex-wrap items-center justify-between gap-4"><div><p className="text-[9px] uppercase tracking-widest text-mist">Delta Air Lines · DL 184</p><div className="mt-3 flex items-center gap-4"><span className="font-display text-2xl">ATL</span><span className="h-px w-12 bg-gold"/><Plane size={17} className="text-gold"/><span className="h-px w-12 bg-gold"/><span className="font-display text-2xl">LHR</span></div></div><div className="text-right"><p className="text-[9px] text-mist">Bag tag</p><p className="mt-1 font-mono text-sm font-bold text-cyan">DL 004921</p></div></div></div>
          <div className="p-6 md:p-8"><div className="mb-8 flex items-center gap-4 bg-emerald-400/[.06] p-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><ShieldCheck size={20}/></div><div><p className="text-xs font-bold text-ivory">Your bag is on track</p><p className="mt-1 text-[10px] text-mist">Last updated moments ago at Ramp B-14</p></div></div>
            <div className="relative"><div className="absolute bottom-7 left-[15px] top-5 w-px bg-white/10"/>{steps.map((s,i)=><div key={s.t} className="relative grid grid-cols-[32px_1fr_auto] gap-4 pb-7"><div className={`relative z-10 grid h-8 w-8 place-items-center rounded-full ${i<3?"bg-emerald-400 text-ink":"border border-white/15 bg-panel text-mist"}`}>{i<3?<Check size={14}/>:<MapPin size={13}/>}</div><div className="pt-1"><p className="text-xs font-bold">{s.t}</p><p className="mt-1 text-[9px] text-mist">{s.d}</p></div><span className="pt-1 text-[9px] text-mist">{s.time}</span></div>)}</div>
          </div>
        </section>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.07] pt-6"><p className="text-[9px] text-mist">Powered by BAG-DNA OS · ETL GIS Consulting LLC</p><Link href="/" className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-cyan">Learn about the platform <ChevronRight size={12}/></Link></div>
    </div>
  </main>
}
