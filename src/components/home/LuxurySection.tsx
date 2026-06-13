import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";
import { AnimatedSection } from "../ui/AnimatedSection";

/**
 * Antares Lujo: bloque premium con ritmo propio — fondo oscuro siempre,
 * serif Fraunces en títulos, dorado de marca y cards más grandes y aireadas.
 */
export function LuxurySection({ cards }: { cards: TravelCard[] }) {
  const featured = cards.slice(0, 3);

  return (
    <AnimatedSection
      id="lujo"
      data-track-section="lujo"
      className="relative overflow-hidden bg-stone-950 py-20 md:py-28"
    >
      {/* Resplandor dorado sutil de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(196,168,130,0.13), transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[4px]" style={{ color: "var(--antares-gold)" }}>
            Antares Lujo
          </p>
          <h2 className="font-serif-lux mx-auto mb-4 max-w-3xl text-4xl font-medium leading-tight text-white md:text-6xl">
            Viajar también puede ser{" "}
            <em className="not-italic" style={{ color: "var(--antares-gold)" }}>un arte</em>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-400 md:text-lg">
            Hoteles únicos, experiencias privadas y cada detalle resuelto antes
            de que lo pidas. Para los viajes que se hacen una vez en la vida.
          </p>
        </div>

        <div className="mb-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {featured.map((pkg, i) => (
            <Link
              key={pkg.id}
              to={`/paquete/${encodeURIComponent(pkg.id)}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              className="group relative block cursor-pointer overflow-hidden rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--antares-gold)]"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }}
              />
              <div
                className="absolute inset-0 rounded-3xl border border-white/10 transition-colors duration-300 group-hover:border-[var(--antares-gold)]/50"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: "var(--antares-gold)" }}>
                  {pkg.destination}
                </p>
                <h3 className="font-serif-lux mb-3 text-2xl font-medium leading-snug text-white md:text-3xl">
                  {pkg.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-300">{pkg.duration}</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--antares-gold)" }}>
                    {pkg.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to="/experiencias"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-8 py-3.5 text-sm font-bold transition-colors duration-300 hover:bg-[var(--antares-gold)] hover:text-stone-950"
            style={{ borderColor: "var(--antares-gold)", color: "var(--antares-gold)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#0c0a09"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--antares-gold)"; }}
          >
            Descubrir Antares Lujo
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
