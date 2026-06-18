# Spec A — Persistencia (decisión), cierre de Admin de contenido + Branding

**Fecha:** 2026-06-18
**Rama:** `feat/admin-content`
**Estado:** Diseño aprobado por el usuario (incremental); pendiente revisión del spec escrito.

## Objetivo

Cerrar la gestión de contenido del panel admin que falta de la Fase 2 y hacer una
limpieza de Config + branding, todo sobre patrones que **ya existen** en el código
(`site_config` para valores únicos, tablas tipo `testimonials` para listas, `CloudinaryUploader`
para subir imágenes). No se introduce ninguna dependencia ni patrón nuevo.

## Contexto de persistencia (decisión tomada, NO se toca)

El backend corre en Render **plan free**, sin disco persistente, y `server/data.db` está
gitignored. En consecuencia, cada vez que el servicio se duerme por inactividad (~15 min) o
se redeploya, arranca con una base **vacía** y se pierde todo lo cargado a mano (legales,
opiniones, equipo, imágenes, leads). Los paquetes sobreviven solo porque se re-sincronizan del
mayorista en cada arranque (`SYNC_ON_STARTUP=true`).

**Decisión del usuario:** se deja así por ahora. Es un tema de suscripción del backend, no de
código; la empresa decidirá más adelante si paga Render (disco persistente) u otra opción. En
local la base persiste, así que el desarrollo y la prueba funcionan normalmente, y el día que
haya backend pago todo "pega" sin cambios de código.

**Implicancia directa:** el síntoma de "subo el PDF de condiciones legales y luego desaparece"
**no es un bug de código** (el `PUT /config` guarda `legal_pdf_url`/`legal_text` correctamente);
es la base efímera. **No hay fix de código para esto en este spec.**

## Fuera de alcance

- Persistencia / infraestructura del backend (decidido arriba).
- Textos de `/nosotros` (intro, los 2 párrafos de Historia, Misión/Visión/Valores): quedan
  hardcodeados. Si en el futuro se editan, será por código.
- Fase 3 (páginas internas: redirects, adaptación estética de /grupales /quinceañeras
  /circuitos /experiencias, nueva /disney, dropdown del navbar, texto de Servicios del home) →
  Spec B aparte.
- Fase 4 (página de detalle del paquete) → Spec C aparte.

## Requisito transversal

**Responsive de celular** en todo lo que tenga UI pública (imágenes de servicios, equipo de
Nosotros, logos del navbar/footer). El panel admin es de escritorio, pero no debe romperse en
pantallas chicas.

---

## Feature 1 — Imágenes de Servicios (Home) editables

Las 3 fotos de la sección "Servicios" del home hoy están hardcodeadas en
`src/components/home/ServicesEditorial.tsx` (URLs de Unsplash). Son valores únicos → van en
`site_config`.

**DB (`server/schema.sql` + `server/db.js`):**
- Agregar 3 columnas a `site_config`: `service_paquetes_img`, `service_grupales_img`,
  `service_circuitos_img` (TEXT).
- Sumarlas al `CREATE TABLE site_config` (bases nuevas) y como 3 `ALTER TABLE ... ADD COLUMN`
  en `runMigrations()` de `db.js` (bases existentes; idempotente, como ya se hace con `legal_*`).

**Backend (`server/routes/admin.js`):**
- Incluir las 3 columnas en el whitelist del `PUT /config` (hoy solo lista campos fijos).

**API pública:** ya viaja en `config` dentro de `/api/data` (`SELECT * FROM site_config`), no
hay que tocar `public.js`.

**Front:**
- `src/data/packagesStore.tsx`: agregar las 3 claves a `SiteConfig`.
- `src/components/admin/adminApi.ts`: agregar las 3 claves a `SiteConfig`.
- `src/components/admin/AdminConfig.tsx`: nueva sección "Imágenes de Servicios (Home)" con 3
  `CloudinaryUploader` (accept="image") que escriben en esas claves del estado `config` y se
  guardan con el `updateConfig` existente.
- `src/components/home/ServicesEditorial.tsx`: importar `usePackages`, leer `config` y para cada
  servicio usar `config.service_<key>_img ?? <URL Unsplash actual>` como `img`. Fallback = se ve
  igual que hoy si no se cargó nada.

