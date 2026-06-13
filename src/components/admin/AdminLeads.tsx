import { useEffect, useMemo, useState } from "react";
import { getLeads, updateLead, deleteLead } from "./adminApi";
import type { Lead } from "./adminApi";

const STATUSES = [
  { value: "nuevo", label: "Nuevo", cls: "bg-red-600/15 text-red-600" },
  { value: "contactado", label: "Contactado", cls: "bg-blue-600/15 text-blue-600" },
  { value: "seguimiento", label: "En seguimiento", cls: "bg-amber-500/15 text-amber-600" },
  { value: "ganado", label: "Ganado", cls: "bg-green-600/15 text-green-600" },
  { value: "perdido", label: "Perdido", cls: "bg-stone-500/15 text-stone-500" },
];
const statusMeta = (v?: string) => STATUSES.find((s) => s.value === v) || STATUSES[0];

const SOURCE_LABELS: Record<string, string> = {
  lead_qualifier: "Pedido de propuesta",
  hero_search: "Buscador (hero)",
  trip_form: "Viaje a medida",
  web: "Web",
};
const sourceLabel = (s?: string) => SOURCE_LABELS[s || "web"] || s || "Web";

/** Parsea timestamps de SQLite (UTC sin zona) como UTC reales. */
function parseUTC(s?: string): Date | null {
  if (!s) return null;
  const hasTz = /[zZ]|[+-]\d\d:?\d\d$/.test(s);
  const d = new Date(s.replace(" ", "T") + (hasTz ? "" : "Z"));
  return isNaN(d.getTime()) ? null : d;
}

function fmtDuration(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min < 1) return "menos de 1 min";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return m ? `${h} h ${m} min` : `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d ${h % 24} h`;
}

function timeAgo(d: Date | null): string {
  if (!d) return "—";
  return fmtDuration(Date.now() - d.getTime());
}

type SafePayload = { fields: [string, string][]; keyword?: string };
function readPayload(raw?: string): SafePayload {
  if (!raw) return { fields: [] };
  try {
    const obj = JSON.parse(raw) as Record<string, unknown>;
    const attribution = (obj.attribution || {}) as Record<string, string>;
    const keyword = attribution.utm_term || attribution.utm_campaign;
    const fields = Object.entries(obj)
      .filter(([k, v]) => k !== "attribution" && v != null && v !== "")
      .map(([k, v]) => [k, String(v)] as [string, string]);
    return { fields, keyword };
  } catch {
    return { fields: [] };
  }
}

