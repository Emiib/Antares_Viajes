import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { heroSlides } from "../config/site";
import { departureMonthOptions } from "../data/dates";
import { usePackages } from "../data/packagesStore";
import { useHeroSlide } from "../hooks/useHeroSlide";
import { useMobileViewport } from "../hooks/useMobileViewport";
import { PopularDestinationsCarousel } from "../components/home/PopularDestinationsCarousel";
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
  const currentHeroSlide = useHeroSlide();
  const isMobileViewport = useMobileViewport();
  const { byType } = usePackages();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Quiero buscar viajes:${searchData.destination ? ` Destino: ${searchData.destination}` : ""}${searchData.departure ? ` Fecha: ${searchData.departure}` : ""}${searchData.passengers ? ` Pasajeros: ${searchData.passengers}` : ""}`;
    window.location.href = wa(msg);
  };

  const slide = heroSlides[currentHeroSlide];
  const webm = isMobileViewport ? slide.sources.mobileWebm : slide.sources.desktopWebm;
  const mp4  = isMobileViewport ? slide.sources.mobileMp4  : slide.sources.desktopMp4;

  return (
    <main>
      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen overflow-hidden flex items-center md:min-h-[110vh]">
        <div className="absolute inset-0 z-0">
          <video
            key={`${slide.label}-${isMobileViewport ? "m" : "d"}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: 1 }}
            poster={slide.poster}
            autoPlay muted loop playsInline preload="auto"
          >
            <source src={webm} type="video/webm" />
            <source src={mp4}  type="video/mp4"  />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/12 to-transparent" style={{ zIndex: 2 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"  style={{ zIndex: 2 }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)] sm:text-5xl md:text-7xl">
              Tu viaje soñado,
              <span className="block text-red-500">armado a tu medida</span>
            </h1>
            <p className="mb-7 max-w-xl text-base font-medium text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:text-lg">
              Hace más de 30 años convertimos ideas en viajes inolvidables. Vos
              elegís el destino; nosotros nos ocupamos de todo — con asesoría
              personalizada y guardia 24 hs durante todo el viaje.
            </p>
            <form onSubmit={handleSearch} className="rounded-2xl bg-white p-4 shadow-2xl md:p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Destino</label>
                  <input
                    type="text" placeholder="¿A dónde?"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Fecha</label>
                  <select
                    value={searchData.departure}
                    onChange={(e) => setSearchData({ ...searchData, departure: e.target.value })}
                    className={`w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400 ${searchData.departure ? "text-stone-900" : "text-stone-400"}`}
                  >
                    <option value="">¿Cuándo?</option>
                    {departureMonthOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-stone-500">Pasajeros</label>
                  <select
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-red-400"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
                <div className="col-span-2 flex items-end md:col-span-1">
                  <button type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:from-red-700 hover:to-red-600 hover:shadow-lg">
                    Buscar mi viaje →
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-sm">
              <span className="inline-flex items-center gap-1.5">✓ +30 años de experiencia</span>
              <span className="inline-flex items-center gap-1.5">✓ Atención personalizada</span>
              <span className="inline-flex items-center gap-1.5">✓ Guardia 24 hs en viaje</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINOS POPULARES ── */}
      <PopularDestinationsCarousel darkMode={darkMode} whatsappLink={wa} />

      {/* ── FAVORITOS ── */}
      <AnimatedSection id="paquetes" className={`${darkMode ? "bg-stone-900" : "bg-stone-50"} py-14 md:py-20`}>
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
            <Link to="/ofertas" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más paquetes →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── CIRCUITOS ── */}
      <AnimatedSection id="circuitos" className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-14 md:py-20`}>
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
            <Link to="/circuitos" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más circuitos →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── GRUPALES ── */}
      <AnimatedSection id="grupales" className={`${darkMode ? "bg-stone-900" : "bg-stone-50"} py-14 md:py-20`}>
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
            <Link to="/grupales" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más paquetes grupales →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── LUJO ── */}
      <AnimatedSection id="experiencias-home" className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-14 md:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className={`mb-2 text-3xl font-black md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}>
              Experiencias de <span style={{ color: "var(--antares-gold)" }}>Lujo</span>
            </h2>
            <p className={`${darkMode ? "text-stone-400" : "text-stone-600"} mx-auto max-w-2xl text-base md:text-lg`}>
              Una categoría premium con servicio exclusivo y atención de primer nivel.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
            {byType.experiencias.map((pkg, i) => (
              <div key={pkg.id} style={{ transitionDelay: `${i * 100}ms` }} className="h-full">
                <PackageCard pkg={pkg} accent="gold" darkMode={darkMode} />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/experiencias" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C4A882] to-[#b89060] px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-1">
              Ver más experiencias →
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ── ¿POR QUÉ ANTARES? ── */}
      <AnimatedSection className="bg-stone-900 py-14 text-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black md:text-5xl">
              ¿Por qué <span style={{ color: "var(--antares-gold)" }}>Antares</span>?
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              { icon: "🚨", title: "Guardia 24hs",           desc: "Atención 24/7 para nuestros pasajeros en viaje." },
              { icon: "🏆", title: "Trayectoria",            desc: "Más de 30 años nos avalan en experiencias." },
              { icon: "🎯", title: "Atención Personalizada", desc: "Asesoramiento cercano y pensado para cada cliente." },
              { icon: "🧳", title: "Viajes a medida",        desc: "Armamos tu idea de viaje según tus tiempos, gustos y presupuesto." },
            ].map((item, idx) => (
              <div
                key={item.title}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <div className="mb-3 text-3xl md:text-4xl">{item.icon}</div>
                <h3 className="mb-1 text-base font-bold md:text-lg">{item.title}</h3>
                <p className="text-xs text-stone-300 md:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}