import { useState } from "react";
import type { FormEvent } from "react";
import { heroSlides } from "../config/site";
import { departureMonthOptions } from "../data/dates";
import { usePackages } from "../data/packagesStore";
import { useHeroSlide } from "../hooks/useHeroSlide";
import { useMobileViewport } from "../hooks/useMobileViewport";
import { trackEvent, trackStandard } from "../lib/tracking";
import { captureLead } from "../lib/leads";
import { ServicesEditorial } from "../components/home/ServicesEditorial";
import { DestinationsStrip } from "../components/home/DestinationsStrip";
import { WhyUs } from "../components/home/WhyUs";
import { LuxurySection } from "../components/home/LuxurySection";
import { Testimonials } from "../components/home/Testimonials";
import { LeadQualifier } from "../components/home/LeadQualifier";
import { FooterCTA } from "../components/home/FooterCTA";

interface HomePageProps {
  darkMode: boolean;
  wa: (text?: string) => string;
}

export function HomePage({ wa }: HomePageProps) {
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

      <ServicesEditorial />
      <DestinationsStrip />
      <WhyUs />
      <LuxurySection cards={byType.experiencias} />
      <Testimonials />
      <LeadQualifier wa={wa} />
      <FooterCTA />
    </main>
  );
}
