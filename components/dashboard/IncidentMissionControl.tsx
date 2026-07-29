"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight, CircleDot, Clock3, FileJson2, Fingerprint, Gauge, LockKeyhole, MapPin, Plane, Radio, Search, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";

const steps = ["Network", "Flight", "Anomaly", "Investigation", "Resolution", "Evidence"];
const flights = [
  { code: "BDO 2174", route: "MIA → ATL", gate: "D32", time: "18:40", status: "Boarding", bags: "142 / 148", risk: "1 open" },
  { code: "BDO 804", route: "FLL → ATL", gate: "E7", time: "19:05", status: "Loading", bags: "96 / 101", risk: "Nominal" },
  { code: "BDO 551", route: "MIA → JFK", gate: "D18", time: "19:20", status: "Reconcile", bags: "117 / 119", risk: "2 review" },
];
const events = [
  { time: "16:58:12", place: "MIA · Check-in", label: "Identity issued", detail: "Passenger reference and physical bag profile bound", state: "verified" },
  { time: "17:06:44", place: "MIA · Screening", label: "Security cleared", detail: "Seal S-884192 applied and screening evidence attached", state: "verified" },
  { time: "17:19:03", place: "MIA · Sortation", label: "Custody transferred", detail: "Handler H-204 accepted bag into outbound make-up area", state: "verified" },
  { time: "17:42:51", place: "MIA · Gate D32", label: "Loaded to flight", detail: "Load event matched BDO 2174 container ULD-43A", state: "verified" },
  { time: "19:31:08", place: "ATL · Arrival", label: "Expected scan missing", detail: "No authorized arrival event inside the transfer window", state: "critical" },
  { time: "19:37:26", place: "ATL · Zone T4", label: "Untrusted duplicate scan", detail: "Device D-991 not assigned to the active custody team", state: "warning" },
];
const evidence = [
  ["Identity", "Bag DNA profile matched", "99.2%"],
  ["Route", "MIA–ATL assignment consistent", "Verified"],
  ["Custody", "One expected event missing", "Gap"],
  ["Seal", "S-884192 status unresolved", "Inspect"],
  ["Device", "D-991 outside assignment", "Mismatch"],
  ["Ledger", "4 of 6 events hash-verified", "Partial"],
];

