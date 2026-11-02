// Monta a aplicação Express (sem iniciar o servidor, o que facilita testes).
const path = require('path');
const express = require('express');
const cors = require('cors');
const rotasEstacionamento = require('./routes/estacionamentoRoutes');
const { apiNaoEncontrada, tratarErros } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Frontend estático
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// API
app.use('/api', rotasEstacionamento);
app.use('/api', apiNaoEncontrada);

app.use(tratarErros);

module.exports = app;
