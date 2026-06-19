# Spec 4 — Detalle del paquete (/paquete/:id) en estética nueva, optimizado para conversión

**Fecha:** 2026-06-18
**Rama:** (nueva) `feat/fase4-detalle`
**Estado:** Diseño aprobado por el usuario; pendiente revisión del spec escrito.

## Objetivo

Reescribir `src/pages/PackageDetailPage.tsx` (hoy estética vieja stone/rojo, íconos emoji) en la
estética nueva, con **dos "skins"** (oscura/dorada para lujo, editorial clara para el resto) y
optimizada para **conversión** — es el punto donde el cliente convierte o abandona. La intel de UX
(ui-ux-pro-max) se incorpora: CTA siempre alcanzable, urgencia con el dato real, señales de
confianza junto al CTA, precio honesto, y calidad/a11y.

## Contexto del estado actual

- `PackageDetailPage` recibe `darkMode` + `whatsappLink` y arma un layout de 2 columnas (imagen +
  info / panel de precio sticky con botón WhatsApp directo). Usa clases stone/rojo y **emojis como
  íconos** (📍 🌙 ✈️). El CTA es WhatsApp directo.
- Datos disponibles (`TravelCard`): `id, title, destination, duration, price, image, badge?,
  departure?, people?, includes?[], highlights?[]`. **No hay descripción larga ni itinerario.**
- `usePackages()` expone `getById(id)` y `byType`. **Detección de lujo:** `isLux =
  byType.experiencias.some(p => p.id === id)`.
- `useLeadModal().openLead(prefill?)` con `LeadPrefill = { destino?: string; context?: string }`
  abre el modal de consulta (que ya captura el lead y ofrece continuar por WhatsApp).
- `wa(text?)` (App.tsx, pasado como `whatsappLink`) arma el link de WhatsApp con mensaje.
- El sitio tiene un FAB de WhatsApp fijo abajo-derecha (`z-50`).

## Fuera de alcance

- No se agregan campos nuevos al modelo de datos (se muestran los del `TravelCard`).
- Sin sección de "paquetes relacionados" (YAGNI v1).
- Sin ratings/reviews (no hay dato).
- Bug de overflow horizontal mobile → post Fase 4 (esta página no debe agregar desbordes nuevos).

## Requisitos transversales (a11y + calidad, de ui-ux-pro-max)

- **Responsive** (375/768/1024/1440); **sin scroll horizontal**.
- **Íconos con sobriedad, nada informal**: nada de emojis; usar `Icon` (SVG) **con moderación** —
  preferir etiquetas/tipografía editorial para la meta. Reservar íconos solo donde aportan claridad
  sin recargar: un **check sutil** en "Incluye" y el glyph en el botón de WhatsApp. No saturar.
- **Touch targets ≥ 44px**, `cursor-pointer`, **focus states** visibles en botones/links.
- **Contraste** 4.5:1 en texto (ambos skins).
- **Alt text** en la imagen (`pkg.title`); la imagen del hero carga normal (LCP, above-the-fold),
  no `loading="lazy"`.
- `prefers-reduced-motion` ya lo maneja `Reveal`.

---

## Feature — Rewrite de `PackageDetailPage` (dos skins + UX de conversión)

### Detección de skin
`const isLux = byType.experiencias.some(p => p.id === pkg.id);` Un mapa de tokens
(`const t = isLux ? LUX : LIGHT;`) define colores/clases; **un solo JSX** los aplica (no se duplica
el árbol). 
- **LIGHT** (editorial clara): tokens del sistema (`bg-base`, `card-base`, `t1`, `t-mut`, `terra`,
  `var(--terra)`, `var(--line)`) — se adapta solo al dark mode del sitio.
- **LUX** (oscura/dorada): fondo `#080706` (+ overlay sutil opcional), texto `#F4EDE2`/`rgba(...)`,
  acento dorado (`var(--gold)`/`var(--gold-soft)`, `gold-text`), bordes `rgba(198,164,97,.2)`.

### Estructura (mobile-first; above-the-fold = imagen + título + precio + CTA primario en desktop)
1. **"← Volver"** → `/paquetes` (link real, no rompe el back del navegador).
2. **Hero**: imagen grande (rounded, `aspect` responsivo); `badge` overlay (pill, acento del skin);
   eyebrow `destination` (uppercase ls-wide, acento); `<h1>` Playfair (`clamp`).
