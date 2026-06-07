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
          } else {
            console.log('Database schema initialized');
            resolve(db);
          }
        });
      }
    });
  });
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
