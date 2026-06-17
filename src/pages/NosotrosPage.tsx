import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { useLeadModal } from "../context/LeadModalContext";

function Placeholder({ label = "Foto", ratio = "4 / 3" }: { label?: string; ratio?: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl"
      style={{ aspectRatio: ratio, background: "linear-gradient(135deg, rgba(217,78,63,.10), rgba(198,164,97,.10))", border: "1px dashed var(--line)" }}>
      <span className="t-faint text-xs font-semibold uppercase ls-wide">{label}</span>
    </div>
  );
}

const VALORES: { icon: IconName; title: string; copy: string }[] = [
  { icon: "compass", title: "Misión", copy: "Que cada cliente viaje tranquilo, con un itinerario pensado por personas que conocen el destino y se hacen cargo de cada detalle." },
  { icon: "sparkle", title: "Visión", copy: "Ser la agencia de referencia del Litoral: la que recomendás a tu familia porque sabés que van a estar en buenas manos." },
  { icon: "shield", title: "Nuestros valores", copy: "Cercanía, palabra cumplida y acompañamiento real — antes, durante y después del viaje." },
];

export function NosotrosPage() {
  const { openLead } = useLeadModal();
  return (
    <main className="bg-base">
      {/* Intro */}
      <section className="px-5 pb-16 pt-28 sm:px-8 md:pt-36">
        <div className="mx-auto max-w-[1100px]">
          <Link to="/" className="terra mb-6 inline-flex items-center gap-2 text-sm font-semibold">← Volver al inicio</Link>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Nosotros</span>
            </div>
            <h1 className="font-display t1 leading-[1.02] text-balance" style={{ fontSize: "clamp(2.4rem,6vw,4.6rem)" }}>
              Personas que arman viajes,<br /><span className="italic">no un buscador de vuelos.</span>
            </h1>
            <p className="t-mut mt-7 max-w-[44rem] text-[1.08rem] leading-relaxed text-pretty">
              Somos una agencia de viajes con más de 25 años en Gualeguaychú, Entre Ríos. Empezamos como un negocio familiar
              y seguimos siéndolo: las mismas personas que te atienden son las que arman tu viaje y te responden cuando algo
              pasa del otro lado del mundo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Historia */}
      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2">
          <Reveal variant="left"><Placeholder label="Foto de la agencia / equipo" /></Reveal>
          <Reveal variant="right">
            <h2 className="font-display t1 leading-[1.1]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Nuestra historia</h2>
            <p className="t-mut mt-5 leading-relaxed text-pretty">
              [Texto editable] Contá acá la historia de Antares: cómo empezó, quiénes la fundaron, los hitos de estos más de
              25 años y por qué generaciones de familias siguen viajando con ustedes.
            </p>
            <p className="t-mut mt-4 leading-relaxed text-pretty">
              [Texto editable] Un segundo párrafo para el presente: el equipo, la oficina en Churruarín 248 y la forma de
              trabajar que los distingue.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-6 md:grid-cols-3">
          {VALORES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="card-base h-full rounded-2xl p-7" style={{ border: "1px solid var(--line)" }}>
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(217,78,63,.4)", color: "var(--terra)" }}>
                  <Icon name={v.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-display t1 text-[1.4rem]">{v.title}</h3>
                <p className="t-mut mt-2.5 text-[0.95rem] leading-relaxed text-pretty">{v.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="px-5 py-12 sm:px-8 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <Reveal className="mb-10 max-w-[40rem]">
            <h2 className="font-display t1 leading-[1.1]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>El equipo</h2>
            <p className="t-mut mt-4 leading-relaxed text-pretty">
              [Reemplazar por fotos reales] Las caras de Antares. Cargá acá las fotos del equipo con su nombre y especialidad.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <Reveal key={n} delay={n * 0.05}>
                <Placeholder label="Foto" ratio="3 / 4" />
                <p className="font-display t1 mt-3 text-[1.05rem]">Nombre Apellido</p>
                <p className="t-faint text-[0.85rem]">Rol / especialidad</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 md:py-24">
        <Reveal className="mx-auto max-w-[1100px] text-center">
          <h2 className="font-display t1 leading-[1.05] text-balance" style={{ fontSize: "clamp(2rem,5vw,3.6rem)" }}>
            ¿Armamos tu próximo viaje?
          </h2>
          <p className="t-mut mx-auto mt-5 max-w-[34rem] leading-relaxed text-pretty">
            Contanos a dónde querés ir y te respondemos con una propuesta hecha a tu medida.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => openLead({ context: "nosotros" })}
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "var(--terra)", boxShadow: "0 16px 40px -16px rgba(217,78,63,.95)" }}>
              Empezar mi consulta
            </button>
            <Link to="/paquetes" className="terra rounded-full px-8 py-3.5 text-sm font-semibold" style={{ border: "1px solid var(--line)" }}>
              Ver paquetes
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
