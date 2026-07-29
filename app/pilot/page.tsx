import { FileCheck2, Globe2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shell";
import { Badge, Progress, SectionHeading } from "@/components/ui";

const phases = [
  ["01", "Controlled airport demonstration", "Validate identity enrollment, visual fingerprinting, custody scans, and command workflows in one bounded international terminal."],
  ["02", "Airline integration", "Connect departure control, baggage reconciliation, and operational event streams with a participating carrier."],
  ["03", "Authority and border integration", "Establish governed access, evidence exchange, intervention protocols, and accountable human oversight."],
  ["04", "Multi-airport corridor deployment", "Operate end-to-end across selected origin, transfer, and destination airports."],
  ["05", "International standards review", "Translate pilot evidence into interoperable operating, data, security, and governance standards."],
];

const stakeholders = ["ICAO review pathway", "IATA", "ACI", "Airport authorities", "Airlines", "Customs", "Border agencies", "Aviation security agencies", "Insurance companies", "Passengers", "Technology providers"];

const alignment = [
  ["Annex 17 security objectives", 88, "Identity assurance, screening evidence, custody integrity, anomaly escalation, and controlled intervention."],
  ["Annex 9 facilitation principles", 84, "Interoperable processing, accountable information exchange, passenger protection, and operational continuity."],
  ["Governance and audit evidence", 91, "Privacy controls, role-based access, human oversight, event traceability, and verifiable evidence export."],
];

export default function PilotPage() {
  return <AppShell title="Pilot Control Workspace" eyebrow="MIA → FLL → ATL controlled demonstration">
    <section className="glass p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <Badge tone="gold"><Globe2 size={12}/> International review posture</Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">Controlled corridor pilot workspace.</h2>
          <p className="mt-5 text-sm leading-7 text-mist">BAG-DNA OS is structured to present measurable security, facilitation, interoperability, and governance evidence to aviation authorities and international standards stakeholders.</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[.07] p-5 text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Review package</p>
          <p className="mt-2 text-2xl font-semibold">Design ready</p>
          <p className="mt-1 text-[11px] text-mist">Standards mapping · pilot controls · evidence plan</p>
        </div>
      </div>
    </section>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <section className="glass p-6">
        <SectionHeading eyebrow="Evidence-led scale" title="Five-phase deployment pathway"/>
        <div className="space-y-3">{phases.map(([n,title,text],i)=><div className="grid grid-cols-[42px_1fr_auto] gap-4 rounded-2xl border border-white/[.08] bg-white/[.02] p-4" key={n}><span className="font-display text-2xl text-gold">{n}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-[11px] leading-5 text-mist">{text}</p></div><Badge tone={i===0?"emerald":i===4?"gold":"slate"}>{i===0?"Ready":i===4?"Review":"Credential required"}</Badge></div>)}</div>
      </section>
      <div className="space-y-6">
        <section className="glass p-5">
          <SectionHeading eyebrow="Coalition design" title="Stakeholder review matrix"/>
          <div className="flex flex-wrap gap-2">{stakeholders.map(x=><Badge key={x} tone={x.includes("ICAO")?"gold":"slate"}>{x}</Badge>)}</div>
        </section>
        <section className="glass p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gold">Pilot success criteria</p>
          <div className="mt-4 space-y-3">{[["Identity match rate","≥ 99.5%"],["Custody event coverage","≥ 98%"],["Exception response time","< 4 min"],["Passenger confidence","≥ 90 NPS"],["Evidence export","100% verifiable"]].map(([a,b])=><div className="flex justify-between border-b border-white/[.06] pb-3 text-[11px]" key={a}><span className="text-mist">{a}</span><b>{b}</b></div>)}</div>
        </section>
      </div>
    </div>

    <section className="glass mt-6 p-6 md:p-8">
      <SectionHeading eyebrow="ICAO standards alignment" title="Review-ready control mapping" action={<Badge tone="emerald"><FileCheck2 size={12}/> Evidence mapped</Badge>}/>
      <div className="grid gap-4 lg:grid-cols-3">{alignment.map(([title,value,text])=><article key={String(title)} className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-center justify-between"><ShieldCheck size={18} className="text-cyan"/><b className="text-emerald-300">{value}%</b></div><h3 className="mt-5 text-sm font-semibold">{String(title)}</h3><p className="mt-2 min-h-16 text-[11px] leading-5 text-mist">{String(text)}</p><div className="mt-4"><Progress value={Number(value)} tone={Number(value)>89?"emerald":"gold"}/></div></article>)}</div>
      <p className="mt-6 rounded-2xl border border-gold/20 bg-gold/[.05] p-4 text-[11px] leading-5 text-mist"><b className="text-gold">Status note:</b> ICAO alignment describes the platform’s design intent and standards-mapping posture. It does not represent ICAO approval, certification, adoption, or endorsement.</p>
    </section>
  <section className="glass mt-6 p-6"><SectionHeading eyebrow="Controlled corridor readiness" title="MIA → FLL → ATL pilot control"/><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["Integration readiness",62],["Security readiness",88],["Operational readiness",74],["Data governance",82]].map(([label,value])=><article key={String(label)} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between text-xs"><b>{label}</b><span className="text-cyan">{value}%</span></div><div className="mt-3"><Progress value={Number(value)} tone={Number(value)>80?"emerald":"gold"}/></div></article>)}</div><div className="mt-5 grid gap-4 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 p-5"><h3 className="font-semibold">Risks and mitigations</h3><ul className="mt-3 space-y-2 text-xs text-mist"><li>• Airline messages unavailable → use governed synthetic test fixtures.</li><li>• Public feed rate limits → preserve degraded mode and manual retry.</li><li>• Operational adoption → shadow-mode training before controlled scans.</li></ul></article><article className="rounded-2xl border border-white/10 p-5"><h3 className="font-semibold">Participation boundary</h3><p className="mt-3 text-xs leading-6 text-mist">Airports shown define a proposed demonstration corridor only. BAG-DNA OS does not claim confirmed airport participation. Production integrations require stakeholder authorization.</p></article></div></section></AppShell>;
}
