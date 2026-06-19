# Spec 4 — Detalle del paquete (conversión) · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir `PackageDetailPage` en la estética nueva con dos skins (editorial clara / luxury oscura) y optimizada para conversión (panel sticky en desktop + barra de CTA fija en mobile, urgencia con `departure`, trust strip, precio honesto, CTA modal prefilleado + WhatsApp directo).

**Architecture:** Una sola página, presentación pura. Lee `getById(id)` y `byType.experiencias` del store. Un mapa de tokens `T = isLux ? LUX : LIGHT` (colores por CSS vars / valores) aplicado vía estilos inline en un único árbol JSX — sin duplicar el layout. El skin claro usa los tokens del sistema (se adapta solo al dark mode); el luxury es siempre oscuro.

**Tech Stack:** React 19 + TypeScript 5.9 (strict, `noUnusedLocals`/`noUnusedParameters`), react-router-dom 7, Tailwind CSS 4.

## Global Constraints

- **Sin tests unitarios.** Verificación: `npx tsc --noEmit && npm run build` (ambos exit 0). Strict TS.
- **Íconos con sobriedad:** nada de emojis; usar `Icon` (SVG) con moderación — la **meta va sin íconos** (label/valor editoriales); reservar íconos para un **check sutil** en "Qué incluye" y el **glyph** en el botón de WhatsApp. Nada más.
- **A11y/calidad:** touch targets ≥ 44px; `cursor-pointer` (botones/links nativos ya lo traen vía estilos del navegador; los `<button>`/`<a>`/`<Link>` son nativos); alt text en la imagen (`pkg.title`); imagen del hero **no** `loading="lazy"` (LCP, above-the-fold); sin scroll horizontal.
- **Skins:** LIGHT = tokens `var(--bg)/var(--text)/var(--text-70)/var(--text-55)/var(--card)/var(--line)/var(--terra)`. LUX = `#080706` bg, texto `#F4EDE2`/`rgba(244,237,226,.7|.5)`, acento `var(--gold)`/`var(--gold-soft)`, líneas `rgba(198,164,97,.22)`, card `rgba(10,9,8,.72)`.
- **Detección de lujo:** `const isLux = byType.experiencias.some((p) => p.id === pkg.id);`
- **CTA primario:** `openLead({ destino: pkg.destination, context: \`Paquete: ${pkg.title}\` })`. **CTA WhatsApp:** `<a href={whatsappLink(\`Hola! Me interesa el paquete "${pkg.title}". Quería más detalles.\`)}>`.
- **Copy verbatim** (precio nota, trust strip) de este plan. **Rama:** `feat/fase4-detalle`.

---

### Task 1: Reescribir `PackageDetailPage` (dos skins + conversión) + ajustar `App.tsx`

**Files:**
- Modify (rewrite): `src/pages/PackageDetailPage.tsx`
- Modify: `src/App.tsx` (render de la ruta `/paquete/:id`)

**Interfaces:**
- Consumes: `usePackages()` → `getById`, `byType`; `useLeadModal()` → `openLead({ destino?, context? })`; `Icon` (`check`, `whatsapp`); la prop `whatsappLink: (msg: string) => string`.
- Produces: `PackageDetailPage({ whatsappLink })` (ya **sin** `darkMode`).

- [ ] **Step 1: Reescribir `PackageDetailPage.tsx`**

Reemplazar **todo** el contenido de `src/pages/PackageDetailPage.tsx` por:

