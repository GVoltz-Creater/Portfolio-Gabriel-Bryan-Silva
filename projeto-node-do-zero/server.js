// import { createServer } from "node:http";

// const server = createServer((request, response) => {
//  response.write("Hello World");

//  return response.end();
//});

//server.listen(3333); // Porta onde o servidor vai rodar

//CRUD = Create, Read, Update, Delete (Criar, Ler, Atualizar, Deletar) - são as operações básicas de um banco de dados, ou seja, são as operações que podemos fazer com os dados armazenados em um banco de dados.

// O fastify é um framework para criar servidores de forma mais fácil e rápida, ele tem uma sintaxe mais simples e intuitiva do que o node puro, além de ser mais rápido e leve.

//Rotas são os caminhos que o servidor vai responder, ou seja, quando o usuário acessar a rota, o servidor vai executar a função que está associada a essa rota.

// O método get é usado para criar uma rota, o primeiro parâmetro é a rota, e o segundo é a função que vai ser executada quando a rota for acessada (parametros são separados por vírgula).

// O metodo post é usado para criar uma rota que recebe dados do usuário, ou seja, quando o usuário enviar um formulário, o servidor vai receber os dados e executar a função associada a essa rota.

// O método put é usado para criar uma rota que atualiza um recurso, ou seja, quando o usuário enviar um formulário para atualizar um recurso, o servidor vai receber os dados e executar a função associada a essa rota.

// O método delete é usado para criar uma rota que deleta um recurso, ou seja, quando o usuário enviar um formulário para deletar um recurso, o servidor vai receber os dados e executar a função associada a essa rota.

// O método patch é usado para criar uma rota que atualiza parcialmente um recurso, ou seja, quando o usuário enviar um formulário para atualizar parcialmente um recurso, o servidor vai receber os dados e executar a função associada a essa rota.

// Qunado temos uma rota com um parâmetro, como por exemplo /videos/:id, o :id é um parâmetro que pode ser acessado na função associada a essa rota, ou seja, quando o usuário acessar a rota /videos/1, o id vai ser 1, quando o usuário acessar a rota /videos/2, o id vai ser 2, e assim por diante.

// Request Body é o corpo da requisição, ou seja, os dados que o usuário enviou para o servidor, por exemplo, quando o usuário envia um formulário, os dados do formulário vão estar no request body.

import { fastify } from "fastify";
import cors from "@fastify/cors";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

// 👇 1. CORS — registra ANTES das rotas
server.register(cors, { origin: "*" });

const database = new DatabasePostgres();

// 👇 2. Rota de health check
server.get("/", () => {
  return { status: "ok", message: "API de vídeos no ar" };
});

// 👇 3. Schema de validação (fica perto da rota que usa)
const videoSchema = {
  body: {
    type: "object",
    required: ["title", "description", "duration"],
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      duration: { type: "number", minimum: 1 },
    },
  },
};

// Rotas⬇️

server.post("/videos", { schema: videoSchema }, async (request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({ title, description, duration });

  return reply.status(201).send("Vídeo criado com sucesso");
});

server.get("/videos", async (request) => {
  const search = request.query.search;
  const videos = await database.list(search);
  return videos;
});

server.put("/videos/:id", { schema: videoSchema }, async (request, reply) => {
  const videosId = request.params.id;
  const { title, description, duration } = request.body;

  await database.update(videosId, { title, description, duration });

  return reply.status(204).send();
});

server.delete("/videos/:id", async (request, reply) => {
  const videosId = request.params.id;
  await database.delete(videosId);
  return reply.status(204).send();
});

// Rotas⬆️

// 👇 4. Error handler — fica DEPOIS das rotas, ANTES do listen
server.setErrorHandler((error, request, reply) => {
  console.error(error);
  reply.status(500).send({ message: "Erro interno no servidor" });
});

server.listen({
  port: process.env.PORT ?? 3333,
  host: "0.0.0.0",
});
