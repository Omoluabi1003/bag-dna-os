"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity, CloudRain, Database, Gauge, MapPin, Plane, Radio, RefreshCw, ShieldCheck, Wind } from "lucide-react";
import { EMPTY_LIVE_OPERATIONS_SNAPSHOT, getLiveOperationsSnapshot, type LiveOperationsSnapshot } from "@/lib/integrations/liveOperations";
import { Badge, StatusDot } from "@/components/ui";

const AviationMap = dynamic(() => import("@/components/dashboard/AviationMap"), { ssr: false, loading: () => <div className="h-[440px] animate-pulse rounded-2xl bg-white/[.04]" aria-label="Loading geographic map"/> });

const corridor = { minLon: -85, maxLon: -78, minLat: 24.2, maxLat: 35.5 };

function position(longitude: number, latitude: number) {
  return {
    left: `${Math.max(2, Math.min(98, ((longitude - corridor.minLon) / (corridor.maxLon - corridor.minLon)) * 100))}%`,
    top: `${Math.max(3, Math.min(97, 100 - ((latitude - corridor.minLat) / (corridor.maxLat - corridor.minLat)) * 100))}%`,
  };
}

function formatObservedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "recent" : date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";
}

export function LiveOperationsConsole() {
  const [snapshot, setSnapshot] = useState<LiveOperationsSnapshot>(EMPTY_LIVE_OPERATIONS_SNAPSHOT);
  const [refreshing, setRefreshing] = useState(true);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setSnapshot(await getLiveOperationsSnapshot());
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const airborne = snapshot.aircraft.filter((aircraft) => !aircraft.onGround);
  const latestContact = snapshot.aircraft.reduce((latest, aircraft) => Math.max(latest, aircraft.lastContact), 0);
  const generatedAtSeconds = Math.floor(new Date(snapshot.generatedAt).getTime() / 1000);
  const latency = latestContact ? Math.max(0, generatedAtSeconds - latestContact) : null;
  const reportingStations = snapshot.airportWeather.length;
  const hasLoaded = snapshot.generatedAt !== EMPTY_LIVE_OPERATIONS_SNAPSHOT.generatedAt;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-cyan/15 bg-[#06111d] shadow-[0_30px_90px_rgba(0,0,0,.32)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.08] bg-white/[.025] px-5 py-4 md:px-7">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50"/><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"/></span>
            <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan">Live public-data operations layer</p><p className="mt-1 text-xs text-slate-400">South Florida → Atlanta aviation corridor</p></div>
          </div>
          <div className="flex flex-wrap gap-2"><Badge tone={snapshot.mode === "live" ? "emerald" : "amber"}><StatusDot/> {refreshing ? "Refreshing" : snapshot.mode === "live" ? "Feeds live" : "Continuity mode"}</Badge><Badge>{hasLoaded ? `Updated ${new Date(snapshot.generatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" })} UTC` : "Connecting…"}</Badge></div>
        </div>

        <div className="grid gap-px bg-white/[.07] sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Aircraft observed", value: snapshot.aircraft.length.toString(), detail: `${airborne.length} airborne in corridor`, icon: Plane },
            { label: "Weather stations", value: reportingStations.toString(), detail: "MIA · FLL · ATL METAR network", icon: CloudRain },
            { label: "Position latency", value: latency === null ? "N/A" : `${latency}s`, detail: "latest anonymous OpenSky contact", icon: Radio },
            { label: "Surface visibility", value: snapshot.surfaceWeather.visibilityKm === null ? "N/A" : `${snapshot.surfaceWeather.visibilityKm.toFixed(1)} km`, detail: "Open-Meteo MIA observation", icon: Gauge },
          ].map(({ label, value, detail, icon: Icon }) => <article key={label} className="bg-[#081724] p-5 md:p-6"><div className="flex items-center justify-between"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-500">{label}</p><Icon size={16} className="text-cyan"/></div><p className="mt-5 text-3xl font-semibold tracking-[-.04em] text-white">{value}</p><p className="mt-2 text-[10px] text-slate-400">{detail}</p></article>)}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_.8fr]">
          <div className="relative min-h-[440px] overflow-hidden border-r border-white/[.08] bg-[radial-gradient(circle_at_35%_40%,rgba(46,211,183,.08),transparent_24%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:auto,36px_36px,36px_36px] p-6">
            <div className="relative z-20 flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan">Regional air picture</p><h3 className="mt-2 text-xl font-semibold text-white">Anonymous ADS-B aircraft positions</h3></div><button onClick={() => void refresh()} className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[9px] font-bold text-emerald-300">{refreshing ? "REFRESHING…" : "AUTO REFRESH · 60S"}</button></div>
            <div className="absolute inset-x-6 bottom-6 top-24 rounded-2xl border border-white/[.06] bg-[#06101a]/65">
              <svg className="absolute inset-0 h-full w-full opacity-45" viewBox="0 0 800 420" fill="none" aria-hidden="true"><path d="M210 390C240 323 254 280 292 229C335 171 409 138 453 102C495 67 541 42 627 18" stroke="#27d3b7" strokeWidth="2" strokeDasharray="7 10"/><circle cx="210" cy="390" r="7" fill="#27d3b7"/><circle cx="292" cy="229" r="7" fill="#27d3b7"/><circle cx="627" cy="18" r="7" fill="#27d3b7"/></svg>
              {[{name:"MIA",lon:-80.287,lat:25.796},{name:"FLL",lon:-80.153,lat:26.072},{name:"ATL",lon:-84.428,lat:33.64}].map((airport)=><div key={airport.name} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={position(airport.lon,airport.lat)}><span className="block h-3 w-3 rounded-full border-2 border-gold bg-[#071522] shadow-[0_0_18px_rgba(212,175,55,.8)]"/><span className="mt-1 block -translate-x-1/3 font-mono text-[9px] font-bold text-gold">{airport.name}</span></div>)}
              {snapshot.aircraft.slice(0, 28).map((aircraft) => <div key={aircraft.icao24} className="group absolute z-10 -translate-x-1/2 -translate-y-1/2" style={position(aircraft.longitude, aircraft.latitude)} title={`${aircraft.callsign} · ${aircraft.altitudeM.toLocaleString()} m · ${aircraft.velocityKph} km/h`}><Plane size={13} className={aircraft.onGround ? "text-amber-300" : "text-cyan"} style={{ transform: `rotate(${aircraft.heading - 90}deg)` }}/><div className="pointer-events-none absolute left-4 top-[-22px] hidden min-w-36 rounded-lg border border-white/10 bg-[#02070d]/95 p-2 text-[9px] text-white shadow-xl group-hover:block"><b>{aircraft.callsign}</b><p className="mt-1 text-slate-400">{aircraft.country}</p><p>{Math.round(aircraft.altitudeM).toLocaleString()} m · {aircraft.velocityKph} km/h</p></div></div>)}
              {!snapshot.aircraft.length && <div className="absolute inset-0 grid place-items-center text-center"><div><RefreshCw className={`mx-auto mb-3 text-amber-300 ${refreshing ? "animate-spin" : ""}`}/><p className="text-sm font-semibold text-white">{refreshing ? "Connecting to aircraft feed" : "Aircraft feed temporarily unavailable"}</p><p className="mt-1 text-[10px] text-slate-400">The console retries automatically every 60 seconds.</p></div></div>}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan">Airport weather</p><h3 className="mt-2 text-lg font-semibold text-white">Operational METAR observations</h3></div><Wind size={18} className="text-cyan"/></div>
            <div className="mt-5 space-y-3">{snapshot.airportWeather.map((weather) => <article key={weather.station} className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><MapPin size={13} className="text-gold"/><b className="font-mono text-sm text-white">{weather.station}</b></div><Badge tone={weather.flightCategory === "VFR" ? "emerald" : weather.flightCategory === "MVFR" ? "cyan" : "amber"}>{weather.flightCategory}</Badge></div><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div><p className="text-[8px] uppercase text-slate-500">Temp</p><b className="mt-1 block text-sm text-white">{weather.temperatureC ?? "—"}°C</b></div><div><p className="text-[8px] uppercase text-slate-500">Wind</p><b className="mt-1 block text-sm text-white">{weather.windSpeedKt ?? "—"} kt</b></div><div><p className="text-[8px] uppercase text-slate-500">Visibility</p><b className="mt-1 block text-sm text-white">{weather.visibilityLabel} mi</b></div></div><p className="mt-3 truncate font-mono text-[8px] text-slate-500">{weather.raw}</p><p className="mt-2 text-right text-[8px] text-slate-600">Observed {formatObservedAt(weather.observedAt)}</p></article>)}
              {!snapshot.airportWeather.length && <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.05] p-4 text-xs text-amber-200">NOAA METAR observations are temporarily unavailable.</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="glass p-4 md:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-widest text-cyan">Geographic corridor picture</p><h3 className="mt-1 text-lg font-semibold">MIA · FLL · ATL live public context</h3></div><Badge tone="cyan">OpenStreetMap basemap</Badge></div><AviationMap aircraft={snapshot.aircraft}/><p className="mt-3 text-[9px] text-mist">Aircraft: OpenSky Network anonymous state vectors · Basemap © OpenStreetMap contributors. Positions refresh with the console every 60 seconds.</p></section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { name: "OpenSky Network", status: snapshot.sources.openSky, detail: "Anonymous aircraft state vectors", icon: Plane },
          { name: "NOAA Aviation Weather", status: snapshot.sources.aviationWeather, detail: "METAR airport observations", icon: CloudRain },
          { name: "Open-Meteo", status: snapshot.sources.openMeteo, detail: "Surface weather and visibility", icon: Database },
        ].map(({ name, status, detail, icon: Icon }) => <article key={name} className="glass p-5"><div className="flex items-center justify-between"><Icon size={18} className="text-cyan"/><Badge tone={status === "live" ? "emerald" : "amber"}>{status}</Badge></div><h4 className="mt-5 text-sm font-semibold text-white">{name}</h4><p className="mt-2 text-[10px] leading-5 text-mist">{detail}</p></article>)}
      </section>

      <section className="rounded-2xl border border-gold/15 bg-gold/[.04] p-4 text-[11px] leading-6 text-slate-300"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-gold" size={17}/><p><b className="text-gold">Operational truth:</b> aircraft and weather values above come from free public feeds. BAG-DNA custody, passenger, airline, screening, and claim records require authenticated airport or airline systems and are not represented as live until those integrations exist.</p></div></section>

      {snapshot.notices.length > 0 && <section className="rounded-2xl border border-amber-400/15 bg-amber-400/[.05] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-amber-200"><Activity size={15}/> Public-feed continuity notices</div><ul className="mt-3 space-y-1 text-[10px] text-amber-100/70">{snapshot.notices.map((notice) => <li key={notice}>• {notice}</li>)}</ul></section>}
    </div>
  );
}
