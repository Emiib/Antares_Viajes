const { EjemploMayoristaAdapter } = require('./adapters/ejemploMayorista');

/**
 * Mayoristas registrados. Para sumar uno nuevo:
 *   1. Creás su adapter en ./adapters/
 *   2. Lo agregás a esta lista.
 *
 * - enabled:    si participa de la sincronización.
 * - markupPct:  % que se suma al precio neto del mayorista (0 = sin markup).
 * - El config del adapter sale idealmente de variables de entorno.
 */
const integrations = [
  {
    adapter: new EjemploMayoristaAdapter({
      apiUrl: process.env.EJEMPLO_API_URL,
      apiKey: process.env.EJEMPLO_API_KEY,
    }),
    enabled: true,
    markupPct: 0,
  },
];

function getEnabledIntegrations() {
  return integrations.filter((i) => i.enabled);
}

/** Resumen liviano para mostrar en el panel admin (sin exponer credenciales). */
function listIntegrations() {
  return integrations.map((i) => ({
    source: i.adapter.source,
    enabled: i.enabled,
    markupPct: i.markupPct,
  }));
}

module.exports = { integrations, getEnabledIntegrations, listIntegrations };
