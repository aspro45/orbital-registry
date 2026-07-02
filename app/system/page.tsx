import Link from "next/link";
export const metadata = { title: "System - Orbital Registry" };
export default function SystemPage() {
  const steps = [
    ["Spatial metaphor", "Each object's orbit encodes its real contract state: a stable inner orbit for confirmed, a dashed transfer path for pending, a holding orbit for undetermined, an outer draft path for refuted. The metaphor never runs ahead of stored state."],
    ["Reading", "On verification the contract fetches the cited source. Reading the open web is nondeterministic, so it runs in GenLayer's equivalence flow."],
    ["Consensus", "Each validator independently reads the same source and decides confirmed, refuted, or undetermined. An orbit changes only on agreement - no validator identities are invented."],
    ["Limits", "If the source can't be read or validators disagree, the object holds. The raw page is never stored; only the designation, source URL, outcome, and a short assessment persist."],
    ["Rendering", "The scene is a semantic view, dynamically imported, DPR-capped, and paused when hidden. The registry is fully usable without WebGL via a static 2D diagram and list."],
  ];
  return (
    <div className="mx-auto max-w-reading px-4 py-10 sm:px-5 md:px-8">
      <span className="label">System</span>
      <h1 className="mt-2 font-head text-fluid-section text-starlight">The spatial metaphor, the process, and its limits.</h1>
      <p className="mt-3 text-lg text-starlight/80">Orbital Registry is a precise surface over a GenLayer Intelligent Contract. Orbits are strictly mapped to real state, by shape and label - never colour alone.</p>
      <div className="mt-6">{steps.map(([h, b]) => (<section key={h} className="border-t border-starlight/10 py-5"><h2 className="font-head text-fluid-panel text-starlight">{h}</h2><p className="mt-1 max-w-reading text-starlight/80">{b}</p></section>))}</div>
      <Link href="/app" className="mt-8 inline-flex min-h-[48px] items-center rounded bg-cyan px-6 font-medium text-space">Register an object</Link>
    </div>
  );
}
