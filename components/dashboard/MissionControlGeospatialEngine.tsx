"use client";

import { useEffect, useRef, useState } from "react";
import { demoAirports } from "@/lib/demo/airports";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";

type Props = { aircraft?: AircraftTrack[] };
type GeoPoint = { latitude: number; longitude: number };
type Feature = { geometry?: { type: string; coordinates: unknown } };
type FeatureCollection = { features?: Feature[] };
type ViewState = { centerLon: number; centerLat: number; zoom: number };
type DragState = { active: boolean; x: number; y: number };

const LAND_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const ROUTE_START = demoAirports[0];
const ROUTE_END = demoAirports[2];

function rings(feature: Feature): number[][][] {
  const geometry = feature.geometry;
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates as number[][][];
  if (geometry.type === "MultiPolygon") return (geometry.coordinates as number[][][][]).flat();
  return [];
}

function greatCircle(start: GeoPoint, end: GeoPoint, steps = 90): GeoPoint[] {
  const aLat = start.latitude * DEG;
  const aLon = start.longitude * DEG;
  const bLat = end.latitude * DEG;
  const bLon = end.longitude * DEG;
  const a = [Math.cos(aLat) * Math.cos(aLon), Math.cos(aLat) * Math.sin(aLon), Math.sin(aLat)];
  const b = [Math.cos(bLat) * Math.cos(bLon), Math.cos(bLat) * Math.sin(bLon), Math.sin(bLat)];
  const omega = Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  const divisor = Math.sin(omega) || 1;
  return Array.from({ length: steps }, (_, index) => {
    const t = index / (steps - 1);
    const s0 = Math.sin((1 - t) * omega) / divisor;
    const s1 = Math.sin(t * omega) / divisor;
    const x = a[0] * s0 + b[0] * s1;
    const y = a[1] * s0 + b[1] * s1;
    const z = a[2] * s0 + b[2] * s1;
    return { latitude: Math.atan2(z, Math.hypot(x, y)) / DEG, longitude: Math.atan2(y, x) / DEG };
  });
}

function mercatorY(latitude: number) {
  const limited = Math.max(-84, Math.min(84, latitude)) * DEG;
  return Math.log(Math.tan(Math.PI / 4 + limited / 2));
}

function project(point: GeoPoint, width: number, height: number, view: ViewState) {
  const scale = (256 * 2 ** view.zoom) / TAU;
  const centerY = mercatorY(view.centerLat);
  let deltaLon = point.longitude - view.centerLon;
  while (deltaLon > 180) deltaLon -= 360;
  while (deltaLon < -180) deltaLon += 360;
  return {
    x: width / 2 + deltaLon * DEG * scale,
    y: height / 2 - (mercatorY(point.latitude) - centerY) * scale,
  };
}

// Natural Earth rings must retain their source longitude. Wrapping a country
// around the camera can pull an otherwise offscreen polygon across the canvas.
function projectLandPoint(point: GeoPoint, width: number, height: number, view: ViewState) {
  const scale = (256 * 2 ** view.zoom) / TAU;
  return {
    x: width / 2 + (point.longitude - view.centerLon) * DEG * scale,
    y: height / 2 - (mercatorY(point.latitude) - mercatorY(view.centerLat)) * scale,
  };
}

