"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Fingerprint, Globe2, Network, Radar, ShieldAlert, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";

const capabilities = [
  { icon: Fingerprint, n: "01", title: "Digital bag identity", text: "A persistent, interoperable identity layer that binds every bag to its passenger, journey and verified attributes." },
  { icon: Network, n: "02", title: "Chain-of-custody", text: "Every handoff, scan and security event captured as an immutable, operationally useful record." },
  { icon: Radar, n: "03", title: "AI risk intelligence", text: "Predictive anomaly detection surfaces custody breaks and route deviations before they become incidents." },
  { icon: Globe2, n: "04", title: "GIS digital twin", text: "Live geospatial context turns baggage operations into a clear, commandable airport-wide picture." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[.07] bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Logo />
          <div className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.12em] text-mist md:flex">
            <a href="#platform" className="hover:text-ivory">Platform</a>
            <a href="#intelligence" className="hover:text-ivory">Intelligence</a>
            <Link href="/about" className="hover:text-ivory">Company</Link>
          </div>
          <Link href="/dashboard" className="group flex items-center gap-3 border border-gold/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] text-gold transition hover:bg-gold hover:text-ink">
            Enter platform <ArrowRight size={13} className="transition group-hover:translate-x-1"/>
          </Link>
        </div>
      </nav>

      <section className="grid-field relative flex min-h-[900px] items-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(110,216,224,.09),transparent_31%),radial-gradient(circle_at_15%_35%,rgba(215,169,59,.06),transparent_25%)]"/>
        <div className="absolute right-[-8%] top-[16%] hidden h-[620px] w-[620px] rounded-full border border-cyan/10 lg:block">
          <div className="absolute inset-16 rounded-full border border-white/[.06]"/>
          <div className="absolute inset-32 rounded-full border border-dashed border-gold/20"/>
          <div className="absolute left-1/2 top-1/2 h-px w-[360px] origin-left -rotate-[28deg] bg-gradient-to-r from-cyan/50 to-transparent"/>
          <div className="pulse-ring absolute left-[46%] top-[46%] h-14 w-14 rounded-full border border-cyan/50"/>
          <div className="absolute left-[49%] top-[49%] h-3 w-3 rounded-full bg-cyan shadow-[0_0_28px_#6ed8e0]"/>
          {[["ATL","31%","69%"],["LHR","66%","23%"],["DXB","78%","62%"],["LOS","42%","78%"]].map(([label,left,top]) => (
            <div key={label} className="absolute" style={{left,top}}>
              <span className="block h-1.5 w-1.5 bg-gold"/><span className="mt-1 block text-[8px] font-bold tracking-widest text-mist">{label}</span>
            </div>
          ))}
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-6 py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }} className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-3 border border-white/10 bg-white/[.03] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>
              <span className="text-[9px] font-bold uppercase tracking-[.2em] text-mist">The intelligence layer for global baggage operations</span>
            </div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.34em] text-gold">Know every bag. Secure every journey.</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-[-.035em] text-ivory sm:text-7xl lg:text-[86px]">
              Baggage has an<br/><span className="text-cyan">identity now.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-mist md:text-lg">
              BAG-DNA OS unifies digital identity, chain-of-custody, AI risk scoring and geospatial intelligence into one aviation-grade operating picture.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 bg-gold px-6 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-ink transition hover:bg-[#ecc35c]">Explore mission control <ArrowRight size={14}/></Link>
              <Link href="/track" className="flex items-center gap-3 border border-white/15 px-6 py-4 text-[11px] font-bold uppercase tracking-[.16em] text-ivory hover:bg-white/5">Track a bag <ChevronRight size={14}/></Link>
            </div>
          </motion.div>
          <div className="mt-24 grid max-w-3xl grid-cols-2 gap-px border border-white/[.07] bg-white/[.07] md:grid-cols-4">
            {[["99.97%","Identity uptime"],["< 3 sec","Event latency"],["40%","Faster recovery"],["24 / 7","Risk vigilance"]].map(([value,label]) => (
              <div key={label} className="bg-ink/90 p-5"><p className="font-display text-xl font-semibold text-ivory">{value}</p><p className="mt-1 text-[9px] uppercase tracking-[.15em] text-mist">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[.07] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-red-300">The unresolved identity gap</p><h2 className="mt-5 font-display text-4xl font-semibold leading-tight">A paper tag is not a security identity.</h2><p className="mt-6 text-sm leading-7 text-mist">Tags can be photographed, cloned, diverted, or moved to another bag—creating exposure to theft, substitution, narcotics logistics, insider manipulation, passenger misidentification, legal claims, and airport reputation damage.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">{["Stolen or cloned baggage identities","Luggage substitution and diversion","Insider handling manipulation","Narcotics transit exploitation","Passenger claim misidentification","Legal, diplomatic, and insurance exposure"].map((x,i)=><div className="flex gap-4 border border-white/[.08] bg-white/[.02] p-5" key={x}><ShieldAlert size={17} className={i<2?"text-red-300":"text-amber-300"}/><span className="text-xs">{x}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[.07] bg-[#091b2a] py-28">
        <div className="mx-auto max-w-7xl px-6"><p className="text-[10px] font-bold uppercase tracking-[.24em] text-gold">Identity-first custody</p><h2 className="mt-5 max-w-3xl font-display text-4xl font-semibold">Eight verified steps. One defensible journey.</h2><div className="mt-10 grid gap-px bg-white/[.08] sm:grid-cols-2 lg:grid-cols-4">{["Check-in","Digital ID creation","AI visual fingerprint","RFID / NFC custody","Screening verification","Loading verification","GIS location tracking","Passenger claim confirmation"].map((x,i)=><div className="bg-[#0b2134] p-5" key={x}><span className="font-mono text-[9px] text-gold">0{i+1}</span><h3 className="mt-8 text-sm font-bold">{x}</h3><p className="mt-2 text-[10px] leading-5 text-mist">{["Passenger, journey, weight and dimensions are reconciled.","A persistent BAG-DNA identity is securely minted.","Computer vision extracts durable physical attributes.","Every custody handoff receives sensor evidence.","Identity, seal and screening results are reconciled.","Bag-to-flight and handler assignments are confirmed.","Movement is mapped across airport operational zones.","Passenger and bag identity close the custody chain."][i]}</p></div>)}</div></div>
      </section>

      <section className="py-28"><div className="mx-auto max-w-7xl px-6"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-gold">Pilot opportunity</p><h2 className="mt-5 font-display text-4xl font-semibold">Start where identity risk is highest.</h2></div><Link href="/pilot" className="text-[10px] font-bold uppercase tracking-widest text-cyan">Explore deployment strategy →</Link></div><div className="mt-9 grid gap-3 md:grid-cols-5">{["Canada → Africa","North America → Caribbean","Europe → Africa","Latin America transit","High-risk narcotics routes"].map((x,i)=><div className="glass p-5" key={x}><Globe2 size={17} className="text-cyan"/><h3 className="mt-8 text-xs font-bold">{x}</h3><p className="mt-2 text-[9px] text-mist">{["High readiness","High volume","Elevated controls","Transit intelligence","Agency-led pilot"][i]}</p></div>)}</div></div></section>

      <section id="platform" className="relative border-y border-white/[.07] bg-[#091b2a] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-gold">One shared operational truth</p>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-ivory md:text-5xl">From bag drop to arrival belt.</h2>
              <p className="mt-6 text-sm leading-7 text-mist">Designed for airport authorities, airlines, ground handlers and security teams that cannot afford fragmented visibility.</p>
              <div className="mt-8 space-y-3">
                {["Standards-aligned interoperability","Role-based enterprise controls","Supabase and GIS-ready architecture"].map(x => <p key={x} className="flex items-center gap-3 text-xs text-ivory"><span className="grid h-5 w-5 place-items-center border border-gold/30 text-gold"><Check size={11}/></span>{x}</p>)}
              </div>
            </div>
            <div className="grid gap-px bg-white/[.08] sm:grid-cols-2">
              {capabilities.map(({icon:Icon,n,title,text}) => (
                <motion.div whileHover={{ y: -3 }} key={n} className="group bg-[#0b2134] p-8">
                  <div className="flex items-center justify-between"><Icon size={20} className="text-cyan"/><span className="font-mono text-[10px] text-mist/50">{n}</span></div>
                  <h3 className="mt-10 font-display text-xl font-semibold text-ivory">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-mist">{text}</p>
                  <div className="mt-6 h-px w-8 bg-gold transition-all group-hover:w-16"/>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="intelligence" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="glass relative overflow-hidden p-8 md:p-14">
            <div className="absolute right-0 top-0 h-full w-1/2 dot-field opacity-40"/>
            <div className="relative max-w-2xl">
              <div className="flex items-center gap-3 text-gold"><Sparkles size={17}/><span className="text-[10px] font-bold uppercase tracking-[.24em]">Built by ETL GIS Consulting LLC</span></div>
              <h2 className="mt-6 font-display text-4xl font-semibold text-ivory">A safer journey begins with operational clarity.</h2>
              <p className="mt-5 text-sm leading-7 text-mist">We combine geospatial systems thinking, aviation security intelligence and modern product engineering to make baggage movement visible, accountable and resilient.</p>
              <Link href="/about" className="mt-8 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] text-cyan">Meet the company <ArrowRight size={13}/></Link>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.07] bg-gold py-16 text-ink"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 lg:flex-row lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[.22em]">The infrastructure layer for baggage trust</p><h2 className="mt-3 font-display text-3xl font-semibold">Every passenger has an identity. Every bag should too.</h2></div><div className="flex flex-wrap gap-3"><Link href="/dashboard" className="bg-ink px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-ivory">View command dashboard</Link><Link href="/pilot" className="border border-ink px-5 py-3 text-[10px] font-bold uppercase tracking-widest">Explore pilot strategy</Link><Link href="/passenger" className="border border-ink px-5 py-3 text-[10px] font-bold uppercase tracking-widest">Open passenger portal</Link></div></div></section>
      <footer className="border-t border-white/[.07] py-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6"><Logo/><p className="text-[9px] uppercase tracking-widest text-mist">© 2026 ETL GIS Consulting LLC · Aviation intelligence, engineered.</p></div></footer>
    </main>
  );
}