## Feature 2 — Equipo de `/nosotros` (CRUD) + imagen de Historia

### 2.1 Equipo (tabla con filas — espejo de `testimonials`)

Lista variable de personas (no hay número fijo; el "4" actual son placeholders).

**DB (`server/schema.sql`):** tabla nueva `team_members`:
```sql
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
Se autocrea con `IF NOT EXISTS`; **sin migración** en `db.js`.

**Backend (`server/routes/admin.js`):** CRUD espejo de testimonials:
`GET/POST/PUT/DELETE /team` + `PUT /team/:id/toggle` (visible/oculto).
`POST` valida `id` y `name`.

**API pública (`server/routes/public.js`):** agregar `getActiveTeam()`
(`SELECT * FROM team_members WHERE active = 1 ORDER BY display_order ASC, created_at DESC`) al
`Promise.all` de `/data` y devolver `team` en la respuesta.

**Front:**
- `adminApi.ts`: tipo `TeamMember` ({id, name, role?, photo_url?, active?, display_order?}) +
  funciones get/create/update/delete/toggle (espejo de testimonials).
- `src/components/admin/AdminTeam.tsx` (nuevo): espejo de `AdminTestimonials`, con `CloudinaryUploader`
  para la foto. Campos: foto (`photo_url`), nombre (`name`), rol/especialidad (`role`), orden
  (`display_order`), visible/oculto. `newId()` = `"tm-" + random`.
- `src/components/AdminPanel.tsx`: nuevo tab `"equipo"` (label "Equipo"), ubicado tras
  "Opiniones". Render del componente.
- `src/data/packagesStore.tsx`: tipo `TeamMember` ({name, role, photo}), estado `team`
  (default `[]`), mapear de backend en el fetch de `/data` (`data.team`), exponer en el store.
- `src/pages/NosotrosPage.tsx`: consumir `usePackages().team`. Si hay miembros, renderizar la
  grilla con foto real + nombre + rol; si está vacío, **mantener los placeholders actuales** (la
  página nunca se ve rota antes de cargar fotos). Mantener responsive (grilla 2/3/4 columnas).

### 2.2 Imagen de "Nuestra historia" (valor único)

**DB:** columna `historia_img` (TEXT) en `site_config` (CREATE + ALTER en `db.js`).
**Backend:** sumar `historia_img` al whitelist de `PUT /config`.
**Front:**
- `SiteConfig` (packagesStore + adminApi): agregar `historia_img`.
- `AdminConfig.tsx`: 1 `CloudinaryUploader` para la imagen de Historia (puede ir junto a la
  sección de imágenes, o en su propio bloque "Nosotros").
- `NosotrosPage.tsx`: el `<Placeholder label="Foto de la agencia / equipo" />` de la sección
  Historia pasa a mostrar `config.historia_img` si existe; si no, mantiene el placeholder.

## Feature 3 — Limpieza de Config

En `src/components/admin/AdminConfig.tsx`:
- **Quitar** los campos editables **WhatsApp**, **Email de ventas** y **Slogan**. Esos valores
  quedan fijos: el sitio los lee de las constantes en `src/config/site.ts` (`SITE_CONFIG`) y/o
  del seed de `site_config`, que ya tienen los valores correctos. No se borran columnas de la DB
  (no hace falta), solo se sacan del formulario.
- **Logos por subida de imagen (no ruta):** reemplazar los inputs de texto
  `logo_header_path` y `logo_dark_path` por `CloudinaryUploader` (accept="image"), y **agregar**
  un tercer uploader para el **logo del footer**.

**DB:** agregar columna `logo_footer_path` (TEXT) a `site_config` (CREATE + ALTER en `db.js`).
**Backend:** sumar `logo_footer_path` al whitelist de `PUT /config`. (WhatsApp/email/slogan
pueden seguir en el `UPDATE` aunque ya no se editen; no molestan.)
**Front:** `SiteConfig` (packagesStore + adminApi) gana `logo_footer_path`.

## Feature 4 — Swap y tamaño de logos (Navbar ↔ Footer)

Decisión visual (verificada mirando los assets):
- **Navbar → isotipo** (círculo rojo sin texto). **Una sola imagen para modo claro y oscuro**
  (el círculo rojo se sostiene sobre cualquier fondo). Default = el asset isotipo que hoy usa el
  footer (`/branding/Logo-footer.webp`). **Agrandar** respecto del tamaño actual (`h-10 sm:h-12`
  → apuntar a ~`h-12 sm:h-14`, ajustando al ojo durante la implementación para que quede
  proporcionado).
- **Footer → logo completo con texto claro sobre fondo oscuro.** Default = el asset
  "Logo sobre negro" (hoy `/branding/Logo sobre negro.png`; copiarlo a una ruta sin espacios,
  p. ej. `/branding/logo-footer-full.png`, para usarlo limpio). Tamaño acorde a un lockup
  horizontal (~`h-12`/`h-14`, ajustando al ojo).

**Implementación:**
- `src/components/layout/Navbar.tsx`:
  - `logoSrc` deja de alternar por `onDark`: usa el isotipo (vía `config.logo_header_path ??`
    `config.logo_dark_path ??` `/branding/Logo-footer.webp`, default isotipo en ambos modos).
  - Subir el `className` del `<img>` del isologo (~`h-12 sm:h-14`).
  - El logo del overlay mobile (hoy `/branding/logo-dark.webp` hardcodeado, sobre fondo oscuro):
    usar también el isotipo.
- `src/components/layout/Footer.tsx`: el `<img>` pasa a usar
  `config.logo_footer_path ?? /branding/logo-footer-full.png` (logo completo claro). Requiere que
  el Footer consuma `usePackages().config` (hoy no lo hace).
- Defaults de `site_config` (seed en `schema.sql` y/o fallbacks en el front) coherentes con el
  swap: header/dark = isotipo, footer = logo completo oscuro.

Nota: como el navbar consume `config.logo_header_path`/`logo_dark_path` con fallback al isotipo,
y Config permite subir los 3 (header/dark/footer), el usuario conserva flexibilidad: si algún día
quiere un logo distinto por modo, lo sube; por defecto ambos muestran el isotipo.

## Feature 5 — Widget "Últimos leads" en el Dashboard

En `src/components/AdminPanel.tsx` (componente `AdminDashboard`), debajo de las tarjetas de
conteo, agregar una lista compacta **de solo lectura** con los **5 leads más nuevos**
(nombre, destino/origen, fecha) y un acceso que lleva a la pestaña **Leads**.

- **Sin cambios de backend:** reutiliza el `GET /leads` existente (`getLeads()` en `adminApi`),
  toma los primeros 5 (ya vienen ordenados por `created_at DESC`).
- La pestaña **Leads** sigue siendo el CRM completo (estado, notas, asignar). El widget no
  duplica gestión: solo muestra y deriva.

## Data flow (resumen)

```
Admin (Config/Equipo)  ──PUT/POST──>  Express (admin.js)  ──>  SQLite (site_config / team_members)
                                                                      │