function fitBounds(start: GeoPoint, end: GeoPoint, width: number, height: number, padding: number): ViewState {
  const minLon = Math.min(start.longitude, end.longitude);
  const maxLon = Math.max(start.longitude, end.longitude);
  const minLat = Math.min(start.latitude, end.latitude);
  const maxLat = Math.max(start.latitude, end.latitude);
  const centerLon = (minLon + maxLon) / 2;
  const centerLat = (minLat + maxLat) / 2;
  const availableWidth = Math.max(1, width - padding * 2);
  const availableHeight = Math.max(1, height - padding * 2);
  const longitudeSpan = Math.max(0.001, (maxLon - minLon) * DEG);
  const centerY = mercatorY(centerLat);
  const latitudeSpan = Math.max(
    0.001,
    2 * Math.max(Math.abs(mercatorY(minLat) - centerY), Math.abs(mercatorY(maxLat) - centerY)),
  );
  const scale = Math.min(availableWidth / longitudeSpan, availableHeight / latitudeSpan);
  return { centerLon, centerLat, zoom: Math.log2((scale * TAU) / 256) };
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createRadialGradient(width * 0.52, height * 0.42, 0, width * 0.52, height * 0.45, Math.max(width, height) * 0.85);
  gradient.addColorStop(0, "#15334b");
  gradient.addColorStop(0.48, "#071725");
  gradient.addColorStop(1, "#02070d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

export default function MissionControlGeospatialEngine({ aircraft = [] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<Feature[]>([]);
  const aircraftRef = useRef(aircraft);
  const viewRef = useRef<ViewState>({ centerLon: -82.55, centerLat: 29.8, zoom: 4.35 });
  const activeViewRef = useRef<"operational" | "global">("operational");
  const operationalFitRef = useRef(false);
  const sizeRef = useRef({ width: 1, height: 1 });
  const dragRef = useRef<DragState>({ active: false, x: 0, y: 0 });
  const [geometryState, setGeometryState] = useState<"loading" | "online" | "degraded">("loading");
  const [activeView, setActiveView] = useState<"operational" | "global">("operational");

  useEffect(() => { aircraftRef.current = aircraft; }, [aircraft]);

  useEffect(() => {
    let cancelled = false;
    fetch(LAND_URL, { cache: "force-cache" })
      .then((response) => response.ok ? response.json() as Promise<FeatureCollection> : Promise.reject(new Error("boundaries unavailable")))
      .then((data) => {
        if (cancelled) return;
        featuresRef.current = data.features ?? [];
        setGeometryState("online");
      })
      .catch(() => { if (!cancelled) setGeometryState("degraded"); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const route = greatCircle(ROUTE_START, ROUTE_END);
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      sizeRef.current = { width, height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (activeViewRef.current === "operational" && !operationalFitRef.current && rect.width > 0 && rect.height > 0) {
        viewRef.current = fitBounds(ROUTE_START, ROUTE_END, width, height, Math.min(90, Math.max(42, Math.min(width, height) * 0.16)));
        operationalFitRef.current = true;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const render = (now: number) => {
      const view = viewRef.current;
      drawBackground(ctx, width, height);

      ctx.save();
      ctx.strokeStyle = "rgba(104,188,226,.09)";
      ctx.lineWidth = 0.7;
      for (let lon = -180; lon <= 180; lon += 10) {
        const a = project({ longitude: lon, latitude: -80 }, width, height, view);
        const b = project({ longitude: lon, latitude: 80 }, width, height, view);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (let lat = -80; lat <= 80; lat += 10) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 4) {
          const point = project({ longitude: lon, latitude: lat }, width, height, view);
          if (!started) { ctx.moveTo(point.x, point.y); started = true; } else ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      for (const feature of featuresRef.current) {
        for (const ring of rings(feature)) {
          const points = ring.map((coordinate) => projectLandPoint(
            { longitude: coordinate[0], latitude: coordinate[1] }, width, height, view,
          )).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
          if (points.length < 3) continue;
          const xs = points.map((point) => point.x);
          const ys = points.map((point) => point.y);
          if (Math.max(...xs) < 0 || Math.min(...xs) > width || Math.max(...ys) < 0 || Math.min(...ys) > height) continue;

          const subpaths: typeof points[] = [];
          let subpath: typeof points = [];
          for (const point of points) {
            if (subpath.length && Math.abs(point.x - subpath[subpath.length - 1].x) > width / 2) {
              if (subpath.length >= 3) subpaths.push(subpath);
              subpath = [];
            }
            subpath.push(point);
          }
          if (subpath.length >= 3) subpaths.push(subpath);
          for (const path of subpaths) {
            if (Math.abs(path[0].x - path[path.length - 1].x) > width / 2) continue;
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (const point of path.slice(1)) ctx.lineTo(point.x, point.y);
            ctx.closePath();
            ctx.fillStyle = "rgba(27,73,66,.96)";
            ctx.fill();
            ctx.strokeStyle = "rgba(140,215,190,.28)";
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      ctx.save();
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(215,168,75,.96)";
      ctx.shadowColor = "rgba(215,168,75,.82)";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -(now * 0.025) % 18;
      ctx.beginPath();
      route.forEach((item, index) => {
        const point = project(item, width, height, view);
        if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();

      for (const airport of demoAirports) {
        const point = project(airport, width, height, view);
        const pulse = 7 + ((now * 0.02) % 15);
        ctx.strokeStyle = `rgba(215,168,75,${0.55 - (pulse - 7) / 34})`;
        ctx.beginPath(); ctx.arc(point.x, point.y, pulse, 0, TAU); ctx.stroke();
        ctx.fillStyle = "#f0c96e";
        ctx.beginPath(); ctx.arc(point.x, point.y, 3.8, 0, TAU); ctx.fill();
        ctx.font = "700 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,.95)";
        ctx.fillText(airport.code, point.x, point.y - 14);
      }

      for (const track of aircraftRef.current.slice(0, 120)) {
        const point = project(track, width, height, view);
        if (point.x < -20 || point.x > width + 20 || point.y < -20 || point.y > height + 20) continue;
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.rotate(((track.heading ?? 0) - 90) * DEG);
        ctx.fillStyle = track.onGround ? "#f6b94a" : "#27d3b7";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 7;
        ctx.beginPath();
        ctx.moveTo(6, 0); ctx.lineTo(-4.5, -3); ctx.lineTo(-2.7, 0); ctx.lineTo(-4.5, 3); ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, []);

  const resetCorridor = () => {
    const { width, height } = sizeRef.current;
    viewRef.current = fitBounds(ROUTE_START, ROUTE_END, width, height, Math.min(90, Math.max(42, Math.min(width, height) * 0.16)));
    activeViewRef.current = "operational";
    operationalFitRef.current = true;
    setActiveView("operational");
  };
  const showWorld = () => {
    const { width, height } = sizeRef.current;
    viewRef.current = fitBounds(
      { longitude: -180, latitude: -72 }, { longitude: 180, latitude: 78 }, width, height, 24,
    );
    activeViewRef.current = "global";
    setActiveView("global");
  };

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full overflow-hidden bg-[#02070d]">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        aria-label="Interactive BAG-DNA Mission Control operational map"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { active: true, x: event.clientX, y: event.clientY }; }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag.active) return;
          const scale = 2 ** viewRef.current.zoom;
          viewRef.current.centerLon -= (event.clientX - drag.x) * (0.72 / scale);
          viewRef.current.centerLat += (event.clientY - drag.y) * (0.52 / scale);
          viewRef.current.centerLat = Math.max(-75, Math.min(75, viewRef.current.centerLat));
          dragRef.current = { active: true, x: event.clientX, y: event.clientY };
        }}
        onPointerUp={() => { dragRef.current.active = false; }}
        onPointerCancel={() => { dragRef.current.active = false; }}
        onWheel={(event) => { event.preventDefault(); viewRef.current.zoom = Math.max(1.1, Math.min(8.5, viewRef.current.zoom - event.deltaY * 0.0013)); }}
      />

      <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/10 bg-[#04111d]/88 px-3 py-2 text-right text-[9px] shadow-2xl backdrop-blur-md">
        <div className="font-mono text-white">{aircraft.length.toLocaleString()} LIVE TRACKS</div>
        <div className={`mt-1 ${geometryState === "degraded" ? "text-amber-300" : "text-white/50"}`}>{geometryState === "online" ? "OPERATIONAL GEOMETRY ONLINE" : geometryState === "degraded" ? "OPERATIONAL GEOMETRY DEGRADED" : "LOADING OPERATIONAL GEOMETRY"}</div>
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex gap-1 rounded-lg border border-white/10 bg-[#04111d]/90 p-1 shadow-2xl backdrop-blur-md">
        <button type="button" onClick={resetCorridor} aria-pressed={activeView === "operational"} className={`rounded-md px-2.5 py-1.5 text-[8px] font-semibold tracking-[.12em] ${activeView === "operational" ? "bg-[#d7a84b]/18 text-[#f0c96e]" : "text-white/55 hover:text-white"}`}>OPERATIONAL VIEW</button>
        <button type="button" onClick={showWorld} aria-pressed={activeView === "global"} className={`rounded-md px-2.5 py-1.5 text-[8px] font-semibold tracking-[.12em] ${activeView === "global" ? "bg-[#d7a84b]/18 text-[#f0c96e]" : "text-white/55 hover:text-white"}`}>GLOBAL VIEW</button>
      </div>
    </div>
  );
}
