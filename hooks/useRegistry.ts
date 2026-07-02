"use client";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchObject, fetchObjects, fetchStats, registerObject, verifyObject } from "@/lib/genlayer/contract";
import { activeAccount, connectWallet } from "@/lib/genlayer/client";
import { PREVIEW_MODE } from "@/lib/env";
export const useObjects = () => useQuery({ queryKey: ["obj"], queryFn: fetchObjects, staleTime: 15000 });
export const useStats = () => useQuery({ queryKey: ["stats"], queryFn: fetchStats, staleTime: 15000 });
export const useObject = (id: number) => useQuery({ queryKey: ["obj", id], queryFn: () => fetchObject(id), enabled: Number.isFinite(id) });
export function useRegister() { const qc = useQueryClient(); return useMutation({ mutationFn: (v: { designation: string; sourceUrl: string }) => registerObject(v.designation, v.sourceUrl), onSuccess: () => { qc.invalidateQueries({ queryKey: ["obj"] }); qc.invalidateQueries({ queryKey: ["stats"] }); } }); }
export function useVerify() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: number) => verifyObject(id), onSuccess: (_h, id) => { qc.invalidateQueries({ queryKey: ["obj", id] }); qc.invalidateQueries({ queryKey: ["obj"] }); qc.invalidateQueries({ queryKey: ["stats"] }); } }); }
export function useWallet() {
  const [account, setAccount] = useState<string | null>(null); const [connecting, setConnecting] = useState(false);
  useEffect(() => { if (PREVIEW_MODE) return; activeAccount().then(setAccount).catch(() => setAccount(null)); window.ethereum?.on?.("accountsChanged", () => activeAccount().then(setAccount)); }, []);
  const connect = useCallback(async () => { setConnecting(true); try { setAccount(await connectWallet()); } finally { setConnecting(false); } }, []);
  return { account, connect, connecting };
}
