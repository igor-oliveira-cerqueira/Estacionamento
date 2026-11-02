// Aceita ABC-1234 (antiga) e ABC1D23 (Mercosul), com ou sem hífen.
const REGEX_PLACA = /^[A-Z]{3}\d[A-Z0-9]\d{2}$/;

/** Retorna a placa em maiúsculas e sem hífen, ou null se for inválida. */
function normalizarPlaca(texto) {
  if (typeof texto !== 'string') return null;
  const placa = texto.toUpperCase().replace(/[\s-]/g, '');
  return REGEX_PLACA.test(placa) ? placa : null;
}

module.exports = { normalizarPlaca };
