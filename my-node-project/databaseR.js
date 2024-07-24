const db = require('better-sqlite3')(process.env.DB_PATH || 'database.db');

const createTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS register (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       firstname TEXT NOT NULL,
       lastname TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL
    )
    `;
    try {
        db.prepare(sql).run();
    } catch (error) {
        console.error('Error creating register table:', error);
    }
};

const insertTable = (firstname, lastname, email, password) => {
    const sql = `
        INSERT INTO register (firstname, lastname, email, password)
        VALUES (?, ?, ?, ?)
    `;
    try {
        db.prepare(sql).run(firstname, lastname, email, password);
    } catch (error) {
        console.error('Error inserting into register table:', error);
    }
};

module.exports = {
    createTable,
    insertTable
};