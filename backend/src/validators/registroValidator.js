const ErroNegocio = require('../errors/ErroNegocio');
const { normalizarPlaca } = require('../utils/placa');
const { horarioParaMinutos, horaAgora } = require('../utils/tempo');

/** Valida e normaliza a placa. Lança ErroNegocio (400) se inválida. */
function validarPlaca(valor) {
  const placa = normalizarPlaca(valor);
  if (!placa) throw new ErroNegocio('Placa inválida. Exemplos: ABC-1234 ou ABC1D23.');
  return placa;
}

/**
 * Valida um horário "HH:MM". Se vier vazio, usa a hora atual.
 * Retorna { hhmm, minutos }.
 */
function validarHorario(valor, rotulo) {
  const texto = valor && String(valor).trim() ? String(valor).trim() : horaAgora();
  const minutos = horarioParaMinutos(texto);
  if (minutos === null) {
    throw new ErroNegocio(`${rotulo} inválido. Use o formato HH:MM (ex.: 08:00).`);
  }
  return { hhmm: texto, minutos };
}

module.exports = { validarPlaca, validarHorario };
