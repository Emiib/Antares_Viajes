import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackage,
} from "./adminApi";
import type { AdminPackage } from "./adminApi";

const TYPES = [
  "ofertas",
  "featured",
  "argentina",
  "circuitos",
  "grupales",
  "quinceaneras",
  "experiencias",
  "cruceros",
];

type Draft = {
  isNew: boolean;
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
  includesText: string;
};

function emptyDraft(): Draft {
  return {
    isNew: true, id: "", type: "ofertas", title: "", destination: "",
    duration: "", price: "", image_url: "", badge: "", departure: "",
    people: "", includesText: "",
  };
}

function toDraft(p: AdminPackage): Draft {
  return {
    isNew: false, id: p.id, type: p.type || "ofertas", title: p.title,
    destination: p.destination, duration: p.duration || "", price: p.price,
    image_url: p.image_url || "", badge: p.badge || "", departure: p.departure || "",
    people: p.people || "", includesText: (p.includes || []).join("\n"),
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
    includes: d.includesText.split("\n").map((s) => s.trim()).filter(Boolean),
  };
}

const isManual = (p: AdminPackage) => !p.source || p.source === "manual";

export function AdminPackages({ darkMode }: { darkMode: boolean }) {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleToggle = async (id: string) => {
    try {
      await togglePackage(id);
      await load();
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-black ${textCls}`}>Paquetes</h2>
        <button
          onClick={() => setDraft(emptyDraft())}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
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
          <h3 className={`text-lg font-bold mb-4 ${textCls}`}>
            {draft.isNew ? "Nuevo paquete" : `Editar: ${draft.title}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <label className={labelCls}>Categoría</label>
              <select
                className={inputCls}
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Título *</label>
              <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Destino *</label>
              <input className={inputCls} value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Precio *</label>
              <input className={inputCls} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} placeholder="USD 1.290" />
            </div>
            <div>
              <label className={labelCls}>Duración</label>
              <input className={inputCls} value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} placeholder="7 noches" />
            </div>
            <div>
              <label className={labelCls}>Imagen (URL)</label>
              <input className={inputCls} value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="/branding/..." />
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <input className={inputCls} value={draft.badge} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} placeholder="Oferta, Luxury..." />
            </div>
            <div>
              <label className={labelCls}>Salida</label>
              <input className={inputCls} value={draft.departure} onChange={(e) => setDraft({ ...draft, departure: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Personas</label>
              <input className={inputCls} value={draft.people} onChange={(e) => setDraft({ ...draft, people: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Incluye (uno por línea)</label>
              <textarea
                className={inputCls}
                rows={3}
                value={draft.includesText}
                onChange={(e) => setDraft({ ...draft, includesText: e.target.value })}
                placeholder={"Aéreos\nHotel 5★\nTraslados"}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className={`px-4 py-2 rounded-lg font-semibold ${darkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-600 hover:bg-stone-100"}`}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : packages.length === 0 ? (
        <p className={mutedCls}>Todavía no hay paquetes. Creá uno o sincronizá un mayorista.</p>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Origen</th>
                <th className="px-4 py-3 font-semibold">Precio</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                  <td className={`px-4 py-3 font-medium ${textCls}`}>
                    {p.title}
                    <div className={`text-xs ${mutedCls}`}>{p.destination}</div>
                  </td>
                  <td className={`px-4 py-3 ${mutedCls}`}>{p.type || "—"}</td>
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
                      onClick={() => handleToggle(p.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        p.active
                          ? "bg-green-600/15 text-green-600"
                          : "bg-stone-500/15 text-stone-500"
                      }`}
                      title="Mostrar/ocultar en el sitio"
                    >
                      {p.active ? "Activo" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {isManual(p) ? (
                      <>
                        <button
                          onClick={() => setDraft(toDraft(p))}
                          className="text-xs font-semibold text-red-600 hover:underline mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className={`text-xs font-semibold hover:underline ${mutedCls}`}
                        >
                          Borrar
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs ${mutedCls}`}>Sincronizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
