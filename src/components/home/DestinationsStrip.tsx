import { Link } from "react-router-dom";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";
import { popularDestinations } from "../../data/destinations";

type Dest = { name: string; subtitle: string; image: string; to: string; country?: string; priceFrom?: string };

export function DestinationsStrip() {
  const { openLead } = useLeadModal();
  const dests = (popularDestinations as readonly Dest[]).slice(0, 3);

  return (
    <section id="destinos" className="bg-base relative overflow-hidden" style={{ padding: "clamp(5rem,11vw,8.5rem) 0" }}>
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <Reveal className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[34rem]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">Destinos</span>
            </div>
            <h2 className="font-display t1 leading-[1.03] text-balance" style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }}>
              Destinos que son<br /><span className="italic">tendencia.</span>
            </h2>
          </div>
          <div className="t-faint hidden shrink-0 items-center gap-2 pb-2 text-[0.78rem] font-medium sm:flex">
            <span>Deslizá para explorar</span><Icon name="arrowR" className="terra h-5 w-5" />
          </div>
        </Reveal>
      </div>

      <Reveal className="no-bar snap-x snap-mandatory overflow-x-auto">
        <div className="flex gap-4 px-5 sm:gap-5 sm:px-8 md:px-[max(2rem,calc((100vw-1340px)/2+2rem))]">
          {dests.map((d, i) => (
            <Link key={d.name} to={d.to}
              className="group relative shrink-0 snap-start overflow-hidden rounded"
              style={{ width: "clamp(265px,78vw,400px)", height: "clamp(400px,60vh,540px)", background: "#1a1611" }}>
              <div className="absolute inset-0 overflow-hidden">
                <img src={d.image} alt={d.name} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-105" style={{ transitionTimingFunction: "var(--ease)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.05) 35%, rgba(10,9,8,.88) 100%)" }} />
              </div>
              <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="font-display text-xl text-white/40">0{i + 1}</span>
                  {d.priceFrom && (
                    <span className="rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold text-white backdrop-blur-md"
                      style={{ background: "rgba(244,237,226,.13)", border: "1px solid rgba(244,237,226,.2)" }}>
                      desde USD {d.priceFrom}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[0.68rem] font-semibold uppercase ls-wide text-white/65">{d.country ?? d.subtitle}</span>
                  <h3 className="font-display mt-1 text-[1.9rem] leading-[1.02] text-white sm:text-[2.3rem]">{d.name}</h3>
                  <span className="text-terrasoft mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold transition-all duration-300 group-hover:translate-x-0.5">
                    Ver paquetes <Icon name="arrowR" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          <div className="flex w-[78vw] shrink-0 items-center sm:w-[300px]">
            <button onClick={() => openLead({ context: "destino:otro" })} className="t1 group inline-flex items-center gap-3 text-left">
              <span className="font-display text-[1.8rem] italic leading-tight">¿Tu destino<br />no está acá?</span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1" style={{ background: "var(--terra)" }}>
                <Icon name="arrowR" className="h-5 w-5 text-white" />
              </span>
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
