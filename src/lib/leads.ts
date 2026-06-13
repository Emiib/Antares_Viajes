import { API_URL } from "../config/api";
import { getAttribution } from "./tracking";

export type LeadInput = {
  source: string;
  name?: string;
  contact?: string;
  email?: string;
  destination?: string;
  message?: string;
  /** Datos estructurados extra (presupuesto, estilo, mes, etc.). */
  payload?: Record<string, unknown>;
};

/**
 * Guarda el lead en el backend de forma fire-and-forget. Adjunta la
 * atribución de campaña (keyword/UTM) y usa `keepalive` para que la request
 * sobreviva al salto a WhatsApp (incluso con window.location.href).
 * Nunca bloquea ni lanza: si falla, el usuario igual llega a WhatsApp.
 */
export function captureLead(lead: LeadInput): void {
  try {
    const payload = { ...(lead.payload || {}), attribution: getAttribution() };
    fetch(`${API_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, payload }),
      keepalive: true,
    }).catch(() => {
      /* sin conexión / backend dormido: no interrumpimos al usuario */
    });
  } catch {
    /* nunca rompemos el flujo de conversión */
  }
}
