"use client";
import { Radio, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export function DigitalTagSimulator({ flight = "BA 074", origin = "LOS", destination = "LHR", bagDnaId = "BD-PENDING" }: { flight?: string; origin?: string; destination?: string; bagDnaId?: string }) {
  const [seconds, setSeconds] = useState(30);
  useEffect(() => { const timer = window.setInterval(() => setSeconds((value) => value <= 1 ? 30 : value - 1), 1000); return () => window.clearInterval(timer); }, []);
  const mask = bagDnaId.length > 7 ? `${bagDnaId.slice(0, 6)}••••${bagDnaId.slice(-4)}` : bagDnaId;
  return <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f7f4ea] text-[#071522] shadow-2xl shadow-black/20">
    <div className="flex items-center justify-between bg-[#d7a93b] px-5 py-3 text-[10px] font-black uppercase tracking-[.18em]"><span>BAG-DNA secure tag</span><span>Public layer</span></div>
    <div className="grid gap-5 p-5 sm:grid-cols-[1fr_132px]">
      <div><p className="text-xs font-bold text-slate-500">Flight</p><p className="mt-1 text-5xl font-black tracking-[-.06em]">{flight}</p><div className="mt-5 flex items-center gap-4"><strong className="text-3xl">{origin}</strong><span className="h-px flex-1 bg-slate-300"/><strong className="text-3xl">{destination}</strong></div><p className="mt-5 font-mono text-xs text-slate-600">{mask}</p></div>
      <div className="rounded-2xl bg-white p-3 shadow-inner"><svg viewBox="0 0 100 100" className="h-full w-full" aria-label="Rotating QR placeholder">{Array.from({length: 49},(_,i)=><rect key={i} x={(i%7)*14+2} y={Math.floor(i/7)*14+2} width={i%3===0?11:7} height={i%4===0?11:7} rx="1" fill={i%2?"#071522":"#17465f"}/>)}</svg></div>
    </div>
    <div className="grid grid-cols-3 border-t border-slate-200 bg-white/60 text-[10px] font-bold"><span className="flex items-center justify-center gap-1.5 p-3"><Radio size={13}/> RFID</span><span className="flex items-center justify-center gap-1.5 border-x border-slate-200 p-3"><Smartphone size={13}/> NFC</span><span className="flex items-center justify-center gap-1.5 p-3"><ShieldCheck size={13}/> Seal</span></div>
    <div className="flex justify-between bg-[#071522] px-5 py-3 text-[10px] text-white"><span>Encrypted identity layer · protected</span><span className="font-mono text-cyan">QR rotates in {seconds}s</span></div>
  </div>;
}

