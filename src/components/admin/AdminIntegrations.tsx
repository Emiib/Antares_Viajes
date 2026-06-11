import { useEffect, useState } from "react";
import { getIntegrations, runSync } from "./adminApi";
import type { Integration, SyncResult } from "./adminApi";

export function AdminIntegrations({ darkMode }: { darkMode: boolean }) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getIntegrations()
      .then(setIntegrations)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError("");
    setResults(null);
    try {
      const data = await runSync();
      setResults(data.results);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-black ${textCls}`}>Mayoristas</h2>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {syncing ? "Sincronizando..." : "🔄 Sincronizar ahora"}
        </button>
      </div>

      <p className={`mb-6 text-sm ${mutedCls}`}>
        Cada mayorista trae sus paquetes y se cargan automáticamente en el sitio.
        La sincronización también corre sola cuando arranca el servidor.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {results && (
        <div className="mb-6 space-y-2">
          {results.map((r) => (
            <div
              key={r.source}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                r.ok ? "bg-green-600/10 text-green-600" : "bg-red-600/10 text-red-600"
              }`}
            >
              {r.ok
                ? `✓ ${r.source}: ${r.count} paquetes sincronizados`
                : `✗ ${r.source}: ${r.error}`}
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : integrations.length === 0 ? (
        <p className={mutedCls}>No hay mayoristas registrados.</p>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                <th className="px-4 py-3 font-semibold">Mayorista</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Markup</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((i) => (
                <tr key={i.source} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                  <td className={`px-4 py-3 font-medium ${textCls}`}>{i.source}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        i.enabled ? "bg-green-600/15 text-green-600" : "bg-stone-500/15 text-stone-500"
                      }`}
                    >
                      {i.enabled ? "Habilitado" : "Deshabilitado"}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${mutedCls}`}>{i.markupPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={`mt-4 text-xs ${mutedCls}`}>
        Para sumar un mayorista o cambiar su markup se edita <code>server/integrations/registry.js</code>.
      </p>
    </div>
  );
}
