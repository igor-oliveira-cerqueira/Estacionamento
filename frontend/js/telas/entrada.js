// RF01 — Registrar entrada
import * as api from '../api/estacionamentoApi.js';
import { $ } from '../ui/dom.js';
import { avisar } from '../ui/aviso.js';
import { enviarFormulario } from '../ui/formulario.js';
import { formatarPlaca } from '../utils/formatters.js';
import { horaAgora } from '../utils/tempo.js';

/** `aoRegistrar()` é chamado depois de uma entrada registrada com sucesso. */
export function iniciarTelaEntrada({ aoRegistrar }) {
  const form = $('form-entrada');
  $('entrada-hora').value = horaAgora();

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    enviarFormulario(form, async () => {
      const { mensagem, registro } = await api.registrarEntrada(
        $('entrada-placa').value,
        $('entrada-hora').value
      );
      avisar(`${mensagem} (${formatarPlaca(registro.placa)} às ${registro.entrada})`);
      $('entrada-placa').value = '';
      await aoRegistrar();
    });
  });
}
