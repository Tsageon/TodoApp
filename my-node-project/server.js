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

const recreateUserTable = () => {
  db.prepare('DROP TABLE IF EXISTS user').run();
  createUserTable();
};

recreateUserTable();
const tableInfo = db.prepare('PRAGMA table_info(user)').all();
console.log(tableInfo);

app.post('/register', [
  body('firstname').isString().trim().escape(),
  body('lastname').isString().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).escape(),
  body('confirmPassword').custom((value, { req }) => value === req.body.password)
], (req, res) => {
  console.log('Request body:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      res.status(500).json({ error: 'Error registering user' });
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }}
});

app.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM user WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '5h' });

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

  console.log('Decoded JWT:', req.user);

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});