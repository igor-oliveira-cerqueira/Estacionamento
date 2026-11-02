// Uma função por endpoint do backend.
import { get, post } from './client.js';

export const registrarEntrada = (placa, entrada) => post('/entrada', { placa, entrada });
export const calcularValor = (placa, saida) => post('/calcular', { placa, saida });
export const registrarSaida = (placa, saida) => post('/saida', { placa, saida });

export const obterReceita = () => get('/receita');
export const listarEstacionados = () => get('/estacionados');
export const listarHistorico = () => get('/historico');
