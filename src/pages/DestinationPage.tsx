import { Link } from "react-router-dom";
import { destinationsStack } from "../data/destinationsStack";
import { Reveal } from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import { useLeadModal } from "../context/LeadModalContext";

/**
 * Subpágina de un destino (Argentina, Caribe & Centroamérica, Exóticos, etc.).
 * Reutiliza el lenguaje visual del sitio y aplica el COLOR de identidad del destino
 * como acento (eyebrow, aura del hero, botones). Los paquetes llegarán vía la API
 * de Travel Compositor; por ahora muestra un estado "a medida" con CTA.
 */
export function DestinationPage({ slug }: { slug: string }) {
  const dest = destinationsStack.find((d) => d.slug === slug);
  const { openLead } = useLeadModal();

  if (!dest) {
    return (
      <main className="bg-base grid min-h-[60vh] place-items-center px-5 text-center">
        <p className="t-mut text-lg">Destino no encontrado. <Link to="/" className="terra font-semibold">Volver al inicio</Link></p>
      </main>
    );
  }

  const { name, tagline, intro, image, color } = dest;

  return (
    <main className="bg-base">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden sm:min-h-[68vh]">
        <img src={image} alt={`Viajes a ${name}`} className="absolute inset-0 h-full w-full object-cover" />
        {/* Velo oscuro para legibilidad */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.35) 0%, rgba(10,9,8,.25) 45%, rgba(10,9,8,.9) 100%)" }} />
        {/* Aura de color del destino */}
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(110% 80% at 50% 0%, ${color}66 0%, transparent 55%)` }} />
        {/* Línea de acento en el color */}
        <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: color }} />

        <div className="relative mx-auto w-full max-w-[1340px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16">
          <Reveal>
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition-colors hover:text-white">
              <Icon name="arrowR" className="h-4 w-4 rotate-180" /> Volver al inicio
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: color }} />
              <span className="text-[0.7rem] font-semibold uppercase ls-wide" style={{ color }}>{tagline}</span>
            </div>
            <h1 className="font-display leading-[1.0] text-white text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5rem)" }}>
              {name}
            </h1>
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
                Paquetes a {name}
              </span>
              <h2 className="font-display t1 mx-auto mt-6 max-w-[26rem] leading-tight" style={{ fontSize: "clamp(1.7rem,4vw,2.6rem)" }}>
                Estamos sumando propuestas a {name}.
              </h2>
              <p className="t-mut mx-auto mt-4 max-w-[34rem] text-[1rem] leading-relaxed text-pretty">
                Mientras tanto, contanos qué tenés en mente y un asesor te arma una propuesta a tu medida — vuelos, hoteles y traslados, todo resuelto.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => openLead({ context: `destino-${dest.slug}` })}
                  className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: color, boxShadow: `0 16px 40px -16px ${color}` }}
                >
                  Consultá por {name}
                </button>
                <Link
                  to="/paquetes"
                  className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
                  style={{ border: "1px solid var(--line)", color }}
                >
                  Ver todo el catálogo
                  <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
