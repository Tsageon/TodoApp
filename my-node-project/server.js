const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('better-sqlite3')('database.db');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3001;
const saltRounds = 12;

app.use(bodyParser.json());
app.use(cors());

const recreateTablesWithNoForeignKeyChecks = () => {
  db.prepare('PRAGMA foreign_keys = OFF').run(); 
  db.prepare('DROP TABLE IF EXISTS tasks').run(); 
  db.prepare('DROP TABLE IF EXISTS user').run(); 
  createUserTable(); 
  createTasksTable();
  db.prepare('PRAGMA foreign_keys = ON').run(); 
};

const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;
  db.prepare(sql).run();
};

const createTasksTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES user(id)
    )
  `;
  db.prepare(sql).run();
};


recreateTablesWithNoForeignKeyChecks();

app.post('/register', [
  body('firstname').isString().trim().escape(),
  body('lastname').isString().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).escape(),
  body('confirmPassword').custom((value, { req }) => value === req.body.password)
], (req, res) => {
  console.log("Register request data:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const sql = `
      INSERT INTO user (firstname, lastname, email, password)
      VALUES (?, ?, ?, ?)
    `;
    db.prepare(sql).run(firstname, lastname, email, hashedPassword);
    console.log(`User registered: ${firstname} ${lastname}, Email: ${email}`);
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Error registering user' });
    }
  }
});

app.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).escape()
], (req, res) => {
  console.log("Login attempt with email:", req.body.email);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    if (!user) {
      console.log("Login failed - invalid email");
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      console.log("Login failed - invalid password");
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '5h' });
    console.log("User logged in:", user.email);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in user' });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const cleanedToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  try {
    const decoded = jwt.verify(cleanedToken, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

app.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  try {
    const user = db.prepare('SELECT * FROM user WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

app.get('/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE userId = ?').all(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

app.post('/tasks', [
  authenticateToken,
  body('description').isString().trim().escape(),
  body('priority').isString().trim().escape()
], (req, res) => {
  console.log("Create task request:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { description, priority } = req.body;
  const userId = req.user.id;

  try {
    const sql = `
      INSERT INTO tasks (userId, description, priority)
      VALUES (?, ?, ?)
    `;
    const result = db.prepare(sql).run(userId, description, priority);
    const newTask = { id: result.lastInsertRowid, userId, description, priority };
    console.log("Task created:", newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

app.put('/tasks/:id', [
  authenticateToken,
  body('description').isString().trim().escape(),
  body('priority').isString().trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { description, priority } = req.body;
  const userId = req.user.id;

  try {
    const sql = `
      UPDATE tasks
      SET description = ?, priority = ?
      WHERE id = ? AND userId = ?
    `;
    const result = db.prepare(sql).run(description, priority, id, userId);
    if (result.changes === 0) {
      console.log(`Update failed: Task ${id} not found or insufficient permission for user ${userId}`);
      return res.status(404).json({ error: 'Task not found or you do not have permission to update this task' });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const sql = `DELETE FROM tasks WHERE id = ? AND userId = ?`;
    const result = db.prepare(sql).run(id, userId);
    if (result.changes === 0) {
      console.log(`Delete failed: Task ${id} not found or insufficient permission for user ${userId}`);
      return res.status(404).json({ error: 'Task not found or you do not have permission to delete this task' });
    }
    console.log(`Task ${id} deleted by user ${userId}`);
    res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
