# Rediseño del Home — Antares Viajes (port del diseño editorial de Claude Design)

**Fecha:** 2026-06-15
**Estado:** Aprobado el enfoque; pendiente revisión del spec por el usuario.

---

## 1. Objetivo

Portar el diseño editorial generado en Claude Design (proyecto "Antares", archivo
`Antares Viajes.html` + módulos JSX) al sitio React 19 + Vite + TS + Tailwind v4
existente, **adaptándolo a la infraestructura ya construida** (paquetes dinámicos,
captura de leads, config, dark mode, SEO). El alcance es el **Home (landing)**.
Las páginas de catálogo se migran en una fase posterior.

## 2. Decisiones tomadas (cerradas con el usuario)

1. **Hero = video actual, sin porthole.** Se descarta el zoom de la ventana de avión
   (el único momento "pineado" del diseño). Se conserva el hero de video existente
   (`heroSlides`) y se le aplica la estética editorial nueva. Consecuencia: la página
   queda **sin scroll-jacking**, solo reveal-on-enter + parallax suave en Luxury.
2. **Click en destino → su catálogo.** Cada card de destino navega a su ruta
   (`popularDestinations[].to`), no abre el modal.
3. **Captura de leads = modal + form inline.** Los CTAs abren el `LeadModal` (popup,
   prefilled por contexto); se conserva el form inline detallado (`LeadQualifier`,
   restyleado) como sección propia; se **elimina** el bloque del slogan (`FooterShowcase`).
4. **Alcance = Home.** Las páginas `/argentina`, `/circuitos`, `/cruceros`,
   `/quinceaneras`, `/ofertas`, etc. quedan con el estilo actual (rojo/stone) por ahora.

## 3. Resumen del diseño de origen

- **Una sola página** con anclas: `#servicios`, `#destinos`, `#nosotros`, `#premium`, `#contacto`.
- **Dark-first** con toggle a un light crema, vía `[data-theme]` + CSS custom properties.
- **Paleta:** terracota `#D94E3F` (acento), dorado `#C6A461` (**confinado a Premium**),
  ink `#0E0C0B` (fondo dark), cream `#F4EDE2` (texto).
- **Tipografías:** Playfair Display (títulos serif) + Plus Jakarta Sans (cuerpo/UI).
- **Animación:** IntersectionObserver reveal (una vez), contadores, parallax decorativo,
  carrusel de testimonios con crossfade. Todo con `prefers-reduced-motion`. GSAP era solo
  para el porthole → **se elimina** (no quedan dependencias de GSAP).
- **Iconos:** set de stroke icons inline (sin emoji). Se portan a un `Icon` compartido.

## 4. Arquitectura

### 4.1 Componentes (Fase 1, bajo `src/components/home/`)

| Componente | Origen | Estado | Datos |
|---|---|---|---|
| Hero (en `HomePage.tsx`) | — (se mantiene el actual) | restyle | `heroSlides` + `captureLead` |
| `Navbar.tsx` | opener.jsx | modificar | dropdown Servicios → rutas |
| `ServicesEditorial.tsx` | services.jsx | nuevo | 3 filas; imágenes de `config` |
| `DestinationsStrip.tsx` | destinations.jsx | nuevo | `popularDestinations.slice(0,3)` |
| `WhyUs.tsx` | destinations.jsx | nuevo | stats + features (estático) |
| `LuxurySection.tsx` | premium.jsx | reescribir | fondo Atlantis + dorado + paquetes |
| `Testimonials.tsx` | social.jsx | nuevo | de DB (fallback hardcode) |
| `FooterCTA.tsx` + `Footer.tsx` | social.jsx | nuevo/adaptar | datos/enlaces reales |
| `LeadModal.tsx` (en `modals/`) | modal.jsx | nuevo | `captureLead` → WhatsApp |
| `LeadQualifier.tsx` | el inline actual | restyle | `captureLead` |
| `Icon.tsx` (en `ui/`) | utils.jsx | nuevo | — |

Se **elimina** `FooterShowcase` del Home. `TripFormModal` queda reemplazado por `LeadModal`
(se evalúa borrarlo si no lo usa ninguna otra ruta).

### 4.2 Estado y contexto de leads

- Se agrega un contexto liviano (o lifting de estado en `AppShell`/`HomePage`) que expone
  `openLead(prefill)` para que cualquier CTA abra el `LeadModal` con datos precargados
  (`{ destino, context }`).
