import { Badge } from "@/components/ui";

const services = [
  ["Open-Meteo", "Ready", "Keyless weather and environmental risk context", "emerald"],
  ["OpenSky", "Fallback ready", "Public movement context with deterministic beta fallback", "emerald"],
  ["OurAirports", "Seeded", "Nigeria and international airport metadata", "cyan"],
  ["REST Countries", "Ready", "Country, flag, and regional corridor context", "emerald"],
  ["GeoJSON", "Local", "Airports, zones, corridors, and baggage trails", "cyan"],
  ["OpenStreetMap / Overpass", "Adapter ready", "No hard dependency on live calls", "cyan"],
  ["Supabase", "Future", "Governed identity and event persistence", "slate"],
  ["ArcGIS", "Future", "Authoritative airport geospatial services", "slate"],
  ["ArcGIS Velocity", "Future", "Streaming sensor and geofence telemetry", "slate"],
  ["ArcGIS Indoors", "Future", "Indoor positioning and restricted routing", "slate"],
  ["Airline systems", "Future", "DCS, BRS, BHS, EDS, and AODB integration", "slate"],
  ["Identity hardware", "Future", "RFID, NFC, seals, scales, and vision stations", "slate"],
] as const;

export function IntegrationStatusPanel() {
  return <div className="grid gap-3 md:grid-cols-2">{services.map(([name,status,detail,tone])=><article key={name} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold">{name}</h3><Badge tone={tone}>{status}</Badge></div><p className="mt-2 text-[11px] leading-5 text-mist">{detail}</p></article>)}</div>;
}
