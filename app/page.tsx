"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Fingerprint,
  Globe2,
  Map,
  Menu,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { type CSSProperties, useState } from "react";
import { Logo } from "@/components/logo";

const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65 },
};

const capabilities = [
  {
    icon: Fingerprint,
    title: "Persistent bag identity",
    text: "Bind every bag to its passenger, journey, visual attributes, and secure tag.",
    href: "/registry",
  },
  {
    icon: Network,
    title: "Verified chain of custody",
    text: "Turn every handoff into a timestamped, defensible evidence event.",
    href: "/custody",
  },
  {
    icon: Radar,
    title: "AI risk intelligence",
    text: "Surface anomalies, route deviations, and custody breaks before escalation.",
    href: "/risk",
  },
  {
    icon: Map,
    title: "GIS operational twin",
    text: "See baggage movement, facilities, and risk in one geospatial command layer.",
    href: "/digital-twin",
  },
];

const journey = [
  ["01", "Issue identity", "At check-in, create a BAG-DNA identity for the passenger, flight, and physical bag."],
  ["02", "Bind every layer", "Link the tag, RFID, NFC, rotating QR, tamper seal, weight, and visual fingerprint."],
  ["03", "Verify every scan", "Reconcile credentials, route, custody stage, staff assignment, seal, weight, and appearance."],
  ["04", "Detect and preserve", "Stop identity mismatches, record evidence, and release the bag only after trusted claim."],
];

const backgroundLinks = [
  {
    label: "Tagged bag identity",
    href: "https://unsplash.com/photos/green-suitcase-with-travel-stickers-in-airport-terminal-TQ1lLBpy6X4",
    image: "https://images.unsplash.com/photo-1757865579170-8d64d9aab467?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Baggage claim custody",
    href: "https://unsplash.com/photos/luggage-on-a-conveyor-belt-at-an-airport-baggage-claim-S0u5ugYRNFo",
    image: "https://images.unsplash.com/photo-1762965119363-af950b523dca?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Airport operations corridor",
    href: "https://unsplash.com/photos/a-baggage-claim-area-at-an-airport-with-a-conveyor-belt-z4BDX1qlGtI",
    image: "https://images.unsplash.com/photo-1728327208432-782ad594ef7e?auto=format&fit=crop&w=1200&q=80",
  },
];

function LinkedSectionBackground({
  label,
  href,
  image,
  className = "",
  imageOpacity,
  overlayOpacity,
  gradientStrength,
  focalPosition,
}: {
  label: string;
  href: string;
  image: string;
  className?: string;
  imageOpacity?: number;
  overlayOpacity?: number;
  gradientStrength?: number;
  focalPosition?: string;
}) {
  const backgroundStyle = {
    "--background-image": `url(${image})`,
    ...(imageOpacity !== undefined ? { "--image-opacity": imageOpacity } : {}),
    ...(overlayOpacity !== undefined ? { "--overlay-opacity": overlayOpacity } : {}),
    ...(gradientStrength !== undefined ? { "--gradient-strength": gradientStrength } : {}),
    ...(focalPosition ? { "--focal-position": focalPosition } : {}),
  } as CSSProperties;
  return (
    <a
      href={href}
      className={`linked-section-background ${className}`}
      style={backgroundStyle}
      aria-label={`${label} image source`}
      title={`${label} image source`}
    >
      <span>{label}</span>
    </a>
  );
}

