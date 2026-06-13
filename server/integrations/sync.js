const { getDB } = require('../db');
const { getEnabledIntegrations } = require('./registry');

// Pequeño wrapper para usar db.run con async/await.
function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

/** Aplica el markup (%) sobre el número que contenga el string de precio. */
function applyMarkup(pkg, markupPct) {
  if (!markupPct) return pkg;
  const match = pkg.price && pkg.price.match(/[\d.,]+/);
  if (!match) return pkg;
  const num = Number(match[0].replace(/\./g, '').replace(',', '.'));
  if (!Number.isFinite(num)) return pkg;
  const final = Math.round(num * (1 + markupPct / 100));
  return { ...pkg, price: pkg.price.replace(match[0], final.toLocaleString('es-AR')) };
}

async function upsertPackage(db, source, p) {
  const id = `${source}:${p.externalId}`;
  // Curaduría: el mayorista es dueño del CONTENIDO (título, precio, fechas…);
  // el admin es dueño de la UBICACIÓN (categoría, destacado, imagen curada,
  // publicado, vencimiento, orden). Por eso, al re-sincronizar SOLO se pisan
  // las columnas de contenido y se preservan las de curaduría.
  // En el primer alta entra como BORRADOR (active=0): nada va al sitio sin que
  // el admin lo publique. La categoría/imagen/badge del mayorista solo siembran
  // el valor inicial; después manda el admin.
  await run(
    db,
    `INSERT INTO packages
       (id, source, external_id, type, title, destination, duration, price, image_url, badge, departure, people, active, featured, display_order, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET
       title=excluded.title, destination=excluded.destination,
       duration=excluded.duration, price=excluded.price,
       departure=excluded.departure, people=excluded.people,
       updated_at=CURRENT_TIMESTAMP`,
    [
      id, source, String(p.externalId), p.type || null, p.title, p.destination,
      p.duration || null, p.price, p.imageUrl || null, p.badge || null,
      p.departure || null, p.people || null,
    ]
  );

  // Reemplazamos los "includes" del paquete.
  await run(db, 'DELETE FROM package_includes WHERE package_id = ?', [id]);
  for (const inc of p.includes || []) {
    await run(db, 'INSERT INTO package_includes (package_id, include_text) VALUES (?, ?)', [id, inc]);
  }
  return id;
}

/** Borra los paquetes de `source` que ya no vinieron en esta sincronización. */
async function pruneStale(db, source, keepIds) {
  if (keepIds.length === 0) {
    await run(db, 'DELETE FROM packages WHERE source = ?', [source]);
    return;
  }
  const placeholders = keepIds.map(() => '?').join(',');
  await run(
    db,
    `DELETE FROM packages WHERE source = ? AND id NOT IN (${placeholders})`,
    [source, ...keepIds]
  );
}

/** Sincroniza un solo mayorista. Devuelve { source, ok, count } o { source, ok:false, error }. */
async function syncOne(db, integration) {
  const source = integration.adapter.source;
  try {
    const items = await integration.adapter.fetchPackages();
    const keepIds = [];
    for (const item of items) {
      const withMarkup = applyMarkup(item, integration.markupPct);
      keepIds.push(await upsertPackage(db, source, withMarkup));
    }
    await pruneStale(db, source, keepIds);
    return { source, ok: true, count: keepIds.length };
  } catch (err) {
    return { source, ok: false, error: err.message };
  }
}

/**
 * Sincroniza todos los mayoristas habilitados con la tabla `packages`.
 * @returns {Promise<Array<{source:string, ok:boolean, count?:number, error?:string}>>}
 */
async function syncAll() {
  const db = getDB();
  const results = [];
  for (const integration of getEnabledIntegrations()) {
    results.push(await syncOne(db, integration));
  }
  return results;
}

module.exports = { syncAll };
