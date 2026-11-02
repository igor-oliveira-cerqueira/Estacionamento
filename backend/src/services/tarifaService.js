// Regras de cálculo puras (sem banco, sem HTTP): fáceis de testar.
const ErroNegocio = require('../errors/ErroNegocio');
const { TARIFA_POR_HORA } = require('../config/constants');

/** Minutos entre entrada e saída (ambos em minutos desde 00:00, mesmo dia). */
function calcularPermanencia(entradaMin, saidaMin) {
  if (saidaMin < entradaMin) {
    throw new ErroNegocio('O horário de saída não pode ser anterior ao de entrada.');
  }
  return saidaMin - entradaMin;
}

/** Qualquer fração de hora vale 1 hora cheia; mínimo de 1 hora. */
function calcularCobranca(minutosPermanencia) {
  const horas = Math.max(1, Math.ceil(minutosPermanencia / 60));
  const valor = Math.round(horas * TARIFA_POR_HORA * 100) / 100;
  return { horas, valor };
}

module.exports = { calcularPermanencia, calcularCobranca };
