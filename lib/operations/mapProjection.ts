import { computeCorridorBounds, sampleGreatCircle, type GeoPoint } from "./corridorGeometry";

export type CanvasPoint = { x: number; y: number };
export type OperationalRouteView = { centerLongitude: number; centerMercatorY: number; scale: number; padding: number };

const DEG = Math.PI / 180;
const MAX_LATITUDE = 85;

function globalFrame(width: number, height: number, padding = 16) {
  const availableWidth = Math.max(1, width - padding * 2);
  const availableHeight = Math.max(1, height - padding * 2);
  const scale = Math.min(availableWidth / 360, availableHeight / 170);
  return { scale, left: (width - 360 * scale) / 2, top: (height - 170 * scale) / 2 };
}

export function projectGlobalPoint(point: GeoPoint, width: number, height: number): CanvasPoint {
  const frame = globalFrame(width, height);
  const latitude = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, point.latitude));
  return { x: frame.left + (point.longitude + 180) * frame.scale, y: frame.top + (MAX_LATITUDE - latitude) * frame.scale };
}

export function projectGlobalGeometryPoint(point: GeoPoint, width: number, height: number): CanvasPoint {
  return projectGlobalPoint(point, width, height);
}

export function unwrapRoute(route: readonly GeoPoint[]): GeoPoint[] {
  if (!route.length) return [];
  const result = [{ ...route[0] }];
  for (let index = 1; index < route.length; index += 1) {
    let longitude = route[index].longitude;
    while (longitude - result[index - 1].longitude > 180) longitude -= 360;
    while (longitude - result[index - 1].longitude < -180) longitude += 360;
    result.push({ ...route[index], longitude });
  }
  return result;
}

function mercatorY(latitude: number) {
  const limited = Math.max(-84, Math.min(84, latitude)) * DEG;
  return Math.log(Math.tan(Math.PI / 4 + limited / 2));
}

export function computeOperationalRouteView(start: GeoPoint, end: GeoPoint, width: number, height: number, padding = 56): OperationalRouteView {
  const route = unwrapRoute(sampleGreatCircle(start, end, 120));
  const bounds = computeCorridorBounds(route);
  const minY = Math.min(...route.map((point) => mercatorY(point.latitude)));
  const maxY = Math.max(...route.map((point) => mercatorY(point.latitude)));
  const availableWidth = Math.max(1, width - padding * 2);
  const availableHeight = Math.max(1, height - padding * 2);
  const longitudeSpan = Math.max(0.001, (bounds.maxLongitude - bounds.minLongitude) * DEG);
  const latitudeSpan = Math.max(0.001, maxY - minY);
  return {
    centerLongitude: (bounds.minLongitude + bounds.maxLongitude) / 2,
    centerMercatorY: (minY + maxY) / 2,
    scale: Math.min(availableWidth / longitudeSpan, availableHeight / latitudeSpan),
    padding,
  };
}

export function projectOperationalPoint(point: GeoPoint, width: number, height: number, view: OperationalRouteView): CanvasPoint {
  let longitude = point.longitude;
  while (longitude - view.centerLongitude > 180) longitude -= 360;
  while (longitude - view.centerLongitude < -180) longitude += 360;
  return { x: width / 2 + (longitude - view.centerLongitude) * DEG * view.scale, y: height / 2 - (mercatorY(point.latitude) - view.centerMercatorY) * view.scale };
}

// Administrative geometry deliberately retains raw WGS84 longitude. Only route
// and operational point calculations are allowed to unwrap around the corridor.
export function projectOperationalGeometryPoint(point: GeoPoint, width: number, height: number, view: OperationalRouteView): CanvasPoint {
  return { x: width / 2 + (point.longitude - view.centerLongitude) * DEG * view.scale, y: height / 2 - (mercatorY(point.latitude) - view.centerMercatorY) * view.scale };
}

export function splitPathAtDiscontinuity<T extends GeoPoint>(points: readonly T[], threshold = 180): T[][] {
  const paths: T[][] = [];
  for (const point of points) {
    const current = paths.at(-1);
    if (!current || (current.length && Math.abs(point.longitude - current.at(-1)!.longitude) > threshold)) paths.push([point]);
    else current.push(point);
  }
  return paths.filter((path) => path.length > 0);
}
