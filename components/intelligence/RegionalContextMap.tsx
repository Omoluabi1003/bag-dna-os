'use client';
import { useEffect, useMemo } from 'react';
import { Circle, CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet';
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Airport } from '@/lib/operations/airports';
import { sampleGreatCircle } from '@/lib/operations/corridorGeometry';
import type { RegionalEvent } from '@/lib/intelligence/regionalContext';
const unwrap = (lon:number,anchor:number) => anchor+((lon-anchor+540)%360)-180;
function FitRegion({ points }: { points: LatLngTuple[] }) {
  const map=useMap();
  useEffect(()=>{map.fitBounds(points,{padding:[35,35],maxZoom:9});},[map,points]);
  return null;
}
export default function RegionalContextMap({ origin,destination,events,radius,selected,onSelect }: { origin: Airport; destination?: Airport; events: RegionalEvent[]; radius:number; selected:string|null; onSelect:(id:string)=>void }) {
  const route=useMemo(()=>destination?sampleGreatCircle(origin,destination).map(p=>[p.latitude,unwrap(p.longitude,origin.longitude)] as LatLngTuple):[],[origin,destination]);
  const bounds=useMemo(()=>{
    if(destination) return route;
    const latDelta=radius/111,lonDelta=radius/(111*Math.max(0.1,Math.cos(origin.latitude*Math.PI/180)));
    return [[Math.max(-85,origin.latitude-latDelta),origin.longitude-lonDelta],[Math.min(85,origin.latitude+latDelta),origin.longitude+lonDelta]] as LatLngTuple[];
  },[route,origin,destination,radius]);
  return <div className="relative isolate mt-5 h-[360px] overflow-hidden rounded-2xl border border-white/15 md:h-[440px]" aria-label="Public hazard context map">
    <MapContainer center={[origin.latitude,origin.longitude]} zoom={5} className="h-full w-full" scrollWheelZoom={false}>
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
      <FitRegion points={bounds}/>
      {route.length>0 && <Polyline positions={route} pathOptions={{color:'#0891b2',weight:3,dashArray:'6 6'}}/>}
      {!destination && <Circle center={[origin.latitude,origin.longitude]} radius={radius*1000} pathOptions={{color:'#0891b2',fillOpacity:0.04}}/>}
      {[origin,...destination?[destination]:[]].map(a=><CircleMarker key={a.iataCode} center={[a.latitude,unwrap(a.longitude,origin.longitude)]} radius={8} pathOptions={{color:'#172554',fillColor:'#facc15',fillOpacity:1}}><Tooltip permanent>{a.iataCode}</Tooltip></CircleMarker>)}
      {events.slice(0,200).map(e=><CircleMarker key={e.id} center={[e.latitude,unwrap(e.longitude,origin.longitude)]} radius={selected===e.id?10:6} pathOptions={{color:e.source==='USGS'?'#dc2626':'#7c3aed',fillOpacity:0.8}} eventHandlers={{click:()=>onSelect(e.id)}}><Tooltip>{e.title} · {e.source}</Tooltip></CircleMarker>)}
    </MapContainer>
  </div>;
}
