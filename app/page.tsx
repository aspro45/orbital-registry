"use client";
import Link from "next/link";
import { useState } from "react";
import { ENV, PREVIEW_MODE } from "@/lib/env";
import { STATUS_GLYPH, STATUS_LABEL, STATUS_NOTE } from "@/lib/genlayer/types";
import { OrbitView } from "@/components/OrbitView";
import { useObjects, useStats } from "@/hooks/useRegistry";

export default function Home() {
  const objects = useObjects();
  const stats = useStats();
  const [sel, setSel] = useState<number | null>(null);
  const data = objects.data ?? [];
  const current = data.find(o => o.id === sel) ?? null;
  return (
    <div className="mx-auto max-w-wide px-4 pb-16 sm:px-5 md:px-8">
      <section className="grid gap-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="order-2 lg:order-1">
          <span className="label">GL-011 · Orbital registry & verification</span>
          <h1 className="mt-2 font-head text-fluid-page font-semibold text-starlight">Entities settle into orbit only when the source confirms them.</h1>
          <p className="mt-4 max-w-reading text-lg text-starlight/80">Register a designation about a real entity with a public source. A GenLayer validator set reads the source; the object settles into a stable orbit, returns to the draft path, or holds. {PREVIEW_MODE ? "Preview mode - illustrative." : "Live on " + ENV.network + "."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/app" className="inline-flex min-h-[48px] items-center rounded bg-cyan px-6 font-medium text-space">Register an object</Link>
            <Link href="/registry" className="inline-flex min-h-[48px] items-center rounded border border-starlight/20 px-6">View registry</Link>
          </div>
          <p className="label mt-5">{stats.data?.total ?? 0} objects · {stats.data?.settled ?? 0} stable · {stats.data?.holding ?? 0} holding · {stats.data?.rejected ?? 0} draft · {stats.data?.pending ?? 0} pending</p>
          {/* accessible selection list - keyboard path to the same inspector as the scene */}
          <ul className="mt-4 grid gap-2" aria-label="Registry objects">
            {data.map(o => (
              <li key={o.id}><button onClick={() => setSel(o.id)} aria-pressed={sel === o.id} className={`panel flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${sel === o.id ? "border-cyan" : ""}`}>
                <span className="mono text-muted">{String(o.id + 1).padStart(2, "0")}</span><span className="flex-1 text-starlight">{o.designation}</span><span className="label whitespace-nowrap" style={{ color: "#53B9D8" }}>{STATUS_GLYPH[o.status]}</span>
              </button></li>
            ))}
          </ul>
        </div>
        <aside className="order-1 lg:order-2">
          <OrbitView objects={data} selected={sel} onSelect={setSel} />
          <div className="panel mt-3 p-4" aria-live="polite">
            {current ? (<><span className="label" style={{ color: "#53B9D8" }}>{STATUS_GLYPH[current.status]} · {STATUS_LABEL[current.status]}</span><p className="mt-1 font-head text-fluid-panel text-starlight">{current.designation}</p><p className="mt-1 text-sm text-muted">{current.assessment || STATUS_NOTE[current.status]}</p><Link href={`/registry/${current.id}`} className="mono mt-2 inline-block text-cyan underline">open record →</Link></>) : <p className="text-sm text-muted">Select an object - in the scene or the list - to frame it and open its record.</p>}
          </div>
        </aside>
      </section>

      <section className="mt-6 grid gap-px overflow-hidden rounded bg-starlight/10 sm:grid-cols-2 lg:grid-cols-4">
        {([["Real entities", "Each object is a designation about a real entity, paired with a public source."], ["Input to consensus", "Verification reads the cited source under GenLayer's equivalence flow."], ["Consensus", "Validators independently read the same source and must agree before an orbit changes."], ["Permanence", "Outcomes and assessments persist on-chain; the raw page is never stored."]] as const).map(([h, b]) => (
          <div key={h} className="bg-panel p-5"><h2 className="font-head text-fluid-panel text-starlight">{h}</h2><p className="mt-1 text-sm text-starlight/75">{b}</p></div>
        ))}
      </section>
    </div>
  );
}
