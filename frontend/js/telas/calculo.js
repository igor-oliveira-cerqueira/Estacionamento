// RF02 — Calcular valor do estacionamento (não registra a saída)
import * as api from '../api/estacionamentoApi.js';
import { $ } from '../ui/dom.js';
import { enviarFormulario } from '../ui/formulario.js';
import { renderizarResumoCobranca } from '../ui/componentes.js';
import { horaAgora } from '../utils/tempo.js';

export function iniciarTelaCalculo() {
  const form = $('form-calculo');
  const resultado = $('resultado-calculo');
  $('calculo-hora').value = horaAgora();

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    enviarFormulario(form, async () => {
      const dados = await api.calcularValor($('calculo-placa').value, $('calculo-hora').value);
      renderizarResumoCobranca(resultado, dados, 'Valor a pagar');
    });
  });

  // Esconde o resultado antigo quando o atendente muda os dados
  ['calculo-placa', 'calculo-hora'].forEach((id) =>
    $(id).addEventListener('input', () => (resultado.hidden = true))
  );
}
