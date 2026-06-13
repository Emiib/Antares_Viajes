import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackage,
  featurePackage,
} from "./adminApi";
import type { AdminPackage } from "./adminApi";

/** Categorías = páginas del sitio. "Destacar" es un flag aparte, no una categoría. */
const CATEGORIES: { value: string; label: string }[] = [
  { value: "ofertas", label: "Ofertas" },
  { value: "argentina", label: "Argentina" },
  { value: "circuitos", label: "Circuitos" },
  { value: "grupales", label: "Grupales" },
  { value: "quinceaneras", label: "Quinceañeras" },
  { value: "experiencias", label: "Lujo / Experiencias" },
  { value: "cruceros", label: "Cruceros" },
];

const categoryLabel = (value?: string) =>
  CATEGORIES.find((c) => c.value === value)?.label || value || "—";

const todayISO = () => new Date().toISOString().slice(0, 10);

const isManual = (p: AdminPackage) => !p.source || p.source === "manual";

type Status = { label: string; cls: string };
function statusOf(p: AdminPackage): Status {
  if (!p.active) return { label: "Borrador", cls: "bg-stone-500/15 text-stone-500" };
  if (p.valid_until && p.valid_until < todayISO())
    return { label: "Vencido", cls: "bg-amber-500/15 text-amber-600" };
  return { label: "Publicado", cls: "bg-green-600/15 text-green-600" };
}

type Draft = {
  isNew: boolean;
  source?: string;
  id: string;
  type: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  image_url: string;
  badge: string;
  departure: string;
  people: string;
  validUntil: string;
  displayOrder: string;
  featured: boolean;
  includesText: string;
};

function emptyDraft(): Draft {
  return {
    isNew: true, source: "manual", id: "", type: "ofertas", title: "", destination: "",
    duration: "", price: "", image_url: "", badge: "", departure: "", people: "",
    validUntil: "", displayOrder: "0", featured: false, includesText: "",
  };
}

function toDraft(p: AdminPackage): Draft {
  return {
    isNew: false, source: p.source || "manual", id: p.id, type: p.type || "ofertas",
    title: p.title, destination: p.destination, duration: p.duration || "", price: p.price,
    image_url: p.image_url || "", badge: p.badge || "", departure: p.departure || "",
    people: p.people || "", validUntil: p.valid_until || "",
    displayOrder: String(p.display_order ?? 0), featured: !!p.featured,
    includesText: (p.includes || []).join("\n"),
  };
}

function draftToPayload(d: Draft): AdminPackage {
  return {
    id: d.id.trim(),
    type: d.type,
    title: d.title.trim(),
    destination: d.destination.trim(),
    duration: d.duration.trim() || undefined,
    price: d.price.trim(),
    image_url: d.image_url.trim() || undefined,
    badge: d.badge.trim() || undefined,
    departure: d.departure.trim() || undefined,
    people: d.people.trim() || undefined,
    valid_until: d.validUntil || undefined,
    display_order: Number(d.displayOrder) || 0,
    featured: d.featured ? 1 : 0,
    includes: d.includesText.split("\n").map((s) => s.trim()).filter(Boolean),
  };
}

