import { API_URL } from "../../config/api";

export type AdminPackage = {
  id: string;
  type?: string;
  source?: string;
  external_id?: string;
  title: string;
  destination: string;
  duration?: string;
  price: string;
  image_url?: string;
  badge?: string;
  departure?: string;
  people?: string;
  active?: number;
  includes?: string[];
};

export type SiteConfig = {
  whatsapp?: string;
  sales_email?: string;
  slogan?: string;
  logo_header_path?: string;
  logo_dark_path?: string;
};

export type Integration = {
  source: string;
  enabled: boolean;
  markupPct: number;
};

export type SyncResult = {
  source: string;
  ok: boolean;
  count?: number;
  error?: string;
};

function authToken() {
  return localStorage.getItem("admin_token") || "";
}

/** Fetch a /api/admin/* con el token de sesión inyectado y manejo de errores. */
export async function adminFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}/api/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken()}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    throw new Error("Tu sesión expiró. Cerrá sesión y volvé a entrar.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Paquetes ───
export const getPackages = () => adminFetch<AdminPackage[]>("/packages");
export const createPackage = (pkg: AdminPackage) =>
  adminFetch("/packages", { method: "POST", body: JSON.stringify(pkg) });
export const updatePackage = (id: string, pkg: AdminPackage) =>
  adminFetch(`/packages/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(pkg) });
export const deletePackage = (id: string) =>
  adminFetch(`/packages/${encodeURIComponent(id)}`, { method: "DELETE" });
export const togglePackage = (id: string) =>
  adminFetch(`/packages/${encodeURIComponent(id)}/toggle`, { method: "PUT" });

// ─── Config ───
export const getConfig = () => adminFetch<SiteConfig>("/config");
export const updateConfig = (config: SiteConfig) =>
  adminFetch("/config", { method: "PUT", body: JSON.stringify(config) });

// ─── Mayoristas ───
export const getIntegrations = () => adminFetch<Integration[]>("/integrations");
export const runSync = () => adminFetch<{ results: SyncResult[] }>("/sync", { method: "POST" });
