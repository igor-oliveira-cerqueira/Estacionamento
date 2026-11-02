const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const {
  lerOpcoes,
  validarNomeBanco,
  ajustarNomeDoBanco,
  mensagemDeErro,
} = require('../scripts/criar-banco');

const lerArquivo = (nome) => fs.readFileSync(path.join(__dirname, '..', nome), 'utf8');

test('lerOpcoes', () => {
  assert.deepStrictEqual(lerOpcoes([]), { reset: false, seed: false });
  assert.deepStrictEqual(lerOpcoes(['--reset', '--seed']), { reset: true, seed: true });
});

test('validarNomeBanco recusa nomes perigosos', () => {
  assert.strictEqual(validarNomeBanco('meu_banco1'), 'meu_banco1');
  assert.throws(() => validarNomeBanco('x`; DROP DATABASE mysql; --'), /inválido/);
  assert.throws(() => validarNomeBanco(''), /inválido/);
});

test('ajustarNomeDoBanco troca CREATE DATABASE e USE no schema e no seed', () => {
  const schema = ajustarNomeDoBanco(lerArquivo('schema.sql'), 'outro_nome');
  assert.match(schema, /CREATE DATABASE IF NOT EXISTS outro_nome/);
  assert.match(schema, /^USE outro_nome;/m);
  assert.doesNotMatch(schema, /^USE estacionamento/m);

  const seed = ajustarNomeDoBanco(lerArquivo('seed.sql'), 'outro_nome');
  assert.match(seed, /^USE outro_nome;/m);
});

test('schema.sql define a tabela e o índice que impede placa ativa duplicada', () => {
  const schema = lerArquivo('schema.sql');
  assert.match(schema, /CREATE TABLE IF NOT EXISTS registros/);
  assert.match(schema, /UNIQUE KEY uq_placa_ativa \(placa_ativa\)/);
});

test('mensagens de erro amigáveis', () => {
  assert.match(mensagemDeErro({ code: 'ECONNREFUSED' }), /MySQL/);
  assert.match(mensagemDeErro({ code: 'ER_ACCESS_DENIED_ERROR' }), /senha/);
  assert.match(mensagemDeErro({ code: 'X', message: 'falhou' }), /falhou/);
});
