const { test } = require('node:test');
const assert = require('node:assert');
const { calcularPermanencia, calcularCobranca } = require('../src/services/tarifaService');
const { horarioParaMinutos } = require('../src/utils/tempo');

const permanencia = (a, b) => calcularPermanencia(horarioParaMinutos(a), horarioParaMinutos(b));

test('exemplos do enunciado', () => {
  assert.deepStrictEqual(calcularCobranca(permanencia('08:00', '10:20')), { horas: 3, valor: 15 }); // 2h20
  assert.deepStrictEqual(calcularCobranca(135), { horas: 3, valor: 15 }); // 2h15
  assert.deepStrictEqual(calcularCobranca(70), { horas: 2, valor: 10 }); // 1h10
});

test('receita do exemplo: 15 + 10 = 25', () => {
  assert.strictEqual(calcularCobranca(140).valor + calcularCobranca(70).valor, 25);
});

test('fronteiras: menos de 1h cobra 1h, hora exata não arredonda', () => {
  assert.deepStrictEqual(calcularCobranca(0), { horas: 1, valor: 5 });
  assert.deepStrictEqual(calcularCobranca(1), { horas: 1, valor: 5 });
  assert.deepStrictEqual(calcularCobranca(60), { horas: 1, valor: 5 });
  assert.deepStrictEqual(calcularCobranca(61), { horas: 2, valor: 10 });
});

test('saída anterior à entrada é recusada', () => {
  assert.throws(() => permanencia('10:00', '09:59'), /anterior ao de entrada/);
});
