const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('better-sqlite3')('database.db');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 12;

const corsOptions = {
  origin: 'http://localhost:3000', // Update with your frontend's origin
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

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

createUserTable();

app.post('/register', [
  body('firstname').isString().trim().escape(),
  body('lastname').isString().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).escape(),
  body('confirmPassword').custom((value, { req }) => value === req.body.password)
], (req, res) => {
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
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});