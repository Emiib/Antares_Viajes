import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getConfig, updateConfig } from "./adminApi";
import type { SiteConfig } from "./adminApi";

const FIELDS: { key: keyof SiteConfig; label: string; placeholder?: string }[] = [
  { key: "whatsapp", label: "WhatsApp", placeholder: "5493446528749" },
  { key: "sales_email", label: "Email de ventas", placeholder: "ventas@..." },
  { key: "slogan", label: "Slogan" },
  { key: "logo_header_path", label: "Logo header (ruta)", placeholder: "/branding/logo-header.png" },
  { key: "logo_dark_path", label: "Logo dark (ruta)", placeholder: "/branding/logo-dark.png" },
];

export function AdminConfig({ darkMode }: { darkMode: boolean }) {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getConfig()
      .then((c) => setConfig(c || {}))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateConfig(config);
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none ${
    darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
  }`;

  if (loading) return <p className={mutedCls}>Cargando...</p>;

  return (
    <div className="max-w-xl">
      <h2 className={`text-2xl font-black mb-6 ${textCls}`}>Configuración del sitio</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-lg bg-green-600/10 px-4 py-2 text-sm font-semibold text-green-600">
          ✓ Cambios guardados.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className={`block text-xs font-semibold mb-1 ${mutedCls}`}>{f.label}</label>
            <input
              className={inputCls}
              value={config[f.key] || ""}
              placeholder={f.placeholder}
              onChange={(e) => {
                setSaved(false);
                setConfig({ ...config, [f.key]: e.target.value });
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
