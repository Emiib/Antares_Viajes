import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { useLeadModal } from "../../context/LeadModalContext";

export function FooterCTA() {
  const { openLead } = useLeadModal();
  return (
    <section className="relative" style={{ background: "#100D0B", padding: "clamp(5rem,11vw,8.5rem) 0" }}>
      <Reveal className="mx-auto max-w-[1100px] px-5 text-center sm:px-8">
        <h2 className="font-display leading-[1.02] text-balance" style={{ fontSize: "clamp(2.4rem,6.5vw,5.2rem)", color: "#F4EDE2" }}>
          ¿Listo para tu<br /><span className="italic">próximo viaje?</span>
        </h2>
        <p className="mx-auto mt-7 max-w-[34rem] text-[1.05rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.6)" }}>
          Contanos a dónde querés ir. Te respondemos con una propuesta hecha a tu medida, sin compromiso.
        </p>
        <button onClick={() => openLead({ context: "footer-cta" })}
          className="group mt-10 inline-flex items-center gap-3 rounded-full py-4 pl-8 pr-7 text-[0.98rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: "var(--terra)", boxShadow: "0 20px 50px -18px rgba(217,78,63,.95)" }}>
          Empezar mi consulta
          <Icon name="arrowR" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </Reveal>
    </section>
  );
}
