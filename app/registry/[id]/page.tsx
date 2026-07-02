"use client";
import Link from "next/link";
import { useState } from "react";
import { PREVIEW_MODE } from "@/lib/env";
import { ObjStatus, STATUS_GLYPH, STATUS_HEX, STATUS_LABEL, STATUS_NOTE } from "@/lib/genlayer/types";
import { formatContractError } from "@/lib/genlayer/errors";
import { useObject, useVerify } from "@/hooks/useRegistry";

export default function ObjectPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { data: o, isLoading, isError, refetch } = useObject(id);
  const verify = useVerify();
  const [live, setLive] = useState("");
  const onVerify = async () => { if (PREVIEW_MODE) { setLive("Preview mode: verification disabled."); return; } setLive("Validators reading the source…"); try { await verify.mutateAsync(id); setLive("Verified."); refetch(); } catch (e) { setLive(formatContractError(e)); } };
  return (
    <div className="mx-auto max-w-reading px-4 py-8 sm:px-5 md:px-8">
      <Link href="/registry" className="mono text-sm text-muted hover:text-cyan">← Registry</Link>
      {isLoading && <p className="mono mt-6 text-muted">Reading object #{id}…</p>}
      {isError && <p className="mt-6 text-copper" role="alert">Could not read. <button className="underline" onClick={() => refetch()}>Retry</button></p>}
      {!isLoading && !o && <p className="mono mt-6 text-muted">No object #{id}.</p>}
      {o && (
        <article className="mt-4">
          <span className="label" style={{ color: STATUS_HEX[o.status] }}>{STATUS_GLYPH[o.status]} · {STATUS_LABEL[o.status]}</span>
          <h1 className="mt-1 font-head text-fluid-section text-starlight">{o.designation}</h1>
          <p className="mt-2 text-muted">{STATUS_NOTE[o.status]}</p>
          {o.assessment && <p className="mt-4 border-l-2 pl-4 italic text-starlight/85" style={{ borderColor: STATUS_HEX[o.status] }}>{o.assessment}</p>}
          <dl className="mt-6 grid grid-cols-[6rem_1fr] gap-y-2 border-t border-starlight/10 pt-4 text-sm">
            <dt className="label">Source</dt><dd className="break-all"><a className="text-cyan underline" href={o.sourceUrl} target="_blank" rel="noopener noreferrer">{o.sourceUrl}</a></dd>
            <dt className="label">Registrar</dt><dd className="mono break-all text-starlight/80">{o.registrar}</dd>
          </dl>
          {o.status === ObjStatus.Pending && !PREVIEW_MODE && (
            <div className="mt-6"><button onClick={onVerify} disabled={verify.isPending} className="min-h-[48px] rounded bg-cyan px-6 font-medium text-space disabled:opacity-50">{verify.isPending ? "Validators reading…" : "Verify with validators"}</button>
            <p aria-live="polite" className="mt-2 min-h-[1.1rem] text-sm text-cyan">{live}</p></div>
          )}
        </article>
      )}
    </div>
  );
}
