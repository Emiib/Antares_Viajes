import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { SITE_CONFIG } from "./config/site";
import { useDarkMode } from "./hooks/useDarkMode";
import { useNavbarVisibility } from "./hooks/useNavbarVisibility";

import { RouteSeo } from "./components/Seo";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { PageLayout } from "./components/layout/PageLayout";
import { FooterShowcase } from "./components/home/FooterShowcase";
import { ScrollPlane } from "./components/home/ScrollPlane";
import { TripFormModal } from "./components/modals/TripFormModal";
import { AdminPanel } from "./components/AdminPanel";

import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";
import { InfoUtilPage } from "./pages/InfoUtilPage";
import { LegalesPage } from "./pages/LegalesPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";

import {
  offersPackages,
  argentinaPackages,
  quincePackages,
  luxuryExperiences,
  cruisePackages,
  groupPackages,
  circuitPackages,
} from "./data/packages";

/** Construye un enlace de WhatsApp con un mensaje opcional ya codificado. */
export function wa(text?: string) {
  return `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsapp}${
    text ? `&text=${encodeURIComponent(text)}` : ""
  }`;
}

/** Lleva el scroll al tope en cada cambio de ruta (BrowserRouter no lo hace solo). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell() {
  const { darkMode, setDarkMode } = useDarkMode();
  const navbarVisible = useNavbarVisibility();
  const [showTripForm, setShowTripForm] = useState(false);
  const { pathname } = useLocation();

  // El panel admin se muestra sin el chrome de marketing (navbar, footer, etc.).
  if (pathname.startsWith("/admin")) {
    return <AdminPanel darkMode={darkMode} />;
  }

  const isHome = pathname === "/";

  return (
    <div
      className={`min-h-screen font-['Inter'] transition-colors duration-300 ${
        darkMode ? "antares-dark bg-stone-950" : "bg-white"
      }`}
    >
      <ScrollToTop />
      <RouteSeo />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} navbarVisible={navbarVisible} />

      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} wa={wa} />} />

        <Route
          path="/ofertas"
          element={
            <PageLayout
              title="Ofertas Flash"
              subtitle="Promociones y tarifas especiales con vigencia limitada."
              cards={offersPackages}
              accent="red"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/argentina"
          element={
            <PageLayout
              title="Descubrí Argentina"
              subtitle="Escapadas y viajes nacionales con los mejores destinos del país."
              cards={argentinaPackages}
              accent="amber"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/quinceaneras"
          element={
            <PageLayout
              title="Quinceañeras"
              subtitle="Programas pensados para viajes inolvidables de quince."
              cards={quincePackages}
              accent="rose"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/experiencias"
          element={
            <PageLayout
              title="Experiencias de Lujo"
              subtitle="Propuestas premium y viajes exclusivos de otra categoría."
              cards={luxuryExperiences}
              accent="gold"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/cruceros"
          element={
            <PageLayout
              title="Cruceros"
              subtitle="Preparado para futuras conexiones con MSC y Organfur Central de Cruceros."
              cards={cruisePackages}
              accent="amber"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/grupales"
          element={
            <PageLayout
              title="Viajes Grupales"
              subtitle="Paquetes especiales para empresas, amigos y familias con tarifas pensadas para grupos."
              cards={groupPackages}
              accent="red"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/circuitos"
          element={
            <PageLayout
              title="Circuitos Internacionales"
              subtitle="Rutas completas para descubrir grandes destinos con itinerarios armados."
              cards={circuitPackages}
              accent="red"
              darkMode={darkMode}
            />
          }
        />

        <Route path="/blog" element={<BlogPage darkMode={darkMode} />} />
        <Route path="/info-util" element={<InfoUtilPage darkMode={darkMode} />} />
        <Route path="/legales" element={<LegalesPage darkMode={darkMode} />} />
        <Route
          path="/paquete/:id"
          element={<PackageDetailPage darkMode={darkMode} whatsappLink={wa} />}
        />

        {/* Cualquier ruta desconocida cae en el inicio. */}
        <Route path="*" element={<HomePage darkMode={darkMode} wa={wa} />} />
      </Routes>

      {isHome && (
        <FooterShowcase darkMode={darkMode} onOpenForm={() => setShowTripForm(true)} />
      )}

      <Footer />

      {isHome && <ScrollPlane darkMode={darkMode} />}

      {/* Botón flotante de WhatsApp */}
      <a
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-2xl transition-all hover:scale-110 hover:bg-green-600"
      >
        <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" />
        </svg>
      </a>

      {showTripForm && (
        <TripFormModal darkMode={darkMode} wa={wa} onClose={() => setShowTripForm(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
