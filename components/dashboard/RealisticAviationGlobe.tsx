"use client";

import { useEffect, useRef, useState } from "react";
import { demoAirports } from "@/lib/demo/airports";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";

type Props = { aircraft?: AircraftTrack[] };
type Point = { latitude: number; longitude: number };
type Feature = { geometry?: { type: string; coordinates: unknown } };
type FeatureCollection = { features?: Feature[] };
type DragState = { active: boolean; x: number; y: number };

const LAND_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function project(point: Point, cx: number, cy: number, radius: number, rx: number, ry: number) {
  const lat = point.latitude * DEG;
  const lng = point.longitude * DEG;
  let x = Math.cos(lat) * Math.sin(lng);
  let y = Math.sin(lat);
  let z = Math.cos(lat) * Math.cos(lng);

  const cyaw = Math.cos(ry);
  const syaw = Math.sin(ry);
  [x, z] = [x * cyaw + z * syaw, -x * syaw + z * cyaw];

  const cpitch = Math.cos(rx);
  const spitch = Math.sin(rx);
  [y, z] = [y * cpitch - z * spitch, y * spitch + z * cpitch];

  return { x: cx + x * radius, y: cy - y * radius, depth: z, visible: z > -0.03 };
}

function rings(feature: Feature): number[][][] {
  const geometry = feature.geometry;
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates as number[][][];
  if (geometry.type === "MultiPolygon") return (geometry.coordinates as number[][][][]).flat();
  return [];
}

