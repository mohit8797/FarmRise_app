const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-with-secure-value';

const getUserByEmail = async (email) => {
  const pool = getPool();
  const { rows } = await pool.query('SELECT id, full_name, email, password_hash, role, phone_number, is_verified FROM users WHERE email = $1', [email]);
  return rows[0];
};

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role = 'buyer', phoneNumber } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !role || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const pool = getPool();
    const passwordHash = await bcrypt.hash(password, 12);

    const insert = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role, phone_number, is_verified) VALUES ($1, $2, $3, $4, $5, false) RETURNING id, full_name, email, role, phone_number, is_verified',
      [fullName.trim(), email.toLowerCase(), passwordHash, role, phoneNumber.trim()]
    );

    const user = insert.rows[0];

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('registerUser error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { id } = req.user;
    const pool = getPool();
    const { rows } = await pool.query('SELECT id, full_name, email, role, phone_number, is_verified, created_at FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    return res.json({ user });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: 'Server error getting profile' });
  }
};
