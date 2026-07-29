"use client";

import { useEffect, useRef, useState } from "react";
import { demoAirports } from "@/lib/demo/airports";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";

type Props = { aircraft?: AircraftTrack[] };
type Point = { latitude: number; longitude: number };
type ScreenPoint = { x: number; y: number; depth: number; visible: boolean };
type Ring = number[][];
type LandFeature = { properties?: { ADMIN?: string; NAME?: string }; geometry?: { type: string; coordinates: unknown } };
type LandCollection = { features?: LandFeature[] };
type DragState = { active: boolean; x: number; y: number };

const LAND_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function seeded(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const STARS = Array.from({ length: 115 }, (_, index) => ({
  x: seeded(index + 11),
  y: seeded(index + 41),
  radius: 0.45 + seeded(index + 71) * 1.25,
  alpha: 0.13 + seeded(index + 101) * 0.45,
  phase: seeded(index + 131) * TAU,
}));

const CLOUDS = Array.from({ length: 34 }, (_, index) => ({
  latitude: -62 + seeded(index + 201) * 124,
  longitude: -180 + seeded(index + 251) * 360,
  width: 18 + seeded(index + 301) * 42,
  opacity: 0.04 + seeded(index + 351) * 0.09,
  phase: seeded(index + 401) * TAU,
}));

function rotateVector(latitude: number, longitude: number, rotationX: number, rotationY: number) {
  const lat = latitude * DEG;
  const lng = longitude * DEG;
  let x = Math.cos(lat) * Math.sin(lng);
  let y = Math.sin(lat);
  let z = Math.cos(lat) * Math.cos(lng);

  const cy = Math.cos(rotationY);
  const sy = Math.sin(rotationY);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  x = x1;
  z = z1;

  const cx = Math.cos(rotationX);
  const sx = Math.sin(rotationX);
  const y1 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  y = y1;
  z = z2;

  return { x, y, z };
}

function project(point: Point, cx: number, cy: number, radius: number, rotationX: number, rotationY: number): ScreenPoint {
  const rotated = rotateVector(point.latitude, point.longitude, rotationX, rotationY);
  return {
    x: cx + rotated.x * radius,
    y: cy - rotated.y * radius,
    depth: rotated.z,
    visible: rotated.z > -0.025,
  };
}

function geometryRings(geometry: LandFeature["geometry"]): Ring[] {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates as Ring[];
  if (geometry.type === "MultiPolygon") return (geometry.coordinates as Ring[][]).flat();
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
  const sinOmega = Math.sin(omega) || 1;
  return Array.from({ length: steps }, (_, index) => {
    const t = index / (steps - 1);
    const s0 = Math.sin((1 - t) * omega) / sinOmega;
    const s1 = Math.sin(t * omega) / sinOmega;
    const x = a[0] * s0 + b[0] * s1;
    const y = a[1] * s0 + b[1] * s1;
    const z = a[2] * s0 + b[2] * s1;
    return { latitude: Math.atan2(z, Math.hypot(x, y)) / DEG, longitude: Math.atan2(y, x) / DEG };
  });
}

function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number, now: number) {
  ctx.save();
  for (const star of STARS) {
    const pulse = Math.sin(now * 0.00055 + star.phase) * 0.08;
    ctx.fillStyle = `rgba(220,238,255,${Math.max(0.05, star.alpha + pulse)})`;
    ctx.beginPath();
    ctx.arc(star.x * width, star.y * height, star.radius, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawGlobeBase(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.shadowColor = "rgba(42,143,255,.52)";
  ctx.shadowBlur = radius * 0.17;
  const ocean = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.42, radius * 0.08, cx, cy, radius);
  ocean.addColorStop(0, "#1e5c88");
  ocean.addColorStop(0.33, "#123f65");
  ocean.addColorStop(0.72, "#082842");
  ocean.addColorStop(1, "#020b15");
  ctx.fillStyle = ocean;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rx: number, ry: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();
  ctx.strokeStyle = "rgba(121,194,232,.10)";
  ctx.lineWidth = 0.7;
  const lines: Point[][] = [];
  for (let lat = -60; lat <= 60; lat += 30) lines.push(Array.from({ length: 121 }, (_, i) => ({ latitude: lat, longitude: -180 + i * 3 })));
  for (let lng = -150; lng <= 180; lng += 30) lines.push(Array.from({ length: 61 }, (_, i) => ({ latitude: -90 + i * 3, longitude: lng })));
  for (const line of lines) {
    ctx.beginPath();
    let drawing = false;
    for (const point of line) {
      const p = project(point, cx, cy, radius, rx, ry);
      if (!p.visible) { drawing = false; continue; }
      if (!drawing) { ctx.moveTo(p.x, p.y); drawing = true; } else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawLand(ctx: CanvasRenderingContext2D, features: LandFeature[], cx: number, cy: number, radius: number, rx: number, ry: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();
  for (const feature of features) {
    for (const ring of geometryRings(feature.geometry)) {
      ctx.beginPath();
      let started = false;
      let visibleCount = 0;
      for (const coordinate of ring) {
        const p = project({ longitude: coordinate[0], latitude: coordinate[1] }, cx, cy, radius, rx, ry);
        if (!p.visible) { started = false; continue; }
        visibleCount += 1;
        if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y);
      }
      if (visibleCount < 3) continue;
      ctx.closePath();
      const land = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      land.addColorStop(0, "rgba(72,125,103,.98)");
      land.addColorStop(0.48, "rgba(38,91,77,.98)");
      land.addColorStop(1, "rgba(18,56,49,.98)");
      ctx.fillStyle = land;
      ctx.fill();
      ctx.strokeStyle = "rgba(166,218,190,.32)";
      ctx.lineWidth = Math.max(0.45, radius / 760);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawClouds(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rx: number, ry: number, now: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";
  for (const cloud of CLOUDS) {
    const longitude = cloud.longitude + (now * 0.0018) % 360;
    const p = project({ latitude: cloud.latitude, longitude }, cx, cy, radius, rx, ry);
    if (!p.visible || p.depth < 0.05) continue;
    const scale = Math.max(0.12, p.depth);
    const w = (cloud.width / 180) * radius * scale;
    const h = w * (0.22 + seeded(Math.round(cloud.phase * 100)) * 0.18);
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, w);
    gradient.addColorStop(0, `rgba(255,255,255,${cloud.opacity * scale})`);
    gradient.addColorStop(0.55, `rgba(220,239,255,${cloud.opacity * 0.7 * scale})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, w, h, cloud.phase, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawRoute(ctx: CanvasRenderingContext2D, points: Point[], cx: number, cy: number, radius: number, rx: number, ry: number, now: number) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(215,168,75,.9)";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "rgba(215,168,75,.92)";
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 7]);
  ctx.lineDashOffset = -(now * 0.025) % 16;
  ctx.beginPath();
  let drawing = false;
  for (const point of points) {
    const p = project(point, cx, cy, radius * 1.012, rx, ry);
    if (!p.visible) { drawing = false; continue; }
    if (!drawing) { ctx.moveTo(p.x, p.y); drawing = true; } else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawBeacon(ctx: CanvasRenderingContext2D, point: Point, label: string, cx: number, cy: number, radius: number, rx: number, ry: number, now: number) {
  const p = project(point, cx, cy, radius * 1.016, rx, ry);
  if (!p.visible || p.depth < 0) return;
  const pulse = 7 + ((now * 0.025) % 18);
  ctx.save();
  ctx.strokeStyle = `rgba(215,168,75,${0.62 - (pulse - 7) / 35})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(p.x, p.y, pulse, 0, TAU);
  ctx.stroke();
  ctx.fillStyle = "#f0c96e";
  ctx.shadowColor = "#f0c96e";
  ctx.shadowBlur = 13;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 3.4, 0, TAU);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,.92)";
  ctx.fillText(label, p.x, p.y - 13);
  ctx.restore();
}

function drawAircraft(ctx: CanvasRenderingContext2D, aircraft: AircraftTrack[], cx: number, cy: number, radius: number, rx: number, ry: number) {
  ctx.save();
  for (const track of aircraft.slice(0, 90)) {
    const p = project(track, cx, cy, radius * 1.022, rx, ry);
    if (!p.visible || p.depth < 0.08) continue;
    const angle = ((track.heading ?? 0) - 90) * DEG;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(angle);
    ctx.fillStyle = track.onGround ? "rgba(246,185,74,.9)" : "rgba(39,211,183,.92)";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-4, -2.8);
    ctx.lineTo(-2.5, 0);
    ctx.lineTo(-4, 2.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawAtmosphere(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.88, cx, cy, radius * 1.11);
  atmosphere.addColorStop(0, "rgba(83,181,255,0)");
  atmosphere.addColorStop(0.67, "rgba(83,181,255,.12)");
  atmosphere.addColorStop(0.84, "rgba(83,181,255,.28)");
  atmosphere.addColorStop(1, "rgba(83,181,255,0)");
  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.12, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(130,207,255,.32)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

export default function RealisticAviationGlobe({ aircraft = [] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: -0.14, y: 1.35 });
  const zoomRef = useRef(1);
  const dragRef = useRef<DragState>({ active: false, x: 0, y: 0 });
  const featuresRef = useRef<LandFeature[]>([]);
  const aircraftRef = useRef(aircraft);
  const [landReady, setLandReady] = useState(false);
  const [mode, setMode] = useState<"GLOBE" | "REGIONAL">("GLOBE");
  aircraftRef.current = aircraft;

  useEffect(() => {
    let cancelled = false;
    fetch(LAND_URL, { cache: "force-cache" })
      .then((response) => response.ok ? response.json() as Promise<LandCollection> : Promise.reject(new Error("boundaries unavailable")))
      .then((data) => {
        if (cancelled) return;
        featuresRef.current = data.features ?? [];
        setLandReady(true);
      })
      .catch(() => setLandReady(false));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const corridor = greatCircle(demoAirports[0], demoAirports[2]);
    let frame = 0;
    let last = performance.now();
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
      const delta = Math.min(34, now - last);
      last = now;
      const dragging = dragRef.current.active;
      if (!dragging && mode === "GLOBE") rotationRef.current.y += delta * 0.000025;
      const cx = width * 0.5;
      const cy = height * 0.53;
      const baseRadius = Math.min(width * 0.37, height * 0.405);
      const radius = baseRadius * zoomRef.current * (mode === "REGIONAL" ? 1.34 : 1);
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;

      const backdrop = ctx.createRadialGradient(cx, cy * 0.84, 0, cx, cy, Math.max(width, height) * 0.78);
      backdrop.addColorStop(0, "#102b43");
      backdrop.addColorStop(0.48, "#06131f");
      backdrop.addColorStop(1, "#010407");
      ctx.fillStyle = backdrop;
      ctx.fillRect(0, 0, width, height);
      drawStars(ctx, width, height, now);
      drawGlobeBase(ctx, cx, cy, radius);
      drawGrid(ctx, cx, cy, radius, rx, ry);
      drawLand(ctx, featuresRef.current, cx, cy, radius, rx, ry);
      drawClouds(ctx, cx, cy, radius, rx, ry, now);
      drawRoute(ctx, corridor, cx, cy, radius, rx, ry, now);
      for (const airport of demoAirports) drawBeacon(ctx, airport, airport.code, cx, cy, radius, rx, ry, now);
      drawAircraft(ctx, aircraftRef.current, cx, cy, radius, rx, ry);
      drawAtmosphere(ctx, cx, cy, radius);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [mode]);

  const focusCorridor = () => {
    rotationRef.current = { x: -0.37, y: 1.47 };
    zoomRef.current = 1.15;
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
