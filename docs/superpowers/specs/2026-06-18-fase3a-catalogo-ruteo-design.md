# Spec 3A — Catálogo y ruteo en estética nueva

**Fecha:** 2026-06-18
**Rama:** (nueva) `feat/fase3a-catalogo`
**Estado:** Diseño aprobado por el usuario; pendiente revisión del spec escrito.

## Objetivo

Migrar el ruteo y las páginas de catálogo "estándar" a la estética nueva (terracota
`--terra` / dorado `--gold`, Playfair Display + Plus Jakarta Sans, secciones editoriales,
reveal-on-scroll), sin tocar todavía las páginas bespoke (luxury `/experiencias` y la nueva
`/disney`, que van en el Spec 3B). Reutiliza componentes y patrones que ya existen
(`PaquetesPage`, `PackageCard`, `Reveal`, tokens de `index.css`, `usePackages`).

## Contexto del estado actual

- Las 6 páginas de catálogo (`/argentina`, `/circuitos`, `/grupales`, `/quinceaneras`,
  `/experiencias`, `/cruceros`) usan hoy el componente viejo `src/components/layout/PageLayout.tsx`
  (estética stone/negro): header simple (título + subtítulo) + grilla de `PackageCard`.
- `src/pages/PaquetesPage.tsx` (estética nueva) filtra por **destino** (texto), **precio**,
  **noches** y **ofertas**, leyendo `?destino=` y `?filtro=ofertas` de la URL. **No** filtra por
  categoría/tipo. Agrega todos los `CATALOG_TYPES` (menos `experiencias`) en un solo pool.
- `byType` (de `usePackages()`) expone los paquetes agrupados por `PackageType`
  (`ofertas | featured | argentina | circuitos | grupales | quinceaneras | experiencias | cruceros`).

## Fuera de alcance

- `/experiencias` (luxury) y `/disney` → **Spec 3B**. `PageLayout` sigue en uso por
  `/experiencias` hasta que 3B lo migre; **no se borra `PageLayout` en 3A**.
- Página de detalle de paquete (`/paquete/:id`) → Fase 4.
- **Bug de overflow horizontal en mobile** (sitio se desliza a la izquierda; mail `.ar` cortado
  en el footer): el usuario pidió atacarlo **después de la Fase 4**. NO se incluye acá. Las
  páginas nuevas de 3A se construyen sin agregar desbordes (todo dentro del viewport).

## Requisito transversal

**Responsive de celular** en todo: header fluido (`clamp`), grilla 1 / 2 / 4 columnas, barra de
filtros que se apila en mobile. Ningún elemento debe exceder el ancho del viewport.

---

## Feature 1 — Filtro por tipo (categoría) en `/paquetes`

Agregar un selector de **categoría** a la barra de filtros de `PaquetesPage`, junto a
destino/precio/noches.

- **Opciones del selector:** "Todas las categorías" (valor `""`) · Argentina · Circuitos ·
  Grupales · Quinceañeras · Cruceros. (Se excluyen `ofertas`/`featured`: "Ofertas" ya es un chip;
  "featured" no es una categoría de cara al usuario.)
  - Mapa label→tipo: `{ Argentina: "argentina", Circuitos: "circuitos", Grupales: "grupales",
    "Quinceañeras": "quinceaneras", Cruceros: "cruceros" }`.
- **Estado y URL:** `const [tipo, setTipo] = useState<PackageType | "">(params.get("tipo") as ... || "")`.
  El `useEffect` que ya sincroniza `?destino`/`?filtro` también sincroniza `?tipo`.
- **Lógica de filtrado:** el pool base pasa a depender de `tipo`:
  - si `tipo` está seteado y es una categoría válida → `pool = byType[tipo] ?? []`
  - si no → `pool = allCards` (comportamiento actual).
  Luego se aplican encima los filtros existentes (ofertas, destino, precio, noches, orden). El
  conteo de resultados y el "Limpiar filtros" incluyen `tipo` (limpiar también resetea `tipo`).
- **Sin filtros / hasFilters:** `tipo !== ""` cuenta como filtro activo.

## Feature 2 — Redirects `/argentina` y `/cruceros`

En `src/App.tsx`, reemplazar las rutas que hoy renderizan `PageLayout` para estas dos por
redirects (preservan viejos links/bookmarks):

```tsx
<Route path="/argentina" element={<Navigate to="/paquetes?tipo=argentina" replace />} />
<Route path="/cruceros" element={<Navigate to="/paquetes?tipo=cruceros" replace />} />
```

(`Navigate` ya está importado en App.tsx.)

## Feature 3 — Páginas showcase: `/grupales`, `/quinceañeras`, `/circuitos`

Componente nuevo compartido **`src/components/catalog/CategoryShowcase.tsx`** (estética nueva),
que reemplaza a `PageLayout` para estas 3 rutas.

