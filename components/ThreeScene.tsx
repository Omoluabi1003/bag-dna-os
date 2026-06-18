"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Float, Line, RoundedBox, Sparkles, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function AirportGrid() {
  const gridLines = useMemo(() => {
    const lines: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = -12; i <= 12; i += 1) {
      lines.push([new THREE.Vector3(i, -1.8, -12), new THREE.Vector3(i, -1.8, 12)]);
      lines.push([new THREE.Vector3(-12, -1.8, i), new THREE.Vector3(12, -1.8, i)]);
    }
    return lines;
  }, []);

  return (
    <group rotation={[0, 0.18, 0]}>
      {gridLines.map((line, index) => (
        <Line key={index} points={line} color={index % 5 === 0 ? "#6ed8e0" : "#20364d"} lineWidth={index % 5 === 0 ? 0.8 : 0.35} transparent opacity={index % 5 === 0 ? 0.42 : 0.24} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]} receiveShadow>
        <planeGeometry args={[28, 28, 1, 1]} />
        <meshStandardMaterial color="#071522" metalness={0.25} roughness={0.75} transparent opacity={0.68} />
      </mesh>
    </group>
  );
}

function TerminalSilhouettes() {
  return (
    <group position={[0, -1.35, -5.4]}>
      {[-4.5, -2.2, 0, 2.3, 4.6].map((x, index) => (
        <mesh key={x} position={[x, 0.45 + index * 0.06, 0]}>
          <boxGeometry args={[1.6, 0.9 + index * 0.18, 0.26]} />
          <meshStandardMaterial color="#10233a" emissive="#081a2c" emissiveIntensity={0.65} metalness={0.35} roughness={0.48} />
        </mesh>
      ))}
      {[-3.25, -0.25, 3.15].map((x) => (
        <mesh key={x} position={[x, 1.35, -0.06]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.9, 0.9, 0.18]} />
          <meshStandardMaterial color="#0b2036" emissive="#113a50" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function DataTrails() {
  const moving = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (moving.current) moving.current.position.x = Math.sin(clock.elapsedTime * 0.55) * 0.18;
  });

  const routes = useMemo(
    () => [
      [new THREE.Vector3(-6, -1.42, 2.7), new THREE.Vector3(-2.2, -1.26, 0.9), new THREE.Vector3(0.8, -1.18, 1.8), new THREE.Vector3(5.4, -1.34, -0.2)],
      [new THREE.Vector3(-5.2, -1.38, -1.8), new THREE.Vector3(-1.8, -1.12, -2.4), new THREE.Vector3(1.8, -1.16, -1.15), new THREE.Vector3(5.7, -1.32, -2.8)],
      [new THREE.Vector3(-4.6, -1.45, 4.1), new THREE.Vector3(-1.2, -1.16, 3.1), new THREE.Vector3(2.4, -1.2, 4.2), new THREE.Vector3(5.9, -1.36, 2.4)],
    ],
    [],
  );

  return (
    <group ref={moving}>
      {routes.map((route, index) => (
        <Line key={index} points={route} color={index === 1 ? "#10b981" : "#6ed8e0"} lineWidth={1.55} transparent opacity={0.7} />
      ))}
      {routes.flatMap((route, routeIndex) =>
        route.map((point, pointIndex) => (
          <mesh key={`${routeIndex}-${pointIndex}`} position={point}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#6ed8e0" emissive="#6ed8e0" emissiveIntensity={1.8} />
          </mesh>
        )),
      )}
    </group>
  );
}

function DnaHelix() {
  const helix = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (helix.current) helix.current.rotation.y = clock.elapsedTime * 0.34;
  });

  const nodes = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const y = -1.18 + t * 2.36;
    const angle = t * Math.PI * 6;
    return { y, a: angle, b: angle + Math.PI };
  }), []);

  return (
    <group ref={helix}>
      {nodes.map(({ y, a, b }, index) => (
        <group key={index}>
          <mesh position={[Math.cos(a) * 1.15, y, Math.sin(a) * 0.58]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#6ed8e0" emissive="#6ed8e0" emissiveIntensity={1.9} />
          </mesh>
          <mesh position={[Math.cos(b) * 1.15, y, Math.sin(b) * 0.58]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.25} />
          </mesh>
          {index % 3 === 0 && <Line points={[new THREE.Vector3(Math.cos(a) * 1.15, y, Math.sin(a) * 0.58), new THREE.Vector3(Math.cos(b) * 1.15, y, Math.sin(b) * 0.58)]} color="#ffffff" lineWidth={0.45} transparent opacity={0.28} />}
        </group>
      ))}
    </group>
  );
}

