/**
 * Integration boundaries for production adapters. The MVP uses deterministic
 * mock data; Supabase, GIS and airline/DCS implementations can satisfy these
 * contracts without changing page components.
 */
export interface BaggageRepository {
  getBag(id: string): Promise<unknown>;
  listBags(filters?: Record<string, string>): Promise<unknown[]>;
}

export interface GISAdapter {
  getAirportZones(iata: string): Promise<{
    type: "FeatureCollection";
    features: Array<Record<string, unknown>>;
  }>;
  subscribeToAssetPositions(ids: string[]): () => void;
}

export const integrationConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  gisEndpoint: process.env.NEXT_PUBLIC_GIS_ENDPOINT,
};
