"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FileDown,
  Fingerprint,
  LockKeyhole,
  MapPin,
  Plane,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const flights = [
  { code: "BDO 2174", route: "MIA–ATL", gate: "D32", time: "18:40", bags: "142/148", state: "HOLD", alert: true },
  { code: "BDO 804", route: "FLL–ATL", gate: "E07", time: "19:05", bags: "96/101", state: "LOAD", alert: false },
  { code: "BDO 551", route: "MIA–JFK", gate: "D18", time: "19:20", bags: "117/119", state: "RECON", alert: true },
];

const incidents = [
  { id: "INC-ATL-0047", bag: "BDO-MIA-2026-000184", type: "Custody break", severity: "CRITICAL", time: "19:37" },
  { id: "INC-MIA-0042", bag: "BDO-MIA-2026-000098", type: "Seal mismatch", severity: "HIGH", time: "19:22" },
  { id: "INC-FLL-0038", bag: "BDO-FLL-2026-000441", type: "Late transfer", severity: "MEDIUM", time: "19:11" },
];

const events = [
  ["16:58:12", "MIA CHECK-IN", "Identity issued", "VERIFIED"],
  ["17:06:44", "MIA SCREENING", "Security cleared · seal S-884192 applied", "VERIFIED"],
  ["17:19:03", "MIA SORTATION", "Custody accepted by handler H-204", "VERIFIED"],
  ["17:42:51", "MIA GATE D32", "Loaded to ULD-43A · BDO 2174", "VERIFIED"],
  ["19:31:08", "ATL ARRIVAL", "Expected arrival scan missing", "CRITICAL"],
  ["19:37:26", "ATL ZONE T4", "Duplicate scan from unassigned device D-991", "UNTRUSTED"],
];

const evidence = [
  ["Identity profile", "99.2% match", "PASS"],
  ["Flight assignment", "MIA–ATL · BDO 2174", "PASS"],
  ["Custody continuity", "Arrival event absent", "FAIL"],
  ["Seal state", "Physical confirmation required", "REVIEW"],
  ["Scanner authorization", "D-991 not assigned", "FAIL"],
  ["Ledger integrity", "4/6 events verified", "PARTIAL"],
];

