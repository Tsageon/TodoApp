const db = require('better-sqlite3')('databaseL.db');

const createTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `;
    db.prepare(sql).run();
};

const insertTable = (username, password) => {
    const sql = `
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `;
    db.prepare(sql).run(username, password);
};

const getUsers = () => {
    const sql = `
        SELECT * FROM users
    `;
    const rows = db.prepare(sql).all();
    console.log(rows);
};

const getUser = (id) => {
    const sql = `
        SELECT * FROM users
        WHERE id = ?
    `;
    const row = db.prepare(sql).get(id);
    console.log(row);
};

createTable();

insertTable("Kin", "06717");

getUsers();

getUser(1);