# Spec 3A — Catálogo y ruteo en estética nueva · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar el ruteo y las páginas de catálogo estándar a la estética nueva: filtro por tipo en `/paquetes`, redirects de `/argentina` y `/cruceros`, y un componente editorial compartido para `/grupales`, `/quinceañeras` y `/circuitos`.

**Architecture:** Todo sale de `usePackages().byType` (estático + live de `/api/data`). `CategoryShowcase` es un componente de presentación puro (recibe `cards` por props). El filtro de tipo en `PaquetesPage` es estado de UI sincronizado con la query string. Se reutilizan `PackageCard`, `Reveal`, `useLeadModal` y los tokens/utilidades de `index.css`.

**Tech Stack:** React 19 + TypeScript 5.9 (strict, `noUnusedLocals`/`noUnusedParameters`), react-router-dom 7, Tailwind CSS 4.

## Global Constraints

- **Sin tests unitarios en el repo.** Verificación por tarea: `npx tsc --noEmit` y `npm run build` (ambos exit 0).
- **TS strict:** prohibido dejar imports/locals/params sin usar (rompe `tsc`).
- **Estética nueva:** usar las utilidades existentes (`bg-base`, `t1`, `t-mut`, `terra`, `font-display`, `ls-wide`, `<Reveal>`) y tokens (`var(--terra)`, `var(--line)`). NO usar las clases stone/negro viejas.
- **Responsive de celular obligatorio:** header con `clamp`, grilla `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, barra de filtros que apila. **Ningún elemento nuevo debe exceder el ancho del viewport** (no agregar scroll horizontal).
- **NO borrar `src/components/layout/PageLayout.tsx`** — sigue en uso por `/experiencias` (lo migra el Spec 3B).
- **Rama:** `feat/fase3a-catalogo`. Commits frecuentes, uno por tarea.
- Copy en español rioplatense, usar los strings **verbatim** de este plan.

---

### Task 1: Filtro por tipo (categoría) en `/paquetes`

**Files:**
- Modify: `src/pages/PaquetesPage.tsx`

**Interfaces:**
- Consumes: `usePackages().byType` (ya disponible); `PackageType` de `../data/packagesStore`.
- Produces: `/paquetes` filtra por categoría leyendo `?tipo=<argentina|circuitos|grupales|quinceaneras|cruceros>`; usado por los redirects (Task 3) y por el link "Ver todo el catálogo" de `CategoryShowcase` (Task 2).

- [ ] **Step 1: Agregar las opciones de tipo (constante a nivel módulo)**

En `src/pages/PaquetesPage.tsx`, justo después de la línea `const CATALOG_TYPES: PackageType[] = [...]`, agregar:

```ts
const TIPO_OPTIONS: { label: string; value: PackageType }[] = [
  { label: "Argentina", value: "argentina" },
  { label: "Circuitos", value: "circuitos" },
  { label: "Grupales", value: "grupales" },
  { label: "Quinceañeras", value: "quinceaneras" },
  { label: "Cruceros", value: "cruceros" },
];
const TIPO_VALUES = new Set<PackageType>(TIPO_OPTIONS.map((t) => t.value));
```

- [ ] **Step 2: Agregar el estado `tipo` (sincronizado con la URL al montar)**

En `PaquetesPage`, junto a los otros `useState` (después de `const [soloOfertas, setSoloOfertas] = useState(...)`), agregar:

```ts
  const [tipo, setTipo] = useState<PackageType | "">(() => {
    const t = params.get("tipo");
    return t && TIPO_VALUES.has(t as PackageType) ? (t as PackageType) : "";
  });
```

- [ ] **Step 3: Sincronizar `tipo` cuando cambia la query (redirects/navbar)**

En el `useEffect` existente que reacciona a `[params]`, agregar la línea de `tipo`. El efecto pasa a ser:

```ts
  useEffect(() => {
    setSoloOfertas(params.get("filtro") === "ofertas");
    setDestino(params.get("destino") || "");
    const t = params.get("tipo");
    setTipo(t && TIPO_VALUES.has(t as PackageType) ? (t as PackageType) : "");
  }, [params]);
