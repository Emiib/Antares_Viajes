import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { useLeadModal } from "../context/LeadModalContext";

// Stock genérico TEMPORAL — reemplazar por fotos reales del viaje.
// (No usar imaginería con copyright de Disney: logos, personajes, fotos oficiales.)
const IMG = {
  hero: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1600",
  a: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1100",
  b: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1100",
};

const FEATURES: { icon: IconName; title: string; copy: string }[] = [
  { icon: "map", title: "Tickets y días de parque", copy: "Te ayudamos a elegir cuántos días y qué tipo de entrada conviene según tu grupo, las fechas y lo que quieren ver." },
  { icon: "plane", title: "Hoteles y traslados", copy: "Alojamiento dentro o cerca de los parques, traslados desde el aeropuerto y todo el armado para que no manejes nada." },
  { icon: "compass", title: "Asesoramiento real", copy: "Alguien que conoce el destino te ordena el itinerario para aprovechar cada jornada sin enloquecer." },
];

const PARQUES: { name: string; img: string; copy: string; highlights: string[] }[] = [
  { name: "Magic Kingdom", img: IMG.a, copy: "El parque más icónico: el castillo, los desfiles y las atracciones clásicas para toda la familia.", highlights: ["El castillo y los fuegos nocturnos", "Atracciones clásicas para todas las edades", "Ideal para el primer día"] },
  { name: "EPCOT", img: IMG.b, copy: "Futuro, innovación y un recorrido por países del mundo con su gastronomía y cultura.", highlights: ["World Showcase: países y gastronomía", "Atracciones de ciencia y futuro", "Excelente para comer y pasear"] },
  { name: "Hollywood Studios", img: IMG.hero, copy: "Cine, acción y las áreas más nuevas, con experiencias inmersivas de las grandes sagas.", highlights: ["Áreas temáticas inmersivas", "Shows y atracciones de adrenalina", "De lo más demandado: reservá temprano"] },
  { name: "Animal Kingdom", img: IMG.a, copy: "Naturaleza, aventura y safaris: el parque más grande y verde de todos.", highlights: ["Safari y fauna real", "Áreas de aventura y naturaleza", "Llegá temprano para ver a los animales"] },
];

const TIPS: string[] = [
  "Mejor época: evitá los picos de vacaciones de EE.UU. y los feriados largos; el clima es más amable entre el otoño y la primavera boreal.",
  "Cuántos días: como mínimo un día por parque; lo ideal es sumar jornadas de descanso o repetir el favorito.",
  "Descargá la app oficial (My Disney Experience): mapas, tiempos de espera y reservas en tiempo real.",
  "Lightning Lane / filas rápidas: conviene entenderlas antes de viajar para ahorrar horas de cola.",
  "Llegá temprano (rope drop): la primera hora del día rinde como tres en plena tarde.",
  "Calzado cómodo y agua: se caminan muchos kilómetros por día.",
];

export function DisneyPage() {
  const { openLead } = useLeadModal();

  return (
    <main className="bg-base">
      {/* Hero */}
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1100px]">
          <Link to="/" className="terra mb-6 inline-flex items-center gap-2 text-sm font-semibold">← Volver al inicio</Link>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Walt Disney World · Orlando</span>
            </div>
            <h1 className="font-display t1 leading-[1.02] text-balance" style={{ fontSize: "clamp(2.4rem,6vw,4.6rem)" }}>
              La magia,<br /><span className="terra italic">bien planificada.</span>
            </h1>
            <p className="t-mut mt-7 max-w-[44rem] text-[1.08rem] leading-relaxed text-pretty">
              Llevamos familias a Disney desde hace años. Armamos el viaje completo —parques, días, hoteles y traslados— para que ustedes solo se ocupen de disfrutarlo. Te contamos cómo lo hacemos y qué esperar de cada parque.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <img src={IMG.hero} alt="Viaje familiar a Orlando" className="w-full rounded-2xl object-cover" style={{ aspectRatio: "16 / 7" }} loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* Cómo lo armamos */}
      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Reveal className="mb-10 max-w-[40rem]">
            <h2 className="font-display t1 leading-[1.1]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Cómo lo armamos</h2>
            <p className="t-mut mt-4 leading-relaxed text-pretty">Un viaje a Disney tiene muchas decisiones. Nos encargamos de las difíciles para que la tuya sea solo elegir a dónde ir.</p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="card-base h-full rounded-2xl p-7" style={{ border: "1px solid var(--line)" }}>
                  <span className="mb-5 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(217,78,63,.4)", color: "var(--terra)" }}>
                    <Icon name={f.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="font-display t1 text-[1.3rem]">{f.title}</h3>
                  <p className="t-mut mt-2.5 text-[0.95rem] leading-relaxed text-pretty">{f.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Los 4 parques */}
      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Reveal className="mb-10 max-w-[40rem]">
            <h2 className="font-display t1 leading-[1.1]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Los cuatro parques</h2>
            <p className="t-mut mt-4 leading-relaxed text-pretty">Cada uno tiene su personalidad. Te ayudamos a ordenarlos según tu grupo y los días que tengan.</p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {PARQUES.map((park, i) => (
              <Reveal key={park.name} delay={(i % 2) * 0.08}>
                <article className="card-base h-full overflow-hidden rounded-2xl" style={{ border: "1px solid var(--line)" }}>
                  <img src={park.img} alt={park.name} className="h-52 w-full object-cover" loading="lazy" />
                  <div className="p-6">
                    <h3 className="font-display t1 text-[1.5rem]">{park.name}</h3>
                    <p className="t-mut mt-2 text-[0.95rem] leading-relaxed text-pretty">{park.copy}</p>
                    <ul className="mt-4 space-y-1.5">
                      {park.highlights.map((h) => (
                        <li key={h} className="t-soft flex items-start gap-2 text-[0.9rem]">
                          <Icon name="check" className="terra mt-0.5 h-4 w-4 shrink-0" />{h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Reveal className="mb-10 max-w-[40rem]">
            <h2 className="font-display t1 leading-[1.1]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Recomendaciones</h2>
            <p className="t-mut mt-4 leading-relaxed text-pretty">Lo que les decimos a todos los que viajan por primera vez.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {TIPS.map((tip, i) => (
              <Reveal key={i} delay={(i % 2) * 0.06}>
                <div className="card-base flex items-start gap-3 rounded-2xl p-5" style={{ border: "1px solid var(--line)" }}>
                  <Icon name="sparkle" className="terra mt-0.5 h-5 w-5 shrink-0" />
                  <p className="t-mut text-[0.95rem] leading-relaxed text-pretty">{tip}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 md:py-24">
        <Reveal className="mx-auto max-w-[1100px] text-center">
          <h2 className="font-display t1 leading-[1.05] text-balance" style={{ fontSize: "clamp(2rem,5vw,3.6rem)" }}>¿Armamos tu viaje a Disney?</h2>
          <p className="t-mut mx-auto mt-5 max-w-[34rem] leading-relaxed text-pretty">Contanos cuántos son, qué fechas manejan y qué les gustaría. Te volvemos con una propuesta a medida.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openLead({ context: "disney" })}
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "var(--terra)", boxShadow: "0 16px 40px -16px rgba(217,78,63,.95)" }}
            >
              Armá tu viaje a Disney
            </button>
            <Link to="/paquetes" className="terra rounded-full px-8 py-3.5 text-sm font-semibold" style={{ border: "1px solid var(--line)" }}>Ver paquetes</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
