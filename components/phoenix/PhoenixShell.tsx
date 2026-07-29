"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BrainCircuit, BriefcaseBusiness, Command, FileSearch, Fingerprint, Globe2, Link2, Map, Menu, Rocket, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const navigation = [
  [Globe2,"Mission Control","/dashboard"], [Map,"Digital Twin","/digital-twin"], [Fingerprint,"Bag Memory","/bag-memory"],
  [BrainCircuit,"Intelligence","/intelligence"], [Link2,"Custody Ledger","/custody"], [FileSearch,"Claims","/claims"],
  [Activity,"Simulation Lab","/simulation"], [Rocket,"Innovation Center","/innovation"],
] as const;

export function BootSequence() {
  const [visible,setVisible]=useState(true); const [step,setStep]=useState(0);
  useEffect(()=>{if(sessionStorage.getItem("phoenix-booted")||matchMedia("(prefers-reduced-motion: reduce)").matches){const skip=window.setTimeout(()=>setVisible(false),0);return()=>clearTimeout(skip)} const timer=window.setInterval(()=>setStep(s=>Math.min(4,s+1)),380); const done=window.setTimeout(()=>{sessionStorage.setItem("phoenix-booted","1");setVisible(false)},2200); return()=>{clearInterval(timer);clearTimeout(done)}},[]);
  if(!visible)return null;
  const steps=["Initialize BAG-DNA Intelligence Core","Verify Custody Ledger","Load Aviation Context","Synchronize Airport Operations","Open Mission Control"];
  return <div className="phoenix-boot" role="status" aria-live="polite"><div><span className="boot-mark"><Fingerprint/></span><p>PROJECT PHOENIX / SECURE START</p><h1>BAG-DNA <b>OS</b></h1><div className="boot-track"><i style={{width:`${(step+1)*20}%`}}/></div><span>{steps[step]}</span></div></div>;
}

export function PhoenixShell({children}: {children:React.ReactNode}) {
  const pathname=usePathname(); const [mobile,setMobile]=useState(false); const [palette,setPalette]=useState(false); const [query,setQuery]=useState(""); const [utc,setUtc]=useState("--:--:--");
  useEffect(()=>{const tick=()=>setUtc(new Date().toISOString().slice(11,19));tick();const clock=setInterval(tick,1000);const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setPalette(v=>!v)}if(e.key==="Escape")setPalette(false)};addEventListener("keydown",key);return()=>{clearInterval(clock);removeEventListener("keydown",key)}},[]);
  const results=navigation.filter(([,label])=>label.toLowerCase().includes(query.toLowerCase()));
  return <div className="phoenix-shell">
    <BootSequence/>
    <aside className={`command-rail ${mobile?"is-open":""}`} aria-label="Primary command rail">
      <div className="rail-brand"><span><Fingerprint size={20}/></span><div><b>BAG-DNA</b><small>PROJECT PHOENIX</small></div><button onClick={()=>setMobile(false)} aria-label="Close navigation"><X/></button></div>
      <nav>{navigation.map(([Icon,label,href])=><Link key={href} href={href} aria-label={label} title={label} className={pathname===href?"active":""} onClick={()=>setMobile(false)}><Icon/><span>{label}</span></Link>)}</nav>
      <div className="rail-security"><ShieldCheck/><span>DEMO<br/>CONTROL</span></div>
    </aside>
    <div className="phoenix-workspace">
      <header className="operational-topbar">
        <button className="mobile-trigger" onClick={()=>setMobile(true)} aria-label="Open navigation"><Menu/></button>
        <div className="system-title"><span className="status-pulse"/><div><b>BAG-DNA OS</b><small>Global Aviation Baggage Intelligence</small></div></div>
        <button className="command-search" onClick={()=>setPalette(true)}><Search/>Find bag, flight, evidence <kbd>⌘ K</kbd></button>
        <div className="top-status"><span><i/> SYSTEMS NOMINAL</span><span className="top-source">PUBLIC CONTEXT / DEMO BAGGAGE</span><time>{utc} UTC</time></div>
      </header>
      <main>{children}</main>
      <footer className="phoenix-footer"><span>PHOENIX FOUNDATION · DEMONSTRATION CONTROLS</span><span>Developed by Paul Iyogun · ETL GIS Consulting LLC</span></footer>
    </div>
    {palette&&<div className="palette-backdrop" onMouseDown={()=>setPalette(false)}><section role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={e=>e.stopPropagation()}><label><Command/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type a command or destination…"/><kbd>ESC</kbd></label><p>OPERATIONAL DESTINATIONS</p>{results.map(([Icon,label,href])=><Link key={href} href={href} onClick={()=>setPalette(false)}><Icon/><span><b>{label}</b><small>{href}</small></span></Link>)}<Link href="/bag-memory" onClick={()=>setPalette(false)}><BriefcaseBusiness/><span><b>Open selected bag</b><small>BDO-MIA-2026-000184 · DEMO DATA</small></span></Link></section></div>}
  </div>;
}
