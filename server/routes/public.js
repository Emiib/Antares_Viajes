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
