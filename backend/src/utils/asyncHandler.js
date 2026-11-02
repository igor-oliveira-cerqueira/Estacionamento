// Evita try/catch repetido: erros de handlers async vão direto ao middleware de erro.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
