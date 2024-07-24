const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createTable, insertUser } = require('./databaseR');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

createTable();

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    insertUser(firstname, lastname, email, hashedPassword);
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));