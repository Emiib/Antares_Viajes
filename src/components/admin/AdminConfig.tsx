import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { getConfig, updateConfig } from "./adminApi";
import type { SiteConfig } from "./adminApi";
import { CloudinaryUploader } from "./CloudinaryUploader";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { extractPdfText } from "../../lib/pdfText";

const LOGO_FIELDS: { key: keyof SiteConfig; label: string; hint: string }[] = [
  { key: "logo_header_path", label: "Logo navbar (isotipo)", hint: "Se usa en la barra superior, en claro y oscuro." },
  { key: "logo_dark_path", label: "Logo navbar — variante oscura (opcional)", hint: "Solo si querés un logo distinto sobre fondo oscuro. Si lo dejás vacío, usa el isotipo." },
  { key: "logo_footer_path", label: "Logo footer (completo)", hint: "Logo con texto, claro, para el pie sobre fondo oscuro." },
];

const SERVICE_IMG_FIELDS: { key: keyof SiteConfig; label: string }[] = [
  { key: "service_paquetes_img", label: "Paquetes Turísticos" },
  { key: "service_grupales_img", label: "Viajes Grupales" },
  { key: "service_circuitos_img", label: "Circuitos Internacionales" },
];

export function AdminConfig({ darkMode }: { darkMode: boolean }) {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Legales (PDF → texto)
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfBusy, setPdfBusy] = useState("");
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    getConfig()
      .then((c) => setConfig(c || {}))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const setField = (key: keyof SiteConfig, val: string) => {
    setSaved(false);
    setConfig((c) => ({ ...c, [key]: val }));
  };

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

  // Sube el PDF a Cloudinary y, en paralelo, extrae su texto para mostrarlo
  // como artículo. El texto queda editable antes de guardar.
  const handleLegalPdf = async (file?: File) => {
    if (!file) return;
    setPdfError("");
    setSaved(false);
    try {
      setPdfBusy("Extrayendo texto…");
      const [text, upload] = await Promise.all([
        extractPdfText(file),
        (async () => {
          setPdfBusy("Subiendo PDF…");
          return uploadToCloudinary(file);
        })(),
      ]);
      setConfig((c) => ({ ...c, legal_text: text, legal_pdf_url: upload.url }));
      setPdfBusy("");
    } catch (e) {
      setPdfError((e as Error).message);
      setPdfBusy("");
    } finally {
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none ${
    darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
  }`;
  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const labelCls = `block text-xs font-semibold mb-1 ${mutedCls}`;
  const btnSecondary = `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-60 ${
    darkMode ? "bg-stone-700 text-white hover:bg-stone-600" : "bg-stone-200 text-stone-800 hover:bg-stone-300"
  }`;

  if (loading) return <p className={mutedCls}>Cargando...</p>;

  return (
    <div className="max-w-2xl">
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
        {/* ─── Logos ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-3 ${textCls}`}>Logos</h3>
          <div className="space-y-4">
            {LOGO_FIELDS.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <CloudinaryUploader
                  value={config[f.key]}
                  onUploaded={(url) => setField(f.key, url)}
                  accept="image"
                  darkMode={darkMode}
                  label="Subir imagen"
                />
                <p className={`mt-1 text-[11px] ${mutedCls}`}>{f.hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Imágenes de Servicios (Home) ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-1 ${textCls}`}>Imágenes de Servicios (Home)</h3>
          <p className={`mb-3 text-xs ${mutedCls}`}>Las 3 fotos de la sección "Servicios" del inicio. Si dejás alguna vacía, se usa la imagen por defecto.</p>
          <div className="space-y-4">
            {SERVICE_IMG_FIELDS.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <CloudinaryUploader
                  value={config[f.key]}
                  onUploaded={(url) => setField(f.key, url)}
                  accept="image"
                  darkMode={darkMode}
                  label="Subir imagen"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Nosotros ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-1 ${textCls}`}>Nosotros</h3>
          <p className={`mb-3 text-xs ${mutedCls}`}>Imagen de la sección "Nuestra historia" en /nosotros.</p>
          <label className={labelCls}>Imagen de "Nuestra historia"</label>
          <CloudinaryUploader
            value={config.historia_img}
            onUploaded={(url) => setField("historia_img", url)}
            accept="image"
            darkMode={darkMode}
            label="Subir imagen"
          />
        </div>

        {/* ─── Legales: Condiciones Generales de Contratación ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-1 ${textCls}`}>Condiciones de contratación (Legales)</h3>
          <p className={`mb-3 text-xs ${mutedCls}`}>
            Subí el PDF de las condiciones. Se extrae el texto y se publica como artículo legible en{" "}
            <strong>/legales</strong>; el PDF queda también disponible para descargar. Podés editar el texto
            antes de guardar.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={btnSecondary} disabled={!!pdfBusy} onClick={() => pdfInputRef.current?.click()}>
              {pdfBusy || "Subir PDF de condiciones"}
            </button>
            {config.legal_pdf_url && (
              <a href={config.legal_pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-red-600 hover:underline">
                Ver PDF actual
              </a>
            )}
          </div>
          <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleLegalPdf(e.target.files?.[0])} />
          {pdfError && <p className="mt-2 text-xs font-semibold text-red-600">{pdfError}</p>}

          <label className={`block text-xs font-semibold mt-4 mb-1 ${mutedCls}`}>Texto publicado (editable)</label>
          <textarea
            className={inputCls}
            rows={12}
            value={config.legal_text || ""}
            placeholder="El texto extraído del PDF aparecerá acá. También podés pegarlo o editarlo a mano."
            onChange={(e) => {
              setSaved(false);
              setConfig({ ...config, legal_text: e.target.value });
            }}
          />
          {config.legal_text && (
            <p className={`mt-1 text-[11px] ${mutedCls}`}>
              {config.legal_text.length.toLocaleString()} caracteres · separá párrafos con una línea en blanco.
            </p>
          )}
        </div>

        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60">
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
