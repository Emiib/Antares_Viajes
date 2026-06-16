import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { useCountUp } from "../../hooks/useCountUp";

const STATS = [
  { target: 30, prefix: "+", label: "Años de trayectoria", note: "Operando sin interrupciones desde 1994." },
  { target: 5000, prefix: "+", label: "Viajeros acompañados", note: "Familias, parejas y contingentes." },
  { target: 80, prefix: "+", label: "Destinos coordinados", note: "En los cinco continentes." },
];

const FEATURES: { icon: IconName; title: string; copy: string }[] = [
  { icon: "compass", title: "Asesoramiento real", copy: "Diseñamos cada itinerario con vos. Sin plantillas, sin paquetes genéricos." },
  { icon: "shield", title: "Respaldo de tres décadas", copy: "Treinta años operando en Entre Ríos nos avalan ante cada cliente." },
  { icon: "concierge", title: "De principio a fin", copy: "Te acompañamos antes, durante y después del viaje, estés donde estés." },
];

function Stat({ s }: { s: (typeof STATS)[number] }) {
  const { ref, value } = useCountUp(s.target);
  return (
    <Reveal>
      <div className="flex items-baseline">
        <span className="font-display t1 leading-none" style={{ fontSize: "clamp(3.4rem,8vw,6rem)" }}>
          <span className="terra">{s.prefix}</span>
          <span ref={ref}>{value.toLocaleString("es-AR")}</span>
        </span>
      </div>
      <div className="mt-3 h-px w-12" style={{ background: "var(--terra)" }} />
      <p className="font-display t1 mt-4 text-[1.25rem]">{s.label}</p>
      <p className="t-mut mt-1.5 max-w-[16rem] text-[0.92rem] leading-relaxed text-pretty">{s.note}</p>
    </Reveal>
  );
}

export function WhyUs() {
  return (
    <section id="nosotros" className="bg-base relative overflow-hidden" style={{ padding: "clamp(5.5rem,12vw,9.5rem) 0" }}>
      <div className="relative mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal className="max-w-[44rem]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9" style={{ background: "var(--terra)" }} />
            <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Por qué elegirnos</span>
          </div>
          <h2 className="font-display t1 leading-[1.04] text-balance" style={{ fontSize: "clamp(2.3rem,5.6vw,4.4rem)" }}>
            La experiencia<br /><span className="italic">no se improvisa.</span>
          </h2>
          <p className="t-mut mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-pretty">
            No somos un buscador de vuelos. Somos las mismas personas que te atienden, arman tu viaje y te responden el mensaje
            a las cuatro de la madrugada cuando perdés una conexión del otro lado del mundo.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-20 sm:grid-cols-3">
          {STATS.map((s) => <Stat key={s.label} s={s} />)}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 border-t border-base pt-14 sm:mt-24 sm:grid-cols-3 sm:gap-10">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(217,78,63,.4)", color: "var(--terra)" }}>
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-display t1 text-[1.4rem]">{f.title}</h3>
              <p className="t-mut mt-2.5 text-[0.95rem] leading-relaxed text-pretty">{f.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