export function IncidentMissionControl() {
  const [decision, setDecision] = useState("HOLD BAG");
  const [recorded, setRecorded] = useState(false);

  return (
    <div className="h-screen min-h-[720px] overflow-hidden bg-[#03080d] text-slate-200">
      <header className="grid h-12 grid-cols-[220px_1fr_auto] items-center border-b border-white/10 bg-[#07111a] text-[10px]">
        <div className="flex h-full items-center gap-2 border-r border-white/10 px-3">
          <span className="grid h-7 w-7 place-items-center border border-cyan/30 bg-cyan/10"><Radio size={14} className="text-cyan" /></span>
          <div><b className="block tracking-[.16em] text-white">BAG-DNA OS</b><span className="text-[8px] text-slate-500">MISSION CONTROL</span></div>
        </div>
        <div className="flex h-full items-center gap-5 overflow-hidden px-4 font-mono">
          <span className="text-cyan">MIA–ATL CORRIDOR</span>
          <span>UTC 19:39:42</span>
          <span className="flex items-center gap-1 text-emerald-300"><CircleDot size={10} /> NETWORK NOMINAL</span>
          <span className="text-amber-300">1 CRITICAL EXCEPTION</span>
        </div>
        <div className="flex h-full items-center border-l border-white/10 px-3"><span className="border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-bold text-amber-200">DEMO ENVIRONMENT</span></div>
      </header>

      <div className="grid h-[calc(100vh-48px)] min-h-[672px] grid-cols-[52px_248px_minmax(520px,1fr)_330px] grid-rows-[72px_minmax(0,1fr)_190px]">
        <nav className="row-span-3 flex flex-col items-center border-r border-white/10 bg-[#050c13] py-3">
          {[Radio, Plane, ShieldAlert, Fingerprint, Archive].map((Icon, index) => (
            <button key={index} className={`mb-2 grid h-9 w-9 place-items-center border ${index === 0 ? "border-cyan/30 bg-cyan/10 text-cyan" : "border-transparent text-slate-600 hover:border-white/10 hover:text-slate-300"}`}><Icon size={16} /></button>
          ))}
          <div className="mt-auto text-[8px] font-bold [writing-mode:vertical-rl] rotate-180 tracking-[.22em] text-slate-700">AUTHORIZED DEMONSTRATION</div>
        </nav>

        <section className="col-span-3 border-b border-white/10 bg-[#08131d]">
          <div className="grid h-full grid-cols-3 divide-x divide-white/10">
            {flights.map((flight, index) => (
              <button key={flight.code} className={`grid grid-cols-[1fr_auto] items-center px-4 text-left ${index === 0 ? "bg-cyan/[.07] shadow-[inset_0_-2px_0_#22d3ee]" : "hover:bg-white/[.025]"}`}>
                <div><div className="flex items-center gap-2"><b className="font-mono text-sm text-white">{flight.code}</b><span className="text-[9px] text-cyan">{flight.route}</span></div><div className="mt-2 flex gap-4 text-[9px] text-slate-500"><span>GATE {flight.gate}</span><span>STD {flight.time}</span><span>BAGS {flight.bags}</span></div></div>
                <span className={`font-mono text-[9px] font-bold ${flight.alert ? "text-amber-300" : "text-emerald-300"}`}>{flight.state}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="row-span-2 border-r border-white/10 bg-[#06101a]">
          <div className="flex h-11 items-center gap-2 border-b border-white/10 px-3 text-[10px] text-slate-500"><Search size={13} /><span>Search incident or bag</span></div>
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[9px]"><b className="tracking-[.14em] text-slate-400">INCIDENT QUEUE</b><span className="text-amber-300">03 OPEN</span></div>
          {incidents.map((incident, index) => (
            <button key={incident.id} className={`w-full border-b border-white/[.07] px-3 py-3 text-left ${index === 0 ? "bg-red-400/[.07] shadow-[inset_3px_0_0_#f87171]" : "hover:bg-white/[.025]"}`}>
              <div className="flex items-center justify-between font-mono text-[9px]"><span className="text-slate-500">{incident.id}</span><span className={index === 0 ? "text-red-300" : "text-amber-300"}>{incident.severity}</span></div>
              <b className="mt-2 block text-[11px] text-white">{incident.type}</b>
              <p className="mt-1 truncate font-mono text-[9px] text-slate-500">{incident.bag}</p>
              <p className="mt-2 text-right font-mono text-[8px] text-slate-600">{incident.time} UTC</p>
            </button>
          ))}
        </aside>

        <main className="min-w-0 overflow-hidden bg-[#040b12]">
          <div className="grid h-full grid-rows-[46px_92px_minmax(0,1fr)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-3"><AlertTriangle size={15} className="text-red-300" /><b className="font-mono text-xs text-white">INC-ATL-0047</b><span className="text-[9px] text-slate-500">SELECTED BAG INVESTIGATION</span></div>
              <span className="border border-red-400/30 bg-red-400/10 px-2 py-1 font-mono text-[9px] font-bold text-red-200">RISK 87 · HOLD</span>
            </div>
            <div className="grid grid-cols-6 divide-x divide-white/10 border-b border-white/10 bg-[#07111a]">
              {[["BAG ID","BDO-MIA-2026-000184"],["PAX REF","PAX-•••-4821"],["SEAL","S-884192"],["LAST HANDLER","H-204"],["CURRENT ZONE","ATL · T4"],["CHAIN STATE","DISPUTED"]].map(([label,value]) => <div key={label} className="min-w-0 px-3 py-4"><p className="text-[8px] tracking-[.12em] text-slate-600">{label}</p><b className="mt-2 block truncate font-mono text-[10px] text-white">{value}</b></div>)}
            </div>
            <div className="overflow-auto">
              <table className="w-full border-collapse text-left font-mono text-[9px]">
                <thead className="sticky top-0 bg-[#09141e] text-slate-500"><tr>{["TIME","LOCATION","EVENT","SOURCE","STATUS"].map((h) => <th key={h} className="border-b border-white/10 px-3 py-2 font-medium">{h}</th>)}</tr></thead>
                <tbody>{events.map((event, index) => <tr key={event[0]} className={index === 4 ? "bg-red-400/[.08]" : index === 5 ? "bg-amber-400/[.06]" : "hover:bg-white/[.02]"}><td className="border-b border-white/[.06] px-3 py-3 text-slate-500">{event[0]}</td><td className="border-b border-white/[.06] px-3 py-3 text-cyan">{event[1]}</td><td className="border-b border-white/[.06] px-3 py-3 text-slate-200">{event[2]}</td><td className="border-b border-white/[.06] px-3 py-3 text-slate-500">{index < 4 ? "AUTHORIZED" : index === 4 ? "EXPECTED" : "D-991"}</td><td className={`border-b border-white/[.06] px-3 py-3 font-bold ${event[3] === "VERIFIED" ? "text-emerald-300" : event[3] === "CRITICAL" ? "text-red-300" : "text-amber-300"}`}>{event[3]}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </main>

        <aside className="row-span-2 border-l border-white/10 bg-[#06101a]">
          <div className="flex h-11 items-center justify-between border-b border-white/10 px-3"><b className="text-[9px] tracking-[.14em] text-slate-400">DECISION SUPPORT</b><ShieldAlert size={15} className="text-amber-300" /></div>
          <div className="border-b border-amber-400/20 bg-amber-400/[.06] p-3 text-[10px] leading-5 text-amber-100">Missing arrival scan followed by a scan from an unassigned device in transfer zone T4.</div>
          <div className="p-3">
            {evidence.map(([label,value,status]) => <div key={label} className="grid grid-cols-[1fr_auto] gap-2 border-b border-white/[.07] py-2 text-[9px]"><div><span className="block text-slate-500">{label}</span><b className="mt-1 block text-slate-200">{value}</b></div><span className={`self-center font-mono font-bold ${status === "PASS" ? "text-emerald-300" : status === "FAIL" ? "text-red-300" : "text-amber-300"}`}>{status}</span></div>)}
            <p className="mt-4 text-[8px] font-bold tracking-[.14em] text-slate-500">OPERATOR ACTION</p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">{["HOLD BAG","INSPECT SEAL","VERIFY HANDLER","ESCALATE"].map((action) => <button key={action} onClick={() => { setDecision(action); setRecorded(false); }} className={`border px-2 py-2 text-[9px] font-bold ${decision === action ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/10 bg-white/[.02] text-slate-400 hover:bg-white/[.05]"}`}>{action}</button>)}</div>
            <button onClick={() => setRecorded(true)} className="mt-2 flex w-full items-center justify-center gap-2 border border-amber-300 bg-amber-300 px-3 py-2.5 text-[9px] font-black text-[#06101a]"><LockKeyhole size={12} />{recorded ? "DECISION RECORDED" : `RECORD: ${decision}`}</button>
            <button className="mt-2 flex w-full items-center justify-center gap-2 border border-white/10 px-3 py-2 text-[9px] font-bold text-slate-300 hover:bg-white/[.04]"><FileDown size={12} />GENERATE EVIDENCE PACKAGE</button>
          </div>
        </aside>

        <section className="col-span-2 border-t border-white/10 bg-[#07111a]">
          <div className="flex h-9 items-center justify-between border-b border-white/10 px-3 text-[9px]"><b className="tracking-[.14em] text-slate-400">CHAIN RECONSTRUCTION</b><span className="font-mono text-red-300">1 MISSING EVENT · 1 UNTRUSTED EVENT</span></div>
          <div className="grid h-[151px] grid-cols-6 divide-x divide-white/10">
            {events.map((event, index) => <div key={event[0]} className={`relative p-3 ${index === 4 ? "bg-red-400/[.06]" : index === 5 ? "bg-amber-400/[.05]" : ""}`}><div className={`mb-3 h-1 ${index < 4 ? "bg-emerald-400" : index === 4 ? "bg-red-400" : "bg-amber-400"}`} /><div className="flex items-center gap-2">{index < 4 ? <CheckCircle2 size={12} className="text-emerald-300" /> : <AlertTriangle size={12} className={index === 4 ? "text-red-300" : "text-amber-300"} />}<b className="font-mono text-[9px] text-white">{event[1]}</b></div><p className="mt-3 text-[8px] leading-4 text-slate-500">{event[2]}</p><p className="absolute bottom-2 font-mono text-[8px] text-slate-700">{event[0]}</p>{index < events.length - 1 && <ChevronRight size={12} className="absolute -right-2 top-[72px] z-10 text-slate-600" />}</div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
