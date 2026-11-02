// Cria o banco e a tabela no MySQL a partir de schema.sql, usando o .env.
//
//   npm run db:criar     -> cria o banco e a tabela (não apaga nada que já exista)
//   npm run db:exemplo   -> cria e insere dados de exemplo (se a tabela estiver vazia)
//   npm run db:reset     -> APAGA o banco inteiro e cria de novo
//
// As opções --reset e --seed também podem ser combinadas.
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const NOME_PADRAO = 'estacionamento';

function lerOpcoes(argv) {
  return { reset: argv.includes('--reset'), seed: argv.includes('--seed') };
}

/** O nome vai para dentro de comandos SQL, então só aceita letras, números e _. */
function validarNomeBanco(nome) {
  if (!/^[A-Za-z0-9_]{1,64}$/.test(nome)) {
    throw new Error('DB_NAME inválido no .env. Use apenas letras, números e "_".');
  }
  return nome;
}

/** Troca o nome do banco nos comandos CREATE DATABASE e USE dos arquivos .sql. */
function ajustarNomeDoBanco(sql, nome) {
  return sql.replace(/^(CREATE DATABASE IF NOT EXISTS|USE)\s+estacionamento\b/gim, `$1 ${nome}`);
}

function lerSql(arquivo, nomeBanco) {
  return ajustarNomeDoBanco(fs.readFileSync(path.join(RAIZ, arquivo), 'utf8'), nomeBanco);
}

function mensagemDeErro(erro) {
  switch (erro.code) {
    case 'ECONNREFUSED':
      return 'Não foi possível conectar ao MySQL. Ele está ligado? Confira DB_HOST e DB_PORT no .env.';
    case 'ER_ACCESS_DENIED_ERROR':
      return 'Usuário ou senha do MySQL recusados. Confira DB_USER e DB_PASSWORD no .env.';
    case 'MODULE_NOT_FOUND':
      return 'Dependências ausentes. Rode "npm install" antes.';
    default:
      return `Erro ao criar o banco: ${erro.message}`;
  }
}

async function executar({ reset, seed }) {
  require('dotenv').config({ path: path.join(RAIZ, '.env') });
  const mysql = require('mysql2/promise');

  const nome = validarNomeBanco(process.env.DB_NAME || NOME_PADRAO);
  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true, // os .sql têm vários comandos
  });

  try {
    if (reset) {
      await conexao.query(`DROP DATABASE IF EXISTS \`${nome}\``);
      console.log(`Banco "${nome}" apagado.`);
    }

    await conexao.query(lerSql('schema.sql', nome));
    console.log(`Banco "${nome}" pronto: tabela "registros" criada.`);

    if (seed) {
      const [[{ total }]] = await conexao.query('SELECT COUNT(*) AS total FROM registros');
      if (total > 0) {
        console.log('Dados de exemplo ignorados: a tabela já tem registros (use db:reset para recomeçar).');
      } else {
        await conexao.query(lerSql('seed.sql', nome));
        console.log('Dados de exemplo inseridos: 2 saídas (receita de R$ 25,00) e 1 veículo estacionado.');
      }
    }
  } finally {
    await conexao.end();
  }
}

if (require.main === module) {
  executar(lerOpcoes(process.argv.slice(2))).catch((erro) => {
    console.error(mensagemDeErro(erro));
    process.exit(1);
  });
}

module.exports = { lerOpcoes, validarNomeBanco, ajustarNomeDoBanco, mensagemDeErro };
