import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMember,
} from "./adminApi";
import type { TeamMember } from "./adminApi";
import { CloudinaryUploader } from "./CloudinaryUploader";

const newId = () => "tm-" + Math.random().toString(36).slice(2, 8);

type Draft = { isNew: boolean; id: string; name: string; role: string; photo_url: string; display_order: string };

function emptyDraft(): Draft {
  return { isNew: true, id: newId(), name: "", role: "", photo_url: "", display_order: "0" };
}
function toDraft(m: TeamMember): Draft {
  return { isNew: false, id: m.id, name: m.name, role: m.role || "", photo_url: m.photo_url || "", display_order: String(m.display_order ?? 0) };
}
function draftToPayload(d: Draft): TeamMember {
  return {
    id: d.id.trim(),
    name: d.name.trim(),
    role: d.role.trim() || undefined,
    photo_url: d.photo_url.trim() || undefined,
    display_order: Number(d.display_order) || 0,
  };
}

export function AdminTeam({ darkMode }: { darkMode: boolean }) {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getTeam());
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
    return items.filter((m) => `${m.name} ${m.role ?? ""}`.toLowerCase().includes(n));
  }, [items, q]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = draftToPayload(draft);
      if (!payload.id || !payload.name) throw new Error("El nombre es obligatorio.");
      if (draft.isNew) await createTeamMember(payload);
      else await updateTeamMember(draft.id, payload);
      setDraft(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar este integrante del equipo?")) return;
    try {
      await deleteTeamMember(id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleToggle = async (m: TeamMember) => {
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, active: m.active ? 0 : 1 } : x)));
    try {
      await toggleTeamMember(m.id);
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
        <h2 className={`text-2xl font-black ${textCls}`}>Equipo</h2>
        <button onClick={() => setDraft(emptyDraft())} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer">
          + Nuevo integrante
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">{error}</div>
      )}

      {draft && (
        <form onSubmit={handleSave} className={`mb-6 rounded-xl border p-5 ${cardCls}`}>
          <h3 className={`text-lg font-bold mb-3 ${textCls}`}>{draft.isNew ? "Nuevo integrante" : "Editar integrante"}</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelCls}>Foto</label>
              <CloudinaryUploader
                value={draft.photo_url}
                onUploaded={(url) => setDraft({ ...draft, photo_url: url })}
                accept="image"
                darkMode={darkMode}
                label="Subir foto"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre *</label>
                <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="María Pérez" />
              </div>
              <div>
                <label className={labelCls}>Rol / especialidad</label>
                <input className={inputCls} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="Dueña · Cruceros" />
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
        <input className={inputCls} placeholder="Buscar por nombre o rol..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : items.length === 0 ? (
        <p className={mutedCls}>Todavía no cargaste integrantes. Mientras tanto, /nosotros muestra fotos de ejemplo.</p>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                <th className="px-4 py-3 font-semibold">Foto</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                  <td className="px-4 py-3">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="h-10 w-10 rounded-full object-cover border border-stone-300" />
                    ) : (
                      <span className={mutedCls}>—</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${textCls}`}>{m.name}</td>
                  <td className={`px-4 py-3 ${mutedCls}`}>{m.role || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(m)} className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer ${m.active ? "bg-green-600/15 text-green-600" : "bg-stone-500/15 text-stone-500"}`} title="Mostrar / ocultar en el sitio">
                      {m.active ? "Visible" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setDraft(toDraft(m))} className="text-xs font-semibold text-red-600 hover:underline mr-3 cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(m.id)} className={`text-xs font-semibold hover:underline cursor-pointer ${mutedCls}`}>Borrar</button>
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
