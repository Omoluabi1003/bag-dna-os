import { CloudRain, MapPin, Navigation, Plane } from "lucide-react";
import type { ReplayEvent } from "@/types/phoenix";

export function MissionCanvas({event,index,total}:{event:ReplayEvent;index:number;total:number}) {
  const progress=index/(total-1)*100;
  return <section className="mission-canvas" aria-label="Aviation corridor map">
    <div className="map-toolbar"><span><Navigation/> MIA / ATL CORRIDOR</span><span><CloudRain/> ATL · 27°C · VIS 10 mi</span></div>
    <div className="map-coordinates">33.6407°N / 84.4277°W<br/>OSM CONTEXT · DEMO OVERLAY</div>
    <svg className="corridor-map" viewBox="0 0 1000 500" role="img" aria-label={`Journey progress at ${event.zone}`}>
      <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#264052" strokeWidth=".6"/></pattern><linearGradient id="route"><stop stopColor="#00d6a3"/><stop offset="1" stopColor="#4ba3ff"/></linearGradient></defs>
      <rect width="1000" height="500" fill="url(#grid)"/><path className="land-mass" d="M-30 335L83 285l96 15 74-66 87 25 91-66 103 34 75-31 99 56 96-9 92 59 134 8v220H-30z"/>
      <path d="M130 338C300 155 600 155 865 270" className="route-base"/><path d="M130 338C300 155 600 155 865 270" className="route-progress" pathLength="100" strokeDasharray={`${progress} 100`}/>
      <circle cx="130" cy="338" r="8" className="airport-dot"/><circle cx="865" cy="270" r="8" className="airport-dot"/><text x="98" y="375">MIA · ORIGIN</text><text x="824" y="307">ATL · ARRIVED</text>
      <g style={{transform:`translate(${130+(865-130)*progress/100}px, ${338+(270-338)*progress/100}px)`}} className="bag-marker"><circle r="17"/><circle r="5"/><text x="24" y="4">{event.state}</text></g>
      <g className="aircraft" transform="translate(580 155) rotate(15)"><Plane/><text x="28" y="4">BDO 2174</text></g>
    </svg>
    <div className="map-focus"><span><MapPin/> CURRENT ZONE</span><b>{event.airport} · {event.zone}</b><small>{event.holder} · Scan confidence {event.confidence}%</small></div>
    <div className="map-legend"><span><i className="verified"/>Verified path</span><span><i className="missing"/>Missing event</span><span><i className="untrusted"/>Untrusted signal</span></div>
  </section>;
}
