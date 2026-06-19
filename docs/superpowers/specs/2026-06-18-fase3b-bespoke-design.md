# Spec 3B — Páginas bespoke: Luxury (/experiencias) + Disney (/disney)

**Fecha:** 2026-06-18
**Rama:** (nueva) `feat/fase3b-bespoke`
**Estado:** Diseño aprobado por el usuario; pendiente revisión del spec escrito.

## Objetivo

Construir las dos páginas internas "a medida" que quedaban: `/experiencias` con estética
**luxury propia** (oscura/dorada, editorial), y la **nueva `/disney`** (Walt Disney World Orlando)
con la estética editorial clara. Agregar Disney al navbar y eliminar el `PageLayout` viejo, que
tras esta migración queda sin uso.

## Contexto del estado actual

- `/experiencias` usa hoy el componente viejo `src/components/layout/PageLayout.tsx` (estética
  stone/negro). Es el **único** consumidor que le queda a `PageLayout` (tras la Fase 3A: `/argentina`
  y `/cruceros` redirigen, y `/grupales` `/quinceaneras` `/circuitos` usan `CategoryShowcase`).
- `src/components/home/LuxurySection.tsx` (sección del home) ya define el **lenguaje visual luxury**:
  fondo cinematográfico `#080706` con `/luxury/fondo_luxury.webp` + overlays, dorado (`gold-line`,
  `gold-text`, `var(--gold)`, `var(--gold-soft)`), hallmarks en tarjetas oscuras con borde dorado,
  y **tarjetas de paquete oscuras** (aspect 3/4, overlay degradado, `destination`/`title`/`duration`/
  `price` en dorado, link a `/paquete/:id`). Esta tarjeta oscura se reutiliza (ver Feature 1).
- La estética nueva clara usa tokens/utilidades (`bg-base`, `t1`, `t-mut`, `terra`, `font-display`,
  `ls-wide`, `<Reveal>`) que se adaptan solos a dark mode vía `.antares-dark`.
- `byType.experiencias` (de `usePackages()`) trae las experiencias de lujo.

## Fuera de alcance

- Página de detalle de paquete (`/paquete/:id`) → Fase 4.
- Bug de overflow horizontal en mobile → post Fase 4 (las páginas nuevas no agregan desbordes).
- Edición de estos contenidos desde el admin: los textos de `/disney` y los hallmarks de
  `/experiencias` quedan **hardcodeados** (editables por código), como `/nosotros`.

## Requisitos transversales

- **Responsive de celular** en todo; ningún elemento excede el ancho del viewport.
- **Imágenes de `/disney`:** genéricas de stock (Unsplash: parques temáticos, Orlando, viaje/familia).
  **No** usar imaginería con copyright de Disney (logos, personajes, fotos oficiales de los parques).

---

## Feature 1 — `/experiencias`: página Luxury

### 1.1 Componente compartido `LuxuryCard`

La tarjeta oscura de paquete de lujo se usa en dos lugares (el home y la página nueva), así que se
**extrae** a `src/components/luxury/LuxuryCard.tsx`:

```ts
// Props
type LuxuryCardProps = { pkg: TravelCard };
```

Renderiza el `<Link to={`/paquete/${encodeURIComponent(pkg.id)}`}>` con la imagen 3/4, el overlay
degradado, y `destination` (dorado, uppercase tracking), `title` (Playfair claro), `duration` y
`price` (dorado) — **idéntico** al bloque `featured.map(...)` actual de `LuxurySection`.

`src/components/home/LuxurySection.tsx` se **refactoriza** para usar `<LuxuryCard pkg={pkg} />` en su
bloque de paquetes destacados (mismo resultado visual, una sola fuente de verdad). Es una extracción
mecánica; el `featured = cards.slice(0,3)` y el `<Reveal>` envolvente se mantienen en LuxurySection.

### 1.2 Página `ExperienciasPage`

Nueva `src/pages/ExperienciasPage.tsx`. Lee `usePackages().byType.experiencias` (no recibe props).
Fondo y tratamiento oscuro/dorado tipo `LuxurySection` (la página es inherentemente oscura — no
depende del dark mode del sitio). Secciones:

1. **Hero oscuro** — contenedor con `/luxury/fondo_luxury.webp` + los mismos overlays radiales/
   lineales de `LuxurySection`; link "← Volver al inicio" (claro); eyebrow dorado
   ("Antares Luxury · Experiencias de autor"); `<h1>` Playfair grande
   (`clamp(2.6rem,7vw,5.5rem)`, color `#F4EDE2`) con una palabra en `gold-text italic`; intro
   en `rgba(244,237,226,.7)`.
2. **"Qué hace luxury a un viaje"** — 3 tarjetas oscuras con borde dorado
   (`rgba(198,164,97,.18)`), ícono en círculo dorado, título Playfair y copy — mismo patrón que los
   hallmarks de `LuxurySection`. Copy a redactar en el plan (acceso/concierge/diseño a medida, con
   posibilidad de un 4º hallmark).
