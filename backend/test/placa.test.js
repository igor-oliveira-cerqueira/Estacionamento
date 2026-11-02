const { test } = require('node:test');
const assert = require('node:assert');
const { normalizarPlaca } = require('../src/utils/placa');

test('normaliza maiúsculas e hífen', () => {
  assert.strictEqual(normalizarPlaca('abc-1234'), 'ABC1234');
  assert.strictEqual(normalizarPlaca(' ABC 1234 '), 'ABC1234');
});

test('aceita padrão Mercosul', () => {
  assert.strictEqual(normalizarPlaca('ABC1D23'), 'ABC1D23');
});

test('recusa placas inválidas', () => {
  assert.strictEqual(normalizarPlaca('AB-1234'), null);
  assert.strictEqual(normalizarPlaca('ABCD123'), null);
  assert.strictEqual(normalizarPlaca(''), null);
  assert.strictEqual(normalizarPlaca(undefined), null);
});
