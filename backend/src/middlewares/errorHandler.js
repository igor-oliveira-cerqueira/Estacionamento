const ErroNegocio = require('../errors/ErroNegocio');

/** Rota /api/... que não existe. */
function apiNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}

/** Converte qualquer erro em resposta JSON. Deve ser o último middleware. */
// eslint-disable-next-line no-unused-vars
function tratarErros(err, req, res, next) {
  if (err instanceof ErroNegocio) {
    return res.status(err.status).json({ erro: err.message });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno. Verifique a conexão com o banco de dados.' });
}

module.exports = { apiNaoEncontrada, tratarErros };
