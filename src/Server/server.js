const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('better-sqlite3')('database.db');
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

const createTables = () => {
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
  res.send('Welcome to the Task Management API. No Money Baby.');
});

app.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  const { firstname, lastname, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = db.prepare('INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)').run(
      firstname, lastname, email, hashedPassword
    );
    console.log('User registered:', result); 
    res.status(201).send({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('Wehlele:', error);
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;

  try {
    console.log('Searching for user with email:', email); 
    const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    console.log('User fetched from database:', user); 

    if (user) {
      console.log('Fetched user details:', user); 
      console.log('Comparing passwords:', { plaintext: password, hashed: user.password }); 
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);

      if (isMatch) {
        req.session.userId = user.id;
        console.log('User successfully logged in:', user.id); 
        res.send({ authenticated: true, userId: user.id });
      } else {
        console.log('Invalid password for user:', email); 
        res.status(401).send({ authenticated: false });
      }
    } else {
      console.log('No user found with email:', email); 
      res.status(401).send({ authenticated: false });
    }
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).send('Error logging in');
  }
});

app.get('/check-auth', (req, res) => {
  console.log('Checking authentication for session:', req.session); 
  if (req.session.userId) {
    res.send({ authenticated: true, userId: req.session.userId });
  } else {
    res.send({ authenticated: false });
  }
});

app.get('/tasks/:userId', (req, res) => {
  const { userId } = req.params;
  console.log('Fetching tasks for userId:', userId);
  try {
    const tasks = db.prepare('SELECT * FROM task WHERE userId = ?').all(userId);
    console.log('Fetched tasks:', tasks); 
    res.send(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});

app.post('/tasks', (req, res) => {
  const { description, priority, userId } = req.body;
  console.log('Adding task:', { description, priority, userId }); 
  try {
    const result = db.prepare('INSERT INTO task (description, priority, userId) VALUES (?, ?, ?)').run(
      description, priority, userId
    );
    res.send({ id: result.lastInsertRowid, description, priority });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Error adding task');
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  console.log('Deleting task:', id); 
  try {
    db.prepare('DELETE FROM task WHERE id = ?').run(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task');
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { description, priority } = req.body;
  console.log('Updating task:', { id, description, priority }); 
  try {
    db.prepare('UPDATE task SET description = ?, priority = ? WHERE id = ?').run(
      description, priority, id
    );
    res.sendStatus(204);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Error updating task');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});