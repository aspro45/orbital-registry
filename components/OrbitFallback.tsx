"use client";
import { ObjStatus, STATUS_HEX, STATUS_LABEL, STATUS_RING } from "@/lib/genlayer/types";
import type { RegObject } from "@/lib/genlayer/types";

// 2D orbital diagram. Each object sits on a status ring band. Used on mobile and
// whenever WebGL is unavailable. Fully keyboard-operable; status by shape+label.
export function OrbitFallback({ objects, onSelect, selected }: { objects: RegObject[]; onSelect?: (id: number) => void; selected?: number | null }) {
  const cx = 160, cy = 160, scale = 38;
  const rings = [ObjStatus.Settled, ObjStatus.Holding, ObjStatus.Pending, ObjStatus.Rejected];
  return (
    <figure className="m-0">
      <svg viewBox="0 0 320 320" className="h-auto w-full max-w-full" role="img" aria-label={`Orbital registry: ${objects.length} objects on status rings around a central node.`}>
        {rings.map(s => <circle key={s} cx={cx} cy={cy} r={STATUS_RING[s] * scale} fill="none" stroke={STATUS_HEX[s]} strokeOpacity="0.28" strokeWidth="1" strokeDasharray={s === ObjStatus.Pending ? "4 4" : undefined} />)}
        <circle cx={cx} cy={cy} r="9" fill="#0C1424" stroke="#E7EEF9" strokeOpacity="0.5" />
        <text x={cx} y={cy + 26} textAnchor="middle" className="mono" fontSize="7" fill="#718096">REGISTRY CORE</text>
        {objects.slice(0, 8).map((o, i) => {
          const r = STATUS_RING[o.status] * scale;
          const ang = (i / Math.max(objects.length, 1)) * Math.PI * 2 - Math.PI / 2;
          const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
          const sel = selected === o.id;
          return (
            <g key={o.id} className={onSelect ? "cursor-pointer" : ""} tabIndex={onSelect ? 0 : -1} role={onSelect ? "button" : undefined}
               aria-label={onSelect ? `Object ${o.id + 1}: ${STATUS_LABEL[o.status]} - ${o.designation}` : undefined}
               onClick={() => onSelect?.(o.id)} onKeyDown={e => { if (onSelect && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onSelect(o.id); } }}>
              {sel && <circle cx={x} cy={y} r="11" fill="none" stroke="#53B9D8" strokeWidth="1.4" strokeDasharray="3 3" />}
              {o.status === ObjStatus.Settled && <circle cx={x} cy={y} r="6" fill={STATUS_HEX[o.status]} />}
              {o.status === ObjStatus.Pending && <circle cx={x} cy={y} r="6" fill="none" stroke={STATUS_HEX[o.status]} strokeWidth="2" />}
              {o.status === ObjStatus.Rejected && <polygon points={`${x},${y - 6} ${x + 6},${y + 5} ${x - 6},${y + 5}`} fill={STATUS_HEX[o.status]} />}
              {o.status === ObjStatus.Holding && <circle cx={x} cy={y} r="6" fill="none" stroke={STATUS_HEX[o.status]} strokeWidth="2" strokeDasharray="2 2" />}
              <text x={x} y={y - 10} textAnchor="middle" className="mono" fontSize="7" fill="#E7EEF9">{String(o.id + 1).padStart(2, "0")}</text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
