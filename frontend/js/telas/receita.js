// RF04 — Receita total e histórico de saídas
import * as api from '../api/estacionamentoApi.js';
import { $ } from '../ui/dom.js';
import { criarItemHistorico, criarMensagemVazia } from '../ui/componentes.js';
import { moeda } from '../utils/formatters.js';

export async function carregarReceita() {
  const [receita, historico] = await Promise.all([api.obterReceita(), api.listarHistorico()]);

  $('receita-valor').textContent = moeda(receita.receitaTotal);
  $('receita-saidas').textContent = `${receita.saidasRegistradas} saída(s) registrada(s)`;

  const caixa = $('historico');
  if (!historico.length) {
    caixa.replaceChildren(criarMensagemVazia('Nenhuma saída registrada ainda.'));
    return;
  }
  caixa.replaceChildren(...historico.map(criarItemHistorico));
}