- `LeadModal.onSubmit` → `captureLead({ source: context, name, contact, destination, message })`
  (fire-and-forget, `keepalive`) **y luego** muestra el estado "enviado" con botón
  "Continuar por WhatsApp" usando `wa(msg)`. Mantiene la atribución UTM existente.

### 4.3 Tema (bridge dark mode)

- `useDarkMode` además setea `document.documentElement.dataset.theme = darkMode ? "dark" : "light"`.
- Se agregan a `index.css` los bloques de CSS variables (`:root` = dark, `[data-theme="light"]`)
  y las utilidades theme-aware (`.bg-base`, `.t1`, `.t-soft`, `.t-mut`, `.t-faint`,
  `.card-base`, `.border-base`, `.font-serif`, `.reveal`, etc.) portadas del diseño.
- Los componentes nuevos del Home usan estas variables/clases. Las páginas existentes
  no las leen → no se ven afectadas.
- Fuentes: agregar Playfair Display + Plus Jakarta Sans (Google Fonts) y usarlas en el Home.

### 4.4 Ruteo

- Navbar "Servicios" pasa a **dropdown** (desktop: hover/click; mobile: acordeón) con:
  Argentina `/argentina`, Circuitos `/circuitos`, Cruceros `/cruceros`, Quinceañeras `/quinceaneras`.
- Anclas in-page del Home: Destinos `#destinos`, Nosotros `#nosotros`, Luxury `#premium`,
  Contacto `#contacto` (footer). Se quita "Notas".
- Las anclas requieren que el Home renderice esas secciones con esos `id`.

## 5. Spec por sección (con los cambios del usuario)

### 5.1 Navbar
- Wordmark **ANTARES** + "Viajes y Turismo" (texto, no imagen de logo).
- Links: Servicios (dropdown), Destinos, Nosotros, **Luxury** (antes "Premium"), Contacto.
- Se mantiene: toggle sol/luna y botón **Ofertas** (terra) → `openLead({context:'nav'})`.
- Se quita: "Notas".
- Barra transparente sobre el hero; sólida con blur al scrollear (`scrollY > 90`).

### 5.2 Hero (se mantiene el de video, restyle)
- Conserva: `<video>` de `heroSlides` (con poster + fallback reduced-motion), el form de
  búsqueda inline (destino/fecha/pasajeros) que dispara `captureLead({source:'hero_search'})`,
  y los trust badges.
- Restyle a editorial: título en Playfair, paleta terra, botón terra.
- **Verificar reproducción de video** (ver §8, riesgos): confirmar que existen los archivos
  en `public/videos/hero/` y que las rutas de `heroSlides` resuelven.
- No aplica quitar "Gualeguaychú/Diseñá tu viaje/Explorar" (eran del porthole, descartado).

### 5.3 Servicios — "Lo que hacemos"
- 3 filas alternadas imagen/copy: Paquetes (01), Grupales (02), Circuitos (03).
- Botón "Quiero ver paquetes" por fila → `openLead` o link a la categoría (a definir en plan;
  default: `openLead({destino, context:'service:*'})`).
- **Imágenes editables desde el panel** (Fase 2): hoy de `config`, fallback a Unsplash/local.

### 5.4 Destinos (reemplaza "Antares Favoritos")
- Strip horizontal con scroll nativo (snap), **3 cards** (`popularDestinations.slice(0,3)`).
- Cada card linkea a `destino.to`. Se extiende `popularDestinations` con `country` y
  `priceFrom` opcionales para reproducir la card del diseño (degrada si faltan).
- Card final "¿Tu destino no está acá?" → `openLead({context:'destino:otro'})`.

### 5.5 Por qué elegirnos (Nosotros)
- Contadores animados: +30 años, +5.000 viajeros, +80 destinos. + 3 features.
- Copy y números tal cual el diseño (editable luego si se quiere; estático en Fase 1).

### 5.6 Luxury (antes Premium / "Antares Privé")
- Eyebrow: **"Antares Luxury · Experiencias de autor"** (antes "Antares Privé · …").
- Quitar la frase **"por pedido, y a medida"** del párrafo de intro.
- **Fondo:** imagen del Atlantis The Royal (pileta infinita). Original pesado en
  `public/luxury/atlantis-royal.*`; se genera `atlantis-royal.webp` optimizado y se referencia.
- **Corregir el gap** entre las cards "Concierge dedicado" y "Diseñado a cuatro manos"
  (el `gap-px` con fondo dorado se ve mal en algún breakpoint → ajustar).
