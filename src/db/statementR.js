const db = require('better-sqlite3')('databaseR.db');

const createTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS registar (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       firstname TEXT NOT NULL,
       lastname TEXT NOT NULL,
       email TEXT NOT NULL,
       password TEXT NOT NULL,
       confirm_password TEXT NOT NULL
    )
    `;
    db.prepare(sql).run();
};

const insertTable = (firstname, lastname, email, password, confirm_password) => {
    const sql = `
        INSERT INTO registar (firstname, lastname, email, password, confirm_password)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.prepare(sql).run(firstname, lastname, email, password, confirm_password);
};

createTable();

insertTable("Kain", "Abel", "Stone@gmail.com", "2563", "2563");