import { $ } from './dom.js';

let temporizador;

/** Mostra uma mensagem de sucesso ('ok') ou erro ('erro') por alguns segundos. */
export function avisar(texto, tipo = 'ok') {
  const el = $('aviso');
  el.textContent = texto;
  el.className = `aviso ${tipo}`;
  el.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (el.hidden = true), 6000);
}

export function esconderAviso() {
  $('aviso').hidden = true;
}
