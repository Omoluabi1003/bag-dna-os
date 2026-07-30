"use client";

import { useEffect, useRef, useState } from "react";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";
import type { Airport } from "@/lib/operations/airports";
import { resolveCorridor, type OperationalCorridor } from "@/lib/operations/corridors";
import { sampleGreatCircle, type GeoPoint } from "@/lib/operations/corridorGeometry";
import {
  computeOperationalRouteView, projectGlobalGeometryPoint, projectGlobalPoint,
  projectOperationalGeometryPoint, projectOperationalPoint, splitPathAtDiscontinuity,
  type CanvasPoint, type OperationalRouteView,
} from "@/lib/operations/mapProjection";

type ViewMode = "GLOBAL" | "OPERATIONAL";
type Feature = { geometry?: { type: string; coordinates: unknown } };
type FeatureCollection = { features?: Feature[] };
type Props = {
  aircraft?: AircraftTrack[];
  corridor?: OperationalCorridor;
  origin?: Airport;
  destination?: Airport;
  transferAirports?: Airport[];
  initialView?: ViewMode;
};
const LAND_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function featureRings(feature: Feature): number[][][] {
  if (feature.geometry?.type === "Polygon") return feature.geometry.coordinates as number[][][];
  if (feature.geometry?.type === "MultiPolygon") return (feature.geometry.coordinates as number[][][][]).flat();
  return [];
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createRadialGradient(width / 2, height * .42, 0, width / 2, height / 2, Math.max(width, height));
  gradient.addColorStop(0, "#15334b"); gradient.addColorStop(.5, "#071725"); gradient.addColorStop(1, "#02070d");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
}

function tracePaths(ctx: CanvasRenderingContext2D, paths: readonly CanvasPoint[][], close: boolean) {
  for (const path of paths) {
    if (path.length < 2) continue;
    ctx.moveTo(path[0].x, path[0].y);
    for (const point of path.slice(1)) ctx.lineTo(point.x, point.y);
    if (close) ctx.closePath();
  }
}

function resolveProps(props: Props) {
  if (props.origin && props.destination) return { origin: props.origin, destination: props.destination };
  return props.corridor ? resolveCorridor(props.corridor) : undefined;
}

