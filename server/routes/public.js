const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

// Get all public data (for frontend)
router.get('/data', (req, res) => {
  const db = getDB();

  Promise.all([
    getConfig(),
    getActivePackages(),
    getActiveHeroSlides(),
    getActiveBlogPosts()
  ]).then(([config, packages, heroSlides, blogPosts]) => {
    res.json({
      config,
      packages,
      heroSlides,
      blogPosts
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Captura de leads desde los formularios del sitio (sin auth).
// Fire-and-forget: el front no espera respuesta. Validamos mínimamente y
// recortamos longitudes para evitar abuso.
router.post('/leads', (req, res) => {
  const db = getDB();
  const clip = (v, n) => (typeof v === 'string' ? v.slice(0, n) : null);

  const name = clip(req.body.name, 120);
  const contact = clip(req.body.contact, 120);
  const email = clip(req.body.email, 160);
  const source = clip(req.body.source, 40) || 'web';
  const destination = clip(req.body.destination, 200);
  const message = clip(req.body.message, 4000);
  let payload = req.body.payload;
  if (payload && typeof payload === 'object') {
    try { payload = JSON.stringify(payload).slice(0, 4000); } catch { payload = null; }
  } else {
    payload = clip(payload, 4000);
  }

  // Necesitamos al menos algo de contenido para no guardar registros vacíos.
  if (!name && !contact && !destination && !message) {
    return res.status(204).end();
  }

  db.run(
    `INSERT INTO leads (name, contact, email, source, destination, message, payload)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, contact, email, source, destination, message, payload],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

function getConfig() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.get('SELECT * FROM site_config LIMIT 1', (err, config) => {
      if (err) reject(err);
      else resolve(config || {});
    });
  });
}

function getActivePackages() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    // Solo publicados y no vencidos. Orden de curaduría primero.
    db.all(
      `SELECT * FROM packages
       WHERE active = 1
         AND (valid_until IS NULL OR valid_until = '' OR valid_until >= date('now'))
       ORDER BY display_order ASC, created_at DESC`,
      (err, packages) => {
      if (err) {
        reject(err);
      } else {
        // Get includes for each package
        Promise.all(packages.map(pkg => {
          return new Promise((res) => {
            db.all('SELECT include_text FROM package_includes WHERE package_id = ?', [pkg.id], (err, includes) => {
              pkg.includes = includes?.map(i => i.include_text) || [];
              res(pkg);
            });
          });
        })).then(() => {
          resolve(packages);
        });
      }
    });
  });
}

function getActiveBlogPosts() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.all(
      `SELECT * FROM blog_posts WHERE active = 1 ORDER BY display_order ASC, published_at DESC, created_at DESC`,
      (err, posts) => {
        if (err) reject(err);
        else resolve(posts || []);
      }
    );
  });
}

function getActiveHeroSlides() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.all('SELECT * FROM hero_slides WHERE active = 1 ORDER BY display_order ASC', (err, slides) => {
      if (err) reject(err);
      else resolve(slides || []);
    });
  });
}

module.exports = router;
