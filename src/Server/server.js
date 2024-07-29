const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('better-sqlite3')('database.db');
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

const createTables = () => {
  // Drop tables if they exist
  const dropUserTable = 'DROP TABLE IF EXISTS user';
  const dropTaskTable = 'DROP TABLE IF EXISTS task';
  
  db.prepare(dropUserTable).run();
  db.prepare(dropTaskTable).run();
  
  // Create tables
  const userTable = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `;

  const taskTable = `
    CREATE TABLE IF NOT EXISTS task (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      userId INTEGER,
      FOREIGN KEY(userId) REFERENCES user(id)
    )
  `;

  db.prepare(userTable).run();
  db.prepare(taskTable).run();
};

createTables();

app.get('/', (req, res) => {
  res.send('Welcome to the Task Management API');
});

app.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  if (!firstname || !lastname || !email || !password || !confirmPassword) {
    console.log('Missing fields');
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    console.log('Passwords don\'t match');
    return res.status(400).json({ error: 'Passwords don\'t match.' });
  }

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    console.log('Invalid email format');
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const existingUser = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    if (existingUser) {
      console.log('Email already in use');
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', hashedPassword);
    const info = db.prepare('INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)').run(firstname, lastname, email, hashedPassword);
    console.log('User registered with ID:', info.lastInsertRowid);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Other endpoints remain the same

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
