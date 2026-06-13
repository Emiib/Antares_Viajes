const express = require('express');
const bcrypt = require('bcrypt');
const { getDB } = require('../db');
const { verify, signSession } = require('../auth');
const { syncAll } = require('../integrations/sync');
const { listIntegrations } = require('../integrations/registry');

const router = express.Router();

if (!process.env.ADMIN_PASSWORD_HASH) {
  console.warn(
    '⚠️  ADMIN_PASSWORD_HASH no está definido: el login compara en texto plano ' +
    '(ADMIN_PASSWORD o "admin123"). Para producción generá un hash con ' +
    '`node scripts/hash-password.js <tu-password>` y guardalo en server/.env.'
  );
}

// Middleware: valida el token firmado (Authorization: Bearer <token>)
const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = token ? verify(token) : null;
  if (!payload) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  req.admin = payload;
  next();
};

// Verifica la contraseña: bcrypt contra el hash si existe; texto plano solo en dev.
async function checkPassword(password) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return bcrypt.compare(password, hash);
  const plain = process.env.ADMIN_PASSWORD || 'admin123';
  return password === plain;
}

// Login endpoint
router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  const ok = await checkPassword(password);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = signSession();
  res.json({ token, expires: 24 * 60 * 60 });
});

// Get dashboard summary
router.get('/dashboard', verifyAuth, (req, res) => {
  const db = getDB();

  db.all('SELECT COUNT(*) as count FROM packages WHERE active = 1', (err, packagesCount) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all('SELECT COUNT(*) as count FROM hero_slides WHERE active = 1', (err, slidesCount) => {
      if (err) return res.status(500).json({ error: err.message });

      db.all("SELECT COUNT(*) as count FROM leads WHERE status = 'nuevo'", (err, leadsCount) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          activePackages: packagesCount[0]?.count || 0,
          activeSlides: slidesCount[0]?.count || 0,
          newLeads: leadsCount[0]?.count || 0,
          lastUpdated: new Date().toISOString()
        });
      });
    });
  });
});

// Get all packages
router.get('/packages', verifyAuth, (req, res) => {
  const db = getDB();

  db.all('SELECT * FROM packages ORDER BY created_at DESC', (err, packages) => {
    if (err) return res.status(500).json({ error: err.message });

    // Get includes for each package
    Promise.all(packages.map(pkg => {
      return new Promise((resolve) => {
        db.all('SELECT include_text FROM package_includes WHERE package_id = ?', [pkg.id], (err, includes) => {
          pkg.includes = includes?.map(i => i.include_text) || [];
          resolve(pkg);
        });
      });
    })).then(() => {
      res.json(packages);
    });
  });
});

// Create package (manual). Se crea PUBLICADO por defecto (el admin lo cargó a propósito).
router.post('/packages', verifyAuth, (req, res) => {
  const db = getDB();
  const {
    id, type, title, destination, duration, price, image_url, badge,
    departure, people, includes, featured, valid_until, display_order, active,
  } = req.body;

  if (!id || !title || !destination || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO packages
       (id, type, title, destination, duration, price, image_url, badge, departure, people, active, featured, valid_until, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, type, title, destination, duration, price, image_url, badge, departure, people,
      active === 0 ? 0 : 1, featured ? 1 : 0, valid_until || null, Number(display_order) || 0,
    ],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      if (includes && includes.length > 0) {
        includes.forEach(inc => {
          db.run('INSERT INTO package_includes (package_id, include_text) VALUES (?, ?)', [id, inc]);
        });
      }

      res.status(201).json({ id, message: 'Package created' });
    }
  );
});