Home / Nosotros / Navbar / Footer  <──GET /api/data──  public.js  <──┘
   (usePackages: config, team, ...)        (config + team activos)
```

Patrón idéntico al ya usado por opiniones, blog y paquetes: estático/fallback al instante, y si
el backend responde, se reemplaza con lo vivo.

## Testing / verificación

No hay framework de tests unitarios en el repo. Por tarea:
- `npx tsc --noEmit` y `npm run build` (frontend) deben pasar limpios.
- Backend: verificación determinista de la capa DB con un script node standalone (como se hizo
  con testimonios): crear `team_members`, insertar, togglear, borrar; y `PUT /config` con los
  campos nuevos persistiendo en una DB temporal (`DB_PATH`).
- Revisión visual manual (local) de: navbar/footer con logos swapeados y responsive, grilla de
  equipo con y sin datos, imágenes de servicios con y sin override, widget de leads.

## Orden de implementación sugerido

1. DB + migraciones (columnas de `site_config`, tabla `team_members`).
2. Backend (whitelist `PUT /config`, CRUD `/team`, `getActiveTeam` en `/data`).
3. adminApi (tipos + funciones).
4. Admin UI (AdminConfig limpieza + uploaders, AdminTeam + tab, widget de leads en Dashboard).
5. Store (`SiteConfig` ampliado, estado `team`).
6. Front público (ServicesEditorial, NosotrosPage, Navbar, Footer).
7. Branding: copiar asset del footer a ruta limpia, ajustar tamaños al ojo.
8. Verificación (tsc + build + script DB + revisión visual responsive).
