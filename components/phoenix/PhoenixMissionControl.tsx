"use client";
import { AlertTriangle, Check, ChevronDown, ClipboardCheck, Cloud, Copy, Crosshair, Database, FileText, Plane, Radio, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { phoenixBag, phoenixFlights } from "@/lib/demo/mission";
import { evidenceSummary, explainMission } from "@/lib/intelligence/missionBriefing";
import { MissionCanvas } from "./MissionCanvas";
import { MissionBriefingPanel } from "./MissionBriefingPanel";
import { JourneyTimeline } from "./JourneyTimeline";

export function PhoenixMissionControl(){
 const [airport,setAirport]=useState("MIA → ATL"); const [flight,setFlight]=useState(0); const [index,setIndex]=useState(4); const [playing,setPlaying]=useState(false); const [speed,setSpeed]=useState(1); const [drawer,setDrawer]=useState<"evidence"|"decision"|null>(null); const [decision,setDecision]=useState(""); const [copied,setCopied]=useState(false);
 const briefing=useMemo(()=>explainMission(phoenixBag.events,phoenixBag.briefing),[]); const event=phoenixBag.events[index];
 useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setIndex(i=>{if(i>=phoenixBag.events.length-1){setPlaying(false);return i}return i+1}),1200/speed);return()=>clearInterval(timer)},[playing,speed]);
 async function generate(){await navigator.clipboard?.writeText(evidenceSummary(briefing));setCopied(true);setTimeout(()=>setCopied(false),1800)}
 return <div className="mission-control">
  <aside className="mission-left"><div className="case-state"><span><Radio/> ACTIVE INCIDENT</span><b>BDO-DEMO-001</b><small>Missing Arrival Scan Investigation</small><em>DEMO DATA</em></div>
   <label className="ops-select"><span>AIRPORT CORRIDOR</span><select aria-label="Select airport" value={airport} onChange={e=>setAirport(e.target.value)}><option>MIA → ATL</option><option>FLL → ATL</option><option>MIA → JFK</option></select><ChevronDown/></label>
   <div className="flight-list"><p>ACTIVE FLIGHTS <span>03</span></p>{phoenixFlights.map((f,i)=><button key={f.number} className={flight===i?"active":""} onClick={()=>{setFlight(i);setIndex(i===0?4:0)}}><span><Plane/><b>{f.number}</b><em className={f.risk.toLowerCase()}>{f.risk}</em></span><strong>{f.route}</strong><small>{f.status} · {f.bags} bags</small></button>)}</div>
   <div className="alert-stack"><p>ACTIVE ALERTS <span>02</span></p><button onClick={()=>{setFlight(0);setIndex(4)}}><AlertTriangle/><span><b>Missing arrival scan</b><small>{phoenixBag.id}</small></span><em>HIGH</em></button><button onClick={()=>{setFlight(0);setIndex(5)}}><Database/><span><b>Untrusted duplicate</b><small>Device D-991</small></span><em>REVIEW</em></button></div>
   <div className="public-feeds"><p>PUBLIC CONTEXT</p><span><i/><Cloud/> NOAA METAR <small>Cached · 19:38</small></span><span><i/><Plane/> OpenSky <small>Context ready</small></span><span><i/><Crosshair/> OpenStreetMap <small>Map context</small></span></div>
  </aside>
  <div className="mission-center"><div className="mission-strip"><div><small>SELECTED BAG · DEMO DATA</small><b>{flight===0?phoenixBag.id:phoenixFlights[flight].bag}</b></div><span><small>FLIGHT</small><b>{phoenixFlights[flight].number}</b></span><span><small>STATUS</small><b className="warn">{flight===0?"EXCEPTION":"MONITOR"}</b></span><span><small>RISK</small><b>{flight===0?"87 / HIGH":"24 / LOW"}</b></span><button onClick={()=>setDrawer("evidence")}><Search/> Inspect evidence</button></div>
   <MissionCanvas event={event} index={index} total={phoenixBag.events.length}/>
  </div>
  <MissionBriefingPanel briefing={briefing} onEvidence={()=>setDrawer("evidence")}/>
  <JourneyTimeline events={phoenixBag.events} index={index} playing={playing} speed={speed} onIndex={setIndex} onPlaying={setPlaying} onSpeed={setSpeed}/>
  <div className="decision-bar"><span><ShieldCheck/> OPERATOR WORKFLOW</span><button onClick={()=>setDrawer("decision")}><ClipboardCheck/> Record operational decision</button><button onClick={generate}><FileText/> {copied?"Evidence summary copied":"Generate demo evidence summary"}</button></div>
  {drawer&&<div className="ops-drawer-backdrop" onClick={()=>setDrawer(null)}><aside className="ops-drawer" onClick={e=>e.stopPropagation()}><header><div><small>{drawer==="evidence"?"CUSTODY EVIDENCE":"OPERATOR DECISION"}</small><h2>{drawer==="evidence"?"Evidence inspector":"Record response"}</h2></div><button onClick={()=>setDrawer(null)}>Close</button></header>{drawer==="evidence"?<><p className="demo-notice">DEMO DATA · Evidence generated for scenario BDO-DEMO-001</p>{briefing.evidence.map(e=><article key={e.id} className={e.state}><span>{e.id}</span><div><b>{e.label}</b><p>{e.detail}</p></div><em>{e.state}</em></article>)}<button className="drawer-primary" onClick={generate}><Copy/> {copied?"Copied to clipboard":"Copy evidence summary"}</button></>:<><p>Select a controlled demonstration response. Recording is local to this browser session.</p>{["Place bag record on operational hold","Verify destination handler","Inspect seal status","Escalate to baggage security"].map(a=><button className={`decision-option ${decision===a?"selected":""}`} key={a} onClick={()=>setDecision(a)}><span>{decision===a?<Check/>:null}</span>{a}</button>)}<textarea aria-label="Decision note" placeholder="Add operator rationale…"/><button className="drawer-primary" disabled={!decision} onClick={()=>setDrawer(null)}><ClipboardCheck/> Record demo decision</button></>}</aside></div>}
 </div>
}
