import { useState } from "react";
import { SITE_CONFIG } from "./config/site";
import { useHashRoute } from "./hooks/useHashRoute";
import { useDarkMode } from "./hooks/useDarkMode";
import { useNavbarVisibility } from "./hooks/useNavbarVisibility";
import {
  offersPackages,
  argentinaPackages,
  circuitPackages,
  groupPackages,
  quincePackages,
  luxuryExperiences,
  cruisePackages,
} from "./data/packages";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { PageLayout } from "./components/layout/PageLayout";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import { TripFormModal } from "./components/modals/TripFormModal";
import { FooterShowcase } from "./components/home/FooterShowcase";
import { ScrollPlane } from "./components/home/ScrollPlane";
import { HomePage } from "./pages/HomePage";
import { BlogPage } from "./pages/BlogPage";
import { InfoUtilPage } from "./pages/InfoUtilPage";
import { LegalesPage } from "./pages/LegalesPage";
import { PackageDetailPage } from "./pages/PackageDetailPage";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const { route, packageId } = useHashRoute();
  const { darkMode, setDarkMode } = useDarkMode();
  const [showTripForm, setShowTripForm] = useState(false);
  const navbarVisible = useNavbarVisibility();

  const wa = (text?: string) =>
    `https://api.whatsapp.com/send?phone=${SITE_CONFIG.whatsapp}${
      text ? `&text=${encodeURIComponent(text)}` : ""
    }`;

  // Admin: sin navbar, footer ni WhatsApp
  if (route === "admin") {
    return <AdminPanel darkMode={darkMode} />;
  }

  const renderRoute = () => {
    switch (route) {
      case "ofertas":
        return <PageLayout title="Ofertas Flash" subtitle="Promociones y tarifas especiales con vigencia limitada." cards={offersPackages} accent="red" darkMode={darkMode} />;
      case "argentina":
        return <PageLayout title="Descubrí Argentina" subtitle="Escapadas y viajes nacionales con los mejores destinos del país." cards={argentinaPackages} accent="amber" darkMode={darkMode} />;
      case "quinceaneras":
        return <PageLayout title="Quinceañeras" subtitle="Programas pensados para viajes inolvidables de quince." cards={quincePackages} accent="rose" darkMode={darkMode} />;
      case "experiencias":
        return <PageLayout title="Experiencias de Lujo" subtitle="Propuestas premium y viajes exclusivos de otra categoría." cards={luxuryExperiences} accent="gold" darkMode={darkMode} />;
      case "cruceros":
        return <PageLayout title="Cruceros" subtitle="Preparado para futuras conexiones con MSC y Organfur Central de Cruceros." cards={cruisePackages} accent="amber" darkMode={darkMode} />;
      case "grupales":
        return <PageLayout title="Viajes Grupales" subtitle="Paquetes especiales para empresas, amigos y familias con tarifas pensadas para grupos." cards={groupPackages} accent="red" darkMode={darkMode} />;
      case "circuitos":
        return <PageLayout title="Circuitos Internacionales" subtitle="Rutas completas para descubrir grandes destinos con itinerarios armados." cards={circuitPackages} accent="red" darkMode={darkMode} />;
      case "blog":
        return <BlogPage darkMode={darkMode} />;
      case "infoUtil":
        return <InfoUtilPage darkMode={darkMode} />;
      case "legales":
        return <LegalesPage darkMode={darkMode} />;
      case "package-detail":
        return <PackageDetailPage packageId={packageId} darkMode={darkMode} whatsappLink={wa} />;
      default:
        return <HomePage darkMode={darkMode} wa={wa} />;
    }
  };

  return (
    <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${darkMode ? "antares-dark bg-stone-950" : "bg-stone-100"}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} navbarVisible={navbarVisible} />
      {renderRoute()}
      {route === "home" && (
        <FooterShowcase darkMode={darkMode} onOpenForm={() => setShowTripForm(true)} />
      )}
      <Footer />
      {route === "home" && <ScrollPlane darkMode={darkMode} />}
      <WhatsAppButton href={wa()} />
      {showTripForm && (
        <TripFormModal darkMode={darkMode} wa={wa} onClose={() => setShowTripForm(false)} />
      )}
    </div>
  );
}