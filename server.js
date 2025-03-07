const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Database Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Monty@2005', // Use your MySQL root password
  database: 'farmrise_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    return;
  }
  console.log('✅ MySQL Connected Successfully!');
});

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// ✅ Signup Route
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'User registered successfully!' });
      }
    );
  });
});

// ✅ Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const user = result[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token });
  });
});

// ✅ Protected Dashboard Route (Requires Auth)
app.get('/api/dashboard', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    res.status(200).json({ message: `Welcome to your dashboard, ${decoded.email}!` });
  });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});