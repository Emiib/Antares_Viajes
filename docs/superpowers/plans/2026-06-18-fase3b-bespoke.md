# Spec 3B — Páginas bespoke (Luxury + Disney) · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `/experiencias` con estética luxury propia (oscura/dorada) y la nueva `/disney` (Walt Disney World Orlando) en estética editorial clara, agregar Disney al navbar y retirar el `PageLayout` viejo.

**Architecture:** `ExperienciasPage` reutiliza el lenguaje visual de `LuxurySection` (home) y una tarjeta oscura extraída `LuxuryCard` (compartida home + página). `DisneyPage` es una página de contenido estático con la estética editorial clara (tokens `bg-base`/`t1`/`terra`/`<Reveal>`). Ambas leen lo que necesitan del store / son presentación pura.

**Tech Stack:** React 19 + TypeScript 5.9 (strict, `noUnusedLocals`/`noUnusedParameters`), react-router-dom 7, Tailwind CSS 4.

## Global Constraints

- **Sin tests unitarios.** Verificación por tarea: `npx tsc --noEmit` y `npm run build` (ambos exit 0).
- **TS strict:** prohibido imports/locals/params sin usar.
- **`Reveal`** acepta solo `children`, `className`, `variant`, `delay` (segundos), `as`, `id` — **NO** acepta `style`. **`Icon`** acepta solo `name`, `className`, `stroke` — **NO** acepta `style` (el color se da con una clase, p. ej. `terra`, o envolviéndolo en un `<span style>`).
- **Estética:** la página luxury usa el tratamiento oscuro de `LuxurySection` (fondo `#080706`, `/luxury/fondo_luxury.webp`, dorado `var(--gold)`/`var(--gold-soft)`/`gold-line`/`gold-text`). La página Disney usa la estética editorial clara (`bg-base`, `font-display`, `t1`, `t-mut`, `t-soft`, `terra`, `card-base`, `var(--terra)`, `var(--line)`, `ls-wide`).
- **`/disney` imágenes:** stock genérico (se reutilizan 3 IDs de Unsplash ya confirmados en el repo, rotados, marcados como temporales para reemplazar). **NO** usar imaginería con copyright de Disney (logos, personajes, fotos oficiales).
- **Responsive de celular**; ningún elemento excede el ancho del viewport.
- **Rama:** `feat/fase3b-bespoke`. Un commit por tarea. Copy **verbatim** de este plan.

---

### Task 1: Extraer `LuxuryCard` + refactor de `LuxurySection`

**Files:**
- Create: `src/components/luxury/LuxuryCard.tsx`
- Modify: `src/components/home/LuxurySection.tsx`

**Interfaces:**
- Produces: `LuxuryCard` con props `{ pkg: TravelCard }` — tarjeta oscura de paquete de lujo. Usada por `LuxurySection` (esta tarea) y `ExperienciasPage` (Task 2).

- [ ] **Step 1: Crear `LuxuryCard.tsx`**

Crear `src/components/luxury/LuxuryCard.tsx` con exactamente (es el bloque de tarjeta actual de `LuxurySection`):

```tsx
import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";

export function LuxuryCard({ pkg }: { pkg: TravelCard }) {
  return (
    <Link to={`/paquete/${encodeURIComponent(pkg.id)}`} className="group relative block overflow-hidden rounded-2xl">
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img src={pkg.image} alt={pkg.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: "var(--gold)" }}>{pkg.destination}</p>
        <h3 className="font-display mb-3 text-2xl leading-snug" style={{ color: "#F4EDE2" }}>{pkg.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "rgba(244,237,226,.7)" }}>{pkg.duration}</span>
          <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{pkg.price}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Refactorizar `LuxurySection` para usar `LuxuryCard`**

En `src/components/home/LuxurySection.tsx`:

1. Agregar el import (después de `import { Icon } ...` / `import type { IconName } ...`):
```tsx
import { LuxuryCard } from "../luxury/LuxuryCard";
```
2. En el bloque de paquetes (`{featured.length > 0 && (...)}`), reemplazar el `.map` para que cada item use `LuxuryCard`. El `.map` queda:
```tsx
            {featured.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.08}>
                <LuxuryCard pkg={pkg} />
              </Reveal>
            ))}
```
(Es decir: se reemplaza todo el `<Link to={`/paquete/...`} ...>...</Link>` interno por `<LuxuryCard pkg={pkg} />`. El `<Reveal>` envolvente y el resto de `LuxurySection` no cambian. `Link` sigue importado y usado por el CTA "Ver experiencias de lujo".)

- [ ] **Step 3: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/luxury/LuxuryCard.tsx src/components/home/LuxurySection.tsx
git commit -m "refactor(luxury): extraer LuxuryCard y usarlo en LuxurySection"
```

---

### Task 2: `ExperienciasPage` (luxury) + ruta `/experiencias` + retirar `PageLayout`

