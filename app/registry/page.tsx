"use client";
import Link from "next/link";
import { STATUS_GLYPH, STATUS_LABEL, STATUS_NOTE } from "@/lib/genlayer/types";
import { useObjects } from "@/hooks/useRegistry";

export default function RegistryPage() {
  const objects = useObjects();
  const data = objects.data ?? [];
  return (
    <div className="mx-auto max-w-app px-4 py-8 sm:px-5 md:px-8">
      <span className="label">Registry</span>
      <h1 className="mt-2 font-head text-fluid-section text-starlight">Every registered object and its orbit.</h1>
      {objects.isLoading && <p className="mono mt-4 text-muted">Reading the registry…</p>}
      {objects.isError && <p className="mt-4 text-copper" role="alert">Could not read. <button className="underline" onClick={() => objects.refetch()}>Retry</button></p>}
      {!objects.isLoading && data.length === 0 && <p className="panel mt-4 p-5">The registry is empty. <Link href="/app" className="text-cyan underline">Register the first object.</Link></p>}
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.slice().reverse().map(o => (
          <li key={o.id} className="panel flex flex-col p-4">
            <span className="label" style={{ color: "#53B9D8" }}>{STATUS_GLYPH[o.status]} · {STATUS_LABEL[o.status]}</span>
            <Link href={`/registry/${o.id}`} className="mt-1 font-head text-fluid-panel text-starlight hover:underline">{o.designation}</Link>
            <p className="mt-1 text-sm text-muted">{STATUS_NOTE[o.status]}</p>
            <span className="mono mt-auto pt-2 text-xs text-muted">object #{String(o.id + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