3. **Meta** (solo los campos presentes): `destination`, `duration`, `departure`, `people` como
   pares **label/valor editoriales** (label chico uppercase ls-wide + valor en Playfair/UI),
   **sin íconos** — separados por gap o finas divisorias. Look sobrio.
4. **Incluye** (`includes`): lista con un **check sutil** (Icon `check`, chico, acento tenue, stroke
   fino), legible (no chips rojos).
5. **Highlights** (si hay): recorrido en línea (ej. "París · Roma · Barcelona") o lista.
6. **Panel de precio + CTA** (en el grid; **sticky en desktop** `lg:sticky lg:top-28`; en mobile
   va in-flow):
   - **Urgencia**: si hay `departure`, mostrarlo como pill destacada arriba del precio (el dato ya
     trae escasez: "Últimos lugares", "Cupos limitados", fechas).
   - **Precio**: label "Precio por persona" + `price` grande/bold en acento; **nota honesta**:
     "Tarifa de referencia — confirmamos disponibilidad y precio final al consultar."
   - **CTA primario**: "Consultar este viaje" → `openLead({ destino: pkg.destination, context:
     'Paquete: ' + pkg.title })`. Botón grande, alto contraste (terra o gradiente dorado en lux).
   - **CTA secundario**: WhatsApp directo (outline/menor énfasis) →
     `whatsappLink('Hola! Me interesa el paquete "' + pkg.title + '". Quiero más detalles.')`.
   - **Trust strip**: micro-líneas de confianza: "+25 años en Gualeguaychú · Legajo EVT habilitado
     · Te acompañamos antes, durante y después".
7. **Barra de CTA fija en mobile** (`lg:hidden`, `fixed bottom-0`, `z-40`): `price` compacto +
   botón "Consultar" (mismo `openLead`). Deja espacio a la derecha para no chocar con el FAB de
   WhatsApp (`pr` suficiente); `z-index` por debajo del FAB (`z-50`). Asegura el CTA siempre visible
   en mobile (anti-abandono).

### Estado "no encontrado"
Rediseñado en estética clara: "Paquete no encontrado" (Playfair) + texto + link "Volver a paquetes".

### Wiring
- `App.tsx`: el render pasa de `<PackageDetailPage darkMode={darkMode} whatsappLink={wa} />` a
  `<PackageDetailPage whatsappLink={wa} />` (la página ya no necesita `darkMode`: el skin claro usa
  tokens, el lux es siempre oscuro). Quitar la prop `darkMode` de la firma del componente.
  (No se agregan íconos nuevos al set: la meta es sin íconos; "Incluye" usa el `check` existente.)

## Racional de conversión (de ui-ux-pro-max, volcado al diseño)

- **CTA siempre alcanzable** (panel sticky desktop + barra fija mobile) reduce el abandono — el
  paso final no debe requerir scroll para convertir.
- **Urgencia con dato real** (`departure`) en vez de inventar: escasez creíble junto al precio.
- **Señales de confianza junto al CTA** (años, legajo EVT, acompañamiento) bajan el riesgo percibido
  en el momento de decisión.
- **Precio honesto** ("tarifa de referencia") evita la fricción de "¿este es el precio final?".
- **Íconos sobrios (no emoji)**, contraste, focus, alt — calidad percibida = confianza.

## Data flow / arquitectura

Sin cambios de datos. La página lee `getById(id)` y `byType.experiencias` del store (estático al
instante + live). Es presentación pura con dos acciones (modal / WhatsApp). El mapa de tokens
mantiene un solo árbol JSX con estilos condicionales por skin.

Unidades:
- `PackageDetailPage.tsx` (reescrito): detalle con dos skins + UX de conversión.
- `App.tsx` (mod): quitar prop `darkMode` del render del detalle.

## Testing / verificación

No hay framework de tests unitarios. Por tarea: `npx tsc --noEmit` + `npm run build` (ambos exit 0).
Revisión visual manual (local, 375/768/1024/1440): un paquete **estándar** (skin claro) y una
**experiencia de lujo** (skin oscuro), incluyendo el estado "no encontrado"; verificar el panel
sticky en desktop, la barra fija en mobile (sin chocar con el FAB), los CTAs (modal prefilleado +
WhatsApp directo), y que no haya scroll horizontal.

## Orden de implementación sugerido

1. Reescribir `PackageDetailPage.tsx` (dos skins + estructura + CTAs + barra mobile + no-encontrado).
2. Ajustar el render en `App.tsx` (quitar `darkMode`).
3. Verificación (tsc + build + revisión visual responsive de ambos skins).
