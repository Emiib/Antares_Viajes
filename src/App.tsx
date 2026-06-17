import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { SITE_CONFIG } from "./config/site";
import { useDarkMode } from "./hooks/useDarkMode";
import { useNavbarVisibility } from "./hooks/useNavbarVisibility";

import { Analytics } from "./components/Analytics";
import { RouteSeo } from "./components/Seo";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { PageLayout } from "./components/layout/PageLayout";
import { AdminPanel } from "./components/AdminPanel";

import { HomePage } from "./pages/HomePage";
import { PaquetesPage } from "./pages/PaquetesPage";
import { NosotrosPage } from "./pages/NosotrosPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { InfoUtilPage } from "./pages/InfoUtilPage";
import { LegalesPage } from "./pages/LegalesPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";

import { PackagesProvider, usePackages } from "./data/packagesStore";
import { LeadModalProvider } from "./context/LeadModalContext";
import { LeadModal } from "./components/modals/LeadModal";
import { Icon } from "./components/ui/Icon";

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
  const { pathname } = useLocation();
  const { byType } = usePackages();

  // El panel admin se muestra sin el chrome de marketing (navbar, footer, etc.).
  if (pathname.startsWith("/admin")) {
    return <AdminPanel darkMode={darkMode} />;
  }

  return (
    <div
      className={`min-h-screen font-['Inter'] transition-colors duration-300 ${
        darkMode ? "antares-dark bg-stone-950" : "bg-white"
      }`}
    >
      <ScrollToTop />
      <RouteSeo />
      <Analytics />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} navbarVisible={navbarVisible} />

      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} wa={wa} />} />

        <Route path="/paquetes" element={<PaquetesPage darkMode={darkMode} />} />
        <Route path="/ofertas" element={<Navigate to="/paquetes?filtro=ofertas" replace />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route
          path="/argentina"
          element={
            <PageLayout
              title="Descubrí Argentina"
              subtitle="Escapadas y viajes nacionales con los mejores destinos del país."
              cards={byType.argentina}
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
              cards={byType.quinceaneras}
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
              cards={byType.experiencias}
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
              cards={byType.cruceros}
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
              cards={byType.grupales}
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
              cards={byType.circuitos}
              accent="red"
              darkMode={darkMode}
            />
          }
        />

        <Route path="/blog" element={<BlogPage darkMode={darkMode} />} />
        <Route path="/blog/:slug" element={<BlogPostPage darkMode={darkMode} />} />
        <Route path="/info-util" element={<InfoUtilPage darkMode={darkMode} />} />
        <Route path="/legales" element={<LegalesPage darkMode={darkMode} />} />
        <Route
          path="/paquete/:id"
          element={<PackageDetailPage darkMode={darkMode} whatsappLink={wa} />}
        />

        {/* Cualquier ruta desconocida cae en el inicio. */}
        <Route path="*" element={<HomePage darkMode={darkMode} wa={wa} />} />
      </Routes>

      <Footer />

      <LeadModal wa={wa} />

      {/* Botón flotante de WhatsApp */}
      <a
        href={wa()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        className="wa-bob fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full text-white"
        style={{ background: "#25D366", boxShadow: "0 14px 34px -10px rgba(37,211,102,.8)" }}
      >
        <Icon name="whatsapp" className="h-8 w-8" />
      </a>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PackagesProvider>
        <LeadModalProvider>
          <AppShell />
        </LeadModalProvider>
      </PackagesProvider>
    </BrowserRouter>
  );
}
