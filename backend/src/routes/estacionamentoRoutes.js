const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const controlador = require('../controllers/estacionamentoController');

const rotas = Router();

rotas.post('/entrada', asyncHandler(controlador.registrarEntrada)); // RF01
rotas.post('/calcular', asyncHandler(controlador.calcularValor)); // RF02
rotas.post('/saida', asyncHandler(controlador.registrarSaida)); // RF03
rotas.get('/receita', asyncHandler(controlador.consultarReceita)); // RF04

rotas.get('/estacionados', asyncHandler(controlador.listarEstacionados));
rotas.get('/historico', asyncHandler(controlador.listarHistorico));

module.exports = rotas;
