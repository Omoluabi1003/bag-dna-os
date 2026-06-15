import { Badge } from "@/components/ui";

const services = [
  ["Weather Intelligence", "Active", "Airport weather, wind, rain, visibility and environmental risk", "emerald"],
  ["Aircraft Movement Context", "Active", "Airspace movement awareness with continuity protection", "emerald"],
  ["Airport Metadata Intelligence", "Active", "IATA, ICAO, location and gateway role coverage", "cyan"],
  ["Country and Corridor Intelligence", "Active", "Country, region and cross-border corridor context", "emerald"],
  ["Geospatial Route Intelligence", "Active", "Airports, zones, corridors and baggage movement trails", "cyan"],
] as const;

export function IntegrationStatusPanel() {
  return <div className="grid gap-3 md:grid-cols-2">{services.map(([name,status,detail,tone])=><article key={name} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold">{name}</h3><Badge tone={tone}>{status}</Badge></div><p className="mt-2 text-[11px] leading-5 text-mist">{detail}</p></article>)}</div>;
}
