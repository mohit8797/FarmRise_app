// const pool = require('../config/db');

// router.post('/register', (req, res) => {
//     const { name, email, password } = req.body;
//     const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    
//     pool.query(sql, [name, email, password], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.send('User registered successfully!');
//     });
// });
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (user, callback) => {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return callback(err, null);
      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [user.name, user.email, hash],
        callback
      );
    });
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  }
};

module.exports = User;