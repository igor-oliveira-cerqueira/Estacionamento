// Painel lateral com os veículos atualmente estacionados.
import * as api from '../api/estacionamentoApi.js';
import { $ } from '../ui/dom.js';
import { criarItemEstacionado, criarMensagemVazia } from '../ui/componentes.js';

let aoDarSaida = () => {};

/** `aoDarSaida(veiculo)` é chamado quando o atendente clica em "Dar saída". */
export function iniciarPainelEstacionados(opcoes) {
  aoDarSaida = opcoes.aoDarSaida;
}

export async function atualizarEstacionados() {
  const veiculos = await api.listarEstacionados();
  $('contador').textContent = veiculos.length;

  const caixa = $('estacionados');
  if (!veiculos.length) {
    caixa.replaceChildren(criarMensagemVazia('Nenhum veículo estacionado.'));
    return;
  }
  caixa.replaceChildren(...veiculos.map((v) => criarItemEstacionado(v, aoDarSaida)));
}
