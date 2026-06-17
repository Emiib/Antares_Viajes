import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type LeadPrefill = { destino?: string; context?: string };

type LeadModalValue = {
  open: boolean;
  prefill: LeadPrefill | null;
  openLead: (prefill?: LeadPrefill) => void;
  closeLead: () => void;
};

const Ctx = createContext<LeadModalValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<LeadPrefill | null>(null);

  const openLead = useCallback((p?: LeadPrefill) => { setPrefill(p ?? null); setOpen(true); }, []);
  const closeLead = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, prefill, openLead, closeLead }), [open, prefill, openLead, closeLead]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLeadModal(): LeadModalValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeadModal debe usarse dentro de <LeadModalProvider>");
  return ctx;
}
