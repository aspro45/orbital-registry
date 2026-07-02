export enum ObjStatus { Pending = 0, Settled = 1, Rejected = 2, Holding = 3 }
export const STATUS_LABEL: Record<ObjStatus, string> = { [ObjStatus.Pending]: "Pending transfer", [ObjStatus.Settled]: "Stable orbit", [ObjStatus.Rejected]: "Returned to draft", [ObjStatus.Holding]: "Holding orbit" };
export const STATUS_NOTE: Record<ObjStatus, string> = {
  [ObjStatus.Pending]: "Awaiting verification - on a pending transfer path.",
  [ObjStatus.Settled]: "The source confirms the designation - settled in a stable orbit.",
  [ObjStatus.Rejected]: "The source refutes the designation - returned to the draft path.",
  [ObjStatus.Holding]: "Undetermined from the source - kept in a labelled holding orbit.",
};
// status by glyph + label, never colour alone
export const STATUS_GLYPH: Record<ObjStatus, string> = { [ObjStatus.Pending]: "◐ transfer", [ObjStatus.Settled]: "◉ stable", [ObjStatus.Rejected]: "△ draft", [ObjStatus.Holding]: "○ holding" };
export const STATUS_HEX: Record<ObjStatus, string> = { [ObjStatus.Pending]: "#F0B64B", [ObjStatus.Settled]: "#53B9D8", [ObjStatus.Rejected]: "#C77A44", [ObjStatus.Holding]: "#718096" };
// orbital ring radius band per status
export const STATUS_RING: Record<ObjStatus, number> = { [ObjStatus.Pending]: 2.5, [ObjStatus.Settled]: 1.4, [ObjStatus.Rejected]: 3.3, [ObjStatus.Holding]: 2.0 };
export interface RegObject { id: number; registrar: string; designation: string; sourceUrl: string; status: ObjStatus; assessment: string; }
export interface RegStats { total: number; settled: number; rejected: number; holding: number; pending: number; }
export interface RawObject { registrar: string; designation: string; source_url: string; status: number | bigint; assessment: string; archived: number | bigint; }
