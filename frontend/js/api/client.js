import { API_BASE } from '../config.js';

/** Faz a requisição e devolve o JSON; erros viram `Error` com mensagem legível. */
async function requisitar(rota, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_BASE}${rota}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Ele está rodando?');
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || 'Erro inesperado.');
  return dados;
}

export const get = (rota) => requisitar(rota);

export const post = (rota, corpo) =>
  requisitar(rota, { method: 'POST', body: JSON.stringify(corpo) });