```

- [ ] **Step 4: Aplicar el filtro de tipo en `results`**

Reemplazar el `const results = useMemo(...)` completo por (cambia el pool base y suma `byType`/`tipo` a las deps):

```ts
  const results = useMemo(() => {
    let r = (tipo ? byType[tipo] ?? [] : allCards).slice();
    if (soloOfertas) r = r.filter((p) => ofertasIds.has(p.id));
    if (destino) r = r.filter((p) => p.destination.toLowerCase().includes(destino.toLowerCase()));
    const pr = PRICE_RANGES.find((x) => x.label === priceRange);
    if (pr) r = r.filter((p) => pr.test(parsePrice(p.price)));
    const nr = NIGHT_RANGES.find((x) => x.label === nightRange);
    if (nr) r = r.filter((p) => nr.test(parseNights(p.duration)));
    if (orden === "precio-asc") r = r.slice().sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    else if (orden === "precio-desc") r = r.slice().sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return r;
  }, [allCards, byType, tipo, ofertasIds, soloOfertas, destino, priceRange, nightRange, orden]);
```

- [ ] **Step 5: Incluir `tipo` en `hasFilters`**

Reemplazar la línea `const hasFilters = ...` por:

```ts
  const hasFilters = soloOfertas || !!tipo || !!destino || !!priceRange || !!nightRange || orden !== "relevancia";
