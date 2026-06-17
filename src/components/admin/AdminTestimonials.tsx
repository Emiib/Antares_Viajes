import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
} from "./adminApi";
import type { Testimonial } from "./adminApi";

const newId = () => "t-" + Math.random().toString(36).slice(2, 8);

type Draft = {
  isNew: boolean;
  id: string;
  quote: string;
  name: string;
  city: string;
  display_order: string;
};

function emptyDraft(): Draft {
  return { isNew: true, id: newId(), quote: "", name: "", city: "", display_order: "0" };
}
function toDraft(t: Testimonial): Draft {
  return { isNew: false, id: t.id, quote: t.quote, name: t.name || "", city: t.city || "", display_order: String(t.display_order ?? 0) };
}
function draftToPayload(d: Draft): Testimonial {
  return {
    id: d.id.trim(),
    quote: d.quote.trim(),
    name: d.name.trim() || undefined,
    city: d.city.trim() || undefined,
    display_order: Number(d.display_order) || 0,
  };
}

export function AdminTestimonials({ darkMode }: { darkMode: boolean }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getTestimonials());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter((t) => `${t.quote} ${t.name ?? ""} ${t.city ?? ""}`.toLowerCase().includes(n));
  }, [items, q]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = draftToPayload(draft);
      if (!payload.id || !payload.quote) throw new Error("La opinión (texto) es obligatoria.");
      if (draft.isNew) await createTestimonial(payload);
      else await updateTestimonial(draft.id, payload);
      setDraft(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar esta opinión?")) return;
    try {
      await deleteTestimonial(id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleToggle = async (t: Testimonial) => {
    setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, active: t.active ? 0 : 1 } : x)));
    try {
      await toggleTestimonial(t.id);
    } catch (e) {
      setError((e as Error).message);
      load();
    }
  };

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? "text-stone-400" : "text-stone-600"}`;
  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-black ${textCls}`}>Opiniones</h2>
        <button onClick={() => setDraft(emptyDraft())} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer">
          + Nueva opinión
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">{error}</div>
      )}

      {draft && (
        <form onSubmit={handleSave} className={`mb-6 rounded-xl border p-5 ${cardCls}`}>
          <h3 className={`text-lg font-bold mb-3 ${textCls}`}>{draft.isNew ? "Nueva opinión" : "Editar opinión"}</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelCls}>Opinión / testimonio *</label>
              <textarea className={inputCls} rows={3} value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} placeholder="Volvimos enamorados de la Patagonia..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre</label>
                <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="María Elena R." />
              </div>
              <div>
                <label className={labelCls}>Ciudad</label>
                <input className={inputCls} value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="Gualeguaychú" />
              </div>
            </div>
            <div className="w-40">
              <label className={labelCls}>Orden (menor = primero)</label>
              <input type="number" className={inputCls} value={draft.display_order} onChange={(e) => setDraft({ ...draft, display_order: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 cursor-pointer">
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={() => setDraft(null)} className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${darkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-600 hover:bg-stone-100"}`}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input className={inputCls} placeholder="Buscar por texto, nombre o ciudad..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : items.length === 0 ? (
        <p className={mutedCls}>Todavía no cargaste opiniones. Mientras tanto, el sitio muestra unas de ejemplo.</p>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                <th className="px-4 py-3 font-semibold">Opinión</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                  <td className={`px-4 py-3 ${textCls} max-w-md`}>
                    <span className="line-clamp-2">{t.quote}</span>
                  </td>
                  <td className={`px-4 py-3 ${mutedCls}`}>{t.name || "—"}{t.city ? ` · ${t.city}` : ""}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(t)} className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer ${t.active ? "bg-green-600/15 text-green-600" : "bg-stone-500/15 text-stone-500"}`} title="Mostrar / ocultar en el sitio">
                      {t.active ? "Visible" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setDraft(toDraft(t))} className="text-xs font-semibold text-red-600 hover:underline mr-3 cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(t.id)} className={`text-xs font-semibold hover:underline cursor-pointer ${mutedCls}`}>Borrar</button>
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
