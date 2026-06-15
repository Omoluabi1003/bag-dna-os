"use client";
import { AlertTriangle, CheckCircle2, Radio, ScanLine } from "lucide-react";
import { useState } from "react";
import { primaryDemoBag } from "@/lib/data/demoWorkflow";
import { scanBag } from "@/lib/scanner/scanEngine";
import type { CheckpointName } from "@/lib/schema/bagDnaSchema";

const checkpoints: CheckpointName[] = ["Check-in Counter","Conveyor Intake","Screening","Sorting Hub","Loading Bay","Aircraft Cargo Hold","Transfer Arrival","Arrival Scan","Belt Assignment","Passenger Claim"];
export function CheckpointScanner() {
  const [checkpoint, setCheckpoint] = useState<CheckpointName>("Screening");
  const [credential, setCredential] = useState(primaryDemoBag.rfid.uid);
  const [result, setResult] = useState<ReturnType<typeof scanBag> | null>(null);
  const run = () => setResult(scanBag(primaryDemoBag, { credential, checkpoint, weightKg: primaryDemoBag.physicalProfile.weightKg, sealStatus: "intact", visualProfile: primaryDemoBag.physicalProfile, actor: { id:"SEC-204", name:"A. Okon", role:"Checkpoint operator", assignedZone:checkpoint, actualZone:checkpoint }, device:"BAG-DNA MultiSensor V3" }));
  return <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
    <section className="glass p-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan/10 text-cyan"><ScanLine/></span><div><p className="text-[10px] uppercase tracking-widest text-gold">Live checkpoint</p><h2 className="text-lg font-semibold">Scan credential</h2></div></div>
      <label className="mt-6 block text-[11px] text-mist">Checkpoint<select value={checkpoint} onChange={(e)=>setCheckpoint(e.target.value as CheckpointName)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b2134] p-3 text-sm text-white">{checkpoints.map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="mt-4 block text-[11px] text-mist">RFID / NFC / rotating QR<input value={credential} onChange={(e)=>setCredential(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b2134] p-3 font-mono text-xs text-white"/></label>
      <div className="mt-4 grid grid-cols-3 gap-2">{[["RFID",primaryDemoBag.rfid.uid],["NFC",primaryDemoBag.nfc.uid],["QR",primaryDemoBag.qr.payload]].map(([a,b])=><button key={a} onClick={()=>setCredential(b)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-[10px] font-bold text-mist hover:text-white">{a}</button>)}</div>
      <button onClick={run} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan p-3.5 text-xs font-black text-ink"><Radio size={15}/> Run multisensor verification</button>
    </section>
    <section className="glass p-6">{!result?<div className="grid min-h-80 place-items-center text-center"><div><span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-cyan/20 bg-cyan/5 text-cyan"><Radio size={32}/></span><h2 className="mt-5 text-xl font-semibold">Scanner armed</h2><p className="mt-2 text-xs text-mist">Present an RFID, NFC, or rotating QR credential.</p></div></div>:<div><div className={`flex items-center gap-3 rounded-2xl border p-4 ${result.verified?"border-emerald-400/30 bg-emerald-400/10":"border-red-400/30 bg-red-400/10"}`}>{result.verified?<CheckCircle2 className="text-emerald-300"/>:<AlertTriangle className="text-red-300"/>}<div><b>{result.verified?"Identity verified":"Mismatch detected"}</b><p className="text-[10px] text-mist">Custody confidence {result.confidence}%</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{[["RFID match",result.rfidMatch],["NFC match",result.nfcMatch],["QR validation",result.qrValid],["Weight match",result.weightMatch],["Visual fingerprint",`${result.visualMatch}%`],["Seal integrity",result.sealMatch]].map(([label,value])=><div key={String(label)} className="flex justify-between rounded-xl border border-white/[.07] bg-white/[.03] p-3 text-xs"><span className="text-mist">{label}</span><b className={value===false?"text-red-300":"text-emerald-300"}>{typeof value==="boolean"?(value?"PASS":"FAIL"):value}</b></div>)}</div>{result.alerts.length>0&&<div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-xs text-red-200">{result.alerts.join(" · ")}</div>}</div>}</section>
  </div>;
}