function Suitcase() {
  const group = useRef<THREE.Group>(null);
  const node = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.38) * 0.34 - 0.38;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.72) * 0.12;
    if (node.current) node.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.3) * 0.13);
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.38}>
      <group ref={group} position={[0, 0.25, 0]}>
        <RoundedBox args={[2.15, 2.55, 0.72]} radius={0.18} smoothness={8}>
          <meshStandardMaterial color="#17283d" metalness={0.72} roughness={0.24} emissive="#07111f" emissiveIntensity={0.45} />
        </RoundedBox>
        {[-0.68, 0.68].map((x) => (
          <mesh key={x} position={[x, 0, 0.39]}>
            <boxGeometry args={[0.16, 2.7, 0.08]} />
            <meshStandardMaterial color="#263f5e" metalness={0.72} roughness={0.2} emissive="#0a1f32" emissiveIntensity={0.55} />
          </mesh>
        ))}
        <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.045, 14, 40, Math.PI]} />
          <meshStandardMaterial color="#8aa8c0" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0.82, -0.58, 0.47]} rotation={[0.35, 0.15, 0.4]}>
          <torusGeometry args={[0.18, 0.022, 10, 34]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.85} metalness={0.55} roughness={0.26} />
        </mesh>
        <mesh ref={node} position={[-0.22, 0.18, 0.48]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color="#6ed8e0" emissive="#6ed8e0" emissiveIntensity={3.4} />
        </mesh>
        <DnaHelix />
      </group>
    </Float>
  );
}

function HolographicMarkers() {
  return (
    <group>
      {[[-3.8, 1.4, -1.3, "RFID"], [3.7, 1.1, 0.7, "LOS"], [2.4, 2.3, -2.8, "RISK 18"]].map(([x, y, z, label]) => (
        <group key={String(label)} position={[Number(x), Number(y), Number(z)]}>
          <mesh>
            <boxGeometry args={[0.92, 0.38, 0.035]} />
            <meshStandardMaterial color="#0b2134" emissive="#6ed8e0" emissiveIntensity={0.42} transparent opacity={0.62} />
          </mesh>
          <Text position={[0, 0, 0.035]} fontSize={0.105} color="#dffbff" anchorX="center" anchorY="middle">{String(label)}</Text>
        </group>
      ))}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={["#06101d"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#e6faff" />
      <pointLight position={[-3, 2.2, 2.4]} intensity={3.2} color="#6ed8e0" distance={7} />
      <pointLight position={[3.5, 1.4, -1.6]} intensity={1.7} color="#fbbf24" distance={6} />
      <AirportGrid />
      <TerminalSilhouettes />
      <DataTrails />
      <Suitcase />
      <HolographicMarkers />
      <Sparkles count={58} scale={[8, 3.6, 5]} size={1.4} speed={0.22} color="#6ed8e0" opacity={0.42} />
      <Stars radius={28} depth={8} count={450} factor={2.2} saturation={0} fade speed={0.32} />
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom intensity={0.72} luminanceThreshold={0.22} luminanceSmoothing={0.75} mipmapBlur />
      </EffectComposer>
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 1.35, 7.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="pointer-events-none"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
