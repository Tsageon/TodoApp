const db = require('better-sqlite3')('databaseR.db');

const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS register (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `;
  db.prepare(sql).run();
};

const insertUser = (firstname, lastname, email, password) => {
  const sql = `
    INSERT INTO register (firstname, lastname, email, password)
    VALUES (?, ?, ?, ?)
  `;
  db.prepare(sql).run(firstname, lastname, email, password);
};

module.exports = {
  createTable,
  insertUser
};