export function AdminPackages({ darkMode }: { darkMode: boolean }) {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  // Filtros / buscador
  const [q, setQ] = useState("");
  const [fCategory, setFCategory] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fSource, setFSource] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setPackages(await getPackages());
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
    () => Array.from(new Set(packages.map((p) => p.source || "manual"))).sort(),
    [packages]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return packages.filter((p) => {
      if (fCategory && p.type !== fCategory) return false;
      if (fSource && (p.source || "manual") !== fSource) return false;
      if (fStatus && statusOf(p).label !== fStatus) return false;
      if (needle) {
        const hay = `${p.title} ${p.destination} ${p.id}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [packages, q, fCategory, fSource, fStatus]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = draftToPayload(draft);
      if (!payload.id || !payload.title || !payload.destination || !payload.price) {
        throw new Error("Completá id, título, destino y precio.");
      }
      if (draft.isNew) await createPackage(payload);
      else await updatePackage(draft.id, payload);
      setDraft(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar este paquete?")) return;
    try {
      await deletePackage(id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const optimistic = (id: string, patch: Partial<AdminPackage>) =>
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const handleToggle = async (p: AdminPackage) => {
    optimistic(p.id, { active: p.active ? 0 : 1 });
    try {
      await togglePackage(p.id);
    } catch (e) {
      setError((e as Error).message);
      load();
    }
  };

  const handleFeature = async (p: AdminPackage) => {
    optimistic(p.id, { featured: p.featured ? 0 : 1 });
    try {
      await featurePackage(p.id);
    } catch (e) {
      setError((e as Error).message);
      load();
    }
  };

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none disabled:opacity-50 ${
    darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
  }`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? "text-stone-400" : "text-stone-600"}`;
  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";

  const lockedContent = !!draft && !draft.isNew && !(draft.source === "manual" || !draft.source);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-black ${textCls}`}>Paquetes</h2>
        <button
          onClick={() => setDraft(emptyDraft())}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer"
        >
          + Nuevo paquete
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {draft && (
        <form onSubmit={handleSave} className={`mb-6 rounded-xl border p-5 ${cardCls}`}>
          <h3 className={`text-lg font-bold mb-1 ${textCls}`}>
            {draft.isNew ? "Nuevo paquete" : `Editar: ${draft.title}`}
          </h3>
          {lockedContent && (
            <p className={`mb-4 text-xs ${mutedCls}`}>
              Este paquete viene del mayorista <strong>{draft.source}</strong>. El contenido
              (título, precio, fechas) lo administra el mayorista; vos elegís dónde y cómo se muestra.
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className={labelCls}>ID (único) *</label>
              <input
                className={inputCls}
                value={draft.id}
                disabled={!draft.isNew}
                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                placeholder="ej. promo-bariloche"
              />
            </div>
            <div>
              <label className={labelCls}>Página / categoría *</label>
              <select
                className={inputCls}
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Título *</label>
              <input className={inputCls} value={draft.title} disabled={lockedContent} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Destino *</label>
              <input className={inputCls} value={draft.destination} disabled={lockedContent} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Precio *</label>
              <input className={inputCls} value={draft.price} disabled={lockedContent} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="USD 1.290" />
            </div>
            <div>
              <label className={labelCls}>Duración</label>
              <input className={inputCls} value={draft.duration} disabled={lockedContent} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="7 noches" />
            </div>
            <div>
              <label className={labelCls}>Imagen (URL)</label>
              <input className={inputCls} value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="/img/... o https://..." />
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <input className={inputCls} value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} placeholder="Oferta, Luxury..." />
            </div>
            <div>
              <label className={labelCls}>Salida</label>
              <input className={inputCls} value={draft.departure} disabled={lockedContent} onChange={(e) => setDraft({ ...draft, departure: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Personas</label>
              <input className={inputCls} value={draft.people} disabled={lockedContent} onChange={(e) => setDraft({ ...draft, people: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Vence el (opcional)</label>
              <input type="date" className={inputCls} value={draft.validUntil} onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Orden (menor = primero)</label>
              <input type="number" className={inputCls} value={draft.displayOrder} onChange={(e) => setDraft({ ...draft, displayOrder: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <input
                id="draft-featured"
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                className="h-4 w-4 cursor-pointer accent-red-600"
              />
              <label htmlFor="draft-featured" className={`text-sm font-medium cursor-pointer ${textCls}`}>
                Destacar en “Favoritos” del home
              </label>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Incluye (uno por línea)</label>
              <textarea
                className={inputCls}
                rows={3}
                value={draft.includesText}
                disabled={lockedContent}
                onChange={(e) => setDraft({ ...draft, includesText: e.target.value })}
                placeholder={"Aéreos\nHotel 5★\nTraslados"}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${darkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-600 hover:bg-stone-100"}`}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className={inputCls}
          placeholder="Buscar por título, destino o ID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={inputCls} value={fCategory} onChange={(e) => setFCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select className={inputCls} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="Publicado">Publicado</option>
          <option value="Borrador">Borrador</option>
          <option value="Vencido">Vencido</option>
        </select>
        <select className={inputCls} value={fSource} onChange={(e) => setFSource(e.target.value)}>
          <option value="">Todos los orígenes</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s === "manual" ? "Manual" : s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : packages.length === 0 ? (
        <p className={mutedCls}>Todavía no hay paquetes. Creá uno o sincronizá un mayorista.</p>
      ) : (
        <>
          <p className={`mb-2 text-xs ${mutedCls}`}>
            {filtered.length} de {packages.length} paquetes
          </p>
          <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                  <th className="px-3 py-3 font-semibold" title="Destacar en el home">★</th>
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold">Origen</th>
                  <th className="px-4 py-3 font-semibold">Precio</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const st = statusOf(p);
                  return (
                    <tr key={p.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleFeature(p)}
                          title={p.featured ? "Quitar de Favoritos" : "Destacar en Favoritos"}
                          className={`text-lg leading-none cursor-pointer transition-colors ${p.featured ? "text-amber-400" : "text-stone-400 hover:text-amber-400"}`}
                        >
                          {p.featured ? "★" : "☆"}
                        </button>
                      </td>
                      <td className={`px-4 py-3 font-medium ${textCls}`}>
                        {p.title}
                        <div className={`text-xs ${mutedCls}`}>{p.destination}</div>
                      </td>
                      <td className={`px-4 py-3 ${mutedCls}`}>{categoryLabel(p.type)}</td>
                      <td className="px-4 py-3">
                        {isManual(p) ? (
                          <span className={`text-xs ${mutedCls}`}>Manual</span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600">🔌 {p.source}</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${textCls}`}>{p.price}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(p)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer ${st.cls}`}
                          title="Publicar / pasar a borrador"
                        >
                          {st.label}
                        </button>
                        {p.valid_until && (
                          <div className={`mt-1 text-[10px] ${mutedCls}`}>vence {p.valid_until}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <a
                          href={`/paquete/${encodeURIComponent(p.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs font-semibold hover:underline mr-3 ${mutedCls}`}
                        >
                          Ver
                        </a>
                        <button
                          onClick={() => setDraft(toDraft(p))}
                          className="text-xs font-semibold text-red-600 hover:underline mr-3 cursor-pointer"
                        >
                          {isManual(p) ? "Editar" : "Ubicación"}
                        </button>
                        {isManual(p) && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            className={`text-xs font-semibold hover:underline cursor-pointer ${mutedCls}`}
                          >
                            Borrar
                          </button>
                        )}
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
