# Sistema de Estacionamento (PW / PAM)

Frontend responsivo em HTML/CSS/JS (módulos ES) + backend Node.js (Express) + MySQL.

## Como rodar

Pré-requisitos: Node.js 18+ e um servidor MySQL 8 (ou MariaDB 10.2+) ligado.

1. `cd backend && cp .env.example .env` e edite `DB_USER` / `DB_PASSWORD`
2. `npm install`
3. **Crie o banco:** `npm run db:criar`
4. `npm start`
5. Abra **http://localhost:3000** (no celular, use o IP do computador na mesma rede, ex.: `http://192.168.0.10:3000`)

### Comandos do banco

| Comando | O que faz |
|---|---|
| `npm run db:criar` | Cria o banco `estacionamento` e a tabela `registros` (não apaga nada que já exista) |
| `npm run db:exemplo` | Igual ao anterior, e insere dados de exemplo se a tabela estiver vazia (2 saídas = R$ 25,00 de receita e 1 veículo estacionado) |
| `npm run db:reset` | **Apaga o banco inteiro** e cria de novo, vazio |

Prefere importar na mão (MySQL Workbench, phpMyAdmin, terminal)? Execute o arquivo `backend/schema.sql` (e, se quiser os dados de exemplo, `backend/seed.sql`):

```
mysql -u root -p < backend/schema.sql
mysql -u root -p < backend/seed.sql
```

O nome do banco vem de `DB_NAME` no `.env` (padrão: `estacionamento`).

> O frontend usa módulos ES, que **não funcionam abrindo o `index.html` direto do disco** (`file://`). Acesse sempre pelo servidor Node.

`npm test` roda os testes (não precisam de banco).

## Estrutura

```
estacionamento/
├── backend/
│   ├── schema.sql                         # CREATE DATABASE + tabela registros
│   ├── seed.sql                           # dados de exemplo (opcional)
│   ├── .env.example
│   ├── scripts/criar-banco.js             # npm run db:criar / db:exemplo / db:reset
│   ├── src/
│   │   ├── server.js                      # só inicia o servidor (listen)
│   │   ├── app.js                         # monta o Express: middlewares, rotas, estáticos
│   │   ├── config/
│   │   │   ├── constants.js               # tarifa, limite do histórico
│   │   │   └── db.js                      # pool MySQL + comTransacao()
│   │   ├── routes/estacionamentoRoutes.js # URL -> controller
│   │   ├── controllers/                   # camada HTTP (req/res)
│   │   ├── services/
│   │   │   ├── estacionamentoService.js   # casos de uso (RF01–RF04)
│   │   │   └── tarifaService.js           # cálculo de permanência e valor
│   │   ├── repositories/registroRepository.js  # único lugar com SQL
│   │   ├── validators/registroValidator.js     # valida placa e horário
│   │   ├── mappers/registroMapper.js      # linha do banco -> JSON da API
│   │   ├── middlewares/errorHandler.js    # erros -> respostas JSON
│   │   ├── errors/ErroNegocio.js          # erro com status HTTP
│   │   └── utils/                         # placa.js, tempo.js, asyncHandler.js
│   └── test/                              # um arquivo de teste por módulo
└── frontend/
    ├── index.html
    ├── css/
    │   ├── base.css                       # variáveis, reset, cabeçalho
    │   ├── layout.css                     # menu, grade, responsividade
    │   └── components.css                 # formulários, botões, listas
    └── js/
        ├── main.js                        # ponto de entrada: liga as telas
        ├── config.js                      # endereço da API
        ├── api/
        │   ├── client.js                  # fetch + tratamento de erro
        │   └── estacionamentoApi.js       # uma função por endpoint
        ├── telas/                         # entrada, calculo, saida, receita, estacionados
        ├── ui/                            # dom, aviso, formulario, navegacao, componentes
        └── utils/                         # formatters.js, tempo.js
```

### Fluxo de uma requisição no backend

`routes` → `controllers` → `services` → `repositories` → MySQL.
Cada camada só fala com a de baixo: o controller não tem regra de negócio, o serviço não conhece HTTP e só o repositório escreve SQL.

### Onde mexer quando…

| Quero mudar… | Arquivo |
|---|---|
| valor da tarifa | `backend/src/config/constants.js` |
| regra de arredondamento | `backend/src/services/tarifaService.js` |
| formato aceito de placa | `backend/src/utils/placa.js` |
| uma consulta SQL | `backend/src/repositories/registroRepository.js` |
| mensagem de erro de validação | `backend/src/validators/registroValidator.js` |
| visual de uma tela | `frontend/js/telas/<tela>.js` e `frontend/css/` |
| endereço da API | `frontend/js/config.js` |

## Mapeamento com o enunciado

| Item | Onde |
|---|---|
| RF01 Registrar entrada | `POST /api/entrada` |
| RF02 Calcular valor | `POST /api/calcular` (não grava nada) |
| RF03 Registrar saída | `POST /api/saida` |
| RF04 Receita total | `GET /api/receita` (soma só quem já saiu) |
| Menu | Botões 1 a 4 no topo da página |
| Veículo não entra duas vezes | Checagem na API + índice único `placa_ativa` no MySQL |
| Saída de veículo inexistente | Erro 404 "Veículo não encontrado no estacionamento." |
| Reentrada após saída | Cada permanência é uma nova linha em `registros` |
| Fração de hora | `Math.ceil(min / 60)`, com mínimo de 1 hora |
| Várias operações sem reiniciar | Frontend e API continuam rodando |

## Decisões

- **Estrutura de dados:** tabela `registros` com uma linha por permanência; `saida IS NULL` significa que o veículo está estacionado.
- **Horários:** informados em `HH:MM` (mesmo dia). Se o campo ficar vazio, usa a hora atual. A saída não pode ser anterior à entrada.
- **Placas:** aceita ABC-1234 e Mercosul ABC1D23, com ou sem hífen.
