import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { heroSlides } from "../config/site";
import { departureMonthOptions } from "../data/dates";
import { usePackages } from "../data/packagesStore";
import { useHeroSlide } from "../hooks/useHeroSlide";
import { useMobileViewport } from "../hooks/useMobileViewport";
import { trackEvent, trackStandard } from "../lib/tracking";
import { captureLead } from "../lib/leads";
import { Differentiators } from "../components/home/Differentiators";
import { DestinationsGrid } from "../components/home/DestinationsGrid";
import { LuxurySection } from "../components/home/LuxurySection";
import { LeadQualifier } from "../components/home/LeadQualifier";
import { AnimatedSection } from "../components/ui/AnimatedSection";
import { PackageCard } from "../components/ui/PackageCard";

interface HomePageProps {
  darkMode: boolean;
  wa: (text?: string) => string;
}

export function HomePage({ darkMode, wa }: HomePageProps) {
  const [searchData, setSearchData] = useState({
    destination: "",
    departure: "",
    passengers: "2",
  });
  const { currentSlide, advance } = useHeroSlide();
  const isMobileViewport = useMobileViewport();
  const { byType } = usePackages();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero buscar viajes:${searchData.destination ? ` Destino: ${searchData.destination}` : ""}${searchData.departure ? ` Fecha: ${searchData.departure}` : ""}${searchData.passengers ? ` Pasajeros: ${searchData.passengers}` : ""}`;
    trackStandard("Search", { search_term: searchData.destination || "(sin destino)" });
    trackEvent("hero_search", { ...searchData });
    captureLead({
      source: "hero_search",
      destination: searchData.destination,
      payload: { departure: searchData.departure, passengers: searchData.passengers },
    });
    window.open(wa(msg), "_blank", "noopener");
  };

  const slide = heroSlides[currentSlide];
  const webm = isMobileViewport ? slide.sources.mobileWebm : slide.sources.desktopWebm;
  const mp4  = isMobileViewport ? slide.sources.mobileMp4  : slide.sources.desktopMp4;

  return (
    <main>
      {/* ── HERO (video, editorial) ── */}
      <section id="hero" data-track-section="hero" className="relative flex min-h-screen items-center overflow-hidden md:min-h-[105vh]">
        <div className="absolute inset-0 z-0">
          <video
            key={`${slide.label}-${isMobileViewport ? "m" : "d"}`}
            className="animate-hero-video absolute inset-0 h-full w-full object-cover"
            poster={slide.poster}
            onEnded={advance}
            autoPlay muted playsInline preload="auto"
          >
            <source src={webm} type="video/webm" />
            <source src={mp4} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1340px] px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display mb-5 max-w-3xl font-medium leading-[0.98] text-white text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5.4rem)" }}>
              Tu viaje soñado,
              <span className="block italic" style={{ color: "#F1E4DC" }}>armado a tu medida.</span>
            </h1>
            <p className="mb-7 max-w-xl text-base font-medium text-white/90 sm:text-lg">
              Hace más de 30 años convertimos ideas en viajes inolvidables. Vos elegís el destino;
              nosotros nos ocupamos de todo — con asesoría personalizada y guardia 24 hs durante todo el viaje.
            </p>
            <form onSubmit={handleSearch} className="card-base rounded-2xl p-4 shadow-2xl md:p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="hero-destination" className="t-mut mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Destino</label>
                  <input id="hero-destination" type="text" placeholder="¿A dónde?"
                    value={searchData.destination} onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]"
                    style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }} />
                </div>
                <div>
                  <label htmlFor="hero-departure" className="t-mut mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Fecha</label>
                  <select id="hero-departure" value={searchData.departure} onChange={(e) => setSearchData({ ...searchData, departure: e.target.value })}
                    className="w-full appearance-none rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]"
                    style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }}>
                    <option value="">¿Cuándo?</option>
                    {departureMonthOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="hero-passengers" className="t-mut mb-1.5 block text-[10px] font-semibold uppercase tracking-wider">Pasajeros</label>
                  <select id="hero-passengers" value={searchData.passengers} onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--terra)]"
                    style={{ border: "1px solid var(--line)", background: "var(--bg)", color: "var(--text)" }}>
                    {["1","2","3","4","5+"].map((n) => (<option key={n} value={n}>{n}</option>))}
                  </select>
                </div>
                <div className="col-span-2 flex items-end md:col-span-1">
                  <button type="submit"
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "var(--terra)" }}>
                    Buscar mi viaje →
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/90 sm:text-sm">
              <span>✓ +30 años de experiencia</span>
              <span>✓ Atención personalizada</span>
              <span>✓ Guardia 24 hs en viaje</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LA DIFERENCIA ANTARES (somos personas) ── */}
      <Differentiators darkMode={darkMode} />

      {/* ── FAVORITOS ── */}
      <AnimatedSection id="paquetes" data-track-section="favoritos" className={`${darkMode ? "bg-stone-900" : "bg-stone-50"} py-14 md:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
            <h2 className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}>
              Antares <span className="text-red-600">Favoritos</span>
            </h2>
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} text-base md:text-lg max-w-2xl`}>
              Las propuestas más elegidas para viajar en pareja, en familia o con amigos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
            {byType.featured.map((pkg, i) => (
              <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/ofertas" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más paquetes →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── DESTINOS ── */}
      <DestinationsGrid darkMode={darkMode} />

      {/* ── CIRCUITOS ── */}
      <AnimatedSection id="circuitos" data-track-section="circuitos" className={`${darkMode ? "bg-stone-900" : "bg-stone-50"} py-14 md:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center justify-center gap-4 text-center">
            <h2 className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}>
              Circuitos <span className="text-red-600">Internacionales</span>
            </h2>
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} text-base md:text-lg max-w-2xl`}>
              Rutas completas para descubrir grandes destinos con itinerarios armados.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
            {byType.circuitos.map((pkg, i) => (
              <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/circuitos" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más circuitos →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── GRUPALES ── */}
      <AnimatedSection id="grupales" data-track-section="grupales" className={`${darkMode ? "bg-stone-950" : "bg-white"} py-14 md:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className={`mb-2 text-3xl font-black md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}>
              Viajes <span className="text-red-600">Grupales</span>
            </h2>
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} mx-auto max-w-2xl text-base md:text-lg`}>
              Paquetes especiales para empresas, amigos y familias con tarifas pensadas para grupos.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
            {byType.grupales.map((pkg, i) => (
              <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/grupales" className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más paquetes grupales →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── ANTARES LUJO ── */}
      <LuxurySection cards={byType.experiencias} />

      {/* ── CONTANOS TU VIAJE (filtro de leads) ── */}
      <LeadQualifier wa={wa} />
    </main>
  );
}
