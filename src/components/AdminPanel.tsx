import React, { useState, useEffect } from "react";

interface AdminPanelProps {
  darkMode: boolean;
}

export function AdminPanel({ darkMode }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "packages" | "hero" | "config">("dashboard");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", data.token);
        setIsLoggedIn(true);
        setPassword("");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error");
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
            Admin Panel
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-stone-300" : "text-stone-700"}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200"}`}
                placeholder="Enter admin password"
              />
            </div>

            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Enter
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
              Logout
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "packages", label: "Packages" },
              { id: "hero", label: "Hero Slides" },
              { id: "config", label: "Config" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === "hero" && <AdminHeroSlides darkMode={darkMode} />}
        {activeTab === "config" && <AdminConfig darkMode={darkMode} />}
      </div>
    </div>
  );
}

function AdminDashboard({ darkMode }: { darkMode: boolean }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      setData(result);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}>
        Dashboard
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-lg border p-6 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <div className={`text-sm font-semibold mb-2 ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
            Active Packages
          </div>
          <div className="text-4xl font-black text-red-600">{data?.activePackages || 0}</div>
        </div>

        <div className={`rounded-lg border p-6 ${darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"}`}>
          <div className={`text-sm font-semibold mb-2 ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
            Active Hero Slides
          </div>
          <div className="text-4xl font-black text-red-600">{data?.activeSlides || 0}</div>
        </div>
      </div>

      <p className={`mt-6 text-sm ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
        Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "Loading..."}
      </p>
    </div>
  );
}

function AdminPackages({ darkMode }: { darkMode: boolean }) {
  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}>
        Manage Packages
      </h2>
      <p className={`${darkMode ? "text-stone-400" : "text-stone-600"}`}>
        Package management coming soon...
      </p>
    </div>
  );
}

function AdminHeroSlides({ darkMode }: { darkMode: boolean }) {
  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}>
        Manage Hero Slides
      </h2>
      <p className={`${darkMode ? "text-stone-400" : "text-stone-600"}`}>
        Hero slides management coming soon...
      </p>
    </div>
  );
}

function AdminConfig({ darkMode }: { darkMode: boolean }) {
  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-stone-900"}`}>
        Site Configuration
      </h2>
      <p className={`${darkMode ? "text-stone-400" : "text-stone-600"}`}>
        Configuration management coming soon...
      </p>
    </div>
  );
}
