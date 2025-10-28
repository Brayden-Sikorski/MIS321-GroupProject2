const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dbDir, 'energy.db');
let db = null;

async function init() {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Create users table (sql.js doesn't support pragma, skip WAL mode)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create calculations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS calculations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      carbon_emissions REAL,
      breakeven_years REAL,
      carbon_details TEXT,
      breakeven_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database initialized successfully');
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call init() first.');
  }
  return db;
}

function getFilePath() {
  return dbPath;
}

function save() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

module.exports = {
  init,
  getDb,
  getFilePath,
  save
};

