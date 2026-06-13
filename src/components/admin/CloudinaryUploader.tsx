import { useRef, useState } from "react";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { cloudinaryConfigured } from "../../config/cloudinary";

type Props = {
  /** URL actual ya guardada (para mostrar preview / estado). */
  value?: string;
  /** Se dispara con la URL pública cuando la subida termina OK. */
  onUploaded: (url: string) => void;
  /** Tipo de archivo aceptado. */
  accept?: "image" | "pdf";
  darkMode: boolean;
  /** Texto del botón de subida. */
  label?: string;
};

const ACCEPT_ATTR = {
  image: "image/jpeg,image/png,image/webp",
  pdf: "application/pdf",
};

const MAX_MB = { image: 8, pdf: 15 };

export function CloudinaryUploader({
  value,
  onUploaded,
  accept = "image",
  darkMode,
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const configured = cloudinaryConfigured();
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-500";
  const btnCls = `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-60 ${
    darkMode ? "bg-stone-700 text-white hover:bg-stone-600" : "bg-stone-200 text-stone-800 hover:bg-stone-300"
  }`;

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError("");

    const max = MAX_MB[accept] * 1024 * 1024;
    if (file.size > max) {
      setError(`El archivo supera el máximo de ${MAX_MB[accept]} MB.`);
      return;
    }

    setBusy(true);
    try {
      const { url } = await uploadToCloudinary(file);
      onUploaded(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (!configured) {
    return (
      <p className={`text-xs ${mutedCls}`}>
        Cloudinary no está configurado. Definí VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_PRESET.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button type="button" className={btnCls} disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Subiendo…" : label || (accept === "pdf" ? "Subir PDF" : "Subir imagen")}
        </button>

        {value && accept === "image" && (
          <img
            src={value}
            alt="preview"
            className="h-12 w-12 rounded-lg object-cover border border-stone-300"
          />
        )}
        {value && accept === "pdf" && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Ver archivo actual
          </a>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR[accept]}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
