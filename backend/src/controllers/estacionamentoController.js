// Camada HTTP: lê a requisição, chama o serviço e monta a resposta.
const servico = require('../services/estacionamentoService');

async function registrarEntrada(req, res) {
  const registro = await servico.registrarEntrada(req.body);
  res.status(201).json({ mensagem: 'Entrada registrada. Veículo estacionado.', registro });
}

async function calcularValor(req, res) {
  res.json(await servico.calcularValor(req.body));
}

async function registrarSaida(req, res) {
  const resultado = await servico.registrarSaida(req.body);
  res.json({ mensagem: 'Saída registrada com sucesso.', ...resultado });
}

async function consultarReceita(req, res) {
  res.json(await servico.consultarReceita());
}

async function listarEstacionados(req, res) {
  res.json(await servico.listarEstacionados());
}

async function listarHistorico(req, res) {
  res.json(await servico.listarHistorico());
}

module.exports = {
  registrarEntrada,
  calcularValor,
  registrarSaida,
  consultarReceita,
  listarEstacionados,
  listarHistorico,
};
