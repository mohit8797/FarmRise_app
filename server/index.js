require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('../routes/authRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const { initDb } = require('../config/db');

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from Frontend directory
app.use('/Frontend', express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/Images', express.static(path.join(__dirname, '..', 'Images')));

// API Routers
app.use('/api/auth', authRoutes);

app.get('/api/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome to your dashboard, ${req.user.email}!`, user: req.user });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'Frontend')));
app.use('/Images', express.static(path.join(__dirname, '..', 'Images')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

const PORT = process.env.PORT || 5001;

const start = async () => {
  console.log('🚀 Starting FarmRise server...');
  // await initDb(); // Tables already created

  app.listen(PORT, () => {
    console.log(`🚀 FarmRise Server running on port ${PORT}`);
    console.log(`🌍 Client origin: ${CLIENT_ORIGIN}`);
  });
};

start().catch(err => {
  console.error('❌ Startup error:', err);
  process.exit(1);
});