export function AdminLeads({ darkMode }: { darkMode: boolean }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fSource, setFSource] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setLeads(await getLeads());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sources = useMemo(
    () => Array.from(new Set(leads.map((l) => l.source || "web"))).sort(),
    [leads]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (fStatus && (l.status || "nuevo") !== fStatus) return false;
      if (fSource && (l.source || "web") !== fSource) return false;
      if (needle) {
        const hay = `${l.name} ${l.contact} ${l.destination} ${l.message}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [leads, q, fStatus, fSource]);

  // Métricas de responsabilidad.
  const stats = useMemo(() => {
    const nuevos = leads.filter((l) => (l.status || "nuevo") === "nuevo").length;
    const ganados = leads.filter((l) => l.status === "ganado").length;
    const responded = leads
      .map((l) => {
        const c = parseUTC(l.created_at);
        const f = parseUTC(l.first_contacted_at);
        return c && f ? f.getTime() - c.getTime() : null;
      })
      .filter((v): v is number => v != null);
    const avg = responded.length ? responded.reduce((a, b) => a + b, 0) / responded.length : null;
    return { total: leads.length, nuevos, ganados, avg };
  }, [leads]);

  const patchLocal = (id: number, patch: Partial<Lead>) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const save = async (lead: Lead) => {
    setSaving(true);
    setError("");
    try {
      await updateLead(lead.id, {
        status: lead.status,
        assigned_to: lead.assigned_to,
        notes: lead.notes,
      });
      await load();
      setSelected(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Acción rápida desde la tabla: marcar contactado (registra hora de respuesta).
  const quickContact = async (l: Lead) => {
    patchLocal(l.id, { status: "contactado" });
    try {
      await updateLead(l.id, { status: "contactado", assigned_to: l.assigned_to, notes: l.notes });
      await load();
    } catch (e) {
      setError((e as Error).message);
      load();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Borrar este lead?")) return;
    try {
      await deleteLead(id);
      await load();
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none ${
    darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
  }`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? "text-stone-400" : "text-stone-600"}`;
  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";

  // Color del "sin contestar" según cuánto lleva esperando.
  const waitingClass = (created: Date | null) => {
    if (!created) return mutedCls;
    const mins = (Date.now() - created.getTime()) / 60000;
    if (mins > 120) return "text-red-600 font-semibold";
    if (mins > 30) return "text-amber-600 font-semibold";
    return mutedCls;
  };

  return (
    <div>
      <h2 className={`text-2xl font-black mb-4 ${textCls}`}>Leads / CRM</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Métricas */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <div className={`text-xs font-semibold ${mutedCls}`}>Sin contestar</div>
          <div className={`text-3xl font-black ${stats.nuevos ? "text-red-600" : textCls}`}>{stats.nuevos}</div>
        </div>
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <div className={`text-xs font-semibold ${mutedCls}`}>Total leads</div>
          <div className={`text-3xl font-black ${textCls}`}>{stats.total}</div>
        </div>
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <div className={`text-xs font-semibold ${mutedCls}`}>Ganados</div>
          <div className="text-3xl font-black text-green-600">{stats.ganados}</div>
        </div>
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <div className={`text-xs font-semibold ${mutedCls}`}>Resp. promedio</div>
          <div className={`text-2xl font-black ${textCls}`}>{stats.avg != null ? fmtDuration(stats.avg) : "—"}</div>
        </div>
      </div>

      {/* Detalle / edición */}
      {selected && (
        <div className={`mb-6 rounded-xl border p-5 ${cardCls}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className={`text-lg font-bold ${textCls}`}>
                {selected.name || "Lead sin nombre"}
                {selected.contact && <span className={`ml-2 text-sm font-normal ${mutedCls}`}>· {selected.contact}</span>}
              </h3>
              <p className={`text-xs ${mutedCls}`}>
                {sourceLabel(selected.source)} · entró hace {timeAgo(parseUTC(selected.created_at))}
                {selected.email ? ` · ${selected.email}` : ""}
              </p>
            </div>
            <button onClick={() => setSelected(null)} className={`text-sm ${mutedCls} hover:text-red-600 cursor-pointer`}>✕</button>
          </div>

          {(selected.destination || selected.message) && (
            <div className={`mb-3 rounded-lg p-3 text-sm ${darkMode ? "bg-stone-800" : "bg-stone-50"}`}>
              {selected.destination && <p className={textCls}><strong>Destino:</strong> {selected.destination}</p>}
              {selected.message && <p className={`whitespace-pre-line ${mutedCls}`}>{selected.message}</p>}
              {(() => {
                const { fields, keyword } = readPayload(selected.payload);
                return (
                  <>
                    {fields.length > 0 && (
                      <p className={`mt-2 text-xs ${mutedCls}`}>
                        {fields.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </p>
                    )}
                    {keyword && (
                      <p className="mt-1 text-xs font-semibold text-amber-600">🔎 keyword/campaña: {keyword}</p>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Estado</label>
              <select
                className={inputCls}
                value={selected.status || "nuevo"}
                onChange={(e) => setSelected({ ...selected, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Asignado a (qué asesor lo atiende)</label>
              <input
                className={inputCls}
                value={selected.assigned_to || ""}
                onChange={(e) => setSelected({ ...selected, assigned_to: e.target.value })}
                placeholder="Nombre del asesor"
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelCls}>Notas (seguimiento / por qué no se contestó)</label>
              <textarea
                className={inputCls}
                rows={3}
                value={selected.notes || ""}
                onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                placeholder="Ej: llamé 14:30 sin respuesta, reintentar mañana."
              />
            </div>
          </div>

          <div className={`mt-3 text-xs ${mutedCls}`}>
            {selected.first_contacted_at
              ? `Primer contacto: respondido en ${fmtDuration(
                  (parseUTC(selected.first_contacted_at)!.getTime()) - (parseUTC(selected.created_at)?.getTime() || 0)
                )} desde que entró.`
              : "Todavía sin registrar primer contacto. Al guardar con un estado distinto de “Nuevo” se registra la hora."}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => save(selected)}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => setSelected(null)}
              className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${darkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-600 hover:bg-stone-100"}`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <input className={inputCls} placeholder="Buscar por nombre, contacto, destino..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={inputCls} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select className={inputCls} value={fSource} onChange={(e) => setFSource(e.target.value)}>
          <option value="">Todos los orígenes</option>
          {sources.map((s) => (
            <option key={s} value={s}>{sourceLabel(s)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : leads.length === 0 ? (
        <p className={mutedCls}>Todavía no hay consultas. Cuando alguien complete un formulario del sitio, aparece acá.</p>
      ) : (
        <>
          <p className={`mb-2 text-xs ${mutedCls}`}>{filtered.length} de {leads.length} leads</p>
          <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                  <th className="px-4 py-3 font-semibold">Entró</th>
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">Origen</th>
                  <th className="px-4 py-3 font-semibold">Respuesta</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const created = parseUTC(l.created_at);
                  const contacted = parseUTC(l.first_contacted_at);
                  const st = statusMeta(l.status);
                  return (
                    <tr key={l.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                      <td className={`px-4 py-3 ${mutedCls}`}>
                        hace {timeAgo(created)}
                        <div className="text-[10px]">{created ? created.toLocaleString() : "—"}</div>
                      </td>
                      <td className={`px-4 py-3 font-medium ${textCls}`}>
                        {l.name || <span className={mutedCls}>—</span>}
                        <div className={`text-xs ${mutedCls}`}>
                          {l.contact || "sin contacto"}{l.destination ? ` · ${l.destination}` : ""}
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${mutedCls}`}>{sourceLabel(l.source)}</td>
                      <td className="px-4 py-3">
                        {contacted && created ? (
                          <span className="text-green-600 font-semibold">en {fmtDuration(contacted.getTime() - created.getTime())}</span>
                        ) : (
                          <span className={waitingClass(created)}>sin contestar</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {(l.status || "nuevo") === "nuevo" && (
                          <button
                            onClick={() => quickContact(l)}
                            className="text-xs font-semibold text-blue-600 hover:underline mr-3 cursor-pointer"
                            title="Marca el primer contacto y registra la hora de respuesta"
                          >
                            Contactado
                          </button>
                        )}
                        <button onClick={() => setSelected(l)} className="text-xs font-semibold text-red-600 hover:underline mr-3 cursor-pointer">
                          Ver / editar
                        </button>
                        <button onClick={() => handleDelete(l.id)} className={`text-xs font-semibold hover:underline cursor-pointer ${mutedCls}`}>
                          Borrar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
