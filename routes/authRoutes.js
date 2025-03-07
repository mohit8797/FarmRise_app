// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");  // MongoDB Model
// const db = require("../config/db");  // MySQL Connection
// const router = express.Router();
// require("dotenv").config();

// // Signup Route
// router.post("/signup", async (req, res) => {
//     const { name, email, password, role, phone } = req.body;
//     try {
//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = { name, email, password: hashedPassword, role, phone };

//         // Save to MongoDB
//         if (process.env.DB_TYPE === "mongo") {
//             const user = new User(newUser);
//             await user.save();
//         } else {
//             db.query("INSERT INTO users SET ?", newUser, (err, result) => {
//                 if (err) return res.status(500).json({ error: "Database error" });
//             });
//         }

//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Error signing up" });
//     }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         let user;
        
//         if (process.env.DB_TYPE === "mongo") {
//             user = await User.findOne({ email });
//         } else {
//             db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//                 if (err || results.length === 0) return res.status(400).json({ error: "User not found" });
//                 user = results[0];
//             });
//         }
        
//         if (!user) return res.status(400).json({ error: "User not found" });

//         // Compare Password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//         // Generate Token
//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//         res.status(500).json({ error: "Error logging in" });
//     }
// });

// module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  User.findByEmail(email, (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    User.create({ name, email, password }, (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, result) => {
    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    });
  });
});

module.exports = router;