const { test } = require('node:test');
const assert = require('node:assert');
const {
  horarioParaMinutos,
  minutosDoDatetime,
  horaDoDatetime,
  dataDoDatetime,
  montarDatetime,
} = require('../src/utils/tempo');

test('horarioParaMinutos', () => {
  assert.strictEqual(horarioParaMinutos('08:00'), 480);
  assert.strictEqual(horarioParaMinutos('23:59'), 1439);
  assert.strictEqual(horarioParaMinutos('24:00'), null);
  assert.strictEqual(horarioParaMinutos('8:00'), null);
  assert.strictEqual(horarioParaMinutos(null), null);
});

test('conversões com DATETIME', () => {
  const dt = '2026-11-02 10:20:00';
  assert.strictEqual(dataDoDatetime(dt), '2026-11-02');
  assert.strictEqual(horaDoDatetime(dt), '10:20');
  assert.strictEqual(minutosDoDatetime(dt), 620);
  assert.strictEqual(montarDatetime('2026-11-02', '10:20'), dt);
});
