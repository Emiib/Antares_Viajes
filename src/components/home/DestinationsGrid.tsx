import { Link } from "react-router-dom";
import { popularDestinations } from "../../data/destinations";
import { AnimatedSection } from "../ui/AnimatedSection";

/**
 * Grid liviano de destinos con links internos (SEO + funnel).
 * Reemplaza al antiguo carrusel 3D: carga 6 WebP de ~60 KB y nada de JS de animación.
 */
export function DestinationsGrid({ darkMode }: { darkMode: boolean }) {
  return (
    <AnimatedSection
      id="destinos"
      data-track-section="destinos"
      className={`${darkMode ? "bg-stone-950" : "bg-stone-50"} py-14 md:py-20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className={`mb-2 text-3xl font-black leading-tight md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}>
            ¿A dónde te <span className="text-red-600">llevamos</span>?
          </h2>
          <p className={`text-base md:text-lg ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
            Los destinos más elegidos por nuestros viajeros
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {popularDestinations.map((dest, i) => (
            <Link
              key={dest.name}
              to={dest.to}
              aria-label={`Ver viajes a ${dest.name}`}
              style={{ transitionDelay: `${i * 60}ms` }}
              className="group relative block cursor-pointer overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={`Viajes a ${dest.name}`}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <h3 className="text-lg font-black leading-tight text-white md:text-2xl">{dest.name}</h3>
                <p className="mt-0.5 hidden text-xs text-white/70 sm:block md:text-sm">{dest.subtitle}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-sm">
                  Ver viajes
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
