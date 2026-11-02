// Única camada que conhece SQL. Todas as funções aceitam uma conexão
// opcional (`db`) para poderem participar de uma transação.
const { pool } = require('../config/db');

async function inserirEntrada(placa, entradaDatetime, db = pool) {
  const [resultado] = await db.query('INSERT INTO registros (placa, entrada) VALUES (?, ?)', [
    placa,
    entradaDatetime,
  ]);
  return resultado.insertId;
}

/** Permanência em aberto (sem saída) da placa, ou null. */
async function buscarAtivoPorPlaca(placa, { db = pool, bloquear = false } = {}) {
  const [linhas] = await db.query(
    `SELECT id, placa, entrada FROM registros
      WHERE placa = ? AND saida IS NULL ${bloquear ? 'FOR UPDATE' : ''}`,
    [placa]
  );
  return linhas[0] || null;
}

async function registrarSaida(id, saidaDatetime, horasCobradas, valor, db = pool) {
  await db.query('UPDATE registros SET saida = ?, horas_cobradas = ?, valor = ? WHERE id = ?', [
    saidaDatetime,
    horasCobradas,
    valor,
    id,
  ]);
}

async function somarReceita(db = pool) {
  const [linhas] = await db.query(
    `SELECT COALESCE(SUM(valor), 0) AS total, COUNT(*) AS saidas
       FROM registros WHERE saida IS NOT NULL`
  );
  return { total: Number(linhas[0].total), saidas: linhas[0].saidas };
}

async function listarEstacionados(db = pool) {
  const [linhas] = await db.query(
    'SELECT * FROM registros WHERE saida IS NULL ORDER BY entrada, id'
  );
  return linhas;
}

async function listarSaidas(limite, db = pool) {
  const [linhas] = await db.query(
    'SELECT * FROM registros WHERE saida IS NOT NULL ORDER BY saida DESC, id DESC LIMIT ?',
    [Number(limite)]
  );
  return linhas;
}

module.exports = {
  inserirEntrada,
  buscarAtivoPorPlaca,
  registrarSaida,
  somarReceita,
  listarEstacionados,
  listarSaidas,
};
