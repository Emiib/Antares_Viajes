# Spec A — Admin de contenido + Branding · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar la gestión de contenido del panel admin (imágenes de Servicios, Equipo de Nosotros + imagen de Historia, widget de Leads) y hacer la limpieza de Config + el swap/resize de logos, todo sobre patrones que ya existen.

**Architecture:** SQLite + Express (`server/`) expone CRUD admin autenticado y `/api/data` público. El front (Vite/React/TS, Tailwind v4) consume `/api/data` vía `usePackages()` con fallback estático. Valores únicos → `site_config`; listas → tabla propia tipo `testimonials`; subida de imágenes → `CloudinaryUploader` (preset unsigned). No se introduce ninguna dependencia ni patrón nuevo.

**Tech Stack:** Express 4, sqlite3 (API callback), React 19 + TS 5.9 (strict, `noUnusedLocals`/`noUnusedParameters`), Tailwind CSS 4, Cloudinary (unsigned upload).

## Global Constraints

- **Sin tests unitarios en el repo.** Verificación por tarea: `npx tsc --noEmit` y/o `npm run build` (frontend), y `node server/verify-admin-fase2.js` (backend, DB temporal). Todos deben pasar limpios antes del commit.
- **TS strict:** prohibido dejar imports/params/locals sin usar (rompe `tsc`). Para params intencionalmente sin usar, prefijar con `_`.
- **Dark mode** se maneja con la clase `.antares-dark`; los componentes admin reciben `darkMode: boolean` y alternan clases stone-*.
- **Responsive de celular obligatorio** en todo lo público (imágenes de servicios, grilla de equipo, logos navbar/footer). El admin es de escritorio pero no debe romperse en mobile.
- **Persistencia:** Render free es efímero (decisión tomada: se deja así). No hay fix de "el PDF legal desaparece" — no es código.
- **Rama:** `feat/admin-content`. Commits frecuentes, uno por tarea.
- **Assets de logo (decisión de diseño, fija):** navbar = isotipo `/branding/Logo-footer.webp` (una sola imagen, ambos modos, agrandado); footer = logo completo claro sobre oscuro `/branding/logo-footer-full.png` (copia de "Logo sobre negro.png").

---

### Task 1: Capa DB — columnas de `site_config`, tabla `team_members`, harness de verificación

**Files:**
- Modify: `server/schema.sql`
- Modify: `server/db.js:41-49` (array de `runMigrations`)
- Modify: `.gitignore`
- Create: `server/verify-admin-fase2.js`

**Interfaces:**
- Produces: tabla `team_members(id TEXT PK, name TEXT NOT NULL, role TEXT, photo_url TEXT, active INTEGER, display_order INTEGER, created_at, updated_at)`; columnas nuevas en `site_config`: `logo_footer_path, service_paquetes_img, service_grupales_img, service_circuitos_img, historia_img` (todas TEXT). El script `server/verify-admin-fase2.js` queda como harness para las tareas backend siguientes.

- [ ] **Step 1: Agregar columnas nuevas al `CREATE TABLE site_config`**

En `server/schema.sql`, reemplazar el bloque `CREATE TABLE IF NOT EXISTS site_config (...)` por:

```sql
-- Site Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  whatsapp TEXT,
  sales_email TEXT,
  slogan TEXT,
  logo_header_path TEXT,
  logo_dark_path TEXT,
  logo_footer_path TEXT,
  legal_pdf_url TEXT,
  legal_text TEXT,
  service_paquetes_img TEXT,
  service_grupales_img TEXT,
  service_circuitos_img TEXT,
  historia_img TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Step 2: Agregar la tabla `team_members`**

En `server/schema.sql`, justo después del bloque `CREATE TABLE ... testimonials (...)` y antes de `-- Leads Table`, insertar:

```sql
-- Team Members Table (Equipo de /nosotros, editable desde el panel)
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

- [ ] **Step 3: Sacar las rutas de logo del seed**

En `server/schema.sql`, reemplazar el `INSERT OR IGNORE INTO site_config (...)` final por (sin `logo_header_path`/`logo_dark_path`, para que queden NULL y aplique el fallback del front):

```sql
-- Initialize default site config
INSERT OR IGNORE INTO site_config (whatsapp, sales_email, slogan) VALUES
  ('5493446528749', 'ventas@antaresviajes.com.ar', 'El mejor de los viajes es el próximo');
```

- [ ] **Step 4: Agregar las migraciones ALTER en `db.js`**

En `server/db.js`, dentro del array `statements` de `runMigrations()` (después de la línea `"ALTER TABLE site_config ADD COLUMN legal_text TEXT",`), agregar:

```js
    "ALTER TABLE site_config ADD COLUMN logo_footer_path TEXT",
    "ALTER TABLE site_config ADD COLUMN service_paquetes_img TEXT",
    "ALTER TABLE site_config ADD COLUMN service_grupales_img TEXT",
    "ALTER TABLE site_config ADD COLUMN service_circuitos_img TEXT",
    "ALTER TABLE site_config ADD COLUMN historia_img TEXT",
```

- [ ] **Step 5: Ignorar scripts/db temporales de verificación**

En `.gitignore`, agregar al final:

```
server/verify-*.js
server/*-tmp.db
```

(Esto también saca de `git status` el `server/verify-testimonials.js` que quedó untracked.)

- [ ] **Step 6: Crear el harness de verificación de backend**

Crear `server/verify-admin-fase2.js` con exactamente:

