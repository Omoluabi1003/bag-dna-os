import Link from "next/link";
import { ArrowRight, BarChart3, Globe2, Layers3, Rocket, ShieldCheck, Target } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, SectionHeading } from "@/components/ui";

const thesis = [
  [Target,"Problem","Baggage identity and custody are fragmented across paper tags, siloed systems, physical handoffs, and weak passenger evidence."],
  [Rocket,"Why now","Computer vision, low-cost identity hardware, modern GIS, and regulatory demand make an identity-first operating layer practical."],
  [Globe2,"Market","Airports, airlines, handlers, customs, security agencies, insurers, and passengers share the cost of baggage uncertainty."],
  [Layers3,"Product wedge","Begin with high-value identity, custody, exception, and claim evidence across a controlled Nigeria corridor pilot."],
  [ShieldCheck,"Pilot strategy","Prove fewer custody blind spots, faster exception investigation, stronger claims evidence, and reusable integration patterns."],
  [BarChart3,"Revenue model","Annual platform licensing, airport deployment services, airline and agency modules, managed GIS, and hardware-enabled identity programs."],
] as const;

export default function InvestorsPage() {
  return <AppShell title="Investor Readiness" eyebrow="ETL GIS Consulting LLC · BAG-DNA OS">
    <div className="max-w-5xl"><Badge tone="cyan">Aviation identity infrastructure</Badge><h2 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-.055em] md:text-7xl">Turn baggage uncertainty into operational trust.</h2><p className="mt-6 max-w-3xl text-base leading-8 text-mist">BAG-DNA OS is the identity, evidence, and geospatial intelligence layer for checked baggage—starting with a credible Nigeria aviation wedge and expanding into global airport infrastructure.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/pilot" className="rounded-full bg-gold px-5 py-3 text-xs font-bold text-ink">Review pilot strategy</Link><Link href="/integrations" className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold text-ivory">Explore API roadmap</Link></div></div>
    <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{thesis.map(([Icon,title,text])=><article className="glass p-6" key={title}><Icon size={20} className="text-cyan"/><h3 className="mt-7 text-xl font-semibold">{title}</h3><p className="mt-3 text-xs leading-6 text-mist">{text}</p></article>)}</div>
    <section className="glass mt-8 p-6"><SectionHeading eyebrow="Expansion path" title="Land with evidence. Expand with infrastructure."/><div className="grid gap-5 md:grid-cols-4">{[["Nigeria pilot","LOS and ABV operational proof across domestic and international corridors."],["Airport network","Replicable identity and intelligence patterns across Nigerian gateways."],["Airline adoption","Shared custody evidence across stations, partners, and claims teams."],["Global trust layer","Interoperable baggage identity and risk intelligence across borders."]].map(([title,text],i)=><div key={title}><span className="text-xs font-bold text-gold">0{i+1}</span><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-2 text-[11px] leading-5 text-mist">{text}</p></div>)}</div></section>
    <section className="glass mt-8 p-6"><SectionHeading eyebrow="Beta-to-enterprise roadmap" title="Capital turns a working wedge into governed infrastructure"/><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[.06] p-5"><h3 className="font-semibold">Beta-safe now</h3><p className="mt-2 text-xs leading-6 text-mist">Vercel deployment, static demo, mock-safe public API adapters, local geospatial layers, operational dashboards, identity records, evidence concepts, and pilot narratives.</p></div><div className="rounded-2xl border border-gold/20 bg-gold/[.06] p-5"><h3 className="font-semibold">Enterprise investment</h3><p className="mt-2 text-xs leading-6 text-mist">Security architecture, governed data, live airline and airport interfaces, certified identity hardware, computer-vision validation, regulatory alignment, and measured pilot outcomes.</p></div></div><Link href="/beta" className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-cyan">Open beta readiness center <ArrowRight size={14}/></Link></section>
  </AppShell>;
}
