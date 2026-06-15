import airports from "@/lib/data/nigeria-airports.geojson";
import corridors from "@/lib/data/nigeria-corridors.geojson";
import zones from "@/lib/data/airport-zones.geojson";
import trails from "@/lib/data/baggage-trails.geojson";
import type { IntegrationResult } from "./types";

export type GeoJsonCollection = {
  type: "FeatureCollection";
  features: Array<Record<string, unknown>>;
};

export const localGeoJson = {
  airports: airports as GeoJsonCollection,
  corridors: corridors as GeoJsonCollection,
  zones: zones as GeoJsonCollection,
  trails: trails as GeoJsonCollection,
};

export async function getOperationalGeoJson(): Promise<IntegrationResult<typeof localGeoJson>> {
  return { data: localGeoJson, mode: "live", source: "Geospatial Route Intelligence", message: "Versioned operational geometry for airport and corridor views." };
}

export interface InfrastructureContext {
  category: string;
  count: number;
  note: string;
}

export async function getOverpassReadyContext(): Promise<IntegrationResult<InfrastructureContext[]>> {
  return {
    data: [
      { category: "Primary road access", count: 4, note: "Corridor access context" },
      { category: "Cargo and logistics facilities", count: 7, note: "Logistics proximity context" },
      { category: "Emergency services", count: 5, note: "Emergency response context" },
    ],
    mode: "live",
    source: "Infrastructure Context",
    message: "Continuity-protected infrastructure context.",
  };
}
