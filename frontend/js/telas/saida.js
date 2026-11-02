// RF03 — Registrar saída
import * as api from '../api/estacionamentoApi.js';
import { $ } from '../ui/dom.js';
import { avisar } from '../ui/aviso.js';
import { enviarFormulario } from '../ui/formulario.js';
import { renderizarResumoCobranca } from '../ui/componentes.js';
import { formatarPlaca } from '../utils/formatters.js';
import { horaAgora } from '../utils/tempo.js';

/** Preenche o formulário (usado pelo botão "Dar saída" da lista de estacionados). */
export function preencherSaida(placa) {
  $('saida-placa').value = formatarPlaca(placa);
  $('saida-hora').value = horaAgora();
  $('resultado-saida').hidden = true;
}

/** `aoRegistrar()` é chamado depois de uma saída registrada com sucesso. */
export function iniciarTelaSaida({ aoRegistrar }) {
  const form = $('form-saida');
  const resultado = $('resultado-saida');
  $('saida-hora').value = horaAgora();

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    enviarFormulario(form, async () => {
      const { mensagem, ...dados } = await api.registrarSaida(
        $('saida-placa').value,
        $('saida-hora').value
      );
      renderizarResumoCobranca(resultado, dados, 'Valor devido');
      avisar(mensagem);
      $('saida-placa').value = '';
      await aoRegistrar();
    });
  });

  ['saida-placa', 'saida-hora'].forEach((id) =>
    $(id).addEventListener('input', () => (resultado.hidden = true))
  );
}
