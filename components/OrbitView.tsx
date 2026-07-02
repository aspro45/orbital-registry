"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OrbitFallback } from "./OrbitFallback";
import type { RegObject } from "@/lib/genlayer/types";

const OrbitScene = dynamic(() => import("./OrbitScene").then(m => m.OrbitScene), { ssr: false, loading: () => <div className="grid h-full w-full place-items-center"><span className="label">Initialising scene…</span></div> });

function webglOK(): boolean {
  try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); }
  catch { return false; }
}

export function OrbitView({ objects, selected, onSelect, height = "h-[clamp(300px,60vh,560px)]" }: { objects: RegObject[]; selected: number | null; onSelect: (id: number) => void; height?: string }) {
  const [use3d, setUse3d] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setUse3d(wide && !reduce && webglOK());
  }, []);
  return (
    <div className={`${height} w-full overflow-hidden rounded panel`}>
      {use3d ? <OrbitScene objects={objects} selected={selected} onSelect={onSelect} /> : <div className="grid h-full place-items-center p-3"><OrbitFallback objects={objects} selected={selected} onSelect={onSelect} /></div>}
    </div>
  );
}