**Files:**
- Create: `src/pages/ExperienciasPage.tsx`
- Modify: `src/App.tsx` (import + ruta `/experiencias`, quitar import de `PageLayout`)
- Delete: `src/components/layout/PageLayout.tsx`

**Interfaces:**
- Consumes: `usePackages().byType.experiencias`; `LuxuryCard` (Task 1); `useLeadModal().openLead`.
- Produces: `ExperienciasPage` (sin props). La ruta `/experiencias` la renderiza.

- [ ] **Step 1: Crear `ExperienciasPage.tsx`**

Crear `src/pages/ExperienciasPage.tsx` con exactamente:

```tsx
import { Link } from "react-router-dom";
import { usePackages } from "../data/packagesStore";
import { Reveal } from "../components/ui/Reveal";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { LuxuryCard } from "../components/luxury/LuxuryCard";
import { useLeadModal } from "../context/LeadModalContext";

const HALLMARKS: { icon: IconName; title: string; copy: string }[] = [
  { icon: "key", title: "Acceso, no catálogo", copy: "Suites que no se reservan online, mesas sin disponibilidad pública, guías privados que solo trabajan con nosotros." },
  { icon: "concierge", title: "Concierge dedicado", copy: "Una sola persona, disponible 24/7, que conoce tu viaje de memoria desde antes de que despegues." },
  { icon: "diamond", title: "Diseñado a cuatro manos", copy: "Nos sentamos con vos. El itinerario se escribe en borrador, se corrige y se vuelve a escribir hasta que es tuyo." },
];

export function ExperienciasPage() {
  const { byType } = usePackages();
  const { openLead } = useLeadModal();
  const cards = byType.experiencias;

  return (
    <main className="relative overflow-hidden" style={{ background: "#080706" }}>
      {/* Fondo cinematográfico */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury/fondo_luxury.webp" alt="" aria-hidden className="h-full w-full object-cover" style={{ transform: "scale(1.08)", opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 70% 30%, transparent 0%, rgba(8,7,6,.7) 55%, rgba(8,7,6,.97) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,7,6,.85) 0%, transparent 22%, transparent 70%, rgba(8,7,6,.95) 100%)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-[1340px] px-5 sm:px-8" style={{ paddingTop: "clamp(7rem,14vw,11rem)", paddingBottom: "clamp(6rem,14vw,10rem)" }}>
        {/* Hero */}
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gold)" }}>← Volver al inicio</Link>
        <Reveal className="max-w-[46rem]">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 gold-line" />
            <span className="gold-text text-[0.7rem] font-semibold uppercase ls-wide">Antares Luxury · Experiencias de autor</span>
          </div>
          <h1 className="font-display leading-[0.98] text-balance" style={{ fontSize: "clamp(2.6rem,7vw,5.5rem)", color: "#F4EDE2" }}>
            Viajar distinto,<br /><span className="gold-text italic">sin fricción.</span>
          </h1>
          <p className="mt-8 max-w-[40rem] text-[1.08rem] leading-relaxed text-pretty sm:text-[1.18rem]" style={{ color: "rgba(244,237,226,.7)" }}>
            No es un paquete más caro. Es el lujo de viajar de una manera: discreta, anticipada, pensada para quien valora el detalle y la exclusividad. Una franja reservada de lo que hacemos.
          </p>
        </Reveal>

        {/* Hallmarks */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-3 md:gap-5">
          {HALLMARKS.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.09}>
              <div className="h-full rounded-xl px-7 py-10 sm:py-12" style={{ background: "rgba(10,9,8,.72)", border: "1px solid rgba(198,164,97,.18)", backdropFilter: "blur(4px)" }}>
                <span className="mb-7 grid h-12 w-12 place-items-center rounded-full" style={{ border: "1px solid rgba(198,164,97,.5)", color: "var(--gold-soft)" }}>
                  <Icon name={h.icon} className="h-[1.4rem] w-[1.4rem]" />
                </span>
                <h3 className="font-display text-[1.5rem] leading-[1.1]" style={{ color: "#F4EDE2" }}>{h.title}</h3>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-pretty" style={{ color: "rgba(244,237,226,.55)" }}>{h.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Grilla de experiencias */}
        {cards.length > 0 ? (
          <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {cards.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.06}>
                <LuxuryCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-lg sm:mt-20" style={{ color: "rgba(244,237,226,.55)" }}>Pronto vas a encontrar nuevas experiencias de lujo acá.</p>
        )}

        {/* CTA band */}
        <Reveal className="mt-16 flex flex-col gap-8 border-t border-[rgba(198,164,97,0.22)] pt-12 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display max-w-[26rem] text-[1.6rem] italic leading-[1.15] sm:text-[2rem]" style={{ color: "rgba(244,237,226,.85)" }}>
            Contanos qué imaginás. El resto lo resolvemos nosotros.
          </p>
          <button
            onClick={() => openLead({ context: "luxury" })}
            className="group inline-flex shrink-0 items-center gap-3 rounded-full py-4 pl-8 pr-7 text-[0.94rem] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(100deg, var(--gold-soft), var(--gold))", color: "#2a2008", boxShadow: "0 18px 44px -18px rgba(198,164,97,.7)" }}
          >
            Diseñar mi experiencia
            <Icon name="arrowR" className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Cablear la ruta `/experiencias` y quitar `PageLayout` de `App.tsx`**

En `src/App.tsx`:
1. Agregar el import (después de `import { PaquetesPage } from "./pages/PaquetesPage";`):
```tsx
import { ExperienciasPage } from "./pages/ExperienciasPage";
```
2. **Borrar** la línea de import de PageLayout:
```tsx
import { PageLayout } from "./components/layout/PageLayout";
```
3. Reemplazar el `<Route path="/experiencias" element={<PageLayout ... />} />` completo por:
```tsx
        <Route path="/experiencias" element={<ExperienciasPage />} />
