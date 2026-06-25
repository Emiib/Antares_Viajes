import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

/**
 * Landing genérica de categoría (destino / especial), self-contained.
 * Hero con el color de identidad + intro + estado pre-API con CTA.
 * Los paquetes reales llegan vía la API de Travel Compositor; cada categoría
 * tendrá los suyos (ya no se concentra nada en /paquetes).
 *
 * `image` es opcional: si no hay imagen todavía, el hero usa un gradiente del color.
 */
export type CategoryLandingProps = {
  eyebrow: string;
  title: string;
  intro: string;
  color: string;
  leadContext: string;
  image?: string;
  /** Sustantivo para el bloque pre-API: "paquetes", "experiencias", "eventos"… */
  packagesNoun?: string;
};

export function CategoryLanding({
  eyebrow,
  title,
  intro,
  color,
  leadContext,
  image,
  packagesNoun = "paquetes",
}: CategoryLandingProps) {
  const { openLead } = useLeadModal();

  return (
    <main className="bg-base">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden sm:min-h-[68vh]">
        {image ? (
          <img src={image} alt={`Viajes — ${title}`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${color} 0%, #14110f 72%)` }} />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.35) 0%, rgba(10,9,8,.25) 45%, rgba(10,9,8,.9) 100%)" }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(110% 80% at 50% 0%, ${color}66 0%, transparent 55%)` }} />
        <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: color }} />

        <div className="relative mx-auto w-full max-w-[1340px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16">
          <Reveal>
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white">
              <Icon name="arrowR" className="h-4 w-4 rotate-180" /> Volver al inicio
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: color }} />
              <span className="text-[0.7rem] font-semibold uppercase ls-wide" style={{ color }}>{eyebrow}</span>
            </div>
            <h1 className="font-display leading-[1.0] text-white text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5rem)" }}>{title}</h1>
            <p className="mt-5 max-w-[40rem] text-[1.05rem] leading-relaxed text-white/80 text-pretty">{intro}</p>
          </Reveal>
        </div>
      </section>

      {/* ── PAQUETES (estado pre-API) ── */}
      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-[1340px]">
          <Reveal>
            <div
              className="card-base rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16"
              style={{ border: "1px solid var(--line)", boxShadow: `0 30px 70px -50px ${color}` }}
            >
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.72rem] font-semibold uppercase ls-mid"
                style={{ background: `${color}1f`, color, border: `1px solid ${color}55` }}
              >
                {title}
              </span>
              <h2 className="font-display t1 mx-auto mt-6 max-w-[28rem] leading-tight" style={{ fontSize: "clamp(1.7rem,4vw,2.6rem)" }}>
                Estamos sumando {packagesNoun}.
              </h2>
              <p className="t-mut mx-auto mt-4 max-w-[34rem] text-[1rem] leading-relaxed text-pretty">
                Contanos qué tenés en mente y un asesor te arma una propuesta a tu medida — vuelos, hoteles y traslados, todo resuelto.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => openLead({ context: leadContext })}
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: color, boxShadow: `0 16px 40px -16px ${color}` }}
                >
                  Consultá
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
