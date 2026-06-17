import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";

const HALLMARKS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "key", title: "Acceso, no catálogo", copy: "Suites que no se reservan online, mesas sin disponibilidad pública, guías privados que solo trabajan con nosotros." },
  { icon: "concierge", title: "Concierge dedicado", copy: "Una sola persona, disponible 24/7, que conoce tu viaje de memoria desde antes de que despegues." },
  { icon: "sparkle", title: "Diseñado a cuatro manos", copy: "Nos sentamos con vos. El itinerario se escribe en borrador, se corrige y se vuelve a escribir hasta que es tuyo." },
];

export function LuxurySection({ cards }: { cards: TravelCard[] }) {
  const featured = cards.slice(0, 3);

  return (
    <section id="premium" className="relative overflow-hidden" style={{ background: "#080706" }}>
      {/* Fondo cinematográfico: Atlantis The Royal */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury/fondo_luxury.webp" alt="" aria-hidden className="h-full w-full object-cover" style={{ transform: "scale(1.08)", opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 70% 30%, transparent 0%, rgba(8,7,6,.7) 55%, rgba(8,7,6,.97) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,7,6,.85) 0%, transparent 22%, transparent 70%, rgba(8,7,6,.95) 100%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1340px] px-5 sm:px-8" style={{ paddingTop: "clamp(6rem,14vw,11rem)", paddingBottom: "clamp(6rem,14vw,11rem)" }}>
        <Reveal className="max-w-[46rem]">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 gold-line" />
            <span className="gold-text text-[0.7rem] font-semibold uppercase ls-wide">Antares Luxury · Experiencias de autor</span>
          </div>
          <h2 className="font-display leading-[0.98] text-balance" style={{ fontSize: "clamp(2.6rem,7vw,6rem)", color: "#F4EDE2" }}>
            El viaje,<br /><span className="gold-text italic">premium.</span>
          </h2>
          <p className="mt-8 max-w-[40rem] text-[1.08rem] leading-relaxed text-pretty sm:text-[1.18rem]" style={{ color: "rgba(244,237,226,.7)" }}>
            No es un paquete más caro. Es el lujo de viajar de una manera: discreta, sin fricción, pensada para quien valora
            el detalle y la exclusividad. Una franja reservada de lo que hacemos.
          </p>
        </Reveal>

        {/* Hallmarks — tarjetas independientes con gap real + borde dorado sutil */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-3 md:gap-5">
          {HALLMARKS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.09}>
              <div className="h-full rounded-xl px-7 py-10 sm:py-12"
                style={{ background: "rgba(10,9,8,.72)", border: "1px solid rgba(198,164,97,.18)", backdropFilter: "blur(4px)" }}>
                <span className="mb-7 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(198,164,97,.5)", color: "var(--gold-soft)" }}>
                  <Icon name={h.icon} className="h-[1.4rem] w-[1.4rem]" />
                </span>
                <h3 className="font-display text-[1.5rem] leading-[1.1]" style={{ color: "#F4EDE2" }}>{h.title}</h3>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.55)" }}>{h.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Paquetes de lujo */}
        {featured.length > 0 && (
          <div className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-3 md:gap-6">
            {featured.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.08}>
                <Link to={`/paquete/${encodeURIComponent(pkg.id)}`} className="group relative block overflow-hidden rounded-2xl">
                  <div className="aspect-[3/4] w-full overflow-hidden">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: "var(--gold)" }}>{pkg.destination}</p>
                    <h3 className="font-display mb-3 text-2xl leading-snug" style={{ color: "#F4EDE2" }}>{pkg.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "rgba(244,237,226,.7)" }}>{pkg.duration}</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{pkg.price}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA band */}
        <Reveal className="mt-16 flex flex-col gap-8 border-t border-[rgba(198,164,97,0.22)] pt-12 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display max-w-[26rem] text-[1.6rem] italic leading-[1.15] sm:text-[2rem]" style={{ color: "rgba(244,237,226,.85)" }}>
            Contanos qué imaginás. El resto lo resolvemos nosotros.
          </p>
          <Link to="/experiencias"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full py-4 pl-8 pr-7 text-[0.94rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(100deg, var(--gold-soft), var(--gold))", color: "#2a2008", boxShadow: "0 18px 44px -18px rgba(198,164,97,.7)" }}>
            Ver experiencias de lujo
            <Icon name="arrowR" className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
