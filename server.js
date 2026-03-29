const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from Frontend directory
app.use('/Frontend', express.static(path.join(__dirname, 'Frontend')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// Database Connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'farmrise_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    console.log('Hint: Make sure MySQL is running and .env is configured');
    return;
  }
  console.log('✅ MySQL Connected Successfully!');
});

// Secret key for JWT - MUST be set in production
const SECRET_KEY = process.env.JWT_SECRET || 'fallback-dev-key-change-in-production';

// Helper: Validate required fields
const validateSignup = (data) => {
  const { fullName, email, password, confirmPassword, role, phoneNumber } = data;
  if (!fullName || !email || !password || !role || !phoneNumber) {
    return 'All fields are required';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
};

// ✅ Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role, phoneNumber } = req.body;

    // Validate input
    const error = validateSignup({ fullName, email, password, confirmPassword, role, phoneNumber });
    if (error) {
      return res.status(400).json({ message: error });
    }

    // Check if user exists
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      connection.query(
        'INSERT INTO users (full_name, email, password, role, phone_number) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, hashedPassword, role, phoneNumber],
        (insertErr) => {
          if (insertErr) {
            console.error('Insert error:', insertErr);
            return res.status(500).json({ message: 'Failed to create user' });
          }
          res.status(201).json({ message: 'User registered successfully! Please login.' });
        }
      );
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role
      }
    });
  });
});

// ✅ Verify Token Route
app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
    res.json({ valid: true, user: decoded });
  });
});

// ✅ Protected Dashboard Route
app.get('/api/dashboard', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    res.status(200).json({ message: `Welcome to your dashboard, ${decoded.email}!` });
  });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from /Frontend`);
});