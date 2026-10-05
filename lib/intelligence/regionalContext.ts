import type { GeoPoint } from '../operations/corridorGeometry';
export type HazardLayer = 'earthquakes' | 'natural-events';
export type RegionalEvent = GeoPoint & { id: string; title: string; category: string; observedAt: string; magnitude: number | null; source: 'USGS' | 'NASA EONET'; url: string };
export type ContextFeed = { layer: HazardLayer; status: 'available' | 'unavailable'; retrievedAt: string; events: RegionalEvent[]; message?: string };
const record = (v: unknown): Record<string, unknown> => v && typeof v === 'object' ? v as Record<string, unknown> : {};
const numeric = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
function point(v: unknown): GeoPoint | undefined {
  if (!Array.isArray(v) || !numeric(v[0]) || !numeric(v[1]) || Math.abs(v[0]) > 180 || Math.abs(v[1]) > 90) return;
  return { longitude: v[0], latitude: v[1] };
}
function sourceUrl(value: unknown, host: string): string | undefined {
  try { const u = new URL(String(value)); return u.protocol === 'https:' && u.hostname === host ? u.href : undefined; } catch { return; }
}
export function parseRegionalEvents(layer: HazardLayer, payload: unknown): RegionalEvent[] {
  const data = record(payload), collection = layer === 'earthquakes' ? data.features : data.events;
  if (!Array.isArray(collection)) throw new Error('Source returned an invalid event collection');
  const out: RegionalEvent[] = [];
  for (const raw of collection) {
    const item = record(raw), p = record(item.properties);
    let location: GeoPoint | undefined, observedAt: string, url: string | undefined;
    if (layer === 'earthquakes') {
      location = point(record(item.geometry).coordinates);
      if (!numeric(p.time) || Math.abs(p.time) > 8640000000000000) continue;
      observedAt = new Date(p.time).toISOString(); url = sourceUrl(p.url, 'earthquake.usgs.gov');
    } else {
      const geometry = Array.isArray(item.geometry) ? item.geometry.map(record).filter(g => g.type === 'Point' && Number.isFinite(Date.parse(String(g.date)))).sort((a,b) => Date.parse(String(b.date)) - Date.parse(String(a.date)))[0] : undefined;
      location = point(geometry?.coordinates);
      observedAt = String(geometry?.date ?? ''); url = sourceUrl(item.link, 'eonet.gsfc.nasa.gov');
    }
    if (!location || !url || !Number.isFinite(Date.parse(observedAt)) || typeof item.id !== 'string') continue;
    const categories = Array.isArray(item.categories) ? item.categories.map(c => String(record(c).title ?? '')).filter(Boolean).join(', ') : '';
    out.push({ ...location, id: `${layer}:${item.id}`, title: String(layer === 'earthquakes' ? p.title ?? p.place ?? 'Earthquake' : item.title ?? 'Natural event').slice(0,240), category: layer === 'earthquakes' ? 'Earthquake' : categories || 'Natural event', observedAt, magnitude: layer === 'earthquakes' && numeric(p.mag) ? p.mag : null, source: layer === 'earthquakes' ? 'USGS' : 'NASA EONET', url });
  }
  return Array.from(new Map(out.map(e => [e.id, e])).values());
}
const rad = Math.PI / 180;
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = (b.latitude-a.latitude)*rad, dLon = (b.longitude-a.longitude)*rad;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.latitude*rad)*Math.cos(b.latitude*rad)*Math.sin(dLon/2)**2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1,Math.max(0,h))));
}
function bearing(a: GeoPoint,b: GeoPoint) { const dl=(b.longitude-a.longitude)*rad; return Math.atan2(Math.sin(dl)*Math.cos(b.latitude*rad), Math.cos(a.latitude*rad)*Math.sin(b.latitude*rad)-Math.sin(a.latitude*rad)*Math.cos(b.latitude*rad)*Math.cos(dl)); }
export function corridorDistanceKm(p: GeoPoint,a: GeoPoint,b?: GeoPoint): number {
  if (!b || distanceKm(a,b)<0.001) return distanceKm(p,a);
  const segment = distanceKm(a,b)/6371, d = distanceKm(a,p)/6371, angle = bearing(a,p)-bearing(a,b);
  const along = Math.atan2(Math.sin(d)*Math.cos(angle), Math.cos(d));
  if (along < 0 || along > segment) return Math.min(distanceKm(p,a),distanceKm(p,b));
  return Math.abs(Math.asin(Math.max(-1,Math.min(1,Math.sin(d)*Math.sin(angle)))))*6371;
}
export function sourceFresh(feed: ContextFeed, now = Date.now()) { const age=now-Date.parse(feed.retrievedAt); return feed.status === 'available' && age>=0 && age<15*60*1000; }
export function eventCurrent(event: RegionalEvent, now = Date.now()) { const age=now-Date.parse(event.observedAt); return age>=0 && age< (event.source==='USGS'?24:7*24)*60*60*1000; }
export function filterRegionalEvents(events: RegionalEvent[], origin: GeoPoint, destination: GeoPoint | undefined, radiusKm: number, minMagnitude: number) {
  return events.filter(e => (e.magnitude === null || e.magnitude >= minMagnitude) && corridorDistanceKm(e,origin,destination)<=radiusKm).sort((a,b)=>Date.parse(b.observedAt)-Date.parse(a.observedAt));
}
