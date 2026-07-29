"use client";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import type { ReplayEvent } from "@/types/phoenix";

export function JourneyTimeline({events,index,playing,speed,onIndex,onPlaying,onSpeed}:{events:ReplayEvent[];index:number;playing:boolean;speed:number;onIndex:(n:number)=>void;onPlaying:(v:boolean)=>void;onSpeed:(n:number)=>void}) {
 return <section className="journey-timeline" aria-label="Journey replay"><div className="replay-controls"><button onClick={()=>onIndex(0)} aria-label="Restart replay"><RotateCcw/></button><button onClick={()=>onIndex(Math.max(0,index-1))} aria-label="Previous event"><ChevronLeft/></button><button className="play" onClick={()=>onPlaying(!playing)} aria-label={playing?"Pause journey replay":"Play journey replay"}>{playing?<Pause/>:<Play/>}</button><button onClick={()=>onIndex(Math.min(events.length-1,index+1))} aria-label="Next event"><ChevronRight/></button><button onClick={()=>onSpeed(speed===2?0.5:speed===0.5?1:2)} aria-label="Playback speed">{speed}×</button></div>
  <div className="timeline-track"><input aria-label="Journey timeline scrubber" type="range" min="0" max={events.length-1} value={index} onChange={e=>onIndex(Number(e.target.value))}/><div>{events.map((event,i)=><button key={event.id} onClick={()=>onIndex(i)} className={`${event.evidenceState} ${i===index?"current":""}`}><i/><span>{event.time}</span><b>{event.state}</b><small>{event.zone}</small></button>)}</div></div>
 </section>
}
