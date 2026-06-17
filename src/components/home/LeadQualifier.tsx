import { useState } from "react";
import type { FormEvent } from "react";
import { departureMonthOptions } from "../../data/dates";
import { trackEvent, trackStandard } from "../../lib/tracking";
import { captureLead } from "../../lib/leads";
import { AnimatedSection } from "../ui/AnimatedSection";

const BUDGETS = [
  "Hasta USD 1.000 por persona",
  "USD 1.000 a 2.000 por persona",
  "USD 2.000 a 4.000 por persona",
  "Más de USD 4.000 por persona",
  "Prefiero que me asesoren",
];

const STYLES = [
  "Playa y relax",
  "Ciudades y cultura",
  "Circuito / varios destinos",
  "Luna de miel",
  "Viaje familiar",
  "Quinceañera",
  "Otro",
];

interface LeadQualifierProps {
  wa: (text?: string) => string;
}

export function LeadQualifier({ wa }: LeadQualifierProps) {
  const [form, setForm] = useState({
    destination: "",
    month: "",
    travelers: "2",
    budget: "",
    style: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const lines = [
      "Hola! Quiero que me armen una propuesta de viaje:",
      form.destination && `• Destino: ${form.destination}`,
      form.month && `• Cuándo: ${form.month}`,
      `• Viajeros: ${form.travelers}`,
      form.budget && `• Presupuesto: ${form.budget}`,
      form.style && `• Estilo: ${form.style}`,
    ].filter(Boolean);

    trackStandard("Lead", { destination: form.destination, budget: form.budget, style: form.style });
    trackEvent("lead_qualifier_submit", { ...form });
    captureLead({
      source: "lead_qualifier",
      destination: form.destination,
      message: lines.slice(1).join("\n"),
      payload: { month: form.month, travelers: form.travelers, budget: form.budget, style: form.style },
    });
    window.open(wa(lines.join("\n")), "_blank", "noopener");
  };

  const labelCls = "mb-1.5 block text-[10px] font-semibold uppercase tracking-wider t-faint";
  const fieldCls = "w-full rounded-xl px-3 py-3 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--terra)]";
  const fieldStyle = { border: "1px solid var(--line)", background: "var(--card)", color: "var(--text)" } as const;

  return (
    <AnimatedSection
      id="contanos-tu-viaje"
      data-track-section="lead-qualifier"
      className="bg-base py-16 md:py-24"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display t1 mb-3 leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.2rem)" }}>
            Contanos tu viaje, <span className="terra">lo armamos por vos</span>
          </h2>
          <p className="t-mut mx-auto max-w-2xl text-base md:text-lg">
            Completá estos datos y un asesor — no un bot — te responde con una
            propuesta pensada para vos. Sin compromiso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-base rounded-3xl p-5 md:p-8" style={{ border: "1px solid var(--line)" }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="lq-destination" className={labelCls}>¿A dónde soñás ir?</label>
              <input id="lq-destination" type="text" placeholder="Caribe, Europa, no sé aún..."
                value={form.destination} onChange={set("destination")} className={fieldCls} style={fieldStyle} />
            </div>
            <div>
              <label htmlFor="lq-month" className={labelCls}>¿Cuándo?</label>
              <select id="lq-month" value={form.month} onChange={set("month")} className={fieldCls} style={fieldStyle}>
                <option value="">Aún no lo sé</option>
                {departureMonthOptions.map((opt) => (<option key={opt.value} value={opt.label}>{opt.label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="lq-travelers" className={labelCls}>¿Cuántos viajan?</label>
              <select id="lq-travelers" value={form.travelers} onChange={set("travelers")} className={fieldCls} style={fieldStyle}>
                {["1", "2", "3", "4", "5+", "Grupo grande"].map((n) => (<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="lq-budget" className={labelCls}>Presupuesto estimado</label>
              <select id="lq-budget" value={form.budget} onChange={set("budget")} className={fieldCls} style={fieldStyle}>
                <option value="">Elegí un rango</option>
                {BUDGETS.map((b) => (<option key={b} value={b}>{b}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="lq-style" className={labelCls}>Estilo de viaje</label>
              <select id="lq-style" value={form.style} onChange={set("style")} className={fieldCls} style={fieldStyle}>
                <option value="">¿Qué buscás?</option>
                {STYLES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--terra)" }}>
                Pedir mi propuesta
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <p className="t-faint mt-4 text-center text-xs">
            Te respondemos por WhatsApp en horario de atención. Sin spam, sin suscripciones.
          </p>
        </form>
      </div>
    </AnimatedSection>
  );
}
