import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  togglePost,
} from "./adminApi";
import type { BlogPost } from "./adminApi";
import { CloudinaryUploader } from "./CloudinaryUploader";

const CONTINENTS = ["América", "Europa", "Asia", "Caribe", "África", "Oceanía"];

const todayISO = () => new Date().toISOString().slice(0, 10);

/** Convierte un título en slug URL-friendly. */
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Draft = {
  isNew: boolean;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string;
  continent: string;
  country: string;
  read_time: string;
  display_order: string;
  published_at: string;
};

function emptyDraft(): Draft {
  return {
    isNew: true, id: "", slug: "", title: "", excerpt: "", body: "", image_url: "",
    continent: "América", country: "", read_time: "", display_order: "0",
    published_at: todayISO(),
  };
}

function toDraft(p: BlogPost): Draft {
  return {
    isNew: false, id: p.id, slug: p.slug || "", title: p.title, excerpt: p.excerpt || "",
    body: p.body || "", image_url: p.image_url || "", continent: p.continent || "América",
    country: p.country || "", read_time: p.read_time || "",
    display_order: String(p.display_order ?? 0), published_at: p.published_at || todayISO(),
  };
}

function draftToPayload(d: Draft): BlogPost {
  const slug = (d.slug.trim() || slugify(d.title)) || d.id.trim();
  return {
    id: d.id.trim(),
    slug,
    title: d.title.trim(),
    excerpt: d.excerpt.trim() || undefined,
    body: d.body.trim() || undefined,
    image_url: d.image_url.trim() || undefined,
    continent: d.continent || undefined,
    country: d.country.trim() || undefined,
    read_time: d.read_time.trim() || undefined,
    display_order: Number(d.display_order) || 0,
    published_at: d.published_at || undefined,
  };
}

export function AdminBlog({ darkMode }: { darkMode: boolean }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await getPosts());
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
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) =>
      `${p.title} ${p.country} ${p.continent} ${p.id}`.toLowerCase().includes(needle)
    );
  }, [posts, q]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = draftToPayload(draft);
      if (!payload.id || !payload.title) {
        throw new Error("Completá al menos ID y título.");
      }
      if (draft.isNew) await createPost(payload);
      else await updatePost(draft.id, payload);
      setDraft(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar esta nota?")) return;
    try {
      await deletePost(id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleToggle = async (p: BlogPost) => {
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: p.active ? 0 : 1 } : x)));
    try {
      await togglePost(p.id);
    } catch (e) {
      setError((e as Error).message);
      load();
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
        <h2 className={`text-2xl font-black ${textCls}`}>Blog</h2>
        <button
          onClick={() => setDraft(emptyDraft())}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer"
        >
          + Nueva nota
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {draft && (
        <form onSubmit={handleSave} className={`mb-6 rounded-xl border p-5 ${cardCls}`}>
          <h3 className={`text-lg font-bold mb-3 ${textCls}`}>
            {draft.isNew ? "Nueva nota" : `Editar: ${draft.title}`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>ID (único) *</label>
              <input
                className={inputCls}
                value={draft.id}
                disabled={!draft.isNew}
                onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                placeholder="ej. europa-bajo-presupuesto"
              />
            </div>
            <div>
              <label className={labelCls}>Slug (URL) — se autogenera del título</label>
              <input
                className={inputCls}
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder={draft.title ? slugify(draft.title) : "se-completa-solo"}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Título *</label>
              <input className={inputCls} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Bajada / resumen</label>
              <textarea className={inputCls} rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} placeholder="Aparece en la tarjeta del blog y en Google." />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Cuerpo del artículo (separá párrafos con una línea en blanco)</label>
              <textarea className={inputCls} rows={12} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder={"Primer párrafo...\n\nSegundo párrafo..."} />
            </div>
            <div>
              <label className={labelCls}>Imagen de portada</label>
              <input className={inputCls} value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} placeholder="https://..." />
              <div className="mt-2">
                <CloudinaryUploader
                  darkMode={darkMode}
                  accept="image"
                  value={draft.image_url}
                  onUploaded={(url) => setDraft((d) => (d ? { ...d, image_url: url } : d))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Continente</label>
                <select className={inputCls} value={draft.continent} onChange={(e) => setDraft({ ...draft, continent: e.target.value })}>
                  {CONTINENTS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>País</label>
                <input className={inputCls} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} placeholder="España" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Tiempo de lectura</label>
              <input className={inputCls} value={draft.read_time} onChange={(e) => setDraft({ ...draft, read_time: e.target.value })} placeholder="5 min" />
            </div>
            <div>
              <label className={labelCls}>Fecha de publicación</label>
              <input type="date" className={inputCls} value={draft.published_at} onChange={(e) => setDraft({ ...draft, published_at: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Orden (menor = primero)</label>
              <input type="number" className={inputCls} value={draft.display_order} onChange={(e) => setDraft({ ...draft, display_order: e.target.value })} />
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

      <div className="mb-4">
        <input
          className={inputCls}
          placeholder="Buscar por título, país o ID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : posts.length === 0 ? (
        <p className={mutedCls}>Todavía no hay notas. Creá la primera.</p>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Destino</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                  <td className={`px-4 py-3 font-medium ${textCls}`}>
                    {p.title}
                    <div className={`text-xs ${mutedCls}`}>{p.slug || p.id}</div>
                  </td>
                  <td className={`px-4 py-3 ${mutedCls}`}>
                    {p.continent}{p.country ? ` · ${p.country}` : ""}
                  </td>
                  <td className={`px-4 py-3 ${mutedCls}`}>{p.published_at || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(p)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer ${
                        p.active ? "bg-green-600/15 text-green-600" : "bg-stone-500/15 text-stone-500"
                      }`}
                      title="Publicar / pasar a borrador"
                    >
                      {p.active ? "Publicado" : "Borrador"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a
                      href={`/blog/${encodeURIComponent(p.slug || p.id)}`}
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
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className={`text-xs font-semibold hover:underline cursor-pointer ${mutedCls}`}
                    >
                      Borrar
                    </button>
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
