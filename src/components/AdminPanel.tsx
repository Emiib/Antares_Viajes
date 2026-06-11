import React, { useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { adminFetch } from "./admin/adminApi";
import { AdminPackages } from "./admin/AdminPackages";
import { AdminIntegrations } from "./admin/AdminIntegrations";
import { AdminConfig } from "./admin/AdminConfig";

interface AdminPanelProps {
  darkMode: boolean;
}

type Tab = "dashboard" | "packages" | "mayoristas" | "config";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "packages", label: "Paquetes" },
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
        {activeTab === "dashboard" && <AdminDashboard darkMode={darkMode} />}
        {activeTab === "packages" && <AdminPackages darkMode={darkMode} />}
        {activeTab === "mayoristas" && <AdminIntegrations darkMode={darkMode} />}
        {activeTab === "config" && <AdminConfig darkMode={darkMode} />}
      </div>
    </div>
  );
}

type Dashboard = { activePackages?: number; activeSlides?: number; lastUpdated?: string };

function AdminDashboard({ darkMode }: { darkMode: boolean }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchData = () => {
      adminFetch<Dashboard>("/dashboard")
        .then((d) => active && setData(d))
        .catch((e) => active && setError((e as Error).message));
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

  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}>Dashboard</h2>
      {error && <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Paquetes activos</div>
          <div className="text-4xl font-black text-red-600">{data?.activePackages ?? "—"}</div>
        </div>
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Hero slides activos</div>
          <div className="text-4xl font-black text-red-600">{data?.activeSlides ?? "—"}</div>
        </div>
      </div>
      <p className={`mt-6 text-sm ${mutedCls}`}>
        Última actualización: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "—"}
      </p>
    </div>
  );
}
