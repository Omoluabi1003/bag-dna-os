"use client";

import { useEffect, useState } from "react";
import { CloudRain, Plane, RefreshCw, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui";
import { getAirportWeather, type AviationWeather } from "@/lib/integrations/openMeteo";
import { getNigeriaAirspaceContext, type AircraftContext } from "@/lib/integrations/openSky";
import type { DataMode } from "@/lib/integrations/types";

type PanelState = {
  loading: boolean;
  mode: DataMode;
  weather?: AviationWeather;
  aircraft?: AircraftContext[];
};

export function LiveDataPanel() {
  const [state, setState] = useState<PanelState>({ loading: true, mode: "mock" });

  async function load() {
    setState((current) => ({ ...current, loading: true }));
    const [weather, aircraft] = await Promise.all([getAirportWeather(), getNigeriaAirspaceContext()]);
    const mode = weather.mode === "live" && aircraft.mode === "live" ? "live" : "degraded";
    setState({ loading: false, mode, weather: weather.data, aircraft: aircraft.data });
  }

  useEffect(() => { void load(); }, []);

  if (state.loading) {
    return <div className="glass flex min-h-56 items-center justify-center p-6" role="status"><RefreshCw className="mr-3 animate-spin text-cyan" size={18}/><span className="text-sm text-mist">Loading corridor context…</span></div>;
  }

  return (
    <section className="glass p-6" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Operational context</p><h2 className="mt-2 text-xl font-semibold">Lagos corridor data pulse</h2></div>
        <Badge tone={state.mode === "live" ? "emerald" : "amber"}>{state.mode === "live" ? "Live intelligence" : "Continuity mode"}</Badge>
      </div>
      {state.mode === "degraded" && <p className="mt-4 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-[11px] text-amber-200"><TriangleAlert size={15}/> One or more environmental feeds are temporarily delayed. Continuity-protected intelligence remains available.</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><CloudRain className="text-cyan" size={18}/><p className="mt-4 text-2xl font-semibold">{state.weather?.temperatureC}°C</p><p className="mt-1 text-[11px] text-mist">Wind {state.weather?.windKph} km/h · visibility {Math.round((state.weather?.visibilityM ?? 0) / 1000)} km</p><Badge tone={state.weather?.risk === "Low" ? "emerald" : "amber"}>{state.weather?.risk} weather risk</Badge></div>
        <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><Plane className="text-cyan" size={18}/><p className="mt-4 text-2xl font-semibold">{state.aircraft?.length ?? 0}</p><p className="mt-1 text-[11px] text-mist">Public aircraft movements in available corridor context</p><p className="mt-3 truncate font-mono text-[10px] text-cyan">{state.aircraft?.map((item) => item.callsign).join(" · ")}</p></div>
      </div>
      <button onClick={() => void load()} className="mt-4 rounded-xl border border-white/10 px-4 py-2 text-[11px] font-semibold text-cyan hover:bg-white/5">Refresh operational context</button>
    </section>
  );
}
