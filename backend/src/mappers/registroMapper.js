const { horaDoDatetime } = require('../utils/tempo');

/** Converte uma linha do banco no formato enviado ao frontend. */
function toRegistroDTO(linha) {
  return {
    id: linha.id,
    placa: linha.placa,
    entrada: horaDoDatetime(linha.entrada),
    saida: linha.saida ? horaDoDatetime(linha.saida) : null,
    horasCobradas: linha.horas_cobradas,
    valor: linha.valor === null ? null : Number(linha.valor),
  };
}

module.exports = { toRegistroDTO };