```tsx
import { useParams, Link } from "react-router-dom";
import { usePackages } from "../data/packagesStore";
import { useLeadModal } from "../context/LeadModalContext";
import { Icon } from "../components/ui/Icon";

export function PackageDetailPage({ whatsappLink }: { whatsappLink: (msg: string) => string }) {
  const { id } = useParams();
  const { getById, byType } = usePackages();
  const { openLead } = useLeadModal();
  const pkg = id ? getById(id) : null;

  if (!pkg) {
    return (
      <main className="bg-base" style={{ minHeight: "100vh" }}>
        <section className="px-5 pt-28 sm:px-8 md:pt-36">
          <div className="mx-auto max-w-[1100px]">
            <Link to="/paquetes" className="terra mb-6 inline-flex items-center gap-2 text-sm font-semibold">← Volver a paquetes</Link>
            <h1 className="font-display t1 leading-[1.05]" style={{ fontSize: "clamp(2rem,5vw,3.4rem)" }}>Paquete no encontrado</h1>
            <p className="t-mut mt-4 max-w-[34rem] leading-relaxed text-pretty">
              Puede que ya no esté disponible o que el enlace haya cambiado. Mirá todas nuestras propuestas en la página de paquetes.
            </p>
            <Link to="/paquetes" className="mt-8 inline-flex rounded-full px-7 py-3 text-sm font-semibold text-white" style={{ background: "var(--terra)" }}>
              Ver todos los paquetes
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const isLux = byType.experiencias.some((p) => p.id === pkg.id);

  const T = isLux
    ? {
        bg: "#080706",
        text: "#F4EDE2",
        mut: "rgba(244,237,226,.7)",
        faint: "rgba(244,237,226,.5)",
        accent: "var(--gold)",
        line: "rgba(198,164,97,.22)",
        card: "rgba(10,9,8,.72)",
        badgeText: "#2a2008",
        urgencyBg: "rgba(198,164,97,.14)",
        primary: { background: "linear-gradient(100deg, var(--gold-soft), var(--gold))", color: "#2a2008", boxShadow: "0 18px 44px -18px rgba(198,164,97,.7)" } as const,
      }
    : {
        bg: "var(--bg)",
        text: "var(--text)",
        mut: "var(--text-70)",
        faint: "var(--text-55)",
        accent: "var(--terra)",
        line: "var(--line)",
        card: "var(--card)",
        badgeText: "#fff",
        urgencyBg: "rgba(217,78,63,.1)",
        primary: { background: "var(--terra)", color: "#fff", boxShadow: "0 16px 40px -16px rgba(217,78,63,.95)" } as const,
      };

  const meta = [
    { label: "Destino", value: pkg.destination },
    { label: "Duración", value: pkg.duration },
    pkg.people ? { label: "Viajan", value: pkg.people } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const consultar = () => openLead({ destino: pkg.destination, context: `Paquete: ${pkg.title}` });
  const waHref = whatsappLink(`Hola! Me interesa el paquete "${pkg.title}". Quería más detalles.`);

  return (
    <main className="relative" style={{ background: T.bg, color: T.text, minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1200px] px-5 pb-28 pt-28 sm:px-8 md:pt-32 lg:pb-16">
        <Link to="/paquetes" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: T.accent }}>← Volver a paquetes</Link>

        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Contenido */}
          <div>
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 10" }}>
              <img src={pkg.image} alt={pkg.title} className="h-full w-full object-cover" />
              {pkg.badge && (
                <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide" style={{ background: T.accent, color: T.badgeText }}>
                  {pkg.badge}
                </span>
              )}
            </div>

            <p className="mt-7 text-[0.72rem] font-semibold uppercase ls-wide" style={{ color: T.accent }}>{pkg.destination}</p>
            <h1 className="font-display mt-2 leading-[1.05] text-balance" style={{ fontSize: "clamp(2rem,5vw,3.4rem)", color: T.text }}>{pkg.title}</h1>

            {/* Meta (sin íconos) */}
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-8 sm:grid-cols-3" style={{ borderColor: T.line }}>
              {meta.map((m) => (
                <div key={m.label}>
                  <p className="text-[0.68rem] font-semibold uppercase ls-wide" style={{ color: T.faint }}>{m.label}</p>
                  <p className="font-display mt-1 text-[1.15rem]" style={{ color: T.text }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Qué incluye */}
            {pkg.includes && pkg.includes.length > 0 && (
              <div className="mt-10 border-t pt-8" style={{ borderColor: T.line }}>
                <h2 className="font-display text-[1.4rem]" style={{ color: T.text }}>Qué incluye</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {pkg.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[0.95rem]" style={{ color: T.mut }}>
                      <span className="mt-0.5 shrink-0" style={{ color: T.accent }}><Icon name="check" stroke={1.75} className="h-4 w-4" /></span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* El recorrido (highlights) */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="mt-10 border-t pt-8" style={{ borderColor: T.line }}>
                <h2 className="font-display text-[1.4rem]" style={{ color: T.text }}>El recorrido</h2>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {pkg.highlights.map((h, i) => (
                    <span key={i} className="rounded-full px-4 py-1.5 text-[0.85rem]" style={{ border: `1px solid ${T.line}`, color: T.mut }}>{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel precio + CTA */}
          <aside className="mt-10 lg:mt-0">
            <div className="rounded-2xl p-6 lg:sticky lg:top-28" style={{ background: T.card, border: `1px solid ${T.line}` }}>
              {pkg.departure && (
                <span className="mb-5 inline-block rounded-full px-3 py-1 text-[0.72rem] font-semibold" style={{ background: T.urgencyBg, color: T.accent }}>
                  {pkg.departure}
                </span>
              )}
              <p className="text-[0.68rem] font-semibold uppercase ls-wide" style={{ color: T.faint }}>Precio por persona</p>
              <p className="font-display mt-1 text-[2.6rem] font-black leading-none" style={{ color: T.accent }}>{pkg.price}</p>
              <p className="mt-2 text-[0.78rem] leading-relaxed" style={{ color: T.faint }}>Tarifa de referencia — confirmamos disponibilidad y precio final al consultar.</p>

              <button onClick={consultar} className="mt-6 block w-full rounded-full py-3.5 text-center text-sm font-semibold transition-transform hover:-translate-y-0.5" style={T.primary}>
                Consultar este viaje
              </button>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold" style={{ border: `1px solid ${T.line}`, color: T.text }}>
                <Icon name="whatsapp" className="h-[1.05rem] w-[1.05rem]" />
                Consultar por WhatsApp
              </a>

              <p className="mt-6 border-t pt-5 text-[0.76rem] leading-relaxed" style={{ borderColor: T.line, color: T.faint }}>
                +25 años en Gualeguaychú · Legajo EVT habilitado · Te acompañamos antes, durante y después del viaje.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Barra de CTA fija en mobile (deja lugar al FAB de WhatsApp) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 px-4 py-3 pr-[5.5rem] lg:hidden" style={{ background: T.card, borderTop: `1px solid ${T.line}`, backdropFilter: "blur(8px)" }}>
        <div className="min-w-0">
          <p className="text-[0.6rem] font-semibold uppercase ls-wide" style={{ color: T.faint }}>Por persona</p>
          <p className="font-display text-[1.2rem] font-black leading-none" style={{ color: T.accent }}>{pkg.price}</p>
        </div>
        <button onClick={consultar} className="shrink-0 rounded-full px-6 py-3 text-sm font-semibold" style={T.primary}>Consultar</button>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Ajustar el render en `App.tsx`**

En `src/App.tsx`, reemplazar:
```tsx
        <Route
          path="/paquete/:id"
          element={<PackageDetailPage darkMode={darkMode} whatsappLink={wa} />}
        />
