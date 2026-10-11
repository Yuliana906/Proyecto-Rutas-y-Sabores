require('dotenv').config();
const { Pool, types } = require('pg');

// ---------- Conversión de tipos ----------
// Postgres devuelve NUMERIC y BIGINT como texto; los convertimos a número
types.setTypeParser(1700, (v) => parseFloat(v)); // NUMERIC
types.setTypeParser(20, (v) => parseInt(v, 10)); // BIGINT

// ---------- Verificación de variables de entorno ----------
const requeridas = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const faltantes = requeridas.filter((k) => !process.env[k]);
if (faltantes.length) {
  console.error(`❌ Faltan variables en el .env: ${faltantes.join(', ')}`);
}

// ---------- Pool de conexión a Supabase (PostgreSQL) ----------
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Error inesperado en PostgreSQL:', err.message);
});

// ---------- Prueba de conexión al arrancar ----------
pool
  .query('SELECT current_user')
  .then((r) => console.log(`✅ Conectado a Supabase como: ${r.rows[0].current_user}`))
  .catch((err) => console.error(`❌ No se pudo conectar a Supabase: ${err.message}`));

module.exports = pool;