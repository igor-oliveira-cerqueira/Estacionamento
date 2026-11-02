import { avisar } from './aviso.js';

/**
 * Executa `acao` enquanto desabilita o botão de envio (evita duplo clique)
 * e mostra qualquer erro como aviso.
 */
export async function enviarFormulario(form, acao) {
  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  try {
    await acao();
  } catch (erro) {
    avisar(erro.message, 'erro');
  } finally {
    botao.disabled = false;
  }
}