```js
// Verificación determinista de la capa DB del Spec A (sin HTTP/puertos).
const path = require('path');
const fs = require('fs');
process.env.DB_PATH = path.join(__dirname, 'verify-fase2-tmp.db');
try { fs.unlinkSync(process.env.DB_PATH); } catch {}

const { initDatabase, getDB, closeDatabase } = require('./db');
const run = (db, sql, p = []) => new Promise((res, rej) => db.run(sql, p, function (e) { e ? rej(e) : res(this); }));
const all = (db, sql, p = []) => new Promise((res, rej) => db.all(sql, p, (e, r) => (e ? rej(e) : res(r))));
const get = (db, sql, p = []) => new Promise((res, rej) => db.get(sql, p, (e, r) => (e ? rej(e) : res(r))));

(async () => {
  await initDatabase();
  const db = getDB();

  // 1) Columnas nuevas en site_config
  const cols = (await all(db, 'PRAGMA table_info(site_config)')).map((c) => c.name);
  const need = ['logo_footer_path', 'service_paquetes_img', 'service_grupales_img', 'service_circuitos_img', 'historia_img'];
  const missing = need.filter((c) => !cols.includes(c));
  console.log('site_config columnas faltantes (debe ser []):', JSON.stringify(missing));

  // 2) team_members + CRUD básico
  await run(db, 'INSERT INTO team_members (id, name, role, photo_url, active, display_order) VALUES (?,?,?,?,?,?)',
    ['tm1', 'Ana', 'Dueña', 'http://img/a.jpg', 1, 0]);
  let act = await all(db, 'SELECT * FROM team_members WHERE active = 1 ORDER BY display_order ASC, created_at DESC');
  console.log('equipo activos tras insert (1):', act.length, '->', act[0] && act[0].name, '/', act[0] && act[0].role);
  await run(db, 'UPDATE team_members SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE id = ?', ['tm1']);
  act = await all(db, 'SELECT * FROM team_members WHERE active = 1');
  console.log('equipo activos tras toggle (0):', act.length);
  await run(db, 'DELETE FROM team_members WHERE id = ?', ['tm1']);
  const total = await all(db, 'SELECT * FROM team_members');
  console.log('equipo total tras delete (0):', total.length);

  // 3) site_config round-trip con campos nuevos
  await run(db, 'UPDATE site_config SET service_paquetes_img = ?, historia_img = ?, logo_footer_path = ? WHERE id = 1',
    ['http://img/p.jpg', 'http://img/h.jpg', '/branding/logo-footer-full.png']);
  const cfg = await get(db, 'SELECT service_paquetes_img, historia_img, logo_footer_path FROM site_config WHERE id = 1');
  console.log('config round-trip:', cfg && cfg.service_paquetes_img, '/', cfg && cfg.historia_img, '/', cfg && cfg.logo_footer_path);

  await closeDatabase();
  try { fs.unlinkSync(process.env.DB_PATH); } catch {}
  const ok = missing.length === 0 && total.length === 0 && cfg && cfg.historia_img === 'http://img/h.jpg';
  console.log(ok ? 'OK ✔ schema + team + config verificados' : 'FALLO ✖');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error('FALLO:', e.message); process.exit(1); });
```

- [ ] **Step 7: Correr la verificación**

Run: `node server/verify-admin-fase2.js`
Expected (exit 0):
```
site_config columnas faltantes (debe ser []): []
equipo activos tras insert (1): 1 -> Ana / Dueña
equipo activos tras toggle (0): 0
equipo total tras delete (0): 0
config round-trip: http://img/p.jpg / http://img/h.jpg / /branding/logo-footer-full.png
OK ✔ schema + team + config verificados
```

- [ ] **Step 8: Commit**

```bash
git add server/schema.sql server/db.js .gitignore
git commit -m "feat(db): columnas de site_config (servicios/historia/logo footer) + tabla team_members"
```

---

### Task 2: Backend — whitelist de `PUT /config` con los campos nuevos

**Files:**
- Modify: `server/routes/admin.js:477-491` (handler `PUT /config`)

**Interfaces:**
- Consumes: columnas nuevas de `site_config` (Task 1).
- Produces: `PUT /api/admin/config` persiste `logo_footer_path`, `service_paquetes_img`, `service_grupales_img`, `service_circuitos_img`, `historia_img` además de los campos previos.

- [ ] **Step 1: Reemplazar el handler `PUT /config`**

En `server/routes/admin.js`, reemplazar el bloque `// Update config` / `router.put('/config', ...)` completo por:

```js
// Update config
router.put('/config', verifyAuth, (req, res) => {
  const db = getDB();
  const {
    whatsapp, sales_email, slogan,
    logo_header_path, logo_dark_path, logo_footer_path,
    legal_pdf_url, legal_text,
    service_paquetes_img, service_grupales_img, service_circuitos_img, historia_img,
  } = req.body;

  db.run(
    `UPDATE site_config SET whatsapp = ?, sales_email = ?, slogan = ?,
       logo_header_path = ?, logo_dark_path = ?, logo_footer_path = ?,
       legal_pdf_url = ?, legal_text = ?,
       service_paquetes_img = ?, service_grupales_img = ?, service_circuitos_img = ?, historia_img = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = 1`,
    [
      whatsapp, sales_email, slogan,
      logo_header_path, logo_dark_path, logo_footer_path ?? null,
      legal_pdf_url ?? null, legal_text ?? null,
      service_paquetes_img ?? null, service_grupales_img ?? null, service_circuitos_img ?? null, historia_img ?? null,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Config updated' });
    }
  );
});
```

- [ ] **Step 2: Chequeo de sintaxis**

Run: `node --check server/routes/admin.js`
Expected: sin salida, exit 0.

- [ ] **Step 3: Re-correr el harness de DB (round-trip de config sigue OK)**

Run: `node server/verify-admin-fase2.js`
Expected: termina en `OK ✔ ...` (exit 0).

- [ ] **Step 4: Commit**

```bash
git add server/routes/admin.js
git commit -m "feat(admin): PUT /config acepta logo footer, imágenes de servicios e imagen de historia"
```

---

### Task 3: Backend — CRUD de Equipo (`/team`) + `team` en `/api/data`

**Files:**
- Modify: `server/routes/admin.js` (insertar bloque tras las rutas de testimonios, ~línea 361, antes de `// ─── Leads`)
- Modify: `server/routes/public.js:10-27` (Promise.all + respuesta) y agregar `getActiveTeam()`