```
por:
```tsx
        <Route
          path="/paquete/:id"
          element={<PackageDetailPage whatsappLink={wa} />}
        />
```

(El import de `PackageDetailPage` en App.tsx queda igual. `darkMode` sigue usándose en App.tsx por otros componentes — no se toca su declaración.)

- [ ] **Step 3: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0. (Si tsc se queja de `darkMode` "does not exist on type" en algún lado, es que quedó un uso viejo — el único era el render de la ruta, ya corregido en el Step 2.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/PackageDetailPage.tsx src/App.tsx
git commit -m "feat(detalle): rediseño de /paquete/:id en estética nueva (2 skins) optimizado para conversión"
```

---

## Cierre

- [ ] **Verificación final + revisión visual**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

Revisión visual manual (local, `npm run dev`, 375/768/1024/1440):
- Un **paquete estándar** (ej. desde `/paquetes`): skin **claro**, panel de precio sticky en desktop, barra fija abajo en mobile (sin chocar con el FAB de WhatsApp), CTAs (el primario abre el modal prefilleado con el destino; el de WhatsApp abre el chat con el mensaje del paquete).
- Una **experiencia de lujo** (desde `/experiencias` → una card): skin **oscuro/dorado**.
- Estado **"Paquete no encontrado"** (ej. `/paquete/inexistente`): claro, con volver.
- Sin scroll horizontal en mobile; la meta se ve sobria (sin íconos); el check de "Qué incluye" es discreto.

## Notas de cobertura del spec (self-review)

- Dos skins (claro/lujo) por `byType.experiencias` → Task 1 (mapa `T`).
- Estructura (volver, hero+badge, eyebrow, título, meta sin íconos, incluye con check sutil, highlights, panel precio) → Task 1.
- Conversión: panel sticky desktop + barra fija mobile, urgencia (`departure`), precio + nota honesta, trust strip → Task 1.
- CTA modal prefilleado + WhatsApp directo → Task 1 (`consultar` / `waHref`).
- No-encontrado rediseñado → Task 1.
- `App.tsx` sin `darkMode` en el detalle; sin íconos nuevos al set → Task 1 (Step 2) / usa `check`+`whatsapp` existentes.
- Sin `Reveal` en la página: el contenido y el CTA del punto de conversión se ven al instante (mejor que animar la entrada). Decisión deliberada, coherente con la guía UX.
