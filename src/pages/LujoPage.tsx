import { Link } from "react-router-dom";
import { usePackages } from "../data/packagesStore";
import { Reveal } from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { LuxuryCard } from "../components/luxury/LuxuryCard";
import { useLeadModal } from "../context/LeadModalContext";

const HALLMARKS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "key", title: "Acceso, no catálogo", copy: "Suites que no se reservan online, mesas sin disponibilidad pública, guías privados que solo trabajan con nosotros." },
  { icon: "concierge", title: "Concierge dedicado", copy: "Una sola persona, disponible 24/7, que conoce tu viaje de memoria desde antes de que despegues." },
  { icon: "diamond", title: "Diseñado a cuatro manos", copy: "Nos sentamos con vos. El itinerario se escribe en borrador, se corrige y se vuelve a escribir hasta que es tuyo." },
];

/** Categoría superior: la franja premium de Antares (Lujo). */
export function LujoPage() {
  const { byType } = usePackages();
  const { openLead } = useLeadModal();
  const cards = byType.experiencias;

  return (
    <main className="relative overflow-hidden" style={{ background: "#080706" }}>
      {/* Fondo cinematográfico */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury/fondo_luxury.webp" alt="" aria-hidden className="h-full w-full object-cover" style={{ transform: "scale(1.08)", opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 70% 30%, transparent 0%, rgba(8,7,6,.7) 55%, rgba(8,7,6,.97) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,7,6,.85) 0%, transparent 22%, transparent 70%, rgba(8,7,6,.95) 100%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1340px] px-5 sm:px-8" style={{ paddingTop: "clamp(7rem,14vw,11rem)", paddingBottom: "clamp(6rem,14vw,10rem)" }}>
        {/* Hero */}
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gold)" }}>← Volver al inicio</Link>
        <Reveal className="max-w-[46rem]">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 gold-line" />
            <span className="gold-text text-[0.7rem] font-semibold uppercase ls-wide">Antares Luxury · Categoría superior</span>
          </div>
          <h1 className="font-display leading-[0.98] text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5.5rem)", color: "#F4EDE2" }}>
            Viajar distinto,<br /><span className="gold-text italic">sin fricción.</span>
          </h1>
          <p className="mt-8 max-w-[40rem] text-[1.08rem] leading-relaxed text-pretty sm:text-[1.18rem]" style={{ color: "rgba(244,237,226,.7)" }}>
            No es un paquete más caro. Es el lujo de viajar de una manera: discreta, anticipada, pensada para quien valora el detalle y la exclusividad. Una franja reservada de lo que hacemos.
          </p>
        </Reveal>

        {/* Hallmarks */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-3 md:gap-5">
          {HALLMARKS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.09}>
              <div className="h-full rounded-xl px-7 py-10 sm:py-12" style={{ background: "rgba(10,9,8,.72)", border: "1px solid rgba(198,164,97,.18)", backdropFilter: "blur(4px)" }}>
                <span className="mb-7 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(198,164,97,.5)", color: "var(--gold-soft)" }}>
                  <Icon name={h.icon} className="h-[1.4rem] w-[1.4rem]" />
                </span>
                <h3 className="font-display text-[1.5rem] leading-[1.1]" style={{ color: "#F4EDE2" }}>{h.title}</h3>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.55)" }}>{h.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Grilla de experiencias de lujo */}
        {cards.length > 0 ? (
          <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {cards.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.06}>
                <LuxuryCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-lg sm:mt-20" style={{ color: "rgba(244,237,226,.55)" }}>Pronto vas a encontrar nuevas propuestas de lujo acá.</p>
        )}

        {/* CTA band */}
        <Reveal className="mt-16 flex flex-col gap-8 border-t border-[rgba(198,164,97,0.22)] pt-12 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display max-w-[26rem] text-[1.6rem] italic leading-[1.15] sm:text-[2rem]" style={{ color: "rgba(244,237,226,.85)" }}>
            Contanos qué imaginás. El resto lo resolvemos nosotros.
          </p>
          <button
            onClick={() => openLead({ context: "luxury" })}
            className="group inline-flex shrink-0 items-center gap-3 rounded-full py-4 pl-8 pr-7 text-[0.94rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(100deg, var(--gold-soft), var(--gold))", color: "#2a2008", boxShadow: "0 18px 44px -18px rgba(198,164,97,.7)" }}
          >
            Diseñar mi experiencia
            <Icon name="arrowR" className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </main>
  );
}
