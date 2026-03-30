const { Pool } = require('pg');

let pool;

const getConnectionConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  }

  if (
    process.env.PGHOST &&
    process.env.PGDATABASE &&
    process.env.PGUSER &&
    process.env.PGPASSWORD
  ) {
    return {
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      ssl: { rejectUnauthorized: false },
    };
  }

  return null;
};

const getPool = () => {
  if (!pool) {
    const connectionConfig = getConnectionConfig();
    if (!connectionConfig) {
      throw new Error('PostgreSQL config not set. Add DATABASE_URL or Railway PGHOST/PGDATABASE/PGUSER/PGPASSWORD variables.');
    }
    pool = new Pool(connectionConfig);
    pool.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });
    pool.on('error', (err) => {
      console.error('❌ Unexpected Postgres client error', err);
      // process.exit(-1); // Remove to prevent server crash
    });
  }
  return pool;
};

const initDb = async () => {
  const connectionConfig = getConnectionConfig();
  if (!connectionConfig) {
    console.warn('⚠️ PostgreSQL config missing. Skipping database initialization.');
    return false;
  }

  const pool = getPool();
  console.log('🔄 Initializing database schema...');

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'buyer',
      phone_number VARCHAR(50),
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      farmer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      price NUMERIC(10,2) NOT NULL DEFAULT 0,
      image_url VARCHAR(1000),
      stock INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Orders table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Order items table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      price NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Cart items
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );
  `);

  console.log('✅ PostgreSQL schema checked/initialized successfully.');
  return true;
};

module.exports = { getPool, initDb };
