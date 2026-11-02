// Casos de uso do estacionamento: orquestra validação, regras e repositório.
// Não conhece HTTP (req/res).
const { comTransacao } = require('../config/db');
const { TARIFA_POR_HORA, LIMITE_HISTORICO } = require('../config/constants');
const ErroNegocio = require('../errors/ErroNegocio');
const repositorio = require('../repositories/registroRepository');
const { toRegistroDTO } = require('../mappers/registroMapper');
const { validarPlaca, validarHorario } = require('../validators/registroValidator');
const { calcularPermanencia, calcularCobranca } = require('./tarifaService');
const {
  hojeISO,
  montarDatetime,
  dataDoDatetime,
  horaDoDatetime,
  minutosDoDatetime,
} = require('../utils/tempo');

function exigirVeiculoEstacionado(ativo) {
  if (!ativo) throw new ErroNegocio('Veículo não encontrado no estacionamento.', 404);
  return ativo;
}

/** Tempo e valor de uma permanência em aberto, caso saia em `saidaMin`. */
function apurarCobranca(ativo, saidaMin) {
  const permanenciaMinutos = calcularPermanencia(minutosDoDatetime(ativo.entrada), saidaMin);
  const { horas, valor } = calcularCobranca(permanenciaMinutos);
  return { permanenciaMinutos, horasCobradas: horas, valor };
}

// RF01
async function registrarEntrada({ placa, entrada }) {
  const placaValida = validarPlaca(placa);
  const { hhmm } = validarHorario(entrada, 'Horário de entrada');

  try {
    const id = await repositorio.inserirEntrada(placaValida, montarDatetime(hojeISO(), hhmm));
    return { id, placa: placaValida, entrada: hhmm };
  } catch (err) {
    // índice único placa_ativa: o veículo já está estacionado
    if (err.code === 'ER_DUP_ENTRY') {
      throw new ErroNegocio('Este veículo já está estacionado.', 409);
    }
    throw err;
  }
}

// RF02 (não grava nada)
async function calcularValor({ placa, saida }) {
  const placaValida = validarPlaca(placa);
  const { hhmm, minutos } = validarHorario(saida, 'Horário de saída');

  const ativo = exigirVeiculoEstacionado(await repositorio.buscarAtivoPorPlaca(placaValida));
  return {
    placa: placaValida,
    entrada: horaDoDatetime(ativo.entrada),
    saida: hhmm,
    ...apurarCobranca(ativo, minutos),
    tarifaPorHora: TARIFA_POR_HORA,
  };
}

// RF03
async function registrarSaida({ placa, saida }) {
  const placaValida = validarPlaca(placa);
  const { hhmm, minutos } = validarHorario(saida, 'Horário de saída');

  return comTransacao(async (conn) => {
    const ativo = exigirVeiculoEstacionado(
      await repositorio.buscarAtivoPorPlaca(placaValida, { db: conn, bloquear: true })
    );
    const apuracao = apurarCobranca(ativo, minutos);

    await repositorio.registrarSaida(
      ativo.id,
      montarDatetime(dataDoDatetime(ativo.entrada), hhmm),
      apuracao.horasCobradas,
      apuracao.valor,
      conn
    );

    return { placa: placaValida, entrada: horaDoDatetime(ativo.entrada), saida: hhmm, ...apuracao };
  });
}

// RF04
async function consultarReceita() {
  const { total, saidas } = await repositorio.somarReceita();
  return { receitaTotal: total, saidasRegistradas: saidas };
}

async function listarEstacionados() {
  return (await repositorio.listarEstacionados()).map(toRegistroDTO);
}

async function listarHistorico() {
  return (await repositorio.listarSaidas(LIMITE_HISTORICO)).map(toRegistroDTO);
}

module.exports = {
  registrarEntrada,
  calcularValor,
  registrarSaida,
  consultarReceita,
  listarEstacionados,
  listarHistorico,
};