```

- [ ] **Step 3: Borrar `PageLayout.tsx`**

Run:
```bash
git rm src/components/layout/PageLayout.tsx
```
(Ya no lo importa nadie: tras la Fase 3A solo lo usaba `/experiencias`, que ahora usa `ExperienciasPage`. `byType` sigue usándose en App.tsx por las rutas `CategoryShowcase`.)

- [ ] **Step 4: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0 (sin "PageLayout is declared but never used" ni import roto).

- [ ] **Step 5: Commit**

```bash
git add src/pages/ExperienciasPage.tsx src/App.tsx
git commit -m "feat(experiencias): página Luxury propia + retirar PageLayout"
```

---

### Task 3: `DisneyPage` + ruta `/disney` + Disney en el navbar

**Files:**
- Create: `src/pages/DisneyPage.tsx`
- Modify: `src/App.tsx` (import + ruta `/disney`)
- Modify: `src/components/layout/Navbar.tsx` (array `SERVICIOS`)

**Interfaces:**
- Consumes: `useLeadModal().openLead`. Página de contenido estático.
- Produces: `DisneyPage` (sin props). La ruta `/disney` la renderiza; el navbar la enlaza.

- [ ] **Step 1: Crear `DisneyPage.tsx`**

Crear `src/pages/DisneyPage.tsx` con exactamente:

```tsx
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
```

- [ ] **Step 2: Cablear la ruta `/disney` en `App.tsx`**

En `src/App.tsx`:
1. Agregar el import (después de `import { ExperienciasPage } from "./pages/ExperienciasPage";`):
```tsx
import { DisneyPage } from "./pages/DisneyPage";
```
2. Agregar la ruta (junto a las otras rutas de páginas, p. ej. después de la de `/experiencias`):
```tsx
        <Route path="/disney" element={<DisneyPage />} />
```

- [ ] **Step 3: Agregar "Disney" al dropdown del Navbar**

En `src/components/layout/Navbar.tsx`, reemplazar el array `const SERVICIOS = [...]` completo por:

```tsx
const SERVICIOS = [
  { label: "Argentina", to: "/argentina" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Cruceros", to: "/cruceros" },
  { label: "Grupales", to: "/grupales" },
  { label: "Quinceañeras", to: "/quinceaneras" },
  { label: "Disney", to: "/disney" },
];
```

- [ ] **Step 4: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/DisneyPage.tsx src/App.tsx src/components/layout/Navbar.tsx
git commit -m "feat(disney): página /disney (WDW Orlando) + ruta + entrada en navbar"
```

---

## Cierre

- [ ] **Verificación final + revisión visual**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

Revisión visual manual (local, `npm run dev`, ancho de celular y desktop):
- **Home**: la sección Luxury se ve **igual** que antes del refactor (`LuxuryCard`).
- **`/experiencias`**: fondo oscuro/dorado, hero, 3 hallmarks, grilla de experiencias (tarjetas oscuras), CTA band; categoría vacía muestra el mensaje.
- **`/disney`**: hero + imagen, 3 features, 4 parques, tips, CTA; imágenes de stock cargan (genéricas, a reemplazar).
- **Navbar**: dropdown Servicios con las 6 entradas (incluida Disney).
- Confirmar que ninguna página nueva agrega scroll horizontal en mobile.

## Notas de cobertura del spec (self-review)

- Feature 1 (ExperienciasPage luxury + LuxuryCard) → Task 1 (LuxuryCard + refactor) + Task 2 (página + ruta).
- Feature 2 (DisneyPage) → Task 3 (página + ruta).
- Feature 3 (navbar +Disney + ruteo + borrar PageLayout) → Task 2 (borra PageLayout) + Task 3 (navbar + ruta /disney).
- Imágenes Disney genéricas (sin copyright) → `IMG` con IDs de Unsplash confirmados del repo, marcados como temporales.
- `Reveal`/`Icon` sin prop `style` → respetado (colores por clase `terra`/`gold-*` o `<span style>`).