// Update package. Consciente del origen:
//  - manual: edición completa (contenido + curaduría + includes).
//  - sincronizado: SOLO campos de curaduría (categoría, imagen, badge, destacado,
//    vencimiento, orden). El contenido lo manda el mayorista y no se toca.
// `active` (publicado) no se modifica acá: se cambia con el toggle dedicado.
router.put('/packages/:id', verifyAuth, (req, res) => {
  const db = getDB();
  const pkgId = req.params.id;
  const b = req.body;
  const curaduria = [b.type, b.image_url, b.badge, b.featured ? 1 : 0, b.valid_until || null, Number(b.display_order) || 0];

  db.get('SELECT source FROM packages WHERE id = ?', [pkgId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Paquete no encontrado' });

    const isManual = !row.source || row.source === 'manual';

    if (!isManual) {
      db.run(
        `UPDATE packages SET type = ?, image_url = ?, badge = ?, featured = ?, valid_until = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [...curaduria, pkgId],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: 'Ubicación actualizada' });
        }
      );
      return;
    }

    db.run(
      `UPDATE packages SET type = ?, image_url = ?, badge = ?, featured = ?, valid_until = ?, display_order = ?,
         title = ?, destination = ?, duration = ?, price = ?, departure = ?, people = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [...curaduria, b.title, b.destination, b.duration, b.price, b.departure, b.people, pkgId],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });

        db.run('DELETE FROM package_includes WHERE package_id = ?', [pkgId], () => {
          if (b.includes && b.includes.length > 0) {
            b.includes.forEach(inc => {
              db.run('INSERT INTO package_includes (package_id, include_text) VALUES (?, ?)', [pkgId, inc]);
            });
          }
          res.json({ message: 'Package updated' });
        });
      }
    );
  });
});

// Delete package
router.delete('/packages/:id', verifyAuth, (req, res) => {
  const db = getDB();

  db.run('DELETE FROM packages WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Package deleted' });
  });
});

// Toggle package active status (publicar / despublicar)
router.put('/packages/:id/toggle', verifyAuth, (req, res) => {
  const db = getDB();

  db.run(
    'UPDATE packages SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Package visibility toggled' });
    }
  );
});

// Toggle destacado (aparece en "Favoritos" del home, sin importar su categoría)
router.put('/packages/:id/feature', verifyAuth, (req, res) => {
  const db = getDB();

  db.run(
    'UPDATE packages SET featured = CASE WHEN featured = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Package featured toggled' });
    }
  );
});

// ─── Blog ──────────────────────────────────────────────────────

// Lista todas las notas (incluye borradores) para el panel.
router.get('/blog', verifyAuth, (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM blog_posts ORDER BY display_order ASC, created_at DESC', (err, posts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(posts);
  });
});

// Crea una nota. Por defecto entra como BORRADOR (active = 0).
router.post('/blog', verifyAuth, (req, res) => {
  const db = getDB();
  const {
    id, slug, title, excerpt, body, image_url, continent, country,
    read_time, active, display_order, published_at,
  } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'Missing required fields (id, title)' });
  }

  db.run(
    `INSERT INTO blog_posts
       (id, slug, title, excerpt, body, image_url, continent, country, read_time, active, display_order, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, slug || id, title, excerpt, body, image_url, continent, country,
      read_time, active ? 1 : 0, Number(display_order) || 0, published_at || null,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, message: 'Post created' });
    }
  );
});

// Actualiza una nota.
router.put('/blog/:id', verifyAuth, (req, res) => {
  const db = getDB();
  const b = req.body;
  db.run(
    `UPDATE blog_posts SET slug = ?, title = ?, excerpt = ?, body = ?, image_url = ?,
       continent = ?, country = ?, read_time = ?, display_order = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      b.slug || req.params.id, b.title, b.excerpt, b.body, b.image_url,
      b.continent, b.country, b.read_time, Number(b.display_order) || 0, b.published_at || null,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Post updated' });
    }
  );
});

// Borra una nota.
router.delete('/blog/:id', verifyAuth, (req, res) => {
  const db = getDB();
  db.run('DELETE FROM blog_posts WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Post deleted' });
  });
});

// Publica / despublica una nota.
router.put('/blog/:id/toggle', verifyAuth, (req, res) => {
  const db = getDB();
  db.run(
    'UPDATE blog_posts SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Post visibility toggled' });
    }
  );
});

// ─── Leads (mini-CRM) ──────────────────────────────────────────