function ResolvedEngine({ aircraft = [], corridor, origin, destination, transferAirports = [], initialView = "OPERATIONAL" }:
  Omit<Props, "origin" | "destination"> & { origin: Airport; destination: Airport }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<Feature[]>([]);
  const [activeView, setActiveView] = useState<ViewMode>(initialView);
  const activeViewRef = useRef<ViewMode>(initialView);
  const operationalViewRef = useRef<OperationalRouteView | undefined>(undefined);
  const routeRef = useRef(sampleGreatCircle(origin, destination, 120));
  const sizeRef = useRef({ width: 1, height: 1 });
  const routeKey = corridor?.id ?? `${origin.iataCode}-${destination.iataCode}`;

  useEffect(() => {
    fetch(LAND_URL, { cache: "force-cache" }).then((response) => response.ok ? response.json() as Promise<FeatureCollection> : Promise.reject())
      .then((data) => { countriesRef.current = data.features ?? []; }).catch(() => { countriesRef.current = []; });
  }, []);

  // A corridor change invalidates both sampled geometry and the fitted camera.
  useEffect(() => {
    routeRef.current = sampleGreatCircle(origin, destination, 120);
    const { width, height } = sizeRef.current;
    operationalViewRef.current = computeOperationalRouteView(origin, destination, width, height);
  }, [routeKey, origin, destination]);

  useEffect(() => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    let frame = 0;
    const resize = () => {
      const rect = container.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.8);
      sizeRef.current = { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
      canvas.width = Math.round(sizeRef.current.width * dpr); canvas.height = Math.round(sizeRef.current.height * dpr);
      canvas.style.width = `${sizeRef.current.width}px`; canvas.style.height = `${sizeRef.current.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      operationalViewRef.current = computeOperationalRouteView(origin, destination, sizeRef.current.width, sizeRef.current.height);
    };
    resize(); const observer = new ResizeObserver(resize); observer.observe(container);

    const render = (now: number) => {
      const { width, height } = sizeRef.current;
      const mode = activeViewRef.current;
      const operationalView = operationalViewRef.current ?? computeOperationalRouteView(origin, destination, width, height);
      const projectPoint = (point: GeoPoint) => mode === "GLOBAL" ? projectGlobalPoint(point, width, height) : projectOperationalPoint(point, width, height, operationalView);
      const projectGeometry = (point: GeoPoint) => mode === "GLOBAL" ? projectGlobalGeometryPoint(point, width, height) : projectOperationalGeometryPoint(point, width, height, operationalView);
      drawBackground(ctx, width, height);

      ctx.strokeStyle = "rgba(104,188,226,.09)"; ctx.lineWidth = .7;
      for (let lon = -180; lon <= 180; lon += 20) { const a = projectGeometry({ longitude: lon, latitude: -85 }), b = projectGeometry({ longitude: lon, latitude: 85 }); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      for (let lat = -80; lat <= 80; lat += 20) { const line = Array.from({ length: 91 }, (_, i) => projectGeometry({ longitude: -180 + i * 4, latitude: lat })); ctx.beginPath(); tracePaths(ctx, [line], false); ctx.stroke(); }

      ctx.beginPath();
      for (const feature of countriesRef.current) for (const ring of featureRings(feature)) {
        const geographic = ring.map(([longitude, latitude]) => ({ longitude, latitude }));
        const paths = mode === "GLOBAL" ? splitPathAtDiscontinuity(geographic) : [geographic];
        tracePaths(ctx, paths.map((path) => path.map(projectGeometry)), true);
      }
      ctx.fillStyle = "rgba(27,73,66,.96)"; ctx.strokeStyle = "rgba(140,215,190,.28)"; ctx.lineWidth = .75; ctx.fill(); ctx.stroke();

      const routePaths = mode === "GLOBAL" ? splitPathAtDiscontinuity(routeRef.current) : [routeRef.current];
      ctx.save(); ctx.beginPath(); tracePaths(ctx, routePaths.map((path) => path.map(projectPoint)), false);
      ctx.strokeStyle = "rgba(215,168,75,.96)"; ctx.shadowColor = "rgba(215,168,75,.82)"; ctx.shadowBlur = 12;
      ctx.lineWidth = 2.2; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -(now * .025) % 18; ctx.stroke(); ctx.restore();

      for (const airport of [origin, ...transferAirports, destination]) {
        const point = projectPoint(airport), pulse = 7 + ((now * .02) % 15);
        ctx.strokeStyle = `rgba(215,168,75,${.55 - (pulse - 7) / 34})`; ctx.beginPath(); ctx.arc(point.x, point.y, pulse, 0, TAU); ctx.stroke();
        ctx.fillStyle = "#f0c96e"; ctx.beginPath(); ctx.arc(point.x, point.y, 3.8, 0, TAU); ctx.fill();
        ctx.font = "700 10px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.fillStyle = "white"; ctx.fillText(airport.iataCode, point.x, point.y - 14);
      }
      for (const track of aircraft.slice(0, 120)) {
        const point = projectPoint(track); if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) continue;
        ctx.save(); ctx.translate(point.x, point.y); ctx.rotate(((track.heading ?? 0) - 90) * DEG); ctx.fillStyle = track.onGround ? "#f6b94a" : "#27d3b7";
        ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -3); ctx.lineTo(-2, 0); ctx.lineTo(-4, 3); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [aircraft, destination, origin, routeKey, transferAirports]);

  const changeView = (mode: ViewMode) => {
    if (mode === "OPERATIONAL") {
      const { width, height } = sizeRef.current;
      operationalViewRef.current = computeOperationalRouteView(origin, destination, width, height);
    }
    activeViewRef.current = mode; setActiveView(mode);
  };

  return <div ref={containerRef} className="absolute inset-0 h-full w-full overflow-hidden bg-[#02070d]">
    <canvas ref={canvasRef} className="h-full w-full" aria-label={`${origin.iataCode} to ${destination.iataCode} ${activeView.toLowerCase()} map`} />
    <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/10 bg-[#04111d]/88 px-3 py-2 text-right font-mono text-[9px] text-white">{origin.iataCode} → {destination.iataCode}<div className="mt-1 text-white/50">{aircraft.length.toLocaleString()} LIVE TRACKS</div></div>
    <div className="absolute bottom-3 left-3 z-10 flex gap-1 rounded-lg border border-white/10 bg-[#04111d]/90 p-1">
      {(["GLOBAL", "OPERATIONAL"] as const).map((mode) => <button key={mode} type="button" onClick={() => changeView(mode)} aria-pressed={activeView === mode} className={`rounded-md px-2.5 py-1.5 text-[8px] font-semibold tracking-[.12em] ${activeView === mode ? "bg-[#d7a84b]/18 text-[#f0c96e]" : "text-white/55"}`}>{mode} VIEW</button>)}
    </div>
  </div>;
}

export default function MissionControlGeospatialEngine(props: Props) {
  const resolved = resolveProps(props);
  if (!resolved) return <div role="status" className="flex h-full items-center justify-center bg-[#02070d] p-8 text-sm text-amber-200">Route unavailable — airport data could not be validated.</div>;
  return <ResolvedEngine {...props} {...resolved} />;
}
