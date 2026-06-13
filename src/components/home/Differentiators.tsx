import { AnimatedSection } from "../ui/AnimatedSection";

/* Iconos SVG (Lucide) — 24x24, stroke 2, consistentes en todo el sitio */
const icons = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
};

const PILLARS = [
  {
    icon: icons.users,
    title: "Te atienden los dueños",
    desc: "No somos un call center ni un buscador. Cuando nos escribís, del otro lado hay una persona con nombre que se hace cargo de tu viaje de principio a fin.",
  },
  {
    icon: icons.globe,
    title: "Un especialista por destino",
    desc: "Cada destino del mundo tiene en Antares alguien del equipo que lo conoce a fondo y arma tu itinerario con criterio, no con plantillas.",
  },
  {
    icon: icons.shield,
    title: "Guardia 24 hs en viaje",
    desc: "Mientras estás viajando, nunca estás solo: ante cualquier imprevisto nos llamás y lo resolvemos, sea la hora que sea.",
  },
  {
    icon: icons.award,
    title: "Más de 30 años de trayectoria",
    desc: "Tres décadas haciendo viajar a familias enteras — y a los hijos de esas familias. La confianza no se compra, se construye.",
  },
];

/**
 * La diferencia Antares: la sección "humana" justo después del hero.
 * Preparada para sumar fotos reales del equipo cuando estén disponibles.
 */
export function Differentiators({ darkMode }: { darkMode: boolean }) {
  return (
    <AnimatedSection
      id="por-que-antares"
      data-track-section="diferenciacion"
      className={`${darkMode ? "bg-stone-900" : "bg-white"} py-16 md:py-24`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          {/* Columna editorial */}
          <div className="lg:sticky lg:top-32">
            <p className="mb-3 text-xs font-bold uppercase tracking-[3px]" style={{ color: "var(--antares-gold)" }}>
              Agencia familiar · Gualeguaychú, Entre Ríos
            </p>
            <h2 className={`mb-5 text-3xl font-black leading-tight md:text-5xl ${darkMode ? "text-white" : "text-stone-900"}`}>
              Somos una agencia de{" "}
              <span className="text-red-600">personas</span>, no de algoritmos
            </h2>
            <p className={`mb-6 text-base leading-relaxed md:text-lg ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
              Hace más de 30 años que sus dueños atienden esta agencia en persona.
              Acá tu viaje no es un número de reserva: es una idea que escuchamos,
              armamos a tu medida y acompañamos hasta que volvés a casa.
            </p>
            {/* TODO: foto real del equipo/oficina (la pasa el cliente) */}
            <a
              href="#contanos-tu-viaje"
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-red-600 transition-colors hover:text-red-700"
            >
              Contanos tu próximo viaje
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Pilares */}
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
            {PILLARS.map((item, idx) => (
              <div
                key={item.title}
                style={{ transitionDelay: `${idx * 80}ms` }}
                className={`rounded-2xl border p-6 transition-colors duration-200 ${
                  darkMode
                    ? "border-stone-800 bg-stone-950 hover:border-stone-700"
                    : "border-stone-200 bg-stone-50 hover:border-red-200 hover:bg-red-50/40"
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/10 text-red-600">
                  {item.icon}
                </div>
                <h3 className={`mb-2 text-base font-bold md:text-lg ${darkMode ? "text-white" : "text-stone-900"}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-stone-400" : "text-stone-600"}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