- 3 hallmarks + CTA band → `openLead({context:'premium'})`. Dorado **confinado** a esta sección.
- Cards de paquetes de lujo: `byType.experiencias.slice(0,3)` (linkean a `/paquete/:id`).

### 5.7 Opiniones / Testimonios
- Carrusel crossfade (se mantiene; es la animación que al usuario le gusta).
- **Editable manualmente desde el panel** (Fase 2), NO de Google. Tabla `testimonials`.
- Fallback a los 4 testimonios hardcodeados del diseño si la tabla está vacía.

### 5.8 Formulario (leads)
- Se conserva `LeadQualifier` (form inline detallado) restyleado a la paleta nueva,
  como sección antes del footer.
- Se **elimina** `FooterShowcase` (bloque del slogan + "Completar formulario").
- El `LeadModal` (popup) cubre los CTAs.

### 5.9 Footer
- Estilo del diseño (dark, columnas Explorar/Empresa/Contacto, redes).
- Adaptar a datos reales: WhatsApp de `config`/`SITE_CONFIG`, email, dirección, redes,
  enlaces a rutas existentes (incluye `/blog` "Notas de viaje" y `/legales`).
- CTA band "¿Listo para tu próximo viaje?" → `openLead({context:'footer-cta'})`.

## 6. Módulos de admin (Fase 2)

### 6.1 Imágenes de la sección Servicios
- 3 campos en `site_config`: `service_paquetes_img`, `service_grupales_img`, `service_circuitos_img`.
- Migración idempotente en `server/db.js`; columnas en `schema.sql`.
- `PUT /api/admin/config` acepta los 3 campos; `GET /api/data` los devuelve en `config`.
- UI: 3 `CloudinaryUploader` en `AdminConfig.tsx`.
- `SiteConfig` (en `packagesStore.tsx` y `adminApi.ts`) suma los 3 campos.

### 6.2 Opiniones (testimonios)
- Tabla `testimonials` (id, quote, name, city, active DEFAULT 1, display_order, created_at, updated_at).
- Admin CRUD: `GET/POST/PUT/DELETE /api/admin/testimonials` + toggle.
- Público: `GET /api/data` incluye `testimonials` activos (ordenados).
- UI: pestaña nueva "Opiniones" en `AdminPanel.tsx` (espejo de `AdminBlog`).
- `Testimonials.tsx` consume `usePackages().testimonials` con fallback hardcode.
- `packagesStore` expone `testimonials` (igual patrón que `blogPosts`).

## 7. Animación, performance y accesibilidad

- Sin GSAP. Reveal vía IntersectionObserver (`once`), contadores on-view, parallax suave
  con `transform` en Luxury (sin librería; puede ser scroll listener liviano o CSS).
- `prefers-reduced-motion`: todo cae a estado final instantáneo.
- Mobile-first: el strip de destinos es scroll horizontal nativo con snap; servicios en
  columna; targets ≥ 44px; probar a 375px.
- LCP: el hero ya usa poster + video diferido; no se agregan libs que bloqueen el paint.

## 8. Riesgos / ítems abiertos

- **Videos del hero:** verificar que existan `public/videos/hero/*.{webm,mp4,jpg}` y que
  reproduzcan; si faltan o pesan demasiado, definir reemplazo. (El usuario reportó que
  "no se reproducen".)
- **Imagen Atlantis:** la provee el usuario en `public/luxury/`; se optimiza a webp.
- **Split visual:** Home editorial vs catálogo rojo/stone hasta la Fase 3.
- **`popularDestinations`** necesita `country`/`priceFrom` para la card ideal (opcional).

## 9. Fuera de alcance (ahora)

- Migración visual de páginas de catálogo (Fase 3).
- Recuperar el porthole/scroll cinemático.
- Reviews automáticas de Google.

## 10. Verificación (al cerrar cada fase)

- `tsc` sin errores + `vite build` limpio (bundle del Home sin GSAP).
- Smoke test backend (Fase 2): login admin, alta/edición de testimonio, toggle, que
  aparezca en `/api/data`; subida de imagen de servicio reflejada en el Home.
- Revisión responsive a 375px y prueba de `prefers-reduced-motion`.
- Verificar reproducción del hero de video.

## 11. Fases

- **Fase 1 — Home visual (frontend):** §4, §5, §7. Imágenes de servicios y testimonios
  con defaults hardcodeados.
- **Fase 2 — Admin (backend + UI):** §6. El Home pasa a consumir DB/config.
- **Fase 3 — Catálogo (futuro):** migrar páginas internas a la estética nueva.
