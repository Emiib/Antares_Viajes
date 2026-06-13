// Cloudinary: subida de archivos desde el panel admin.
// El cloud name y el upload preset "unsigned" son públicos por diseño
// (van en el bundle del navegador); por eso el preset restringe carpeta y
// formatos. Se pueden sobreescribir con variables de entorno en Vercel.
export const CLOUDINARY = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "dglqgef1k",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_PRESET ?? "antares-admin",
};

export const cloudinaryConfigured = () =>
  Boolean(CLOUDINARY.cloudName && CLOUDINARY.uploadPreset);
