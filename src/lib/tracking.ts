// Tracking de conversión: atribución de campañas + eventos de negocio.
// Sin IDs de analítica configurados (VITE_GA_ID / VITE_META_PIXEL_ID) no envía nada.

const ATTRIBUTION_KEY = "antares_attribution";

const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",    // ← keyword de Google Ads
  "utm_content",
  "gclid",       // ← click de Google Ads
  "fbclid",      // ← click de Meta Ads
] as const;

/**
 * Captura UTM/gclid/fbclid de la URL de aterrizaje y los persiste para la
 * sesión (first-touch). Así, cuando el visitante toca WhatsApp 5 minutos
 * después, el evento sale con la keyword/campaña que lo trajo.
 */
export function initAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 200);
    }
    if (Object.keys(found).length === 0) return;
    // First-touch: si ya hay atribución guardada en esta sesión, no se pisa.
    if (!sessionStorage.getItem(ATTRIBUTION_KEY)) {
      found.landing_page = window.location.pathname;
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
    }
  } catch {
    /* storage bloqueado: seguimos sin atribución */
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Evento de negocio hacia GA4 (+ Meta Pixel como evento custom).
 * Adjunta siempre la atribución de la sesión y usa beacon para que el
 * evento sobreviva si el click navega fuera del sitio (ej. WhatsApp).
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  const payload = { ...getAttribution(), ...params, transport_type: "beacon" };
  window.gtag?.("event", name, payload);
  window.fbq?.("trackCustom", name, payload);
}

/** Evento estándar de Meta (Lead, Search, etc.) + su espejo en GA4. */
export function trackStandard(metaEvent: "Lead" | "Search" | "Contact", params: Record<string, unknown> = {}) {
  const payload = { ...getAttribution(), ...params };
  window.fbq?.("track", metaEvent, payload);
  window.gtag?.("event", metaEvent.toLowerCase(), { ...payload, transport_type: "beacon" });
}
