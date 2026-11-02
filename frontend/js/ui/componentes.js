// Funções que montam pedaços de HTML reutilizados pelas telas.
import { formatarPlaca, formatarDuracao, moeda } from '../utils/formatters.js';

function criar(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

export function criarMensagemVazia(texto) {
  return criar('p', 'vazio', texto);
}

/** Linha da lista de veículos estacionados, com botão "Dar saída". */
export function criarItemEstacionado(veiculo, aoDarSaida) {
  const info = criar('div');
  info.append(
    criar('div', 'placa', formatarPlaca(veiculo.placa)),
    criar('div', 'detalhe', `Entrada às ${veiculo.entrada}`)
  );

  const botao = criar('button', '', 'Dar saída');
  botao.type = 'button';
  botao.addEventListener('click', () => aoDarSaida(veiculo));

  const item = criar('div', 'item');
  item.append(info, botao);
  return item;
}

/** Linha do histórico de saídas. */
export function criarItemHistorico(registro) {
  const info = criar('div');
  info.append(
    criar('div', 'placa', formatarPlaca(registro.placa)),
    criar(
      'div',
      'detalhe',
      `${registro.entrada} → ${registro.saida} · ${registro.horasCobradas}h cobrada(s)`
    )
  );

  const item = criar('div', 'item');
  item.append(info, criar('span', 'valor', moeda(registro.valor)));
  return item;
}

/** Preenche `container` com o resumo de uma cobrança (cálculo ou saída). */
export function renderizarResumoCobranca(container, dados, rotuloTotal) {
  const linhas = [
    ['Placa', formatarPlaca(dados.placa)],
    ['Entrada', dados.entrada],
    ['Saída', dados.saida],
    ['Permanência', formatarDuracao(dados.permanenciaMinutos)],
    ['Horas cobradas', String(dados.horasCobradas)],
  ];

  const lista = criar('dl');
  linhas.forEach(([rotulo, valor]) => lista.append(criar('dt', '', rotulo), criar('dd', '', valor)));
  lista.append(criar('dt', '', rotuloTotal), criar('dd', 'total', moeda(dados.valor)));

  container.replaceChildren(lista);
  container.hidden = false;
}
