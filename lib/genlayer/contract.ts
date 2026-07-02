import { ENV, PREVIEW_MODE } from "@/lib/env";
import { getReadClient, writeContract } from "./client";
import { ObjStatus } from "./types";
import type { RegObject, RegStats, RawObject } from "./types";

const ADDRESS = ENV.contractAddress;
const n = (v: number | bigint) => (typeof v === "bigint" ? Number(v) : v);
const toO = (id: number, r: RawObject): RegObject => ({ id, registrar: r.registrar, designation: r.designation, sourceUrl: r.source_url, status: n(r.status) as ObjStatus, assessment: r.assessment });

const PREVIEW: RegObject[] = [
  { id: 0, registrar: "0xPREVIEW", designation: "The ISS orbits Earth in low Earth orbit.", sourceUrl: "https://preview.local/iss", status: ObjStatus.Settled, assessment: "The source confirms this." },
  { id: 1, registrar: "0xPREVIEW", designation: "The Hubble telescope launched in 1990.", sourceUrl: "https://preview.local/hubble", status: ObjStatus.Settled, assessment: "The source confirms this." },
  { id: 2, registrar: "0xPREVIEW", designation: "Voyager 1 is the most distant human-made object.", sourceUrl: "https://preview.local/voyager", status: ObjStatus.Settled, assessment: "The source confirms this." },
  { id: 3, registrar: "0xPREVIEW", designation: "A crewed station will orbit Jupiter next year.", sourceUrl: "https://preview.local/jupiter", status: ObjStatus.Pending, assessment: "" },
];
const stats = (x: RegObject[]): RegStats => ({ total: x.length, settled: x.filter(o => o.status === ObjStatus.Settled).length, rejected: x.filter(o => o.status === ObjStatus.Rejected).length, holding: x.filter(o => o.status === ObjStatus.Holding).length, pending: x.filter(o => o.status === ObjStatus.Pending).length });

export async function fetchObjects(): Promise<RegObject[]> {
  if (PREVIEW_MODE) return PREVIEW;
  const c = await getReadClient();
  const count = n((await c.readContract({ address: ADDRESS, functionName: "get_object_count" })) as number | bigint);
  const out: RegObject[] = [];
  for (let i = 0; i < count; i++) { const r = (await c.readContract({ address: ADDRESS, functionName: "get_object", args: [i] })) as RawObject; if (n(r.archived) === 0) out.push(toO(i, r)); }
  return out;
}
export async function fetchStats(): Promise<RegStats> { return stats(await fetchObjects()); }
export async function fetchObject(id: number): Promise<RegObject | null> {
  if (PREVIEW_MODE) return PREVIEW.find(x => x.id === id) ?? null;
  const c = await getReadClient();
  const count = n((await c.readContract({ address: ADDRESS, functionName: "get_object_count" })) as number | bigint);
  if (id < 0 || id >= count) return null;
  return toO(id, (await c.readContract({ address: ADDRESS, functionName: "get_object", args: [id] })) as RawObject);
}
export const registerObject = (designation: string, sourceUrl: string) => writeContract(ADDRESS, "register_object", [designation, sourceUrl]);
export const verifyObject = (id: number) => writeContract(ADDRESS, "verify_object", [id]);
