const db = require('better-sqlite3')('databaseR.db');

const createTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS registar (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       firstname TEXT NOT NULL,
       lastname TEXT NOT NULL,
       email TEXT NOT NULL,
       password TEXT NOT NULL
    )
    `;
    try {
        db.prepare(sql).run();
        console.log('Table created or already exists.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

const insertTable = (firstname, lastname, email, password) => {
    const sql = `
        INSERT INTO registar (firstname, lastname, email, password)
        VALUES (?, ?, ?, ?)
    `;
    try {
        db.prepare(sql).run(firstname, lastname, email, password);
        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

createTable();
insertTable("Kain", "Abel", "Stone@gmail.com", "2563");