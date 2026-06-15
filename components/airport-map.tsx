import { Plane } from "lucide-react";
import { heatPoints, zones } from "@/lib/data";

export function AirportMap({ heat = false }: { heat?: boolean }) {
  return <div className="map-grid relative min-h-[510px] overflow-hidden border border-white/[.08]">
    <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1000 600" fill="none" aria-hidden="true">
      <path d="M70 445L880 88M120 520L930 163" stroke="#6ED8E0" strokeOpacity=".32" strokeWidth="12"/>
      <path d="M70 445L880 88M120 520L930 163" stroke="#071522" strokeOpacity=".7" strokeWidth="2" strokeDasharray="18 12"/>
      <path d="M200 410L315 360L440 405L595 340L730 380" stroke="#D7A93B" strokeOpacity=".4" strokeWidth="3"/>
      <path d="M294 347v-88h170v125M580 342V230h180v150" stroke="#A9B7C4" strokeOpacity=".3" strokeWidth="9"/>
      <path d="M300 270h155M590 242h160" stroke="#A9B7C4" strokeOpacity=".2" strokeWidth="28"/>
    </svg>
    {heat && heatPoints.map((p,i)=><div key={i} className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" style={{left:`${p.x}%`,top:`${p.y}%`,background:`rgba(${p.value>70?"248,113,113":"245,158,11"},${.08+p.value/600})`}}/>)}
    {zones.map((z)=><div key={z.code} className="absolute -translate-x-1/2 -translate-y-1/2" style={{left:`${z.x}%`,top:`${z.y}%`}}>
      <span className={`pulse-ring absolute -inset-3 rounded-full border ${z.status==="Elevated"?"border-red-400":"border-cyan/60"}`}/>
      <span className={`relative block h-3 w-3 rotate-45 border-2 ${z.status==="Elevated"?"border-red-300 bg-red-400":"border-cyan bg-ink"}`}/>
      <div className="absolute left-4 top-[-10px] w-28 bg-ink/80 px-2 py-1.5 backdrop-blur"><p className="text-[9px] font-bold text-ivory">{z.name}</p><p className="mt-0.5 text-[8px] text-mist">{z.load}% capacity</p></div>
    </div>)}
    <Plane className="absolute left-[66%] top-[36%] -rotate-[24deg] text-gold" size={24}/>
    <div className="absolute bottom-4 left-4 flex gap-4 bg-ink/85 px-3 py-2 text-[8px] uppercase tracking-wider text-mist backdrop-blur"><span><i className="mr-2 inline-block h-1.5 w-1.5 bg-cyan"/>Tracked zone</span><span><i className="mr-2 inline-block h-1.5 w-1.5 bg-red-400"/>Exception</span></div>
  </div>
}
