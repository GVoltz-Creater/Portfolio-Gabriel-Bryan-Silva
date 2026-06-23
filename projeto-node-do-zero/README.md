# NODE do Zero — API de Vídeos

API REST simples para gerenciamento de vídeos, construída com [Fastify](https://fastify.dev/) e [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/)).

## Tecnologias

- Node.js (ES Modules)
- Fastify
- @fastify/cors
- @neondatabase/serverless / postgres
- dotenv

## Pré-requisitos

- Node.js 18+
- Uma instância PostgreSQL (ex: [Neon](https://neon.tech/))

## Instalação

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com a string de conexão do banco:

```env
DATABASE_URL=postgres://usuario:senha@host/banco
```

Crie a tabela `videos` no banco (executa uma única vez):

```bash
node create-table.js
```

## Executando o projeto

```bash
# modo desenvolvimento (com reload automático)
npm run dev

# modo produção
npm start
```

O servidor inicia por padrão na porta `3333` (ou na porta definida em `process.env.PORT`).

## Rotas da API

| Método | Rota          | Descrição                                  |
| ------ | ------------- | ------------------------------------------- |
| GET    | `/`           | Health check                                |
| GET    | `/videos`     | Lista vídeos (aceita `?search=` para busca) |
| POST   | `/videos`     | Cria um novo vídeo                          |
| PUT    | `/videos/:id` | Atualiza um vídeo existente                 |
| DELETE | `/videos/:id` | Remove um vídeo                             |

### Corpo esperado (POST e PUT)

```json
{
  "title": "Título do vídeo",
  "description": "Descrição do vídeo",
  "duration": 180
}
```

Exemplos de requisições prontos para uso estão em [rotas.http](rotas.http).

## Estrutura do projeto

```
.
├── server.js              # Definição do servidor e das rotas
├── db.js                  # Conexão com o banco de dados
├── create-table.js        # Script para criar a tabela videos
├── database-postgres.js   # Camada de acesso a dados (PostgreSQL)
├── database-memory.js     # Camada de acesso a dados em memória (referência/estudo)
└── rotas.http              # Exemplos de requisições HTTP
```
