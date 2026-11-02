// Erro esperado (regra de negócio violada). Carrega o status HTTP a devolver.
class ErroNegocio extends Error {
  constructor(mensagem, status = 400) {
    super(mensagem);
    this.name = 'ErroNegocio';
    this.status = status;
  }
}

module.exports = ErroNegocio;
