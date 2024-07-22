const db = require('better-sqlite3')('database.db');

const createTable = () => {
    const sql = `
        CREATE TABLE todolist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            priority INTEGER
        );
    `;
    try {
        db.prepare(sql).run();
        console.log("Table 'todolist' created successfully.");
    } catch (err) {
        console.error("Error creating table 'todolist':", err.message);
    }
}

const insertTable = (name, priority) => {
    const sql = `
        INSERT INTO todolist (name, priority)
        VALUES (?, ?);
    `;
    try {
        db.prepare(sql).run(name, priority);
        console.log(`Inserted task '${name}' with priority ${priority}.`);
    } catch (err) {
        console.error("Error inserting data into 'todolist':", err.message);
    }
}

const gettodolist = (id) => {
    const sql = `
        SELECT * FROM todolist
        WHERE id = ?;
    `;
    try {
        const row = db.prepare(sql).get(id);
        console.log(row);
        return row;
    } catch (err) {
        console.error("Error retrieving data from 'todolist':", err.message);
    }
}

createTable();

insertTable("Test Task", 2);

gettodolist(10);