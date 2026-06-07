const express = require('express');
const bcrypt = require('bcrypt');
const { getDB } = require('../db');

const router = express.Router();

// Middleware to verify authentication
const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.password !== process.env.ADMIN_PASSWORD || Date.now() > decoded.expires) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Login endpoint
router.post('/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  // Simple password check (in production, use proper hashing)
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password !== correctPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Create token (24 hour expiration)
  const token = Buffer.from(JSON.stringify({
    password: correctPassword,
    expires: Date.now() + 24 * 60 * 60 * 1000
  })).toString('base64');

  res.json({ token, expires: 24 * 60 * 60 });
});

// Get dashboard summary
router.get('/dashboard', verifyAuth, (req, res) => {
  const db = getDB();

  db.all('SELECT COUNT(*) as count FROM packages WHERE active = 1', (err, packagesCount) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all('SELECT COUNT(*) as count FROM hero_slides WHERE active = 1', (err, slidesCount) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        activePackages: packagesCount[0]?.count || 0,
        activeSlides: slidesCount[0]?.count || 0,
        lastUpdated: new Date().toISOString()
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

// Create package
router.post('/packages', verifyAuth, (req, res) => {
  const db = getDB();
  const { id, title, destination, duration, price, image_url, badge, departure, people, includes } = req.body;

  if (!id || !title || !destination || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO packages (id, title, destination, duration, price, image_url, badge, departure, people, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [id, title, destination, duration, price, image_url, badge, departure, people],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      // Insert includes
      if (includes && includes.length > 0) {
        includes.forEach(inc => {
          db.run('INSERT INTO package_includes (package_id, include_text) VALUES (?, ?)', [id, inc]);
        });
      }

      res.status(201).json({ id, message: 'Package created' });
    }
  );
});

// Update package
router.put('/packages/:id', verifyAuth, (req, res) => {
  const db = getDB();
  const { title, destination, duration, price, image_url, badge, departure, people, includes } = req.body;

  db.run(
    `UPDATE packages SET title = ?, destination = ?, duration = ?, price = ?, image_url = ?, badge = ?, departure = ?, people = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [title, destination, duration, price, image_url, badge, departure, people, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      // Delete old includes and add new ones
      db.run('DELETE FROM package_includes WHERE package_id = ?', [req.params.id], () => {
        if (includes && includes.length > 0) {
          includes.forEach(inc => {
            db.run('INSERT INTO package_includes (package_id, include_text) VALUES (?, ?)', [req.params.id, inc]);
          });
        }
        res.json({ message: 'Package updated' });
      });
    }
  );
});

// Delete package
router.delete('/packages/:id', verifyAuth, (req, res) => {
  const db = getDB();

  db.run('DELETE FROM packages WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Package deleted' });
  });
});

// Toggle package active status
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
  const { whatsapp, sales_email, slogan, logo_header_path, logo_dark_path } = req.body;

  db.run(
    `UPDATE site_config SET whatsapp = ?, sales_email = ?, slogan = ?, logo_header_path = ?, logo_dark_path = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = 1`,
    [whatsapp, sales_email, slogan, logo_header_path, logo_dark_path],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Config updated' });
    }
  );
});

module.exports = router;