3. **Grilla completa de experiencias** — todas las `byType.experiencias` con `<LuxuryCard>`
   envuelto en `<Reveal>`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, gap. Si está vacío: mensaje
   discreto en tono claro.
4. **CTA band** — borde superior dorado, frase Playfair itálica + botón dorado
   (`linear-gradient(var(--gold-soft), var(--gold))`) que dispara `openLead({ context: "luxury" })`.

`App.tsx`: la ruta `/experiencias` pasa de `<PageLayout .../>` a `<ExperienciasPage />`.

## Feature 2 — `/disney`: página nueva (Walt Disney World Orlando)

Nueva `src/pages/DisneyPage.tsx` en la **estética editorial clara** (`bg-base`, `font-display`,
`terra`, `<Reveal>`). No recibe props; usa `useLeadModal`. Imágenes genéricas de Unsplash. Secciones:

1. **Hero** — link "← Volver al inicio"; eyebrow "Walt Disney World · Orlando"; `<h1>` Playfair
   (con una parte en `terra italic`); intro sobre cómo Antares arma el viaje a Disney; imagen
   genérica grande (rounded).
2. **Cómo lo armamos / por qué con Antares** — 3 features (íconos + título + copy), p. ej.
   "Tickets y días de parque", "Hoteles + traslados", "Asesoramiento real". Patrón tipo `WhyUs`.
3. **Los 4 parques** — sección con 4 cards (Magic Kingdom · EPCOT · Hollywood Studios ·
   Animal Kingdom): imagen genérica + nombre + descripción corta + 2-3 highlights. Grilla
   `grid-cols-1 sm:grid-cols-2`.
4. **Recomendaciones / tips** — lista editorial de tips (mejor época, cuántos días, la app My
   Disney Experience, Lightning Lane, llegar temprano, etc.).
5. **CTA** — "Armá tu viaje a Disney" → `openLead({ context: "disney" })`.

Todo el texto y los datos (parques, tips, features) se redactan **verbatim en el plan** y quedan
hardcodeados en el componente (arrays a nivel módulo, editables por código).

`App.tsx`: nueva ruta `<Route path="/disney" element={<DisneyPage />} />`.

## Feature 3 — Navbar + ruteo + limpieza de `PageLayout`

- **Navbar** (`src/components/layout/Navbar.tsx`): el array `SERVICIOS` suma `{ label: "Disney",
  to: "/disney" }` al final → `Argentina · Circuitos · Cruceros · Grupales · Quinceañeras · Disney`.
- **Ruteo** (`src/App.tsx`): importar `ExperienciasPage` y `DisneyPage`; `/experiencias` →
  `<ExperienciasPage/>`; agregar `/disney` → `<DisneyPage/>`.
- **Limpieza:** al dejar de usarse, **borrar `src/components/layout/PageLayout.tsx`** y su import en
  `App.tsx`. (`byType` sigue usándose en App.tsx por las rutas `CategoryShowcase` de la Fase 3A, así
  que no queda sin uso.)

---

## Data flow / arquitectura

Sin cambios de datos. `ExperienciasPage` lee `byType.experiencias` del store; `DisneyPage` es
contenido estático (presentación pura). `LuxuryCard` es un componente de presentación reutilizable
(home + página luxury). Unidades nuevas, cada una con una responsabilidad clara:

- `LuxuryCard.tsx` (nuevo): tarjeta oscura de paquete de lujo (compartida).
- `ExperienciasPage.tsx` (nuevo): página luxury (hero + hallmarks + grilla + CTA).
- `DisneyPage.tsx` (nuevo): página de contenido de Disney.
- `LuxurySection.tsx` (mod): usa `LuxuryCard` (DRY).
- `Navbar.tsx` (mod): una entrada más.
- `App.tsx` (mod): imports + rutas + borrado de PageLayout.
- `PageLayout.tsx` (borrado).

## Testing / verificación

No hay framework de tests unitarios. Por tarea: `npx tsc --noEmit` + `npm run build` (ambos exit 0).
Revisión visual manual (local, ancho de celular y desktop): `/experiencias` oscura (hero, hallmarks,
grilla luxury, CTA) y que el home siga viéndose igual tras el refactor de `LuxurySection`; `/disney`
(hero, features, 4 parques, tips, CTA); el dropdown del navbar con Disney; y que ninguna página nueva
agregue scroll horizontal en mobile.

## Orden de implementación sugerido

1. `LuxuryCard.tsx` + refactor de `LuxurySection` para usarlo (verificar que el home no cambia).
2. `ExperienciasPage.tsx` + cablear la ruta `/experiencias`.
3. `DisneyPage.tsx` + cablear la ruta `/disney`.
4. Navbar (+Disney) + borrar `PageLayout.tsx` y su import.
5. Verificación final (tsc + build + revisión visual responsive).