function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      className="hero-console relative mx-auto max-w-6xl"
    >
      <div className="flex items-center justify-between border-b border-white/[.08] px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5"><i/><i/><i/></span>
          <span className="hidden text-[11px] font-semibold text-white/70 sm:block">Nigeria Corridor · Live Operations</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]"/> All systems nominal
        </div>
      </div>
      <div className="grid gap-4 p-4 md:grid-cols-12 md:p-6">
        <div className="grid gap-4 sm:grid-cols-3 md:col-span-12">
          {[
            ["12,847", "Active bags", "+4.2% today"],
            ["18", "Corridor risk score", "Low exposure"],
            ["99.84%", "Custody verification", "Verified live"],
          ].map(([value, label, detail], i) => (
            <div className="console-card p-5" key={label}>
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-slate-400">{label}</p>
                <span className={`h-2 w-2 rounded-full ${i === 1 ? "bg-amber-300" : "bg-emerald-400"}`}/>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-[-.04em] text-white">{value}</p>
              <p className="mt-2 text-[10px] text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
        <div className="console-card relative min-h-[290px] overflow-hidden p-5 sm:min-h-[330px] md:col-span-7 md:p-6">
          <div className="flex items-center justify-between">
            <div><p className="console-label">GIS movement trail</p><h3 className="mt-2 text-base font-semibold text-white">LOS · Secure transfer corridor</h3></div>
            <span className="rounded-full border border-cyan/20 bg-cyan/10 px-2.5 py-1 text-[9px] font-bold text-cyan">LIVE</span>
          </div>
          <div className="preview-map absolute inset-x-0 bottom-0 top-20">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 260" fill="none" aria-hidden="true">
              <path d="M-20 220C80 190 97 86 196 112c86 23 111-58 190-37 66 18 103 105 230 29" stroke="rgba(110,216,224,.22)" strokeWidth="30"/>
              <path d="M-20 220C80 190 97 86 196 112c86 23 111-58 190-37 66 18 103 105 230 29" stroke="#6ED8E0" strokeWidth="2" strokeDasharray="7 8"/>
              {[[74,181],[196,112],[386,75],[522,112]].map(([x,y], i) => <g key={i}><circle cx={x} cy={y} r="9" fill="#0b2134" stroke="#6ED8E0"/><circle cx={x} cy={y} r="3" fill="#6ED8E0"/></g>)}
            </svg>
            <div className="absolute bottom-5 left-5 right-5 flex justify-between rounded-2xl border border-white/[.08] bg-[#071522]/80 p-3 backdrop-blur-xl">
              {["Bag drop", "Screening", "Airside", "Gate E4"].map((x, i) => <div key={x} className="text-center"><p className="text-[8px] text-slate-500">0{i + 1}</p><p className="mt-1 text-[9px] font-semibold text-slate-200">{x}</p></div>)}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:col-span-5">
          <div className="console-card p-5">
            <div className="flex items-center justify-between"><p className="console-label">AI visual fingerprint</p><Fingerprint size={16} className="text-cyan"/></div>
            <div className="mt-5 flex items-end gap-4">
              <div className="relative grid h-20 w-16 place-items-center rounded-xl border border-white/10 bg-white/[.03]">
                <div className="h-10 w-8 rounded-md border border-cyan/40 bg-cyan/5"/><span className="absolute left-2 right-2 top-1/2 h-px bg-cyan/70 shadow-[0_0_12px_#6ed8e0]"/>
              </div>
              <div className="flex-1"><p className="text-3xl font-semibold text-white">98.7%</p><p className="mt-1 text-[10px] text-slate-400">Identity confidence</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[98.7%] rounded-full bg-cyan"/></div></div>
            </div>
          </div>
          <div className="console-card p-5">
            <div className="flex items-center justify-between"><p className="console-label">Tamper seal status</p><ShieldCheck size={16} className="text-emerald-300"/></div>
            <div className="mt-5 flex items-center justify-between">
              <div><p className="text-lg font-semibold text-white">Seal intact</p><p className="mt-1 text-[10px] text-slate-400">BD-LOS-884201 · NFC verified</p></div>
              <span className="grid h-12 w-12 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><Check size={20}/></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f5f7] text-[#101114]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-black/[.06] bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="landing-logo"><Logo/></div>
          <div className="hidden items-center gap-9 text-[13px] font-medium text-slate-700 md:flex">
            <a href="#platform" className="transition hover:text-black">Platform</a>
            <a href="#workflow" className="transition hover:text-black">How it works</a>
            <Link href="/pilot" className="transition hover:text-black">Nigeria pilot</Link>
            <Link href="/about" className="transition hover:text-black">Company</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="premium-button hidden sm:inline-flex">Explore Command Center <ArrowRight size={14}/></Link>
            <button className="grid h-10 w-10 place-items-center rounded-full text-slate-800 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {menuOpen && <div className="border-t border-black/[.06] bg-white px-5 py-5 md:hidden"><div className="flex flex-col gap-4 text-sm font-medium"><a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a><a href="#workflow" onClick={() => setMenuOpen(false)}>How it works</a><Link href="/pilot">Nigeria pilot</Link><Link href="/dashboard" className="premium-button justify-center">Explore Command Center</Link></div></div>}
      </nav>

      <section className="hero-light relative overflow-hidden bg-[#06101d] px-5 pb-24 pt-36 text-white md:px-8 md:pb-36 md:pt-48">
        <div className="absolute inset-0 z-0 opacity-80 [mask-image:linear-gradient(to_bottom,black_0%,black_58%,transparent_100%)]">
          <ThreeScene />
        </div>
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_8%,rgba(110,216,224,.22),transparent_36%),linear-gradient(180deg,rgba(6,16,29,.34),rgba(245,245,247,.92)_88%)]" aria-hidden="true" />
        <LinkedSectionBackground
          {...backgroundLinks[0]}
          className="linked-hero-background"
          imageOpacity={0.56}
          overlayOpacity={0.44}
          gradientStrength={0.34}
          focalPosition="44% center"
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="mx-auto max-w-5xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-[#071522]/70 px-4 py-2 text-[11px] font-semibold text-cyan shadow-[0_0_30px_rgba(110,216,224,.18)] backdrop-blur">
              <Sparkles size={13} className="text-[#9a7422]"/> Aviation identity infrastructure
            </div>
            <h1 className="text-balance text-6xl font-semibold leading-[.94] tracking-[-.065em] text-white drop-shadow-[0_0_34px_rgba(110,216,224,.28)] sm:text-7xl md:text-[104px]">
              BAG-DNA OS<span className="align-top text-[.28em] tracking-normal">™</span>
            </h1>
            <h2 className="mx-auto mt-7 max-w-4xl text-balance text-3xl font-semibold leading-[1.08] tracking-[-.045em] text-slate-100 sm:text-4xl md:text-6xl">
              The digital identity layer for every checked bag.
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-balance text-base leading-7 text-slate-300 md:text-xl md:leading-8">
              Issue, bind, verify, track, and protect a persistent digital identity for every checked bag—from check-in to trusted passenger claim.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/tagging" className="premium-button justify-center px-6 py-3.5 text-sm">Open Tagging Station <ArrowRight size={16}/></Link>
              <Link href="/scanner" className="secondary-button justify-center px-6 py-3.5 text-sm">Run Checkpoint Scan <ChevronRight size={16}/></Link>
            </div>
          </motion.div>
          <div className="mt-20 md:mt-28"><ProductPreview/></div>
        </div>
      </section>

      <section id="platform" className="section-with-linked-background bg-white px-5 py-28 md:px-8 md:py-40">
        <LinkedSectionBackground
          {...backgroundLinks[1]}
          className="linked-platform-background"
          imageOpacity={0.46}
          overlayOpacity={0.48}
          gradientStrength={0.28}
          focalPosition="center 58%"
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div {...reveal} className="mx-auto max-w-4xl text-center">
            <p className="section-kicker">One trusted identity graph</p>
            <h2 className="section-title">Know the bag. Understand the journey.</h2>
            <p className="section-copy mx-auto">BAG-DNA OS is a Digital Baggage Identity issuance, verification, tracking, and chain-of-custody operating system—not merely an aviation dashboard.</p>
          </motion.div>
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {capabilities.map(({icon: Icon, title, text, href}, index) => (
              <motion.article {...reveal} transition={{ duration: .6, delay: index * .06 }} key={title} className="feature-card group">
                <span className="feature-icon"><Icon size={22}/></span>
                <p className="mt-12 text-xs font-semibold text-slate-500">0{index + 1}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-.03em] md:text-3xl">{title}</h3>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">{text}</p>
                <Link
                  href={href}
                  className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#805d14] opacity-70 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#805d14] group-hover:opacity-100"
                  aria-label={`Explore ${title} capability`}
                >
                  Explore capability <ArrowRight size={15} aria-hidden="true"/>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="command-section section-with-linked-background px-5 py-28 text-white md:px-8 md:py-40">
        <LinkedSectionBackground
          {...backgroundLinks[2]}
          className="linked-workflow-background"
          imageOpacity={0.52}
          overlayOpacity={0.5}
          gradientStrength={0.36}
          focalPosition="center"
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
            <div><p className="section-kicker text-cyan">Identity-first custody</p><h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-.045em] sm:text-5xl md:text-7xl">A defensible journey, from bag drop to claim.</h2></div>
            <p className="max-w-xl text-base leading-7 text-slate-300 lg:justify-self-end">Every operational event strengthens the bag’s identity. Every exception becomes visible, explainable, and actionable.</p>
          </motion.div>
          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {journey.map(([number, title, text], index) => (
              <motion.div {...reveal} transition={{ duration: .55, delay: index * .08 }} key={title} className="dark-feature-card">
                <span className="text-xs font-semibold text-cyan">{number}</span>
                <div className="mt-20 h-px bg-gradient-to-r from-cyan/60 to-transparent"/>
                <h3 className="mt-7 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-5 py-28 md:px-8 md:py-40">
        <motion.div {...reveal} className="mx-auto grid max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(15,23,42,.08)] lg:grid-cols-2">
          <div className="p-8 sm:p-12 md:p-16">
            <p className="section-kicker">Built for national-scale trust</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-.045em] md:text-6xl">Nigeria can lead the next era of baggage security.</h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600">A focused pilot creates measurable proof across high-value corridors—strengthening passenger confidence, agency coordination, and operational resilience.</p>
            <div className="mt-9 space-y-4">{["Corridor-level risk intelligence", "Airport, airline, and agency visibility", "Evidence-ready custody records"].map(x => <p key={x} className="flex items-center gap-3 text-sm font-semibold"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check size={13}/></span>{x}</p>)}</div>
            <Link href="/pilot" className="premium-button mt-10">View pilot strategy <ArrowRight size={15}/></Link>
          </div>
          <div className="pilot-visual relative min-h-[460px] overflow-hidden p-8 sm:p-12">
            <div className="absolute inset-0 opacity-70"><div className="pilot-orbit"/><div className="pilot-orbit pilot-orbit-2"/></div>
            <div className="relative flex h-full flex-col justify-between">
              <div className="self-end rounded-2xl border border-white/10 bg-white/[.08] p-4 backdrop-blur-xl"><p className="text-[10px] uppercase tracking-widest text-slate-400">Pilot readiness</p><p className="mt-2 text-2xl font-semibold text-white">Phase 01 · LOS</p></div>
              <div className="rounded-3xl border border-white/10 bg-[#071522]/80 p-6 text-white backdrop-blur-xl"><Globe2 className="text-cyan"/><p className="mt-8 text-xs uppercase tracking-widest text-slate-400">Priority corridor</p><p className="mt-2 text-2xl font-semibold">Lagos ↔ Global gateways</p><div className="mt-6 grid grid-cols-3 gap-3 text-center">{[["6", "Airlines"],["90 days", "Validation"],["4", "Agencies"]].map(([a,b])=><div key={b} className="rounded-xl bg-white/[.05] p-3"><b>{a}</b><p className="mt-1 text-[9px] text-slate-400">{b}</p></div>)}</div></div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white px-5 py-28 text-center md:px-8 md:py-40">
        <motion.div {...reveal} className="mx-auto max-w-4xl">
          <p className="section-kicker">Operational confidence, engineered</p>
          <h2 className="section-title">Every passenger has an identity. Every bag should too.</h2>
          <p className="section-copy mx-auto">Give your baggage network a secure, intelligent foundation built for the realities of modern aviation.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/dashboard" className="premium-button justify-center px-6 py-3.5">Explore Command Center <ArrowRight size={15}/></Link><Link href="/about" className="secondary-button justify-center px-6 py-3.5">Meet ETL GIS</Link></div>
        </motion.div>
      </section>

      <footer className="border-t border-black/[.06] bg-white px-5 py-10 md:px-8"><div className="landing-logo mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center"><Logo/><nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-600"><Link href="/beta">Beta readiness</Link><Link href="/integrations">API roadmap</Link><Link href="/investors">Investors</Link><Link href="/docs">Technical docs</Link><Link href="/about">ETL GIS</Link></nav><p className="text-xs text-slate-500">© 2026 ETL GIS Consulting LLC.</p></div></footer>
    </main>
  );
}
