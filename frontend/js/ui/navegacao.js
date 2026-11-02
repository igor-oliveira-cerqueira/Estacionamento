import { esconderAviso } from './aviso.js';

let aoMudarTela = () => {};

/** Mostra a tela `nome` e marca o botão do menu correspondente. */
export function mostrarTela(nome) {
  document
    .querySelectorAll('.tela')
    .forEach((tela) => tela.classList.toggle('ativa', tela.id === `tela-${nome}`));
  document
    .querySelectorAll('.menu-btn')
    .forEach((botao) => botao.classList.toggle('ativo', botao.dataset.tela === nome));
  esconderAviso();
  aoMudarTela(nome);
}

/** Liga os botões do menu. `aoMudar(nome)` é chamado a cada troca de tela. */
export function iniciarNavegacao(aoMudar) {
  aoMudarTela = aoMudar;
  document
    .querySelectorAll('.menu-btn')
    .forEach((botao) => botao.addEventListener('click', () => mostrarTela(botao.dataset.tela)));
}
