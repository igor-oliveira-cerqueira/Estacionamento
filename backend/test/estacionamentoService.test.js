// Testa as regras de negócio de ponta a ponta (validação + serviço + mapper)
// usando um repositório em memória no lugar do MySQL.
const { test, beforeEach } = require('node:test');
const assert = require('node:assert');

let registros;
let proximoId;

const repositorioFalso = {
  async inserirEntrada(placa, entrada) {
    if (registros.some((r) => r.placa === placa && r.saida === null)) {
      const erro = new Error('duplicado');
      erro.code = 'ER_DUP_ENTRY'; // mesmo código que o índice único do MySQL devolve
      throw erro;
    }
    const id = proximoId++;
    registros.push({ id, placa, entrada, saida: null, horas_cobradas: null, valor: null });
    return id;
  },
  async buscarAtivoPorPlaca(placa) {
    return registros.find((r) => r.placa === placa && r.saida === null) || null;
  },
  async registrarSaida(id, saida, horas, valor) {
    Object.assign(registros.find((r) => r.id === id), { saida, horas_cobradas: horas, valor });
  },
  async somarReceita() {
    const feitas = registros.filter((r) => r.saida !== null);
    return { total: feitas.reduce((s, r) => s + r.valor, 0), saidas: feitas.length };
  },
  async listarEstacionados() {
    return registros.filter((r) => r.saida === null);
  },
  async listarSaidas() {
    return registros.filter((r) => r.saida !== null);
  },
};

function substituirModulo(caminho, exportacoes) {
  const resolvido = require.resolve(caminho);
  require.cache[resolvido] = { id: resolvido, filename: resolvido, loaded: true, exports: exportacoes };
}

substituirModulo('../src/config/db', { pool: {}, comTransacao: async (fn) => fn({}) });
substituirModulo('../src/repositories/registroRepository', repositorioFalso);
const servico = require('../src/services/estacionamentoService');

beforeEach(() => {
  registros = [];
  proximoId = 1;
});

test('exemplo do enunciado: 15 + 10 = receita de 25', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  const s1 = await servico.registrarSaida({ placa: 'ABC-1234', saida: '10:20' });
  assert.strictEqual(s1.horasCobradas, 3);
  assert.strictEqual(s1.valor, 15);
  assert.strictEqual((await servico.consultarReceita()).receitaTotal, 15);

  await servico.registrarEntrada({ placa: 'XYZ-9876', entrada: '09:00' });
  const s2 = await servico.registrarSaida({ placa: 'XYZ-9876', saida: '10:10' });
  assert.strictEqual(s2.valor, 10);
  assert.deepStrictEqual(await servico.consultarReceita(), { receitaTotal: 25, saidasRegistradas: 2 });
});

test('veículo estacionado não pode entrar de novo (409)', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  await assert.rejects(
    servico.registrarEntrada({ placa: 'abc1234', entrada: '08:30' }),
    (e) => e.status === 409 && /já está estacionado/.test(e.message)
  );
});

test('saída de veículo inexistente é recusada (404)', async () => {
  await assert.rejects(
    servico.registrarSaida({ placa: 'ABC-1234', saida: '10:00' }),
    (e) => e.status === 404
  );
  await assert.rejects(
    servico.calcularValor({ placa: 'ABC-1234', saida: '10:00' }),
    (e) => e.status === 404
  );
});

test('após a saída o veículo pode entrar de novo e vira novo registro', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  await servico.registrarSaida({ placa: 'ABC-1234', saida: '09:00' });
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '11:00' });
  await servico.registrarSaida({ placa: 'ABC-1234', saida: '11:30' });
  assert.deepStrictEqual(await servico.consultarReceita(), { receitaTotal: 10, saidasRegistradas: 2 });
});

test('permanência menor que 1 hora cobra 1 hora', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  const r = await servico.registrarSaida({ placa: 'ABC-1234', saida: '08:05' });
  assert.deepStrictEqual([r.horasCobradas, r.valor], [1, 5]);
});

test('calcular valor não altera nada: veículo segue estacionado e receita zerada', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  const calculo = await servico.calcularValor({ placa: 'ABC-1234', saida: '10:15' });
  assert.deepStrictEqual([calculo.horasCobradas, calculo.valor], [3, 15]);
  assert.strictEqual((await servico.listarEstacionados()).length, 1);
  assert.strictEqual((await servico.consultarReceita()).receitaTotal, 0);
});

test('receita ignora veículos que ainda não saíram', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  assert.strictEqual((await servico.consultarReceita()).receitaTotal, 0);
});

test('saída antes da entrada, placa e horário inválidos são recusados (400)', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '10:00' });
  await assert.rejects(servico.registrarSaida({ placa: 'ABC-1234', saida: '09:00' }), (e) => e.status === 400);
  await assert.rejects(servico.registrarEntrada({ placa: 'XX', entrada: '08:00' }), (e) => e.status === 400);
  await assert.rejects(servico.registrarEntrada({ placa: 'DEF-5678', entrada: '25:00' }), (e) => e.status === 400);
});

test('listas devolvem horários em HH:MM', async () => {
  await servico.registrarEntrada({ placa: 'ABC-1234', entrada: '08:00' });
  const [v] = await servico.listarEstacionados();
  assert.strictEqual(v.entrada, '08:00');
  assert.strictEqual(v.saida, null);
});
