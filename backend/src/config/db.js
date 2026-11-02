require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'estacionamento',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // devolve DATETIME como string "YYYY-MM-DD HH:MM:SS"
});

/**
 * Executa `operacao(conn)` dentro de uma transação.
 * Faz commit se tudo der certo e rollback se algo lançar erro.
 */
async function comTransacao(operacao) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const resultado = await operacao(conn);
    await conn.commit();
    return resultado;
  } catch (err) {
    await conn.rollback().catch(() => {});
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { pool, comTransacao };