export function IncidentMissionControl() {
  const [step, setStep] = useState(2);
  const [decision, setDecision] = useState("Hold bag");
  const [resolved, setResolved] = useState(false);
  const selected = flights[0];
  const completion = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  function advance() {
    setStep((current) => Math.min(steps.length - 1, current + 1));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06101a] shadow-[0_28px_90px_rgba(0,0,0,.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#091724] px-4 py-3">
        <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/10"><Radio size={16} className="text-cyan"/></span><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-cyan">Incident command · Demo corridor</p><p className="mt-0.5 text-xs font-semibold text-white">MIA → ATL · Case INC-ATL-0047</p></div></div>
        <div className="flex items-center gap-2 text-[10px]"><span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 font-bold text-amber-200">ACTIVE INVESTIGATION</span><span className="rounded-md border border-white/10 px-2 py-1 text-slate-300">DEMO DATA</span><span className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-slate-300"><Clock3 size={11}/> 19:39 UTC</span></div>
      </div>

      <div className="grid border-b border-white/10 bg-[#07131f] lg:grid-cols-[260px_1fr_300px]">
        <aside className="border-r border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-[10px] text-slate-400"><Search size={13}/><span>Search bag, flight, event</span></div>
          <p className="mt-4 px-1 text-[9px] font-bold uppercase tracking-[.14em] text-slate-500">Active flights</p>
          <div className="mt-2 space-y-2">{flights.map((flight, index) => <button key={flight.code} className={`w-full rounded-xl border p-3 text-left transition ${index === 0 ? "border-cyan/30 bg-cyan/[.08]" : "border-white/[.07] bg-white/[.02] hover:bg-white/[.04]"}`}><div className="flex items-center justify-between"><b className="text-xs text-white">{flight.code}</b><span className={`text-[8px] font-bold ${flight.risk === "Nominal" ? "text-emerald-300" : "text-amber-300"}`}>{flight.risk}</span></div><p className="mt-1 text-[10px] text-slate-300">{flight.route} · Gate {flight.gate}</p><div className="mt-3 flex justify-between text-[9px] text-slate-500"><span>{flight.status}</span><span>{flight.bags}</span></div></button>)}</div>
        </aside>

        <main className="min-w-0 p-4 lg:p-5">
          <div className="grid gap-3 border-b border-white/10 pb-4 sm:grid-cols-4"><div><p className="text-[8px] uppercase tracking-wider text-slate-500">Flight</p><b className="mt-1 block text-lg text-white">{selected.code}</b><p className="text-[10px] text-cyan">{selected.route}</p></div><div><p className="text-[8px] uppercase tracking-wider text-slate-500">Departure</p><b className="mt-1 block text-lg text-white">{selected.time}</b><p className="text-[10px] text-slate-400">Gate {selected.gate}</p></div><div><p className="text-[8px] uppercase tracking-wider text-slate-500">Load state</p><b className="mt-1 block text-lg text-white">96%</b><p className="text-[10px] text-slate-400">142 of 148 reconciled</p></div><div><p className="text-[8px] uppercase tracking-wider text-slate-500">Operational state</p><b className="mt-1 block text-lg text-amber-300">Hold transfer</b><p className="text-[10px] text-slate-400">1 critical exception</p></div></div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
            <section className="rounded-xl border border-white/10 bg-[#081724]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-cyan">Selected bag investigation</p><h2 className="mt-1 text-lg font-semibold text-white">BDO-MIA-2026-000184</h2></div><span className="rounded-md border border-red-400/20 bg-red-400/10 px-2 py-1 text-[9px] font-bold text-red-200">HIGH RISK · 87</span></div>
              <div className="grid gap-px bg-white/[.07] sm:grid-cols-3">{[["Passenger ref","PAX-•••-4821"],["Seal","S-884192"],["Current zone","ATL · T4"],["Last handler","H-204"],["Identity","99.2%"],["Chain state","DISPUTED"]].map(([a,b]) => <div key={a} className="bg-[#081724] p-3"><p className="text-[8px] uppercase text-slate-500">{a}</p><b className="mt-1 block text-[11px] text-white">{b}</b></div>)}</div>
              <div className="p-4"><p className="text-[9px] font-bold uppercase tracking-[.13em] text-slate-500">Custody event sequence</p><div className="mt-3 space-y-1">{events.map((event, index) => <button key={event.time} onClick={() => setStep(Math.min(4, index < 4 ? 2 : 3))} className={`grid w-full grid-cols-[62px_18px_1fr] gap-2 rounded-lg p-2 text-left transition hover:bg-white/[.04] ${event.state === "critical" ? "bg-red-400/[.06]" : event.state === "warning" ? "bg-amber-400/[.05]" : ""}`}><span className="font-mono text-[9px] text-slate-500">{event.time}</span><span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full ${event.state === "verified" ? "bg-emerald-400/15 text-emerald-300" : event.state === "critical" ? "bg-red-400/15 text-red-300" : "bg-amber-400/15 text-amber-300"}`}>{event.state === "verified" ? <CheckCircle2 size={11}/> : <AlertTriangle size={11}/>}</span><span><span className="flex flex-wrap items-center gap-2"><b className="text-[11px] text-white">{event.label}</b><span className="text-[8px] text-cyan">{event.place}</span></span><span className="mt-0.5 block text-[9px] leading-4 text-slate-400">{event.detail}</span></span></button>)}</div></div>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#081724] p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-cyan">Decision support</p><h3 className="mt-1 text-base font-semibold text-white">Why this bag was stopped</h3></div><ShieldAlert size={20} className="text-amber-300"/></div><div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/[.06] p-3"><p className="text-[10px] font-semibold text-amber-100">Missing arrival scan followed by an untrusted device event in transfer zone T4.</p><p className="mt-2 text-[9px] leading-4 text-amber-100/60">The identity remains strong, but custody continuity and seal status require physical confirmation before release.</p></div><div className="mt-4 space-y-2">{evidence.map(([label,value,state]) => <div key={label} className="grid grid-cols-[70px_1fr_auto] items-center gap-2 border-b border-white/[.06] pb-2 text-[9px]"><span className="text-slate-500">{label}</span><span className="text-slate-200">{value}</span><b className={state === "Gap" || state === "Mismatch" || state === "Inspect" ? "text-amber-300" : "text-emerald-300"}>{state}</b></div>)}</div><p className="mt-4 text-[9px] font-bold uppercase tracking-[.13em] text-slate-500">Operator decision</p><div className="mt-2 grid grid-cols-2 gap-2">{["Hold bag","Inspect seal","Verify handler","Escalate security"].map((action) => <button key={action} onClick={() => setDecision(action)} className={`rounded-lg border px-3 py-2 text-[10px] font-semibold ${decision === action ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[.025] text-slate-300 hover:bg-white/[.05]"}`}>{action}</button>)}</div><button onClick={() => { setResolved(true); setStep(4); }} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-3 py-2.5 text-[10px] font-bold text-[#07111b]"><LockKeyhole size={13}/>{resolved ? "Decision recorded" : `Record decision: ${decision}`}</button></section>
          </div>
        </main>

        <aside className="border-l border-white/10 bg-[#07131f] p-4"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-cyan">Presenter workflow</p><div className="mt-3 space-y-1">{steps.map((label,index) => <button key={label} onClick={() => setStep(index)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${step === index ? "bg-cyan/10 text-white" : "text-slate-500 hover:bg-white/[.03]"}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold ${index <= step ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10"}`}>{index + 1}</span><span className="text-[10px] font-semibold">{label}</span>{step === index && <ChevronRight size={12} className="ml-auto text-cyan"/>}</button>)}</div><div className="mt-5 rounded-xl border border-white/10 bg-white/[.025] p-3"><div className="flex items-center justify-between text-[9px]"><span className="text-slate-500">Scenario progress</span><b className="text-cyan">{completion}%</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan transition-all" style={{width:`${completion}%`}}/></div><p className="mt-3 text-[9px] leading-4 text-slate-400">{step < 2 ? "Establish the corridor and select BDO 2174." : step === 2 ? "Reveal the missing arrival event and unauthorized duplicate scan." : step === 3 ? "Inspect identity, seal, handler, device and ledger evidence." : step === 4 ? "Record a controlled operational decision." : "Generate the defensible evidence package."}</p><button onClick={advance} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan/30 bg-cyan/[.08] px-3 py-2 text-[10px] font-bold text-cyan">Next presentation step <ChevronRight size={12}/></button></div>
          <div className="mt-4 rounded-xl border border-white/10 p-3"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-500">Evidence package</p><div className="mt-3 space-y-2 text-[9px] text-slate-300"><p className="flex items-center gap-2"><Fingerprint size={12} className="text-cyan"/> Identity profile</p><p className="flex items-center gap-2"><MapPin size={12} className="text-cyan"/> Journey reconstruction</p><p className="flex items-center gap-2"><ShieldCheck size={12} className="text-cyan"/> Hash verification</p><p className="flex items-center gap-2"><UserCheck size={12} className="text-cyan"/> Operator decision</p></div><button onClick={() => setStep(5)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-3 py-2 text-[10px] font-semibold text-white"><FileJson2 size={13}/> Generate case record</button></div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#091724] px-4 py-2 text-[9px] text-slate-500"><span className="flex items-center gap-2"><CircleDot size={10} className="text-emerald-300"/> Public aviation context available · baggage workflow is controlled demo data</span><span className="flex items-center gap-3"><span className="flex items-center gap-1"><Plane size={10}/> BDO 2174</span><span className="flex items-center gap-1"><Gauge size={10}/> Risk 87</span><span className="flex items-center gap-1"><ShieldCheck size={10}/> Ledger partial</span></span></div>
    </div>
  );
}
