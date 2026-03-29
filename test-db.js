require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log('Testing DB connection...');
console.log('DATABASE_URL:', connectionString ? 'Set' : 'Not set');

if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Testing query...');
    const res = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', res.rows[0]);
    client.release();
    pool.end();
  } catch (err) {
    console.error('❌ Query failed:', err.message);
    pool.end();
  }
})();