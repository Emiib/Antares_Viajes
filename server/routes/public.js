const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

// Get all public data (for frontend)
router.get('/data', (req, res) => {
  const db = getDB();

  Promise.all([
    getConfig(),
    getActivePackages(),
    getActiveHeroSlides()
  ]).then(([config, packages, heroSlides]) => {
    res.json({
      config,
      packages,
      heroSlides
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
    db.all('SELECT * FROM packages WHERE active = 1 ORDER BY created_at DESC', (err, packages) => {
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