function greatCircle(start: Point, end: Point, steps = 72): Point[] {
  const aLat = start.latitude * DEG;
  const aLng = start.longitude * DEG;
  const bLat = end.latitude * DEG;
  const bLng = end.longitude * DEG;
  const a = [Math.cos(aLat) * Math.cos(aLng), Math.cos(aLat) * Math.sin(aLng), Math.sin(aLat)];
  const b = [Math.cos(bLat) * Math.cos(bLng), Math.cos(bLat) * Math.sin(bLng), Math.sin(bLat)];
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

export default function RealisticAviationGlobe({ aircraft = [] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: -0.14, y: 1.35 });
  const zoomRef = useRef(1);
  const dragRef = useRef<DragState>({ active: false, x: 0, y: 0 });
  const featuresRef = useRef<Feature[]>([]);
  const aircraftRef = useRef<AircraftTrack[]>(aircraft);
  const [landReady, setLandReady] = useState(false);
  const [mode, setMode] = useState<"GLOBE" | "REGIONAL">("GLOBE");

  useEffect(() => {
    aircraftRef.current = aircraft;
  }, [aircraft]);

  useEffect(() => {
    let cancelled = false;
    fetch(LAND_URL, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("boundaries unavailable");
        return response.json() as Promise<FeatureCollection>;
      })
      .then((data) => {
        if (cancelled) return;
        featuresRef.current = data.features ?? [];
        setLandReady(true);
      })
      .catch(() => {
        if (!cancelled) setLandReady(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const route = greatCircle(demoAirports[0], demoAirports[2]);
    let animationFrame = 0;
    let previous = performance.now();
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      width = Math.max(320, rect.width);
      height = Math.max(440, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const render = (now: number) => {
      const delta = Math.min(34, now - previous);
      previous = now;
      if (!dragRef.current.active && mode === "GLOBE") rotationRef.current.y += delta * 0.000025;

      const cx = width * 0.5;
      const cy = height * 0.53;
      const baseRadius = Math.min(width * 0.37, height * 0.405);
      const radius = baseRadius * zoomRef.current * (mode === "REGIONAL" ? 1.34 : 1);
      const { x: rx, y: ry } = rotationRef.current;

      const background = ctx.createRadialGradient(cx, cy * 0.84, 0, cx, cy, Math.max(width, height) * 0.78);
      background.addColorStop(0, "#102b43");
      background.addColorStop(0.48, "#06131f");
      background.addColorStop(1, "#010407");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.shadowColor = "rgba(42,143,255,.55)";
      ctx.shadowBlur = radius * 0.17;
      const ocean = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.42, radius * 0.08, cx, cy, radius);
      ocean.addColorStop(0, "#1e5c88");
      ocean.addColorStop(0.35, "#123f65");
      ocean.addColorStop(1, "#020b15");
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.clip();
      for (const feature of featuresRef.current) {
        for (const ring of rings(feature)) {
          ctx.beginPath();
          let started = false;
          let count = 0;
          for (const coordinate of ring) {
            const point = project({ longitude: coordinate[0], latitude: coordinate[1] }, cx, cy, radius, rx, ry);
            if (!point.visible) { started = false; continue; }
            count += 1;
            if (!started) { ctx.moveTo(point.x, point.y); started = true; } else ctx.lineTo(point.x, point.y);
          }
          if (count < 3) continue;
          ctx.closePath();
          ctx.fillStyle = "rgba(38,91,77,.98)";
          ctx.fill();
          ctx.strokeStyle = "rgba(166,218,190,.32)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "rgba(215,168,75,.95)";
      ctx.shadowColor = "rgba(215,168,75,.9)";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.setLineDash([9, 7]);
      ctx.lineDashOffset = -(now * 0.025) % 16;
      ctx.beginPath();
      let routeStarted = false;
      for (const point of route) {
        const projected = project(point, cx, cy, radius * 1.012, rx, ry);
        if (!projected.visible) { routeStarted = false; continue; }
        if (!routeStarted) { ctx.moveTo(projected.x, projected.y); routeStarted = true; } else ctx.lineTo(projected.x, projected.y);
      }
      ctx.stroke();
      ctx.restore();

      for (const airport of demoAirports) {
        const point = project(airport, cx, cy, radius * 1.016, rx, ry);
        if (!point.visible || point.depth < 0) continue;
        ctx.fillStyle = "#f0c96e";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3.5, 0, TAU);
        ctx.fill();
        ctx.font = "600 10px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,.92)";
        ctx.fillText(airport.code, point.x, point.y - 13);
      }

      for (const track of aircraftRef.current.slice(0, 90)) {
        const point = project(track, cx, cy, radius * 1.022, rx, ry);
        if (!point.visible || point.depth < 0.08) continue;
        ctx.save();
        ctx.translate(point.x, point.y);
        ctx.rotate(((track.heading ?? 0) - 90) * DEG);
        ctx.fillStyle = track.onGround ? "#f6b94a" : "#27d3b7";
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(-4, -2.8);
        ctx.lineTo(-2.5, 0);
        ctx.lineTo(-4, 2.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.strokeStyle = "rgba(130,207,255,.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.stroke();

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [mode]);

  const focusCorridor = () => {
    const routeMidpoint = greatCircle(demoAirports[0], demoAirports[2], 3)[1];
    rotationRef.current = {
      x: routeMidpoint.latitude * DEG,
      y: -routeMidpoint.longitude * DEG,
    };
    zoomRef.current = 1.08;
    setMode("REGIONAL");
  };

  const resetGlobe = () => {
    rotationRef.current = { x: -0.14, y: 1.35 };
    zoomRef.current = 1;
    setMode("GLOBE");
  };

  return (
    <div ref={containerRef} className="relative h-[560px] min-h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#010407] shadow-[0_30px_100px_rgba(0,0,0,.55)]">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        aria-label="Interactive BAG-DNA aviation intelligence globe"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragRef.current = { active: true, x: event.clientX, y: event.clientY };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (!drag.active) return;
          rotationRef.current.y += (event.clientX - drag.x) * 0.006;
          rotationRef.current.x = Math.max(-1.25, Math.min(1.25, rotationRef.current.x + (event.clientY - drag.y) * 0.004));
          dragRef.current = { active: true, x: event.clientX, y: event.clientY };
        }}
        onPointerUp={() => { dragRef.current.active = false; }}
        onPointerCancel={() => { dragRef.current.active = false; }}
        onWheel={(event) => {
          event.preventDefault();
          zoomRef.current = Math.max(0.76, Math.min(1.55, zoomRef.current - event.deltaY * 0.0007));
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <div className="rounded-xl border border-white/10 bg-[#05111c]/88 px-3 py-2 text-[10px] text-white shadow-2xl backdrop-blur-md">
          <div className="font-semibold tracking-[0.17em] text-[#27d3b7]">BAG-DNA GEOSPATIAL ENGINE</div>
          <div className="mt-1 text-white/58">Natural Earth boundaries · live OpenSky tracks · atmospheric context</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#05111c]/88 px-3 py-2 text-right text-[10px] shadow-2xl backdrop-blur-md">
          <div className="font-mono text-white">{aircraft.length.toLocaleString()} LIVE TRACKS</div>
          <div className="mt-1 text-white/50">{landReady ? "GEOMETRY ONLINE" : "GEOMETRY LOADING"}</div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 flex items-end gap-2">
        <div className="pointer-events-none rounded-xl border border-[#d7a84b]/25 bg-[#05111c]/90 px-3 py-2 text-[10px] shadow-2xl backdrop-blur-md">
          <div className="font-semibold tracking-[0.14em] text-[#d7a84b]">ACTIVE BAG JOURNEY</div>
          <div className="mt-1 text-white/65">MIA → ATL · DEMO BAG DATA · LIVE AVIATION CONTEXT</div>
        </div>
        <div className="flex gap-1 rounded-xl border border-white/10 bg-[#05111c]/90 p-1 shadow-2xl backdrop-blur-md">
          <button type="button" onClick={resetGlobe} className={`rounded-lg px-3 py-2 text-[9px] font-semibold tracking-[.12em] transition ${mode === "GLOBE" ? "bg-white/12 text-white" : "text-white/50 hover:text-white"}`}>GLOBE</button>
          <button type="button" onClick={focusCorridor} className={`rounded-lg px-3 py-2 text-[9px] font-semibold tracking-[.12em] transition ${mode === "REGIONAL" ? "bg-[#d7a84b]/18 text-[#f0c96e]" : "text-white/50 hover:text-white"}`}>CORRIDOR</button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-white/8 bg-black/30 px-2.5 py-1.5 text-[9px] text-white/45 backdrop-blur-sm">
        Drag to rotate · scroll to zoom
      </div>
    </div>
  );
}
