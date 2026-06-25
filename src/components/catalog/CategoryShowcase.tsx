import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";
import type { PackageType } from "../../data/packagesStore";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { PackageCard } from "../ui/PackageCard";
import { useLeadModal } from "../../context/LeadModalContext";

export type CategoryShowcaseProps = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  cards: TravelCard[];
  tipo: PackageType;
  ctaContext: string;
  darkMode: boolean;
  /** Color de identidad de la categoría. Por defecto el rojo de marca. */
  accent?: string;
};

export function CategoryShowcase({
  eyebrow,
  titleLead,
  titleAccent,
  intro,
  cards,
  tipo,
  ctaContext,
  darkMode,
  accent = "var(--terra)",
}: CategoryShowcaseProps) {
  const { openLead } = useLeadModal();

  return (
    <main className="bg-base" style={{ minHeight: "100vh" }}>
      {/* Header editorial */}
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1340px]">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: accent }}>← Volver al inicio</Link>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: accent }} />
              <span className="text-[0.7rem] font-semibold uppercase ls-wide" style={{ color: accent }}>{eyebrow}</span>
            </div>
            <h1 className="font-display t1 leading-[1.02] text-balance" style={{ fontSize: "clamp(2.2rem,5.5vw,3.8rem)" }}>
              {titleLead}<br /><span className="italic" style={{ color: accent }}>{titleAccent}</span>
            </h1>
            <p className="t-mut mt-6 max-w-[42rem] text-[1.02rem] leading-relaxed text-pretty">{intro}</p>
          </Reveal>
        </div>
      </section>

      {/* Grilla */}
      <section className="px-5 pb-16 sm:px-8 md:pb-20">
        <div className="mx-auto max-w-[1340px]">
          {cards.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {cards.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i * 0.05} className="h-full">
                  <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="t-mut py-20 text-center text-xl">Pronto vas a encontrar nuevas propuestas en esta categoría.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <Reveal className="mx-auto max-w-[1340px] text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openLead({ context: ctaContext })}
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: accent, boxShadow: `0 16px 40px -16px ${accent}` }}
            >
              Consultá por este viaje
            </button>
            <Link
              to={`/paquetes?tipo=${tipo}`}
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
              style={{ border: "1px solid var(--line)", color: accent }}
            >
              Ver todo el catálogo
              <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
