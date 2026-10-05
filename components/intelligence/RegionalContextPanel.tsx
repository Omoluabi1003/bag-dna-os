'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Bell, Layers, RefreshCw } from 'lucide-react';
import { airportRegistry } from '@/lib/operations/airports';
import { operationalCorridors, resolveCorridorAirports } from '@/lib/operations/corridors';
import { getRegionalContext } from '@/lib/integrations/regionalContext';
import { eventCurrent, filterRegionalEvents, sourceFresh, type ContextFeed, type HazardLayer } from '@/lib/intelligence/regionalContext';

const RegionalContextMap = dynamic(()=>import('./RegionalContextMap'),{ssr:false,loading:()=> <p className="mt-5 text-sm text-slate-300">Loading regional map…</p>});
const layerLabels: Record<HazardLayer,string> = { earthquakes: 'USGS earthquakes', 'natural-events': 'NASA natural events' };
const inputClass = 'mt-1 w-full rounded-xl border border-white/20 bg-[#102333] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan';
export function RegionalContextPanel() {
  const [showMap,setShowMap] = useState(false);
  const [scope,setScope] = useState('airport:LOS');
  const [radius,setRadius] = useState(300);
  const [magnitude,setMagnitude] = useState(2.5);
  const [enabled,setEnabled] = useState<HazardLayer[]>([]);
  const [feeds,setFeeds] = useState<Partial<Record<HazardLayer,ContextFeed>>>({});
  const [loading,setLoading] = useState(false);
  const [revision,setRevision] = useState(0);
  const [watch,setWatch] = useState(false);
  const [now,setNow] = useState(0);
  const [selected,setSelected] = useState<string | null>(null);
  useEffect(()=>{ const timer=setInterval(()=>setNow(Date.now()),60000); return ()=>clearInterval(timer); },[]);
  useEffect(()=>{
    let cancelled=false;
    if (!enabled.length) return;
    Promise.all(enabled.map(getRegionalContext)).then(results=>{ if (!cancelled) { setFeeds(Object.fromEntries(results.map(f=>[f.layer,f]))); setNow(Date.now()); setLoading(false); } });
    return ()=>{ cancelled=true; };
  },[enabled,revision]);
  const route = scope.startsWith('corridor:') ? operationalCorridors.find(c=>c.id===scope.slice(9)) : undefined;
  const endpoints = route ? resolveCorridorAirports(route) : { origin: airportRegistry[scope.slice(8)], destination: undefined };
  const events = useMemo(()=>filterRegionalEvents(enabled.flatMap(layer=>feeds[layer]?.events ?? []),endpoints.origin,endpoints.destination,radius,magnitude),[enabled,feeds,endpoints.origin,endpoints.destination,radius,magnitude]);
  const alerts = events.filter(e=>eventCurrent(e,now) && sourceFresh(feeds[e.source==='USGS'?'earthquakes':'natural-events']!,now));
  const focused = events.find(e=>e.id===selected);
  return <section className="glass my-6 overflow-hidden p-4 md:p-6" aria-labelledby="regional-context-title">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-cyan">Public regional context</p><h2 id="regional-context-title" className="mt-2 text-2xl font-semibold text-white">Airport & corridor watch</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Explore nearby hazards and events along a reference corridor. Geographic proximity is a review signal, not proof of disruption or baggage location.</p></div><button onClick={()=>{setLoading(true);setRevision(v=>v+1);}} disabled={loading||!enabled.length} className="flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm text-white disabled:opacity-40"><RefreshCw size={16} className={loading?'animate-spin':''}/>Refresh</button></div>
    <div className="mt-5 grid gap-4 md:grid-cols-3"><label className="text-xs text-slate-300">Geographic scope<select value={scope} onChange={e=>{setScope(e.target.value);setSelected(null);}} className={inputClass}><optgroup label="Airports">{Object.values(airportRegistry).map(a=><option key={a.iataCode} value={`airport:${a.iataCode}`}>{a.iataCode} · {a.city}, {a.country}</option>)}</optgroup><optgroup label="Reference corridors">{operationalCorridors.map(c=><option key={c.id} value={`corridor:${c.id}`}>{c.displayName}</option>)}</optgroup></select></label><label className="text-xs text-slate-300">Watch distance<select value={radius} onChange={e=>setRadius(Number(e.target.value))} className={inputClass}>{[100,300,500,1000].map(r=><option key={r} value={r}>{r} km from {route?'corridor':'airport'}</option>)}</select></label><label className="text-xs text-slate-300">Minimum earthquake magnitude<select value={magnitude} onChange={e=>setMagnitude(Number(e.target.value))} className={inputClass}>{[2.5,4,5,6].map(m=><option key={m} value={m}>M{m.toFixed(1)}+</option>)}</select></label></div>
    <fieldset className="mt-5 flex flex-wrap gap-3"><legend className="mb-2 text-xs font-semibold text-slate-300"><Layers className="mr-2 inline" size={14}/>Activate public layers</legend>{(Object.keys(layerLabels) as HazardLayer[]).map(layer=><label key={layer} className="flex min-h-11 items-center gap-3 rounded-xl border border-white/15 px-4 text-sm text-white"><input type="checkbox" checked={enabled.includes(layer)} onChange={e=>{const next=e.target.checked?[...enabled,layer]:enabled.filter(x=>x!==layer);setLoading(next.length>0);setEnabled(next);}} className="h-4 w-4 accent-cyan-400"/>{layerLabels[layer]}</label>)}</fieldset>
    <div className="mt-4 grid gap-3 md:grid-cols-2">{enabled.map(layer=>{const feed=feeds[layer];return <div key={layer} className="rounded-xl border border-white/10 p-3 text-xs leading-5 text-slate-300"><strong className="text-white">{layerLabels[layer]}</strong><p>{loading?'Checking source…':feed?.status==='unavailable'?'Unavailable':feed && sourceFresh(feed,now)?'Retrieved recently':'Refresh needed'}</p>{feed && <p>Retrieved {new Date(feed.retrievedAt).toLocaleString()}</p>}{feed?.message && <p className="text-amber-200">{feed.message}</p>}</div>;})}</div>
    <div className="mt-5 rounded-2xl border border-white/15 bg-[#081722] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-white">{endpoints.origin.iataCode}{endpoints.destination?` → ${endpoints.destination.iataCode}`:''} · {events.length} matching public events</p><label className="flex min-h-11 items-center gap-2 text-xs text-slate-200"><input type="checkbox" checked={watch} onChange={e=>setWatch(e.target.checked)} className="h-4 w-4 accent-cyan-400"/><Bell size={15}/>Enable watch alerts</label></div><p className="mt-2 text-xs leading-5 text-slate-400">{route?'Reference great-circle route; actual airline flight paths may differ.':'Watch region uses airport coordinates from the BAG-DNA registry.'} Alerts update only while this panel is open and refreshed.</p><div role="status" aria-live="polite" className="mt-3 text-sm text-amber-200">{watch ? loading?'Checking watch region…':!enabled.length?'Activate a layer to monitor this region.':enabled.some(l=>!feeds[l]||!sourceFresh(feeds[l]!,now))?'Watch incomplete: a source is unavailable or needs refresh.':alerts.length?`${alerts.length} recent event${alerts.length===1?'':'s'} warrant regional review. No flight disruption is confirmed.`:'No recent matching events in the selected feeds. This is not an all-clear.':'Watch alerts are off.'}</div></div>
    <button onClick={()=>setShowMap(v=>!v)} aria-expanded={showMap} className="mt-4 min-h-11 rounded-xl border border-white/20 px-4 text-sm text-white">{showMap?'Hide':'Show'} regional map</button>
    {showMap && <RegionalContextMap origin={endpoints.origin} destination={endpoints.destination} events={loading?[]:events} radius={radius} selected={selected} onSelect={setSelected}/>}
    <div className="mt-5 grid gap-3 lg:grid-cols-2" aria-busy={loading}>{!enabled.length?<p className="text-sm text-slate-300">Activate a layer to load public context. Feeds load only when activated; no automatic polling runs.</p>:loading?<p className="text-sm text-slate-300">Loading public sources…</p>:events.length?events.slice(0,30).map(e=><article key={e.id} className={`rounded-xl border p-4 ${selected===e.id?'border-cyan bg-cyan/10':'border-white/10 bg-white/[.025]'}`}><button onClick={()=>setSelected(e.id)} className="text-left text-sm font-semibold text-white underline-offset-4 hover:underline">{e.title}</button><p className="mt-2 text-xs text-cyan">{e.category}{e.magnitude!==null?` · M${e.magnitude.toFixed(1)}`:''} · {e.source}</p><p className="mt-2 text-xs leading-5 text-slate-300">Observation {new Date(e.observedAt).toLocaleString()} · {eventCurrent(e,now)?'Within observation window':'Older observation'}</p><a href={e.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-gold underline">View source evidence</a></article>):<p className="text-sm text-slate-300">No matching events returned for this region. Check source availability above.</p>}</div>
    {events.length>30 && <p className="mt-3 text-xs text-slate-400">Showing the 30 most recent of {events.length} matching events; the map displays up to 200.</p>}{focused && <p className="mt-4 rounded-xl border border-cyan/30 p-3 text-sm text-slate-200">Selected public event: {focused.latitude.toFixed(3)}°, {focused.longitude.toFixed(3)}°. Coordinates describe the event, not a bag or aircraft.</p>}
    <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">USGS M2.5+ events cover the past day. NASA EONET includes open events with observations in the past seven days; coverage is curated and may be delayed. Public context never changes identity scores, custody evidence, or passenger status.</p>
  </section>;
}
