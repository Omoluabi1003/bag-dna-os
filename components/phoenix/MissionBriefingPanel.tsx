import { AlertTriangle, BrainCircuit, CheckCircle2, ChevronRight, FileWarning, ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { MissionBriefing } from "@/types/phoenix";

export function MissionBriefingPanel({briefing,onEvidence}:{briefing:MissionBriefing;onEvidence:()=>void}) {
 return <aside className="briefing-panel"><header><span><BrainCircuit/> DETERMINISTIC MISSION BRIEF</span><b>{briefing.confidence}% confidence</b></header>
  <section className="brief-situation"><small>CURRENT SITUATION</small><p>{briefing.situation}</p></section>
  <section className="brief-alert"><ShieldAlert/><div><small>PRIMARY ANOMALY · HIGH</small><b>{briefing.anomaly}</b></div></section>
  <section><h3>Evidence supporting assessment</h3><div className="evidence-list">{briefing.evidence.map(e=><button key={e.id} onClick={onEvidence}><span className={e.state}>{e.state==="verified"?<CheckCircle2/>:<AlertTriangle/>}</span><span><b>{e.id} · {e.label}</b><small>{e.detail}</small></span><ChevronRight/></button>)}</div></section>
  <section className="impact"><small>POTENTIAL IMPACT</small><p>{briefing.impact}</p></section>
  <section className="recommendation"><span><FileWarning/> RECOMMENDED ACTION</span><p>{briefing.action}</p><ul>{briefing.reasons.map(r=><li key={r}>{r}</li>)}</ul></section>
  <Link href="/bag-memory"><span>Open BAG-DNA Memory</span><ChevronRight/></Link>
 </aside>
}
