-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Site Configuration Table
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  whatsapp TEXT,
  sales_email TEXT,
  slogan TEXT,
  logo_header_path TEXT,
  logo_dark_path TEXT,
  legal_pdf_url TEXT,
  legal_text TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  poster_path TEXT,
  desktop_webm TEXT,
  desktop_mp4 TEXT,
  mobile_webm TEXT,
  mobile_mp4 TEXT,
  display_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  type TEXT,
  source TEXT DEFAULT 'manual',
  external_id TEXT,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  badge TEXT,
  departure TEXT,
  people TEXT,
  active INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  valid_until TEXT,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  image_url TEXT,
  continent TEXT,
  country TEXT,
  read_time TEXT,
  active INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  published_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Leads Table (mini-CRM): consultas de los formularios del sitio.
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  contact TEXT,
  email TEXT,
  source TEXT,
  destination TEXT,
  message TEXT,
  payload TEXT,
  status TEXT DEFAULT 'nuevo',
  assigned_to TEXT,
  first_contacted_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Package Includes Table
CREATE TABLE IF NOT EXISTS package_includes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id TEXT NOT NULL,
  include_text TEXT,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Initialize admin settings with default password hash
-- Password: 'admin123' (hashed with bcrypt)
INSERT OR IGNORE INTO admin_settings (key, value) VALUES
  ('admin_password_hash', '$2b$10$YourHashedPasswordHere'),
  ('api_initialized', 'true');

-- Initialize default site config
INSERT OR IGNORE INTO site_config (whatsapp, sales_email, slogan, logo_header_path, logo_dark_path) VALUES
  ('5493446528749', 'ventas@antaresviajes.com.ar', 'El mejor de los viajes es el próximo', '/branding/logo-header.png', '/branding/logo-dark.png');
