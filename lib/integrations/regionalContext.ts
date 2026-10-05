import { parseRegionalEvents, type ContextFeed, type HazardLayer } from '../intelligence/regionalContext';
const urls: Record<HazardLayer,string> = {
  earthquakes: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
  'natural-events': 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7',
};
const cache = new Map<HazardLayer, { until: number; request: Promise<ContextFeed> }>();
export function getRegionalContext(layer: HazardLayer): Promise<ContextFeed> {
  const existing = cache.get(layer);
  if (existing && existing.until > Date.now()) return existing.request;
  const request = (async (): Promise<ContextFeed> => {
    try {
      const response = await fetch(urls[layer], { signal: AbortSignal.timeout(8000), cache: 'no-store' });
      if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
      const events = parseRegionalEvents(layer, await response.json());
      return { layer, status: 'available', retrievedAt: new Date().toISOString(), events };
    } catch {
      return { layer, status: 'unavailable', retrievedAt: new Date().toISOString(), events: [], message: 'Public feed unavailable. Retry after one minute; no demonstration events are substituted.' };
    }
  })();
  cache.set(layer, { until: Date.now()+60000, request });
  return request;
}
