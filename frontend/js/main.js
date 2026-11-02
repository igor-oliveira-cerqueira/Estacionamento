// Ponto de entrada: só liga as peças. A lógica de cada tela fica em js/telas/.
import { avisar } from './ui/aviso.js';
import { iniciarNavegacao, mostrarTela } from './ui/navegacao.js';
import { iniciarTelaEntrada } from './telas/entrada.js';
import { iniciarTelaCalculo } from './telas/calculo.js';
import { iniciarTelaSaida, preencherSaida } from './telas/saida.js';
import { carregarReceita } from './telas/receita.js';
import { iniciarPainelEstacionados, atualizarEstacionados } from './telas/estacionados.js';

const mostrarErro = (erro) => avisar(erro.message, 'erro');

iniciarNavegacao((tela) => {
  if (tela === 'receita') carregarReceita().catch(mostrarErro);
});

iniciarPainelEstacionados({
  aoDarSaida: (veiculo) => {
    preencherSaida(veiculo.placa);
    mostrarTela('saida');
  },
});

iniciarTelaEntrada({ aoRegistrar: atualizarEstacionados });
iniciarTelaCalculo();
iniciarTelaSaida({ aoRegistrar: atualizarEstacionados });

atualizarEstacionados().catch(mostrarErro);
