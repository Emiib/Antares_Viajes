import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "../ui/Icon";
import { captureLead } from "../../lib/leads";
import { useLeadModal } from "../../context/LeadModalContext";

interface LeadModalProps {
  wa: (text?: string) => string;
}

/** Modal único de captura. Persiste el lead (fire-and-forget) y ofrece seguir por WhatsApp. */
export function LeadModal({ wa }: LeadModalProps) {
  const { open, prefill, closeLead } = useLeadModal();
  const [data, setData] = useState({ nombre: "", contacto: "", destino: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const firstRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setData((d) => ({ ...d, destino: prefill?.destino || "" }));
    setSent(false);
    const t = setTimeout(() => firstRef.current?.focus(), 360);
    return () => clearTimeout(t);
  }, [open, prefill]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeLead();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeLead]);

  const set = (key: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const waMsg = () =>
    `Hola Antares, soy ${data.nombre || "—"}. Quiero consultar por ${data.destino || "un viaje"}.` +
    (data.mensaje ? ` ${data.mensaje}` : "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    captureLead({
      source: prefill?.context || "lead_modal",
      name: data.nombre,
      contact: data.contacto,
      destination: data.destino,
      message: data.mensaje,
    });
    setSent(true);
  };

  return (
    <div
      className="modal-scrim fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      style={{
        background: "rgba(8,7,6,.66)", backdropFilter: "blur(8px)",
        opacity: open ? 1 : 0, visibility: open ? "visible" : "hidden",
        pointerEvents: open ? "auto" : "none", transition: "opacity .4s var(--ease), visibility .4s",
      }}
      onMouseDown={(e) => e.target === e.currentTarget && closeLead()}
    >
      <div
        className="card-base font-ui relative w-full rounded-t-2xl p-7 sm:max-w-[460px] sm:rounded-md sm:p-9"
        style={{
          boxShadow: "0 40px 90px -30px rgba(0,0,0,.8)",
          opacity: open ? 1 : 0, transform: open ? "none" : "translateY(28px)",
          transition: "opacity .55s var(--ease), transform .55s var(--ease)",
        }}
      >
        <button onClick={closeLead} aria-label="Cerrar"
          className="t-soft absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full transition-colors hover:text-[var(--terra)]"
          style={{ border: "1px solid var(--line)" }}>
          <Icon name="close" className="h-4 w-4" />
        </button>

        {!sent ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.66rem] font-semibold uppercase ls-wide">Consulta sin compromiso</span>
            </div>
            <h3 className="font-display t1 leading-[1.05]" style={{ fontSize: "clamp(1.8rem,5vw,2.3rem)" }}>
              Armemos tu<span className="italic"> viaje.</span>
            </h3>
            <p className="t-mut mt-3 text-[0.92rem] leading-relaxed">
              Dejanos tus datos y te respondemos con una propuesta hecha a tu medida.
            </p>
            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
              <input ref={firstRef} className="lead-input" placeholder="Tu nombre" required value={data.nombre} onChange={set("nombre")} />
              <input className="lead-input" placeholder="Teléfono o email" required value={data.contacto} onChange={set("contacto")} />
              <input className="lead-input" placeholder="¿A dónde querés ir?" value={data.destino} onChange={set("destino")} />
              <textarea className="lead-input" rows={2} placeholder="Contanos más (opcional)" value={data.mensaje} onChange={set("mensaje")} />
              <button type="submit"
                className="group mt-2 inline-flex items-center justify-center gap-2.5 rounded-full py-3.5 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "var(--terra)", boxShadow: "0 16px 40px -16px rgba(217,78,63,.95)" }}>
                Enviar consulta
                <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 text-center sm:text-left">
            <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full sm:mx-0"
              style={{ background: "rgba(217,78,63,.14)", color: "var(--terra)" }}>
              <Icon name="check" className="h-7 w-7" stroke={1.8} />
            </span>
            <h3 className="font-display t1 leading-[1.08]" style={{ fontSize: "clamp(1.7rem,4.6vw,2.2rem)" }}>
              ¡Gracias, {data.nombre ? data.nombre.split(" ")[0] : "viajero"}!
            </h3>
            <p className="t-mut mx-auto mt-3 max-w-[24rem] text-[0.95rem] leading-relaxed sm:mx-0">
              Recibimos tu consulta. Seguí la conversación por WhatsApp y empezamos a diseñar tu itinerario ahora mismo.
            </p>
            <a href={wa(waMsg())} target="_blank" rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2.5 rounded-full py-3.5 pl-7 pr-6 text-[0.92rem] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "#25D366", boxShadow: "0 16px 40px -16px rgba(37,211,102,.8)" }}>
              <Icon name="whatsapp" className="h-5 w-5" />
              Continuar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
