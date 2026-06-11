// URL base del backend del panel admin.
// En desarrollo cae a localhost; en producción se define con VITE_API_URL
// (ver .env.example y la configuración de variables de entorno en Vercel).
const FALLBACK = "http://localhost:5000";

export const API_URL = (import.meta.env.VITE_API_URL ?? FALLBACK).replace(/\/+$/, "");
