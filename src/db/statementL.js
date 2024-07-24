const db = require('better-sqlite3')(process.env.DB_PATH || 'databaseL.db');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const createTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `;
    try {
        db.prepare(sql).run();
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};

const insertTable = (username, password) => {
    const sql = `
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `;
    try {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        db.prepare(sql).run(username, hashedPassword);
    } catch (error) {
        console.error('Error inserting into users table:', error);
    }
};

const getUsers = () => {
    const sql = `
        SELECT * FROM users
    `;
    try {
        const rows = db.prepare(sql).all();
        console.log(rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
    }
};

const getUser = (id) => {
    const sql = `
        SELECT * FROM users
        WHERE id = ?
    `;
    try {
        const row = db.prepare(sql).get(id);
        console.log(row);
    } catch (error) {
        console.error('Error retrieving user:', error);
    }
};

createTable();

insertTable("Kin", "06717");

getUsers();

getUser(1);