**Props:**
```ts
type CategoryShowcaseProps = {
  eyebrow: string;        // ej. "Viajes grupales"
  titleLead: string;      // parte normal del título
  titleAccent: string;    // parte en itálica/terra del título
  intro: string;          // copy editorial de la categoría
  cards: TravelCard[];
  tipo: PackageType;      // para el link "Ver todo el catálogo" → /paquetes?tipo=
  ctaContext: string;     // context para openLead()
};
```

**Estructura (mobile-first, reveal-on-scroll):**
- Header editorial: link "← Volver al inicio"; eyebrow (línea terra + texto uppercase ls-wide);
  `<h1>` Playfair con `titleLead` + `<span className="italic terra">titleAccent</span>`
  (`font-size: clamp(2.2rem,5.5vw,3.8rem)`); `intro` en `t-mut`.
- Grilla: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, cada `PackageCard accent="red"` envuelto en
  `<Reveal delay={i*0.05}>`. Si `cards.length === 0`: mensaje "Pronto vas a encontrar nuevas
  propuestas en esta categoría." (t-mut).
- CTA al pie: botón terra "Consultá por este viaje" → `openLead({ context: ctaContext })`
  (usa `useLeadModal`); link secundario "Ver todo el catálogo" → `/paquetes?tipo=${tipo}`.
- Contenedor `bg-base`, `max-w-[1340px]`, paddings con `clamp`; `min-height` para que el footer no
  suba en categorías vacías.

**Copy por categoría (editable por código; lo redacto en el plan):**
- **Grupales** — eyebrow "Viajes grupales"; título "Viajes en grupo, / coordinados de punta a
  punta." ; intro sobre salidas acompañadas, delegaciones y contingentes con coordinación propia.
- **Quinceañeras** — eyebrow "Quinceañeras"; título "El viaje de quince / que no se olvida." ;
  intro sobre grupos de quinceañeras con acompañamiento.
- **Circuitos** — eyebrow "Circuitos internacionales"; título "Varios países, / una sola
  logística." ; intro sobre recorridos guiados con traslados y hoteles anticipados.

**Rutas (App.tsx):** `/grupales`, `/quinceaneras`, `/circuitos` pasan a renderizar
`<CategoryShowcase ... cards={byType.<tipo>} />` en vez de `PageLayout`.

## Feature 4 — Navbar: dropdown Servicios

En `src/components/layout/Navbar.tsx`, el array `SERVICIOS` pasa de
`[Argentina, Circuitos, Cruceros, Quinceañeras]` a:

```ts
const SERVICIOS = [
  { label: "Argentina", to: "/argentina" },
  { label: "Circuitos", to: "/circuitos" },
  { label: "Cruceros", to: "/cruceros" },
  { label: "Grupales", to: "/grupales" },
  { label: "Quinceañeras", to: "/quinceaneras" },
];
```

(Argentina/Cruceros siguen apuntando a sus rutas, que ahora redirigen. "Disney" se agrega en 3B.)
El ancho del dropdown (`w-52`) y el overlay mobile ya iteran `SERVICIOS`, así que toman la nueva
entrada sin cambios extra.

## Feature 5 — Texto de Servicios en el home

En `src/components/home/ServicesEditorial.tsx`, en el item `paquetes` del array `SERVICES`,
cambiar el inicio de `desc` de "Vuelos, hotelería y traslados resueltos…" a comenzar con
**"Vuelos, cruceros, hoteles y traslados…"** (se mantiene el resto del sentido del párrafo).

---

## Data flow / arquitectura

No cambia el modelo de datos. Todo sale de `usePackages().byType` (estático + live de `/api/data`).
`CategoryShowcase` es un componente de presentación puro (recibe `cards` por props). El filtro de
tipo en `PaquetesPage` es estado de UI sincronizado con la query string.

Unidades nuevas/modificadas, cada una con una responsabilidad clara:
- `CategoryShowcase.tsx` (nuevo): presentación de una categoría (header editorial + grilla + CTA).
- `PaquetesPage.tsx` (mod): suma el eje de filtrado por tipo.
- `App.tsx` (mod): redirects + rutas showcase.
- `Navbar.tsx` (mod): una entrada más en el dropdown.
- `ServicesEditorial.tsx` (mod): una línea de copy.

## Testing / verificación

No hay framework de tests unitarios. Por tarea: `npx tsc --noEmit` + `npm run build` (ambos exit 0).
Revisión visual manual (local, en ancho de celular y desktop) de: `/paquetes` con el filtro de tipo
(incluida la llegada desde los redirects), las 3 showcase con y sin cards, el dropdown del navbar, y
el texto del home. Confirmar que ninguna página nueva agrega scroll horizontal.

## Orden de implementación sugerido

1. Filtro por tipo en `PaquetesPage` (Feature 1).
2. `CategoryShowcase.tsx` + cablear `/grupales` `/quinceaneras` `/circuitos` (Feature 3).
3. Redirects `/argentina` `/cruceros` (Feature 2).
4. Navbar dropdown (Feature 4).
5. Texto del home (Feature 5).
6. Verificación (tsc + build + revisión visual responsive).