```

(`clearAll` no necesita cambios: hace `setParams({}, { replace: true })`, y el `useEffect` del Step 3 resetea `tipo` al limpiarse la query — igual que `destino`/`soloOfertas`.)

- [ ] **Step 6: Agregar el selector de categoría a la barra de filtros**

En el JSX, dentro del `<div className="flex flex-wrap items-center gap-3">`, inmediatamente DESPUÉS del `</button>` del chip "🔥 Ofertas" y ANTES del `<select aria-label="Destino" ...>`, insertar:

```tsx
              <select aria-label="Categoría" value={tipo} onChange={(e) => setTipo(e.target.value as PackageType | "")} className={fieldCls} style={fieldStyle}>
                <option value="">Todas las categorías</option>
                {TIPO_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
```

- [ ] **Step 7: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/pages/PaquetesPage.tsx
git commit -m "feat(paquetes): filtro por categoría (?tipo=) en /paquetes"
```

---

### Task 2: Componente `CategoryShowcase` + páginas `/grupales`, `/quinceañeras`, `/circuitos`

**Files:**
- Create: `src/components/catalog/CategoryShowcase.tsx`
- Modify: `src/App.tsx` (import + 3 rutas)

**Interfaces:**
- Consumes: `usePackages().byType` (en App.tsx ya está `const { byType } = usePackages();`); `?tipo=` de Task 1 (para el link del CTA).
- Produces: `CategoryShowcase` (componente de presentación) con la firma de props de abajo. Las rutas `/grupales`, `/quinceaneras`, `/circuitos` lo renderizan.

- [ ] **Step 1: Crear `CategoryShowcase.tsx`**

Crear `src/components/catalog/CategoryShowcase.tsx` con exactamente:

```tsx
import { Link } from "react-router-dom";
import type { TravelCard } from "../../types";
import type { PackageType } from "../../data/packagesStore";
import { Reveal } from "../ui/Reveal";
import { Icon } from "../ui/Icon";
import { PackageCard } from "../ui/PackageCard";
import { useLeadModal } from "../../context/LeadModalContext";

export type CategoryShowcaseProps = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  cards: TravelCard[];
  tipo: PackageType;
  ctaContext: string;
  darkMode: boolean;
};

export function CategoryShowcase({
  eyebrow,
  titleLead,
  titleAccent,
  intro,
  cards,
  tipo,
  ctaContext,
  darkMode,
}: CategoryShowcaseProps) {
  const { openLead } = useLeadModal();

  return (
    <main className="bg-base" style={{ minHeight: "100vh" }}>
      {/* Header editorial */}
      <section className="px-5 pb-12 pt-28 sm:px-8 md:pt-32">
        <div className="mx-auto max-w-[1340px]">
          <Link to="/" className="terra mb-6 inline-flex items-center gap-2 text-sm font-semibold">← Volver al inicio</Link>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9" style={{ background: "var(--terra)" }} />
              <span className="terra text-[0.7rem] font-semibold uppercase ls-wide">{eyebrow}</span>
            </div>
            <h1 className="font-display t1 leading-[1.02] text-balance" style={{ fontSize: "clamp(2.2rem,5.5vw,3.8rem)" }}>
              {titleLead}<br /><span className="terra italic">{titleAccent}</span>
            </h1>
            <p className="t-mut mt-6 max-w-[42rem] text-[1.02rem] leading-relaxed text-pretty">{intro}</p>
          </Reveal>
        </div>
      </section>

      {/* Grilla */}
      <section className="px-5 pb-16 sm:px-8 md:pb-20">
        <div className="mx-auto max-w-[1340px]">
          {cards.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {cards.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i * 0.05} className="h-full">
                  <PackageCard pkg={pkg} accent="red" darkMode={darkMode} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="t-mut py-20 text-center text-xl">Pronto vas a encontrar nuevas propuestas en esta categoría.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <Reveal className="mx-auto max-w-[1340px] text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => openLead({ context: ctaContext })}
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "var(--terra)", boxShadow: "0 16px 40px -16px rgba(217,78,63,.95)" }}
            >
              Consultá por este viaje
            </button>
            <Link
              to={`/paquetes?tipo=${tipo}`}
              className="terra group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
              style={{ border: "1px solid var(--line)" }}
            >
              Ver todo el catálogo
              <Icon name="arrowR" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Importar `CategoryShowcase` en `App.tsx`**

En `src/App.tsx`, después de la línea `import { PackageDetailPage } from "./pages/PackageDetailPage";`, agregar:

```tsx
import { CategoryShowcase } from "./components/catalog/CategoryShowcase";
```

- [ ] **Step 3: Reemplazar la ruta `/grupales`**

En `src/App.tsx`, reemplazar el `<Route path="/grupales" element={<PageLayout ... />} />` completo por:

```tsx
        <Route
          path="/grupales"
          element={
            <CategoryShowcase
              eyebrow="Viajes grupales"
              titleLead="Viajes en grupo,"
              titleAccent="coordinados de punta a punta."
              intro="Salidas acompañadas, delegaciones y contingentes con coordinación propia de Antares. Vos disfrutás del grupo; nosotros resolvemos traslados, hoteles y cada detalle en tiempo real."
              cards={byType.grupales}
              tipo="grupales"
              ctaContext="grupales"
              darkMode={darkMode}
            />
          }
        />
```

- [ ] **Step 4: Reemplazar la ruta `/quinceaneras`**

Reemplazar el `<Route path="/quinceaneras" element={<PageLayout ... />} />` completo por:

```tsx
        <Route
          path="/quinceaneras"
          element={
            <CategoryShowcase
              eyebrow="Quinceañeras"
              titleLead="El viaje de quince"
              titleAccent="que no se olvida."
              intro="Grupos de quinceañeras con acompañamiento de principio a fin: la emoción de viajar con amigas y la tranquilidad de que un equipo se ocupa de todo lo demás."
              cards={byType.quinceaneras}
              tipo="quinceaneras"
              ctaContext="quinceaneras"
              darkMode={darkMode}
            />
          }
        />
```

- [ ] **Step 5: Reemplazar la ruta `/circuitos`**

Reemplazar el `<Route path="/circuitos" element={<PageLayout ... />} />` completo por:

```tsx
        <Route
          path="/circuitos"
          element={
            <CategoryShowcase
              eyebrow="Circuitos internacionales"
              titleLead="Varios países,"
              titleAccent="una sola logística."
              intro="Recorridos guiados por los grandes destinos del mundo con cada traslado, hotel y excursión anticipados. Te movés liviano: la logística ya está pensada de punta a punta."
              cards={byType.circuitos}
              tipo="circuitos"
              ctaContext="circuitos"
              darkMode={darkMode}
            />
          }
        />
```

- [ ] **Step 6: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0. (`PageLayout` sigue importado y usado por `/argentina`, `/cruceros`, `/experiencias`, así que no hay import sin usar.)

- [ ] **Step 7: Commit**

```bash
git add src/components/catalog/CategoryShowcase.tsx src/App.tsx
git commit -m "feat(catalogo): CategoryShowcase editorial para /grupales, /quinceañeras y /circuitos"
```

---

### Task 3: Redirects (`/argentina`, `/cruceros`) + Navbar dropdown + texto del home

**Files:**
- Modify: `src/App.tsx` (2 rutas → redirects)
- Modify: `src/components/layout/Navbar.tsx` (array `SERVICIOS`)
- Modify: `src/components/home/ServicesEditorial.tsx` (1 línea de copy)

**Interfaces:**
- Consumes: `?tipo=` de Task 1 (los redirects apuntan ahí). `Navigate` ya está importado en `App.tsx`.
- Produces: estructura de navegación final de 3A.

- [ ] **Step 1: Convertir `/argentina` en redirect**

En `src/App.tsx`, reemplazar el `<Route path="/argentina" element={<PageLayout ... />} />` completo por:

```tsx
        <Route path="/argentina" element={<Navigate to="/paquetes?tipo=argentina" replace />} />
```

- [ ] **Step 2: Convertir `/cruceros` en redirect**

En `src/App.tsx`, reemplazar el `<Route path="/cruceros" element={<PageLayout ... />} />` completo por:

```tsx
        <Route path="/cruceros" element={<Navigate to="/paquetes?tipo=cruceros" replace />} />
```

- [ ] **Step 3: Agregar "Grupales" al dropdown del Navbar**

En `src/components/layout/Navbar.tsx`, reemplazar el array `const SERVICIOS = [...]` completo por:

```tsx
const SERVICIOS = [
  { label: "Argentina", to: "/argentina" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Cruceros", to: "/cruceros" },
  { label: "Grupales", to: "/grupales" },
  { label: "Quinceañeras", to: "/quinceaneras" },
];
```

- [ ] **Step 4: Actualizar el texto de Servicios en el home**

En `src/components/home/ServicesEditorial.tsx`, en el objeto del array `SERVICES` cuyo `key: "paquetes"`, reemplazar su campo `desc`:

De:
```ts
    desc: "Vuelos, hotelería y traslados resueltos en una sola conversación. Elegís el destino; nosotros armamos cada pieza alrededor de cómo querés viajar.",
```
A:
```ts
    desc: "Vuelos, cruceros, hoteles y traslados resueltos en una sola conversación. Elegís el destino; nosotros armamos cada pieza alrededor de cómo querés viajar.",
```

- [ ] **Step 5: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0. (`PageLayout` queda usado solo por `/experiencias` — sigue importado y usado, sin warning.)

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/layout/Navbar.tsx src/components/home/ServicesEditorial.tsx
git commit -m "feat(ruteo): redirects /argentina y /cruceros + Grupales en navbar + texto de Servicios"
```

---

## Cierre

- [ ] **Verificación final + revisión visual**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

Revisión visual manual (local, `npm run dev`, en ancho de celular y desktop):
- `/paquetes`: el selector "Categoría" filtra; llegar desde `/argentina` y `/cruceros` cae en `/paquetes` con la categoría aplicada; "Limpiar filtros" resetea también la categoría.
- `/grupales`, `/quinceaneras`, `/circuitos`: header editorial + grilla + CTA en estética nueva; categoría vacía muestra el mensaje; "Ver todo el catálogo" lleva a `/paquetes?tipo=`.
- Navbar: dropdown Servicios con las 5 entradas.
- Home: el item Paquetes arranca con "Vuelos, cruceros, hoteles y traslados…".
- Confirmar que ninguna página nueva agrega scroll horizontal en mobile.

## Notas de cobertura del spec (self-review)

- Feature 1 (filtro por tipo) → Task 1.
- Feature 2 (redirects) → Task 3 (Steps 1-2).
- Feature 3 (CategoryShowcase + 3 páginas) → Task 2.
- Feature 4 (navbar dropdown +Grupales) → Task 3 (Step 3).
- Feature 5 (texto Servicios home) → Task 3 (Step 4).
- `PageLayout` se conserva (usado por `/experiencias`) → ninguna tarea lo borra.
- Bug de overflow mobile → fuera de alcance (post Fase 4); las páginas nuevas no agregan desbordes.
