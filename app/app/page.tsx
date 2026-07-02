"use client";
import Link from "next/link";
import { useState } from "react";
import { PREVIEW_MODE } from "@/lib/env";
import { formatContractError } from "@/lib/genlayer/errors";
import { useRegister, useWallet } from "@/hooks/useRegistry";

type Phase = "draft" | "ready" | "submitted" | "accepted" | "failed";

export default function AppPage() {
  const { account, connect } = useWallet();
  const register = useRegister();
  const [f, setF] = useState({ designation: "", sourceUrl: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("draft");
  const [live, setLive] = useState("");
  const set = (k: string, v: string) => { setF(p => ({ ...p, [k]: v })); setPhase("draft"); };
  const validate = () => { const e: Record<string, string> = {}; if (!f.designation.trim()) e.designation = "A designation is required."; else if (f.designation.length > 240) e.designation = "Keep it under 240 characters."; if (!/^https?:\/\//.test(f.sourceUrl)) e.sourceUrl = "Enter an http(s) source URL."; setErrs(e); const ok = Object.keys(e).length === 0; if (ok) setPhase("ready"); return ok; };
  const onSubmit = async () => {
    if (!validate()) return;
    if (PREVIEW_MODE) { setLive("Preview mode: registration disabled."); return; }
    setPhase("submitted"); setLive("Submitted to the wallet - awaiting acceptance…");
    try { await register.mutateAsync({ ...f }); setPhase("accepted"); setLive("Registered. The object enters a pending transfer path."); setF({ designation: "", sourceUrl: "" }); }
    catch (e) { setPhase("failed"); setLive(formatContractError(e)); }
  };
  const order = ["draft", "ready", "submitted", "accepted"];
  const reached = (k: Phase) => order.indexOf(phase === "failed" ? "draft" : phase) >= order.indexOf(k);
  const steps: { k: Phase; label: string }[] = [{ k: "draft", label: "Draft" }, { k: "ready", label: "Ready" }, { k: "submitted", label: "Submitted" }, { k: "accepted", label: "Registered" }];

  return (
    <div className="mx-auto max-w-app px-4 py-8 sm:px-5 md:px-8">
      <span className="label">Register an object</span>
      <h1 className="mt-2 font-head text-fluid-section text-starlight">Register a designation, with a source.</h1>
      <p className="mt-2 max-w-reading text-starlight/80">A calm DOM-first workspace. This screen is fully functional without WebGL; the orbit is a view, not a control.</p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[200px_1fr]">
        <ol className="flex gap-3 lg:flex-col" aria-label="Transaction state">
          {steps.map(s => (<li key={s.k} className="flex items-center gap-2"><span aria-hidden className={`h-3 w-3 rounded-full ${reached(s.k) ? "bg-cyan" : "bg-starlight/20"}`} /><span className={`text-sm ${reached(s.k) ? "text-starlight" : "text-muted"}`}>{s.label}</span></li>))}
          {phase === "failed" && <li className="text-sm text-copper">Failed - edit and retry.</li>}
        </ol>
        <div className="panel p-5">
          {PREVIEW_MODE && <p className="label mb-2 text-amber">preview - registration disabled</p>}
          <div className="flex flex-col gap-4">
            <label className="block"><span className="label">Designation</span><textarea value={f.designation} onChange={e => set("designation", e.target.value)} maxLength={240} aria-invalid={!!errs.designation} className="panel mt-1 min-h-[96px] w-full bg-space p-3 text-base text-starlight" placeholder="A factual statement about a real entity." />{errs.designation && <span className="text-sm text-copper">{errs.designation}</span>}</label>
            <label className="block"><span className="label">Source URL</span><input value={f.sourceUrl} onChange={e => set("sourceUrl", e.target.value)} aria-invalid={!!errs.sourceUrl} className="panel mt-1 h-11 w-full bg-space px-3 text-base text-starlight" placeholder="https://…" />{errs.sourceUrl && <span className="text-sm text-copper">{errs.sourceUrl}</span>}</label>
            <p aria-live="polite" className="min-h-[1.2rem] text-sm text-cyan">{live}</p>
            {!account && !PREVIEW_MODE && <button onClick={() => connect()} className="panel min-h-[44px] px-3 text-sm">Connect wallet</button>}
            <div className="flex flex-wrap gap-3"><button onClick={onSubmit} disabled={register.isPending} className="min-h-[48px] rounded bg-cyan px-6 font-medium text-space disabled:opacity-50">{register.isPending ? "Registering…" : "Register object"}</button><Link href="/registry" className="min-h-[48px] rounded border border-starlight/20 px-6 leading-[48px]">View registry</Link></div>
          </div>
        </div>
      </div>
    </div>
  );
}
