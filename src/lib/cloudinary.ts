import { CLOUDINARY } from "../config/cloudinary";

export type UploadResult = {
  url: string;
  format: string;
  bytes: number;
  resourceType: string;
};

/**
 * Sube un archivo a Cloudinary con el preset unsigned del panel.
 * Usa el endpoint `auto` para que detecte solo si es imagen o documento (PDF).
 * Devuelve la URL pública (HTTPS, vía CDN) lista para guardar.
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY.uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/auto/upload`;
  const res = await fetch(endpoint, { method: "POST", body: form });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || `Error ${res.status} al subir el archivo`);
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    format: data.format,
    bytes: data.bytes,
    resourceType: data.resource_type,
  };
}
