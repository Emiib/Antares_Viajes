import React, { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { adminFetch, getLeads } from "./admin/adminApi";
import type { Lead } from "./admin/adminApi";
import { AdminPackages } from "./admin/AdminPackages";
import { AdminBlog } from "./admin/AdminBlog";
import { AdminTestimonials } from "./admin/AdminTestimonials";
import { AdminTeam } from "./admin/AdminTeam";
import { AdminLeads } from "./admin/AdminLeads";
import { AdminIntegrations } from "./admin/AdminIntegrations";
import { AdminConfig } from "./admin/AdminConfig";

interface AdminPanelProps {
  darkMode: boolean;
}

type Tab = "dashboard" | "packages" | "blog" | "opiniones" | "equipo" | "leads" | "mayoristas" | "config";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "packages", label: "Paquetes" },
  { id: "blog", label: "Blog" },
  { id: "opiniones", label: "Opiniones" },
  { id: "equipo", label: "Equipo" },
  { id: "leads", label: "Leads" },
  { id: "mayoristas", label: "Mayoristas" },
  { id: "config", label: "Config" },
];

export function AdminPanel({ darkMode }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_token")) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("admin_token", data.token);
        setIsLoggedIn(true);
        setPassword("");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-stone-950" : "bg-stone-50"}`}>
        <div className={`rounded-2xl border p-8 w-full max-w-md ${darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <h1 className={`text-2xl font-black mb-6 text-center ${darkMode ? "text-white" : "text-stone-900"}`}>
            Antares Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200"}`}
                placeholder="Ingresá la contraseña"
              />
            </div>
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-stone-950" : "bg-stone-50"}`}>
      <div className={`border-b ${darkMode ? "border-stone-800 bg-stone-900" : "border-stone-200 bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-black ${darkMode ? "text-white" : "text-stone-900"}`}>
              Antares Admin
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : darkMode
                    ? "text-stone-300 hover:bg-stone-800"
                    : "text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <AdminDashboard darkMode={darkMode} onSeeAllLeads={() => setActiveTab("leads")} />}
        {activeTab === "packages" && <AdminPackages darkMode={darkMode} />}
        {activeTab === "blog" && <AdminBlog darkMode={darkMode} />}
        {activeTab === "opiniones" && <AdminTestimonials darkMode={darkMode} />}
        {activeTab === "equipo" && <AdminTeam darkMode={darkMode} />}
        {activeTab === "leads" && <AdminLeads darkMode={darkMode} />}
        {activeTab === "mayoristas" && <AdminIntegrations darkMode={darkMode} />}
        {activeTab === "config" && <AdminConfig darkMode={darkMode} />}
      </div>
    </div>
  );
}

type Dashboard = { activePackages?: number; activeSlides?: number; newLeads?: number; lastUpdated?: string };

function AdminDashboard({ darkMode, onSeeAllLeads }: { darkMode: boolean; onSeeAllLeads: () => void }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [recentLeads, setRecentLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = () => {
      adminFetch<Dashboard>("/dashboard")
        .then((d) => active && setData(d))
        .catch((e) => active && setError((e as Error).message));
      getLeads()
        .then((ls) => active && setRecentLeads(ls.slice(0, 5)))
        .catch(() => active && setRecentLeads([]));
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";
  const textCls = darkMode ? "text-white" : "text-stone-900";

  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${textCls}`}>Dashboard</h2>
      {error && <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-4 max-w-2xl lg:grid-cols-3">
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Leads sin contestar</div>
          <div className={`text-4xl font-black ${data?.newLeads ? "text-red-600" : textCls}`}>
            {data?.newLeads ?? "—"}
          </div>
        </div>
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Paquetes activos</div>
          <div className="text-4xl font-black text-red-600">{data?.activePackages ?? "—"}</div>
        </div>
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Hero slides activos</div>
          <div className="text-4xl font-black text-red-600">{data?.activeSlides ?? "—"}</div>
        </div>
      </div>

      <div className={`mt-8 rounded-xl border ${cardCls} max-w-3xl`}>
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className={`text-base font-bold ${textCls}`}>Últimos leads</h3>
          <button onClick={onSeeAllLeads} className="text-xs font-semibold text-red-600 hover:underline cursor-pointer">
            Ver todos
          </button>
        </div>
        {recentLeads === null ? (
          <p className={`px-5 pb-5 text-sm ${mutedCls}`}>Cargando…</p>
        ) : recentLeads.length === 0 ? (
          <p className={`px-5 pb-5 text-sm ${mutedCls}`}>Todavía no hay consultas.</p>
        ) : (
          <ul className={`divide-y ${darkMode ? "divide-stone-800" : "divide-stone-100"}`}>
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div className="min-w-0">
                  <span className={`font-semibold ${textCls}`}>{l.name || "Sin nombre"}</span>
                  {l.destination ? <span className={mutedCls}> · {l.destination}</span> : null}
                </div>
                <span className={`shrink-0 text-xs ${mutedCls}`}>
                  {l.created_at ? new Date(l.created_at).toLocaleDateString() : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className={`mt-6 text-sm ${mutedCls}`}>
        Última actualización: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "—"}
      </p>
    </div>
  );
}
