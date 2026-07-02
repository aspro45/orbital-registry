"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ObjStatus, STATUS_HEX, STATUS_RING } from "@/lib/genlayer/types";
import type { RegObject } from "@/lib/genlayer/types";

function Ring({ radius, color, dashed }: { radius: number; color: string; dashed?: boolean }) {
  const loop = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const seg = 96;
    for (let i = 0; i < seg; i++) { const a = (i / seg) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: dashed ? 0.3 : 0.4 });
    return new THREE.LineLoop(geo, mat);
  }, [radius, color, dashed]);
  useEffect(() => () => { loop.geometry.dispose(); (loop.material as THREE.Material).dispose(); }, [loop]);
  return <primitive object={loop} />;
}

function Objects({ objects, selected, onSelect }: { objects: RegObject[]; selected: number | null; onSelect: (id: number) => void }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (group.current) group.current.rotation.y += dt * 0.05; });
  return (
    <group ref={group}>
      {objects.slice(0, 8).map((o, i) => {
        const r = STATUS_RING[o.status] * 1.1;
        const a = (i / Math.max(objects.length, 1)) * Math.PI * 2;
        const pos: [number, number, number] = [Math.cos(a) * r, 0, Math.sin(a) * r];
        const sel = selected === o.id;
        return (
          <mesh key={o.id} position={pos} scale={sel ? 0.22 : 0.16} onClick={e => { e.stopPropagation(); onSelect(o.id); }}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={STATUS_HEX[o.status]} emissive={STATUS_HEX[o.status]} emissiveIntensity={sel ? 0.8 : 0.35} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function Rig({ objects, selected }: { objects: RegObject[]; selected: number | null }) {
  const { camera } = useThree();
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0, ty = 3.2, tz = 6;
    if (selected != null) {
      const obj = objects.find(o => o.id === selected);
      if (obj) { const r = STATUS_RING[obj.status] * 1.1; tx = r * 0.6; ty = 1.8; tz = r + 3; }
    }
    if (reduce) { camera.position.set(tx, ty, tz); camera.lookAt(0, 0, 0); return; }
    const tween = gsap.to(camera.position, { x: tx, y: ty, z: tz, duration: 1, ease: "power2.inOut", onUpdate: () => camera.lookAt(0, 0, 0) });
    return () => { tween.kill(); };
  }, [selected, objects, camera]);
  return null;
}

export function OrbitScene({ objects, selected, onSelect }: { objects: RegObject[]; selected: number | null; onSelect: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => { const h = () => setPaused(document.hidden); document.addEventListener("visibilitychange", h); return () => document.removeEventListener("visibilitychange", h); }, []);
  const rings = [ObjStatus.Settled, ObjStatus.Holding, ObjStatus.Pending, ObjStatus.Rejected];
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 3.2, 6], fov: 50 }} frameloop={paused ? "never" : "always"} gl={{ antialias: true, powerPreference: "low-power" }} style={{ width: "100%", height: "100%" }}>
      <color attach="background" args={["#050A16"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 6, 5]} intensity={30} color="#53B9D8" />
      <mesh><sphereGeometry args={[0.3, 24, 24]} /><meshStandardMaterial color="#0C1424" emissive="#1a2740" emissiveIntensity={0.5} /></mesh>
      {rings.map(s => <Ring key={s} radius={STATUS_RING[s] * 1.1} color={STATUS_HEX[s]} dashed={s === ObjStatus.Pending} />)}
      <Objects objects={objects} selected={selected} onSelect={onSelect} />
      <Rig objects={objects} selected={selected} />
    </Canvas>
  );
}
