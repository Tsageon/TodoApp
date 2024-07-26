const express = require('express');
const cors = require('cors');
const db = require('better-sqlite3')('database.db');
const app = express();
const port = 3001;

app.use(cors());
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
  res.send('Welcome to the Task Management API');
});

app.post('/register', (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  if (!firstname || !lastname || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  try {
    const existingUser = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const info = db.prepare('INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)').run(firstname, lastname, email, password);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  try {
    const user = db.prepare('SELECT * FROM user WHERE email = ? AND password = ?').get(email, password);
    if (user) {
      res.status(200).json({ message: 'Login successful', userId: user.id });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Server did server things' });
  }
});

app.post('/tasks', (req, res) => {
  const { description, priority, userId } = req.body;

  if (!description || !priority || !userId) {
    return res.status(400).json({ error: 'Description, priority, and userId are needed.' });
  }

  try {
    const info = db.prepare('INSERT INTO task (description, priority, userId) VALUES (?, ?, ?)').run(description, priority, userId);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tasks/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = db.prepare('SELECT * FROM task WHERE userId = ?').all(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { description, priority } = req.body;

  if (!description || !priority) {
    return res.status(400).json({ error: 'Description and priority are required.' });
  }

  try {
    const info = db.prepare('UPDATE task SET description = ?, priority = ? WHERE id = ?').run(description, priority, id);
    if (info.changes > 0) {
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  try {
    const info = db.prepare('DELETE FROM task WHERE id = ?').run(id);
    if (info.changes > 0) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});