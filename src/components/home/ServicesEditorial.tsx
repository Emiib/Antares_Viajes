import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

type Service = { key: string; num: string; name: string; line: string; tail: string; desc: string; img: string; to: string };

const SERVICES: Service[] = [
  { key: "paquetes", num: "01", name: "Paquetes Turísticos", line: "Paquetes", tail: "a tu medida.", to: "/ofertas",
    desc: "Vuelos, hotelería y traslados resueltos en una sola conversación. Elegís el destino; nosotros armamos cada pieza alrededor de cómo querés viajar.",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1300" },
  { key: "grupales", num: "02", name: "Viajes Grupales", line: "Viajes", tail: "en grupo.", to: "/grupales",
    desc: "Salidas acompañadas, contingentes y delegaciones con coordinación propia. Treinta personas, un solo equipo atrás resolviendo todo en tiempo real.",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1300" },
  { key: "circuitos", num: "03", name: "Circuitos Internacionales", line: "Circuitos", tail: "sin sorpresas.", to: "/circuitos",
    desc: "Recorridos guiados por varios países con cada traslado, hotel y excursión anticipados. Te movés liviano: la logística ya está pensada de punta a punta.",
    img: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1300" },
];

function ServiceRow({ s, i }: { s: Service; i: number }) {
  const { openLead } = useLeadModal();
  const flip = i % 2 === 1;
  return (
    <article className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-10">
      <Reveal variant={flip ? "right" : "left"} className={flip ? "md:order-2 md:col-span-6" : "md:col-span-6"}>
        <button onClick={() => openLead({ destino: s.name, context: "service:" + s.key })}
          className="group relative block w-full overflow-hidden rounded" style={{ aspectRatio: "16/10" }}>
          <img src={s.img} alt={s.name} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" style={{ transitionTimingFunction: "var(--ease)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(10,9,8,.5) 100%)" }} />
        </button>
      </Reveal>
      <Reveal delay={0.08} className={flip ? "md:order-1 md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8"}>
        <span className="font-display t-faint mb-3 block text-[1.3rem]">{s.num} — 03</span>
        <h3 className="font-display t1 leading-[0.98]" style={{ fontSize: "clamp(2.4rem,4.6vw,3.8rem)" }}>
          {s.line}<br /><span className="terra italic">{s.tail}</span>
        </h3>
        <p className="t-mut mt-5 max-w-[30rem] text-[1rem] leading-relaxed text-pretty">{s.desc}</p>
        <button onClick={() => openLead({ destino: s.name, context: "service:" + s.key })}
          className="terra group mt-6 inline-flex items-center gap-2.5 text-[0.9rem] font-semibold">
          Quiero ver paquetes
          <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </Reveal>
    </article>
  );
}

export function ServicesEditorial() {
  return (
    <section id="servicios" className="bg-base relative" style={{ padding: "clamp(5.5rem,12vw,9.5rem) 0" }}>
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal className="mb-16 max-w-[42rem] sm:mb-24">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9" style={{ background: "var(--terra)" }} />
            <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Lo que hacemos</span>
          </div>
          <h2 className="font-display t1 leading-[1.02] text-balance" style={{ fontSize: "clamp(2.3rem,5.6vw,4.4rem)" }}>
            Tres formas de salir<br /><span className="italic">al mundo</span> — y una más, <span className="italic">exclusiva.</span>
          </h2>
          <p className="t-mut mt-6 max-w-[34rem] text-[1.02rem] leading-relaxed text-pretty">
            No vendemos paquetes de catálogo. Escuchamos cómo querés viajar y construimos el itinerario alrededor de esa idea.
          </p>
        </Reveal>
        <div className="flex flex-col gap-16 sm:gap-24">
          {SERVICES.map((s, i) => <ServiceRow key={s.key} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}
