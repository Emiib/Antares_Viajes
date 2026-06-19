import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { SITE_CONFIG } from "./config/site";
import { useDarkMode } from "./hooks/useDarkMode";
import { useNavbarVisibility } from "./hooks/useNavbarVisibility";

import { Analytics } from "./components/Analytics";
import { RouteSeo } from "./components/Seo";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AdminPanel } from "./components/AdminPanel";

import { HomePage } from "./pages/HomePage";
import { PaquetesPage } from "./pages/PaquetesPage";
import { ExperienciasPage } from "./pages/ExperienciasPage";
import { DisneyPage } from "./pages/DisneyPage";
import { NosotrosPage } from "./pages/NosotrosPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { InfoUtilPage } from "./pages/InfoUtilPage";
import { LegalesPage } from "./pages/LegalesPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";
import { CategoryShowcase } from "./components/catalog/CategoryShowcase";

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
        <Route path="/argentina" element={<Navigate to="/paquetes?tipo=argentina" replace />} />
        <Route
          path="/quinceaneras"
          element={
            <CategoryShowcase
              eyebrow="Quinceañeras"
              titleLead="El viaje de quince"
              titleAccent="que no se olvida."
              intro="Grupos de quinceañeras con acompañamiento de principio a fin: la emoción de viajar con amigas y la tranquilidad de que un equipo se ocupa de todo lo demás."
              cards={byType.quinceaneras}
              tipo="quinceaneras"
              ctaContext="quinceaneras"
              darkMode={darkMode}
            />
          }
        />
        <Route path="/experiencias" element={<ExperienciasPage />} />
        <Route path="/disney" element={<DisneyPage />} />
        <Route path="/cruceros" element={<Navigate to="/paquetes?tipo=cruceros" replace />} />
        <Route
          path="/grupales"
          element={
            <CategoryShowcase
              eyebrow="Viajes grupales"
              titleLead="Viajes en grupo,"
              titleAccent="coordinados de punta a punta."
              intro="Salidas acompañadas, delegaciones y contingentes con coordinación propia de Antares. Vos disfrutás del grupo; nosotros resolvemos traslados, hoteles y cada detalle en tiempo real."
              cards={byType.grupales}
              tipo="grupales"
              ctaContext="grupales"
              darkMode={darkMode}
            />
          }
        />
        <Route
          path="/circuitos"
          element={
            <CategoryShowcase
              eyebrow="Circuitos internacionales"
              titleLead="Varios países,"
              titleAccent="una sola logística."
              intro="Recorridos guiados por los grandes destinos del mundo con cada traslado, hotel y excursión anticipados. Te movés liviano: la logística ya está pensada de punta a punta."
              cards={byType.circuitos}
              tipo="circuitos"
              ctaContext="circuitos"
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
          element={<PackageDetailPage whatsappLink={wa} />}
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
