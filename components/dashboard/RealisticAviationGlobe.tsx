"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { demoAirports } from "@/lib/demo/airports";
import type { AircraftTrack } from "@/lib/integrations/liveOperations";

type Props = { aircraft?: AircraftTrack[] };

type GeoPoint = { latitude: number; longitude: number };

const EARTH_RADIUS = 2.25;

function latLngToVector3({ latitude, longitude }: GeoPoint, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function arcPoints(start: GeoPoint, end: GeoPoint) {
  const a = latLngToVector3(start, EARTH_RADIUS + 0.025);
  const b = latLngToVector3(end, EARTH_RADIUS + 0.025);
  const angle = a.angleTo(b);
  const lift = Math.max(0.16, angle * 0.85);
  return Array.from({ length: 72 }, (_, index) => {
    const t = index / 71;
    const point = a.clone().lerp(b, t).normalize();
    const altitude = EARTH_RADIUS + Math.sin(Math.PI * t) * lift;
    return point.multiplyScalar(altitude);
  });
}

function Earth() {
  const earth = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const [surface, normal, specular, cloudMap] = useTexture([
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
  ]);

  useFrame((_, delta) => {
    if (earth.current) earth.current.rotation.y += delta * 0.018;
    if (clouds.current) clouds.current.rotation.y += delta * 0.024;
  });

  return (
    <group rotation={[0.08, -0.45, 0]}>
      <mesh ref={earth} castShadow receiveShadow>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshPhongMaterial
          map={surface}
          normalMap={normal}
          specularMap={specular}
          specular={new THREE.Color("#365a72")}
          shininess={12}
        />
      </mesh>
      <mesh ref={clouds}>
        <sphereGeometry args={[EARTH_RADIUS + 0.018, 96, 96]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.07, 96, 96]} />
        <meshBasicMaterial
          color="#4aa8ff"
          transparent
          opacity={0.075}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function AirportBeacon({ airport }: { airport: (typeof demoAirports)[number] }) {
  const position = latLngToVector3(airport, EARTH_RADIUS + 0.045);
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.035, 18, 18]} />
        <meshBasicMaterial color="#d7a84b" toneMapped={false} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.055, 0.085, 32]} />
        <meshBasicMaterial color="#d7a84b" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <Html center distanceFactor={7.5} style={{ pointerEvents: "none" }}>
        <div className="rounded border border-[#d7a84b]/40 bg-[#071019]/90 px-2 py-1 text-[9px] font-semibold tracking-[0.16em] text-white shadow-xl backdrop-blur">
          {airport.code}
        </div>
      </Html>
    </group>
  );
}

function AircraftMarker({ track }: { track: AircraftTrack }) {
  const position = latLngToVector3(track, EARTH_RADIUS + 0.075);
  return (
    <group position={position}>
      <mesh rotation={[0, 0, THREE.MathUtils.degToRad(-track.heading)]}>
        <coneGeometry args={[0.025, 0.1, 3]} />
        <meshBasicMaterial color={track.onGround ? "#f6b94a" : "#27d3b7"} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GlobeScene({ aircraft = [] }: Props) {
  const corridor = useMemo(
    () => arcPoints(demoAirports[0], demoAirports[2]),
    [],
  );

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 3, 5]} intensity={2.3} color="#d7ecff" />
      <pointLight position={[-4, -1, -3]} intensity={0.55} color="#2b79ff" />
      <Stars radius={70} depth={32} count={1600} factor={2.2} saturation={0.1} fade speed={0.35} />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <Line points={corridor} color="#d7a84b" lineWidth={1.6} transparent opacity={0.9} />
      {demoAirports.map((airport) => <AirportBeacon key={airport.code} airport={airport} />)}
      {aircraft.slice(0, 80).map((track) => <AircraftMarker key={track.icao24} track={track} />)}
      <OrbitControls
        enablePan={false}
        minDistance={3.35}
        maxDistance={7.4}
        autoRotate
        autoRotateSpeed={0.24}
        dampingFactor={0.055}
        enableDamping
      />
    </>
  );
}

export default function RealisticAviationGlobe({ aircraft = [] }: Props) {
  return (
    <div className="relative h-[540px] min-h-[440px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_42%,#13283d_0%,#071019_54%,#02060b_100%)] shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0.35, 5.3], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-label="Interactive realistic aviation globe showing airports, corridor and live public aircraft positions"
      >
        <GlobeScene aircraft={aircraft} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="rounded-xl border border-white/10 bg-[#071019]/82 px-3 py-2 text-[10px] text-white shadow-2xl backdrop-blur-md">
          <div className="font-semibold tracking-[0.16em] text-[#27d3b7]">LIVE AVIATION CONTEXT</div>
          <div className="mt-1 text-white/60">OpenSky aircraft · realistic Earth · MIA–ATL corridor</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#071019]/82 px-3 py-2 text-right text-[10px] shadow-2xl backdrop-blur-md">
          <div className="font-mono text-white">{aircraft.length.toLocaleString()} TRACKS</div>
          <div className="mt-1 text-white/50">Drag to rotate · scroll to zoom</div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-[#d7a84b]/25 bg-[#071019]/88 px-3 py-2 text-[10px] shadow-2xl backdrop-blur-md">
        <div className="font-semibold tracking-[0.14em] text-[#d7a84b]">BAG-DNA JOURNEY CORRIDOR</div>
        <div className="mt-1 text-white/65">MIA → ATL · DEMO BAG DATA · PUBLIC AVIATION CONTEXT</div>
      </div>
    </div>
  );
}
