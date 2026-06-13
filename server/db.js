const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.db');

let db = null;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database');

        // Read and execute schema
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        db.exec(schema, (err) => {
          if (err) {
            console.error('Error initializing database:', err);
            reject(err);
            return;
          }
          runMigrations(db)
            .then(() => {
              console.log('Database schema initialized');
              resolve(db);
            })
            .catch(reject);
        });
      }
    });
  });
}

// Agrega columnas nuevas a bases de datos ya existentes (idempotente).
function runMigrations(database) {
  const statements = [
    "ALTER TABLE packages ADD COLUMN source TEXT DEFAULT 'manual'",
    "ALTER TABLE packages ADD COLUMN external_id TEXT",
    "ALTER TABLE packages ADD COLUMN featured INTEGER DEFAULT 0",
    "ALTER TABLE packages ADD COLUMN valid_until TEXT",
    "ALTER TABLE packages ADD COLUMN display_order INTEGER DEFAULT 0",
  ];
  return Promise.all(
    statements.map(
      (sql) =>
        new Promise((resolve) => {
          database.run(sql, (err) => {
            // "duplicate column name" significa que ya estaba migrada: lo ignoramos.
            if (err && !/duplicate column name/i.test(err.message)) {
              console.error('Migration error:', err.message);
            }
            resolve();
          });
        })
    )
  );
}

function getDB() {
  return db;
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initDatabase,
  getDB,
  closeDatabase
};
