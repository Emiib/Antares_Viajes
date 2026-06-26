import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { useLeadModal } from "../context/LeadModalContext";

const ACCENT = "#8E4F57"; // vino sobrio

/**
 * Experiencias temáticas: viajes en torno a algo puntual (no a un destino).
 * El cliente va a precisar el alcance; queda armada con los tipos de experiencia.
 */
const TIPOS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "concierge", title: "Gastronómicas", copy: "Recorridos de sabores, mercados y cocina local de cada destino." },
  { icon: "compass", title: "Aventura extrema", copy: "Trekking, buceo, montañismo y adrenalina en estado puro." },
  { icon: "sparkle", title: "Wellness", copy: "Retiros, spa y descanso pensados para volver renovado." },
  { icon: "diamond", title: "Gourmet", copy: "Alta cocina, maridajes y bodegas de autor." },
  { icon: "globe", title: "Culturales", copy: "Arte, historia y tradiciones vividas desde adentro." },
];

export function ExperienciasPage() {
  const { openLead } = useLeadModal();

  return (
    <main className="bg-base">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[54vh] items-end overflow-hidden sm:min-h-[60vh]">
        <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${ACCENT} 0%, #14110f 72%)` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.3) 0%, rgba(10,9,8,.2) 45%, rgba(10,9,8,.9) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: ACCENT }} />

        <div className="relative mx-auto w-full max-w-[1340px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16">
          <Reveal>
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white">
              <Icon name="arrowR" className="h-4 w-4 rotate-180" /> Volver al inicio
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: ACCENT }} />
              <span className="text-[0.7rem] font-semibold uppercase ls-wide" style={{ color: "#D8A9B0" }}>Experiencias temáticas</span>
            </div>
            <h1 className="font-display leading-[1.0] text-white text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5rem)" }}>Experiencias</h1>
            <p className="mt-5 max-w-[42rem] text-[1.05rem] leading-relaxed text-white/80 text-pretty">
              Viajes alrededor de una pasión, no de un destino. Elegís el tipo de experiencia y te armamos el viaje entero en torno a eso.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── TIPOS DE EXPERIENCIA ── */}
      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-[1340px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {TIPOS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.06} className="h-full">
                <div className="card-base h-full rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1" style={{ border: "1px solid var(--line)" }}>
                  <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: `${ACCENT}1f`, color: ACCENT, border: `1px solid ${ACCENT}55` }}>
                    <Icon name={t.icon} className="h-[1.35rem] w-[1.35rem]" />
                  </span>
                  <h3 className="font-display t1 mt-5 text-[1.5rem] leading-tight">{t.title}</h3>
                  <p className="t-mut mt-2 text-[0.95rem] leading-relaxed text-pretty">{t.copy}</p>
                </div>
              </Reveal>
            ))}

            {/* CTA tile */}
            <Reveal delay={TIPOS.length * 0.06} className="h-full">
              <div className="flex h-full flex-col justify-center rounded-2xl p-7 text-center" style={{ background: ACCENT, boxShadow: `0 24px 60px -28px ${ACCENT}` }}>
                <h3 className="font-display text-[1.5rem] leading-tight text-white">¿Tenés otra idea?</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/85">Contanos qué experiencia soñás y la diseñamos a tu medida.</p>
                <button
                  onClick={() => openLead({ context: "experiencias" })}
                  className="mt-5 inline-flex items-center justify-center gap-2 self-center rounded-full bg-white px-7 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ color: ACCENT }}
                >
                  Consultá
                  <Icon name="arrowR" className="h-4 w-4" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