**Interfaces:**
- Consumes: tabla `team_members` (Task 1).
- Produces: `GET/POST/PUT/DELETE /api/admin/team` + `PUT /api/admin/team/:id/toggle`. `/api/data` devuelve `team` (array de filas activas ordenadas por `display_order ASC, created_at DESC`).

- [ ] **Step 1: Agregar las rutas CRUD de equipo en `admin.js`**

En `server/routes/admin.js`, después del bloque de testimonios (la ruta `router.put('/testimonials/:id/toggle', ...)`) y antes de `// ─── Leads (mini-CRM) ───`, insertar:

```js
// ─── Equipo (team members) ─────────────────────────────────────

router.get('/team', verifyAuth, (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM team_members ORDER BY display_order ASC, created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/team', verifyAuth, (req, res) => {
  const db = getDB();
  const { id, name, role, photo_url, active, display_order } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: 'Missing required fields (id, name)' });
  }
  db.run(
    `INSERT INTO team_members (id, name, role, photo_url, active, display_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, role ?? null, photo_url ?? null, active === 0 ? 0 : 1, Number(display_order) || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, message: 'Team member created' });
    }
  );
});

router.put('/team/:id', verifyAuth, (req, res) => {
  const db = getDB();
  const b = req.body;
  db.run(
    `UPDATE team_members SET name = ?, role = ?, photo_url = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [b.name, b.role ?? null, b.photo_url ?? null, Number(b.display_order) || 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Team member updated' });
    }
  );
});

router.delete('/team/:id', verifyAuth, (req, res) => {
  const db = getDB();
  db.run('DELETE FROM team_members WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Team member deleted' });
  });
});

router.put('/team/:id/toggle', verifyAuth, (req, res) => {
  const db = getDB();
  db.run(
    'UPDATE team_members SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Team member visibility toggled' });
    }
  );
});
```

- [ ] **Step 2: Agregar `getActiveTeam()` y exponer `team` en `/data` (`public.js`)**

En `server/routes/public.js`, en el `Promise.all` de `GET /data`, agregar `getActiveTeam()` y desestructurar/responder `team`:

```js
  Promise.all([
    getConfig(),
    getActivePackages(),
    getActiveHeroSlides(),
    getActiveBlogPosts(),
    getActiveTestimonials(),
    getActiveTeam()
  ]).then(([config, packages, heroSlides, blogPosts, testimonials, team]) => {
    res.json({
      config,
      packages,
      heroSlides,
      blogPosts,
      testimonials,
      team
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
```

Y agregar la función (junto a `getActiveTestimonials`, antes de `module.exports`):

```js
function getActiveTeam() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.all(
      'SELECT * FROM team_members WHERE active = 1 ORDER BY display_order ASC, created_at DESC',
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}
```

- [ ] **Step 3: Chequeo de sintaxis**

Run: `node --check server/routes/admin.js && node --check server/routes/public.js`
Expected: sin salida, exit 0.

- [ ] **Step 4: Re-correr el harness de DB**

Run: `node server/verify-admin-fase2.js`
Expected: `OK ✔ ...` (las operaciones DB de equipo que usan las rutas ya están cubiertas por el script).

- [ ] **Step 5: Commit**

```bash
git add server/routes/admin.js server/routes/public.js
git commit -m "feat(admin): CRUD de Equipo (/team) + team activos en /api/data"
```

---

### Task 4: Front API — tipos y funciones de `adminApi.ts`

**Files:**
- Modify: `src/components/admin/adminApi.ts:64-72` (type `SiteConfig`) y agregar tipo `TeamMember` + funciones de equipo.

**Interfaces:**
- Consumes: rutas `/team` y `PUT /config` (Tasks 2-3).
- Produces: `SiteConfig` ampliado; `type TeamMember = { id: string; name: string; role?: string; photo_url?: string; active?: number; display_order?: number }`; `getTeam, createTeamMember(m), updateTeamMember(id,m), deleteTeamMember(id), toggleTeamMember(id)`.

- [ ] **Step 1: Ampliar `SiteConfig`**

En `src/components/admin/adminApi.ts`, reemplazar el `export type SiteConfig = {...}` por:

```ts
export type SiteConfig = {
  whatsapp?: string;
  sales_email?: string;
  slogan?: string;
  logo_header_path?: string;
  logo_dark_path?: string;
  logo_footer_path?: string;
  legal_pdf_url?: string;
  legal_text?: string;
  service_paquetes_img?: string;
  service_grupales_img?: string;
  service_circuitos_img?: string;
  historia_img?: string;
};
```

- [ ] **Step 2: Agregar el tipo `TeamMember`**

En `src/components/admin/adminApi.ts`, después del `export type Testimonial = {...}`, agregar:

```ts
export type TeamMember = {
  id: string;
  name: string;
  role?: string;
  photo_url?: string;
  active?: number;
  display_order?: number;
};
```

- [ ] **Step 3: Agregar las funciones de equipo**

En `src/components/admin/adminApi.ts`, después del bloque `// ─── Opiniones (testimonios) ───`, agregar:

```ts
// ─── Equipo ───
export const getTeam = () => adminFetch<TeamMember[]>("/team");
export const createTeamMember = (m: TeamMember) =>
  adminFetch("/team", { method: "POST", body: JSON.stringify(m) });
export const updateTeamMember = (id: string, m: TeamMember) =>
  adminFetch(`/team/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(m) });
export const deleteTeamMember = (id: string) =>
  adminFetch(`/team/${encodeURIComponent(id)}`, { method: "DELETE" });
export const toggleTeamMember = (id: string) =>
  adminFetch(`/team/${encodeURIComponent(id)}/toggle`, { method: "PUT" });
```

- [ ] **Step 4: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores (exit 0). *(Aún no se usan estas exports; TS no marca exports sin usar, así que pasa.)*

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/adminApi.ts
git commit -m "feat(adminApi): SiteConfig ampliado + tipo y funciones de Equipo"
```

---

### Task 5: Store — `SiteConfig` ampliado + estado `team` en `packagesStore`

**Files:**
- Modify: `src/data/packagesStore.tsx` (type `SiteConfig`, tipo `TeamMember` + `toTeamMember`, estado/fetch/exposición).

**Interfaces:**
- Consumes: `team` y `config.*` de `/api/data` (Task 3).
- Produces: `usePackages()` devuelve `config` (con los campos nuevos) y `team: TeamMember[]` donde `type TeamMember = { name: string; role: string; photo: string }`. `team` default `[]`.

- [ ] **Step 1: Ampliar `SiteConfig` del store**

En `src/data/packagesStore.tsx`, reemplazar el `export type SiteConfig = {...}` por:

```ts
export type SiteConfig = {
  whatsapp?: string;
  sales_email?: string;
  slogan?: string;
  logo_header_path?: string;
  logo_dark_path?: string;
  logo_footer_path?: string;
  legal_pdf_url?: string;
  legal_text?: string;
  service_paquetes_img?: string;
  service_grupales_img?: string;
  service_circuitos_img?: string;
  historia_img?: string;
};
```

- [ ] **Step 2: Agregar tipo y mapper de equipo**

En `src/data/packagesStore.tsx`, después del bloque de `Testimonial` (tras `function toTestimonial(...) {...}`), agregar:

```tsx
export type TeamMember = { name: string; role: string; photo: string };

type BackendTeamMember = { id: string; name: string; role?: string; photo_url?: string };
function toTeamMember(m: BackendTeamMember): TeamMember {
  return { name: m.name, role: m.role ?? "", photo: m.photo_url ?? "" };
}
```

- [ ] **Step 3: Agregar `team` al tipo `Store`**

En `src/data/packagesStore.tsx`, en `type Store = {...}`, agregar la línea `team: TeamMember[];` (junto a `testimonials`):

```tsx
  testimonials: Testimonial[];
  team: TeamMember[];
  source: "static" | "live";
```

- [ ] **Step 4: Estado + fetch + exposición**

En `PackagesProvider`, agregar el estado (junto a `testimonials`):

```tsx
  const [team, setTeam] = useState<TeamMember[]>([]);
```

Dentro del `.then((data) => {...})`, después del bloque de `testimonials`, agregar:

```tsx
        if (Array.isArray(data?.team)) {
          setTeam(data.team.map(toTeamMember));
        }
```

En el `useMemo<Store>`, agregar `team` al objeto devuelto y a las deps:

```tsx
    return { byType, all, getById: (id) => map.get(id), config, blogPosts, testimonials, team, source };
  }, [byType, config, blogPosts, testimonials, team, source]);
```

- [ ] **Step 5: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0. *(`team` ya está expuesto; lo consumirán Tasks 9-11.)*

- [ ] **Step 6: Commit**

```bash
git add src/data/packagesStore.tsx
git commit -m "feat(store): config ampliado + estado team en packagesStore"
```

---

### Task 6: AdminConfig — sacar wsp/mail/slogan, logos por upload, imágenes de servicios e historia

**Files:**
- Modify: `src/components/admin/AdminConfig.tsx` (reescritura del formulario; se mantiene la sección Legales PDF tal cual).

**Interfaces:**
- Consumes: `SiteConfig` ampliado, `getConfig`, `updateConfig` (Task 4); `CloudinaryUploader`.
- Produces: panel Config que edita `logo_header_path`, `logo_dark_path`, `logo_footer_path`, `service_*_img`, `historia_img` con uploaders, sin campos de WhatsApp/email/slogan.

- [ ] **Step 1: Reescribir `AdminConfig.tsx`**

Reemplazar el archivo `src/components/admin/AdminConfig.tsx` completo por:

```tsx
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { getConfig, updateConfig } from "./adminApi";
import type { SiteConfig } from "./adminApi";
import { CloudinaryUploader } from "./CloudinaryUploader";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { extractPdfText } from "../../lib/pdfText";

const LOGO_FIELDS: { key: keyof SiteConfig; label: string; hint: string }[] = [
  { key: "logo_header_path", label: "Logo navbar (isotipo)", hint: "Se usa en la barra superior, en claro y oscuro." },
  { key: "logo_dark_path", label: "Logo navbar — variante oscura (opcional)", hint: "Solo si querés un logo distinto sobre fondo oscuro. Si lo dejás vacío, usa el isotipo." },
  { key: "logo_footer_path", label: "Logo footer (completo)", hint: "Logo con texto, claro, para el pie sobre fondo oscuro." },
];

const SERVICE_IMG_FIELDS: { key: keyof SiteConfig; label: string }[] = [
  { key: "service_paquetes_img", label: "Paquetes Turísticos" },
  { key: "service_grupales_img", label: "Viajes Grupales" },
  { key: "service_circuitos_img", label: "Circuitos Internacionales" },
];

export function AdminConfig({ darkMode }: { darkMode: boolean }) {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Legales (PDF → texto)
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfBusy, setPdfBusy] = useState("");
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    getConfig()
      .then((c) => setConfig(c || {}))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const setField = (key: keyof SiteConfig, val: string) => {
    setSaved(false);
    setConfig((c) => ({ ...c, [key]: val }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updateConfig(config);
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Sube el PDF a Cloudinary y, en paralelo, extrae su texto para mostrarlo
  // como artículo. El texto queda editable antes de guardar.
  const handleLegalPdf = async (file?: File) => {
    if (!file) return;
    setPdfError("");
    setSaved(false);
    try {
      setPdfBusy("Extrayendo texto…");
      const [text, upload] = await Promise.all([
        extractPdfText(file),
        (async () => {
          setPdfBusy("Subiendo PDF…");
          return uploadToCloudinary(file);
        })(),
      ]);
      setConfig((c) => ({ ...c, legal_text: text, legal_pdf_url: upload.url }));
      setPdfBusy("");
    } catch (e) {
      setPdfError((e as Error).message);
      setPdfBusy("");
    } finally {
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    }
  };

  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none ${
    darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
  }`;
  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const labelCls = `block text-xs font-semibold mb-1 ${mutedCls}`;
  const btnSecondary = `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer disabled:opacity-60 ${
    darkMode ? "bg-stone-700 text-white hover:bg-stone-600" : "bg-stone-200 text-stone-800 hover:bg-stone-300"
  }`;

  if (loading) return <p className={mutedCls}>Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <h2 className={`text-2xl font-black mb-6 ${textCls}`}>Configuración del sitio</h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-lg bg-green-600/10 px-4 py-2 text-sm font-semibold text-green-600">
          ✓ Cambios guardados.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* ─── Logos ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-3 ${textCls}`}>Logos</h3>
          <div className="space-y-4">
            {LOGO_FIELDS.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <CloudinaryUploader
                  value={config[f.key]}
                  onUploaded={(url) => setField(f.key, url)}
                  accept="image"
                  darkMode={darkMode}
                  label="Subir imagen"
                />
                <p className={`mt-1 text-[11px] ${mutedCls}`}>{f.hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Imágenes de Servicios (Home) ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-1 ${textCls}`}>Imágenes de Servicios (Home)</h3>
          <p className={`mb-3 text-xs ${mutedCls}`}>Las 3 fotos de la sección "Servicios" del inicio. Si dejás alguna vacía, se usa la imagen por defecto.</p>
          <div className="space-y-4">
            {SERVICE_IMG_FIELDS.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <CloudinaryUploader
                  value={config[f.key]}
                  onUploaded={(url) => setField(f.key, url)}
                  accept="image"
                  darkMode={darkMode}
                  label="Subir imagen"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─── Nosotros ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-1 ${textCls}`}>Nosotros</h3>
          <p className={`mb-3 text-xs ${mutedCls}`}>Imagen de la sección "Nuestra historia" en /nosotros.</p>
          <label className={labelCls}>Imagen de "Nuestra historia"</label>
          <CloudinaryUploader
            value={config.historia_img}
            onUploaded={(url) => setField("historia_img", url)}
            accept="image"
            darkMode={darkMode}
            label="Subir imagen"
          />
        </div>

        {/* ─── Legales: Condiciones Generales de Contratación ─── */}
        <div className={`rounded-xl border p-4 ${cardCls}`}>
          <h3 className={`text-base font-bold mb-1 ${textCls}`}>Condiciones de contratación (Legales)</h3>
          <p className={`mb-3 text-xs ${mutedCls}`}>
            Subí el PDF de las condiciones. Se extrae el texto y se publica como artículo legible en{" "}
            <strong>/legales</strong>; el PDF queda también disponible para descargar. Podés editar el texto
            antes de guardar.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={btnSecondary} disabled={!!pdfBusy} onClick={() => pdfInputRef.current?.click()}>
              {pdfBusy || "Subir PDF de condiciones"}
            </button>
            {config.legal_pdf_url && (
              <a href={config.legal_pdf_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-red-600 hover:underline">
                Ver PDF actual
              </a>
            )}
          </div>
          <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleLegalPdf(e.target.files?.[0])} />
          {pdfError && <p className="mt-2 text-xs font-semibold text-red-600">{pdfError}</p>}

          <label className={`block text-xs font-semibold mt-4 mb-1 ${mutedCls}`}>Texto publicado (editable)</label>
          <textarea
            className={inputCls}
            rows={12}
            value={config.legal_text || ""}
            placeholder="El texto extraído del PDF aparecerá acá. También podés pegarlo o editarlo a mano."
            onChange={(e) => {
              setSaved(false);
              setConfig({ ...config, legal_text: e.target.value });
            }}
          />
          {config.legal_text && (
            <p className={`mt-1 text-[11px] ${mutedCls}`}>
              {config.legal_text.length.toLocaleString()} caracteres · separá párrafos con una línea en blanco.
            </p>
          )}
        </div>

        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60">
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminConfig.tsx
git commit -m "feat(admin): Config sin wsp/mail/slogan, logos e imágenes por upload"
```

---

### Task 7: AdminTeam — componente CRUD + pestaña en el panel

**Files:**
- Create: `src/components/admin/AdminTeam.tsx`
- Modify: `src/components/AdminPanel.tsx` (import, `Tab`, `TABS`, render)

**Interfaces:**
- Consumes: funciones de equipo de `adminApi` (Task 4); `CloudinaryUploader`.
- Produces: pestaña "Equipo" en el panel.

- [ ] **Step 1: Crear `AdminTeam.tsx`**

Crear `src/components/admin/AdminTeam.tsx` con:

```tsx
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMember,
} from "./adminApi";
import type { TeamMember } from "./adminApi";
import { CloudinaryUploader } from "./CloudinaryUploader";

const newId = () => "tm-" + Math.random().toString(36).slice(2, 8);

type Draft = { isNew: boolean; id: string; name: string; role: string; photo_url: string; display_order: string };

function emptyDraft(): Draft {
  return { isNew: true, id: newId(), name: "", role: "", photo_url: "", display_order: "0" };
}
function toDraft(m: TeamMember): Draft {
  return { isNew: false, id: m.id, name: m.name, role: m.role || "", photo_url: m.photo_url || "", display_order: String(m.display_order ?? 0) };
}
function draftToPayload(d: Draft): TeamMember {
  return {
    id: d.id.trim(),
    name: d.name.trim(),
    role: d.role.trim() || undefined,
    photo_url: d.photo_url.trim() || undefined,
    display_order: Number(d.display_order) || 0,
  };
}

export function AdminTeam({ darkMode }: { darkMode: boolean }) {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getTeam());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter((m) => `${m.name} ${m.role ?? ""}`.toLowerCase().includes(n));
  }, [items, q]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = draftToPayload(draft);
      if (!payload.id || !payload.name) throw new Error("El nombre es obligatorio.");
      if (draft.isNew) await createTeamMember(payload);
      else await updateTeamMember(draft.id, payload);
      setDraft(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Borrar este integrante del equipo?")) return;
    try {
      await deleteTeamMember(id);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleToggle = async (m: TeamMember) => {
    setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, active: m.active ? 0 : 1 } : x)));
    try {
      await toggleTeamMember(m.id);
    } catch (e) {
      setError((e as Error).message);
      load();
    }
  };

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none ${darkMode ? "bg-stone-800 border-stone-700 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`;
  const labelCls = `block text-xs font-semibold mb-1 ${darkMode ? "text-stone-400" : "text-stone-600"}`;
  const textCls = darkMode ? "text-white" : "text-stone-900";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-black ${textCls}`}>Equipo</h2>
        <button onClick={() => setDraft(emptyDraft())} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer">
          + Nuevo integrante
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600/40 px-4 py-2 text-sm font-semibold text-red-600">{error}</div>
      )}

      {draft && (
        <form onSubmit={handleSave} className={`mb-6 rounded-xl border p-5 ${cardCls}`}>
          <h3 className={`text-lg font-bold mb-3 ${textCls}`}>{draft.isNew ? "Nuevo integrante" : "Editar integrante"}</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={labelCls}>Foto</label>
              <CloudinaryUploader
                value={draft.photo_url}
                onUploaded={(url) => setDraft({ ...draft, photo_url: url })}
                accept="image"
                darkMode={darkMode}
                label="Subir foto"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre *</label>
                <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="María Pérez" />
              </div>
              <div>
                <label className={labelCls}>Rol / especialidad</label>
                <input className={inputCls} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="Dueña · Cruceros" />
              </div>
            </div>
            <div className="w-40">
              <label className={labelCls}>Orden (menor = primero)</label>
              <input type="number" className={inputCls} value={draft.display_order} onChange={(e) => setDraft({ ...draft, display_order: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 cursor-pointer">
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={() => setDraft(null)} className={`px-4 py-2 rounded-lg font-semibold cursor-pointer ${darkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-600 hover:bg-stone-100"}`}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input className={inputCls} placeholder="Buscar por nombre o rol..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <p className={mutedCls}>Cargando...</p>
      ) : items.length === 0 ? (
        <p className={mutedCls}>Todavía no cargaste integrantes. Mientras tanto, /nosotros muestra fotos de ejemplo.</p>
      ) : (
        <div className={`overflow-x-auto rounded-xl border ${cardCls}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left ${mutedCls} border-b ${darkMode ? "border-stone-800" : "border-stone-200"}`}>
                <th className="px-4 py-3 font-semibold">Foto</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className={`border-b last:border-0 ${darkMode ? "border-stone-800" : "border-stone-100"}`}>
                  <td className="px-4 py-3">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="h-10 w-10 rounded-full object-cover border border-stone-300" />
                    ) : (
                      <span className={mutedCls}>—</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${textCls}`}>{m.name}</td>
                  <td className={`px-4 py-3 ${mutedCls}`}>{m.role || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(m)} className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer ${m.active ? "bg-green-600/15 text-green-600" : "bg-stone-500/15 text-stone-500"}`} title="Mostrar / ocultar en el sitio">
                      {m.active ? "Visible" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => setDraft(toDraft(m))} className="text-xs font-semibold text-red-600 hover:underline mr-3 cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(m.id)} className={`text-xs font-semibold hover:underline cursor-pointer ${mutedCls}`}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Registrar la pestaña en `AdminPanel.tsx`**

En `src/components/AdminPanel.tsx`:

1. Agregar el import tras `import { AdminTestimonials } ...`:
```tsx
import { AdminTeam } from "./admin/AdminTeam";
```
2. Agregar `"equipo"` al type `Tab`:
```tsx
type Tab = "dashboard" | "packages" | "blog" | "opiniones" | "equipo" | "leads" | "mayoristas" | "config";
```
3. Agregar la entrada a `TABS` (tras la de `opiniones`):
```tsx
  { id: "equipo", label: "Equipo" },
```
4. Agregar el render (tras la línea de `opiniones`):
```tsx
        {activeTab === "equipo" && <AdminTeam darkMode={darkMode} />}
```

- [ ] **Step 3: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminTeam.tsx src/components/AdminPanel.tsx
git commit -m "feat(admin): pestaña Equipo (CRUD con foto)"
```

---

### Task 8: Dashboard — widget "Últimos leads"

**Files:**
- Modify: `src/components/AdminPanel.tsx` (componente `AdminDashboard` + paso de prop desde `AdminPanel`)

**Interfaces:**
- Consumes: `getLeads()` y `type Lead` de `adminApi` (ya existen).
- Produces: lista de solo lectura con los 5 leads más nuevos en el Dashboard, con botón que cambia a la pestaña Leads.

- [ ] **Step 1: Pasar `onSeeAllLeads` al Dashboard**

En `src/components/AdminPanel.tsx`, en el render del dashboard, reemplazar:
```tsx
        {activeTab === "dashboard" && <AdminDashboard darkMode={darkMode} />}
```
por:
```tsx
        {activeTab === "dashboard" && <AdminDashboard darkMode={darkMode} onSeeAllLeads={() => setActiveTab("leads")} />}
```

- [ ] **Step 2: Importar `getLeads`/`Lead` en `AdminPanel.tsx`**

Reemplazar el import existente `import { adminFetch } from "./admin/adminApi";` por:
```tsx
import { adminFetch, getLeads } from "./admin/adminApi";
import type { Lead } from "./admin/adminApi";
```

- [ ] **Step 3: Extender `AdminDashboard` con el widget**

En `src/components/AdminPanel.tsx`, reemplazar la firma y el cuerpo del componente `AdminDashboard` por (mantiene las tarjetas y agrega la lista; nota: `lastUpdated` no se toca):

```tsx
function AdminDashboard({ darkMode, onSeeAllLeads }: { darkMode: boolean; onSeeAllLeads: () => void }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    let active = true;
    const fetchData = () => {
      adminFetch<Dashboard>("/dashboard")
        .then((d) => active && setData(d))
        .catch((e) => active && setError((e as Error).message));
      getLeads()
        .then((ls) => active && setRecentLeads(ls.slice(0, 5)))
        .catch(() => {});
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const cardCls = darkMode ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200";
  const mutedCls = darkMode ? "text-stone-400" : "text-stone-600";
  const textCls = darkMode ? "text-white" : "text-stone-900";

  return (
    <div>
      <h2 className={`text-2xl font-black mb-6 ${textCls}`}>Dashboard</h2>
      {error && <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>}
      <div className="grid grid-cols-2 gap-4 max-w-2xl lg:grid-cols-3">
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Leads sin contestar</div>
          <div className={`text-4xl font-black ${data?.newLeads ? "text-red-600" : textCls}`}>
            {data?.newLeads ?? "—"}
          </div>
        </div>
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Paquetes activos</div>
          <div className="text-4xl font-black text-red-600">{data?.activePackages ?? "—"}</div>
        </div>
        <div className={`rounded-lg border p-6 ${cardCls}`}>
          <div className={`text-sm font-semibold mb-2 ${mutedCls}`}>Hero slides activos</div>
          <div className="text-4xl font-black text-red-600">{data?.activeSlides ?? "—"}</div>
        </div>
      </div>

      <div className={`mt-8 rounded-xl border ${cardCls} max-w-3xl`}>
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className={`text-base font-bold ${textCls}`}>Últimos leads</h3>
          <button onClick={onSeeAllLeads} className="text-xs font-semibold text-red-600 hover:underline cursor-pointer">
            Ver todos
          </button>
        </div>
        {recentLeads.length === 0 ? (
          <p className={`px-5 pb-5 text-sm ${mutedCls}`}>Todavía no hay consultas.</p>
        ) : (
          <ul className={`divide-y ${darkMode ? "divide-stone-800" : "divide-stone-100"}`}>
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div className="min-w-0">
                  <span className={`font-semibold ${textCls}`}>{l.name || "Sin nombre"}</span>
                  {l.destination ? <span className={mutedCls}> · {l.destination}</span> : null}
                </div>
                <span className={`shrink-0 text-xs ${mutedCls}`}>
                  {l.created_at ? new Date(l.created_at).toLocaleDateString() : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className={`mt-6 text-sm ${mutedCls}`}>
        Última actualización: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : "—"}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/AdminPanel.tsx
git commit -m "feat(admin): widget Últimos leads en el Dashboard"
```

---

### Task 9: Home — `ServicesEditorial` consume las imágenes editables

**Files:**
- Modify: `src/components/home/ServicesEditorial.tsx`

**Interfaces:**
- Consumes: `usePackages().config.service_*_img` (Task 5).
- Produces: cada fila de servicio usa la imagen de Config si existe; si no, la URL de Unsplash actual.

- [ ] **Step 1: Pasar la imagen resuelta a `ServiceRow`**

En `src/components/home/ServicesEditorial.tsx`:

1. Agregar el import (tras los imports existentes):
```tsx
import { usePackages } from "../../data/packagesStore";
```
2. Cambiar la firma de `ServiceRow` para aceptar `img` y usarla en el `<img>`:
```tsx
function ServiceRow({ s, i, img }: { s: Service; i: number; img: string }) {
```
y en el `<img ... src={s.img} ...>` reemplazar `src={s.img}` por `src={img}`.
3. En `ServicesEditorial`, antes del `return`, leer config y resolver:
```tsx
  const { config } = usePackages();
  const imgFor = (s: Service): string => {
    const override =
      s.key === "paquetes" ? config.service_paquetes_img
      : s.key === "grupales" ? config.service_grupales_img
      : s.key === "circuitos" ? config.service_circuitos_img
      : undefined;
    return override || s.img;
  };
```
4. En el `.map`, pasar la prop:
```tsx
          {SERVICES.map((s, i) => <ServiceRow key={s.key} s={s} i={i} img={imgFor(s)} />)}
```

- [ ] **Step 2: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ServicesEditorial.tsx
git commit -m "feat(home): imágenes de Servicios editables desde Config"
```

---

### Task 10: `/nosotros` — consume Equipo e imagen de Historia

**Files:**
- Modify: `src/pages/NosotrosPage.tsx`

**Interfaces:**
- Consumes: `usePackages().team` y `usePackages().config.historia_img` (Task 5).
- Produces: grilla del equipo con datos reales (fallback a placeholders si vacío); imagen de Historia real si está cargada.

- [ ] **Step 1: Leer store en `NosotrosPage`**

En `src/pages/NosotrosPage.tsx`:

1. Agregar el import:
```tsx
import { usePackages } from "../data/packagesStore";
```
2. Dentro de `NosotrosPage`, junto a `const { openLead } = useLeadModal();`, agregar:
```tsx
  const { team, config } = usePackages();
```

- [ ] **Step 2: Imagen de Historia con fallback**

En la sección Historia, reemplazar:
```tsx
          <Reveal variant="left"><Placeholder label="Foto de la agencia / equipo" /></Reveal>
```
por:
```tsx
          <Reveal variant="left">
            {config.historia_img ? (
              <img src={config.historia_img} alt="Equipo de Antares Viajes"
                className="w-full rounded-2xl object-cover" style={{ aspectRatio: "4 / 3" }} />
            ) : (
              <Placeholder label="Foto de la agencia / equipo" />
            )}
          </Reveal>
```

- [ ] **Step 3: Grilla del equipo con fallback**

En la sección Equipo, reemplazar el bloque del `<div className="grid grid-cols-2 ...">...</div>` (la grilla de placeholders `[1,2,3,4].map(...)`) por:
```tsx
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {team.length > 0
              ? team.map((m, i) => (
                  <Reveal key={`${m.name}-${i}`} delay={i * 0.05}>
                    {m.photo ? (
                      <img src={m.photo} alt={m.name}
                        className="w-full rounded-2xl object-cover" style={{ aspectRatio: "3 / 4" }} />
                    ) : (
                      <Placeholder label="Foto" ratio="3 / 4" />
                    )}
                    <p className="font-display t1 mt-3 text-[1.05rem]">{m.name}</p>
                    {m.role ? <p className="t-faint text-[0.85rem]">{m.role}</p> : null}
                  </Reveal>
                ))
              : [1, 2, 3, 4].map((n) => (
                  <Reveal key={n} delay={n * 0.05}>
                    <Placeholder label="Foto" ratio="3 / 4" />
                    <p className="font-display t1 mt-3 text-[1.05rem]">Nombre Apellido</p>
                    <p className="t-faint text-[0.85rem]">Rol / especialidad</p>
                  </Reveal>
                ))}
          </div>
```

- [ ] **Step 4: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/NosotrosPage.tsx
git commit -m "feat(nosotros): equipo e imagen de historia editables desde el admin"
```

---

### Task 11: Branding — swap y tamaño de logos (Navbar ↔ Footer)

**Files:**
- Create (copia de asset): `public/branding/logo-footer-full.png`
- Modify: `src/components/layout/Navbar.tsx` (logo desktop + overlay mobile)
- Modify: `src/components/layout/Footer.tsx` (logo + consumo de config)

**Interfaces:**
- Consumes: `usePackages().config.logo_header_path / logo_dark_path / logo_footer_path` (Task 5).
- Produces: navbar muestra el isotipo (agrandado, ambos modos); footer muestra el logo completo claro.

- [ ] **Step 1: Copiar el asset del footer a una ruta sin espacios**

Run:
```bash
cp "public/branding/Logo sobre negro.png" public/branding/logo-footer-full.png
```
Expected: archivo creado (sin salida).

- [ ] **Step 2: Navbar usa el isotipo en ambos modos y agrandado**

En `src/components/layout/Navbar.tsx`:

1. Agregar el import:
```tsx
import { usePackages } from "../../data/packagesStore";
```
2. Dentro de `Navbar`, junto a `const { openLead } = useLeadModal();`, agregar:
```tsx
  const { config } = usePackages();
  const ISOTIPO = "/branding/Logo-footer.webp";
```
3. Reemplazar la línea:
```tsx
  const logoSrc = onDark ? "/branding/logo-dark.webp" : "/branding/logo-header.webp";
```
por:
```tsx
  const logoSrc = (onDark ? config.logo_dark_path : config.logo_header_path) || ISOTIPO;
```
4. Agrandar el `<img>` del isologo: reemplazar `className="h-10 w-auto sm:h-12"` por `className="h-12 w-auto sm:h-14"`.
5. En el overlay mobile, reemplazar:
```tsx
          <img src="/branding/logo-dark.webp" alt="Antares Viajes y Turismo" className="h-10 w-auto" />
```
por:
```tsx
          <img src={config.logo_dark_path || ISOTIPO} alt="Antares Viajes y Turismo" className="h-11 w-auto" />
```

- [ ] **Step 3: Footer usa el logo completo claro desde config**

En `src/components/layout/Footer.tsx`:

1. Agregar el import:
```tsx
import { usePackages } from "../../data/packagesStore";
```
2. Dentro de `Footer`, al inicio del componente, agregar:
```tsx
  const { config } = usePackages();
```
3. Reemplazar:
```tsx
              <img src="/branding/Logo-footer.webp" alt="Antares Viajes y Turismo" className="h-16 w-auto" />
```
por:
```tsx
              <img src={config.logo_footer_path || "/branding/logo-footer-full.png"} alt="Antares Viajes y Turismo" className="h-14 w-auto sm:h-16" />
```

- [ ] **Step 4: Verificar tipos y build**

Run: `npx tsc --noEmit && npm run build`
Expected: ambos exit 0.

- [ ] **Step 5: Verificación visual (local)**

Para ver los defaults nuevos sin subir nada, reseteá la DB local (pre-lanzamiento, sin datos valiosos; los paquetes se re-sincronizan):
```bash
rm -f server/data.db
```
Levantar backend (`cd server && npm start`) y front (`npm run dev`), y confirmar al ojo:
- Navbar: isotipo (círculo rojo) legible sobre el hero (oscuro) y en páginas internas (claro), tamaño proporcionado. Ajustar `h-12/sm:h-14` si hace falta.
- Footer: logo completo con texto claro, legible sobre el fondo oscuro.
- Mobile: overlay con isotipo; navbar y footer sin desbordes en pantalla chica.

- [ ] **Step 6: Commit**

```bash
git add public/branding/logo-footer-full.png src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "feat(branding): swap navbar/footer (isotipo arriba, logo completo abajo) + tamaños"
```

---

## Cierre

- [ ] **Verificación final completa**

Run: `npx tsc --noEmit && npm run build && node server/verify-admin-fase2.js`
Expected: los tres exit 0.

- [ ] **Resumen para el usuario:** módulos listos (imágenes de servicios, equipo, imagen de historia, Config limpio, logos swapeados, widget de leads). Recordar: en producción (Render free) el contenido cargado a mano se pierde al dormir el servicio hasta que haya backend pago; en local persiste. El merge a `main` se hace cuando el usuario lo pida (mismo flujo que la Fase 2-A).

## Notas de cobertura del spec (self-review)

- Feature 1 (imágenes de servicios) → Tasks 1, 2, 4, 5, 6, 9.
- Feature 2.1 (equipo CRUD) → Tasks 1, 3, 4, 5, 7, 10.
- Feature 2.2 (imagen de historia) → Tasks 1, 2, 4, 5, 6, 10.
- Feature 3 (limpieza Config + logos por upload) → Tasks 1, 2, 4, 6.
- Feature 4 (swap + resize logos) → Task 11 (+ config de Task 6).
- Feature 5 (widget leads) → Task 8.
- Persistencia / PDF legal → fuera de alcance por decisión; documentado, sin tarea.
- Responsive → verificación visual en Task 11 Step 5; grillas con clases responsive en Tasks 9-10.