// Lista todos los leads, los más nuevos primero.
router.get('/leads', verifyAuth, (req, res) => {
  const db = getDB();
  db.all('SELECT * FROM leads ORDER BY created_at DESC', (err, leads) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(leads);
  });
});

// Actualiza un lead (estado, asignado, notas).
// Al pasar de "nuevo" a cualquier otro estado se registra la hora del primer
// contacto (si todavía no estaba), para medir el tiempo de respuesta.
router.put('/leads/:id', verifyAuth, (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { status, assigned_to, notes } = req.body;

  db.get('SELECT first_contacted_at FROM leads WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Lead no encontrado' });

    const markContacted = !row.first_contacted_at && status && status !== 'nuevo';
    const firstContactedSql = markContacted ? ', first_contacted_at = CURRENT_TIMESTAMP' : '';

    db.run(
      `UPDATE leads SET status = ?, assigned_to = ?, notes = ?${firstContactedSql}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status || 'nuevo', assigned_to ?? null, notes ?? null, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Lead updated' });
      }
    );
  });
});

// Borra un lead.
router.delete('/leads/:id', verifyAuth, (req, res) => {
  const db = getDB();
  db.run('DELETE FROM leads WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lead deleted' });
  });
});

// Get hero slides
router.get('/hero-slides', verifyAuth, (req, res) => {
  const db = getDB();

  db.all('SELECT * FROM hero_slides ORDER BY display_order ASC', (err, slides) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(slides);
  });
});

// Create hero slide
router.post('/hero-slides', verifyAuth, (req, res) => {
  const db = getDB();
  const { id, label, poster_path, desktop_webm, desktop_mp4, mobile_webm, mobile_mp4 } = req.body;

  if (!id || !label) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO hero_slides (id, label, poster_path, desktop_webm, desktop_mp4, mobile_webm, mobile_mp4, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [id, label, poster_path, desktop_webm, desktop_mp4, mobile_webm, mobile_mp4],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, message: 'Slide created' });
    }
  );
});

// Update hero slide
router.put('/hero-slides/:id', verifyAuth, (req, res) => {
  const db = getDB();
  const { label, poster_path, desktop_webm, desktop_mp4, mobile_webm, mobile_mp4, display_order } = req.body;

  db.run(
    `UPDATE hero_slides SET label = ?, poster_path = ?, desktop_webm = ?, desktop_mp4 = ?, mobile_webm = ?, mobile_mp4 = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [label, poster_path, desktop_webm, desktop_mp4, mobile_webm, mobile_mp4, display_order || 0, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Slide updated' });
    }
  );
});

// Delete hero slide
router.delete('/hero-slides/:id', verifyAuth, (req, res) => {
  const db = getDB();

  db.run('DELETE FROM hero_slides WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Slide deleted' });
  });
});

// Get config
router.get('/config', verifyAuth, (req, res) => {
  const db = getDB();

  db.get('SELECT * FROM site_config LIMIT 1', (err, config) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(config || {});
  });
});

// Update config
router.put('/config', verifyAuth, (req, res) => {
  const db = getDB();
  const { whatsapp, sales_email, slogan, logo_header_path, logo_dark_path, legal_pdf_url, legal_text } = req.body;

  db.run(
    `UPDATE site_config SET whatsapp = ?, sales_email = ?, slogan = ?, logo_header_path = ?, logo_dark_path = ?,
       legal_pdf_url = ?, legal_text = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = 1`,
    [whatsapp, sales_email, slogan, logo_header_path, logo_dark_path, legal_pdf_url ?? null, legal_text ?? null],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Config updated' });
    }
  );
});

// ─── Mayoristas (integraciones) ───────────────────────────────

// Lista los mayoristas registrados (sin exponer credenciales).
router.get('/integrations', verifyAuth, (req, res) => {
  res.json(listIntegrations());
});

// Dispara la sincronización de todos los mayoristas habilitados.
router.post('/sync', verifyAuth, async (req, res) => {
  try {
    const results = await syncAll();
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
