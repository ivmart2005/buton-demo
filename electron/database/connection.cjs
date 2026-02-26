const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

let dbInstance = null;

const getDatabase = async () => {
  if (dbInstance)
    return dbInstance;
  const exeDir = path.dirname(process.execPath);
  const dbPath = path.join(exeDir, 'flowers.db');
  
  if (!fs.existsSync(dbPath)) {
    throw new Error(`connection.cjs - БД не найдена: ${dbPath}`);
  }
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (error) => {
      if (error) {
        reject(error);
      } else {
        const promisifiedDb = {
          all: promisify(db.all.bind(db)),
          get: promisify(db.get.bind(db)),
          run: promisify(db.run.bind(db)),
          close: promisify(db.close.bind(db))
        };
        dbInstance = promisifiedDb;
        resolve(promisifiedDb);
      }
    });
  });
};

const closeDatabase = async () => {
  if (dbInstance) {
    try {
      await dbInstance.close();
      dbInstance = null;
    } catch (error) {
      console.error('connection.cjs');
    }
  }
};

module.exports = { getDatabase, closeDatabase };