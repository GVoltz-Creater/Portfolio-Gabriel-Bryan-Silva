// Dois tipos de estruturas de dados:

// Set - é uma estrutura de dados que armazena valores únicos, ou seja, não permite valores duplicados, e não tem uma ordem específica, ou seja, os valores são armazenados de forma aleatória.

// Map - é uma estrutura de dados que armazena pares de chave-valor, ou seja, cada valor é associado a uma chave, e a chave é usada para acessar o valor, e tem uma ordem específica, ou seja, os valores são armazenados na ordem em que foram inseridos.

// list - é uma estrutura de dados que armazena uma coleção de elementos, ou seja, é uma coleção de valores, e tem uma ordem específica, ou seja, os valores são armazenados na ordem em que foram inseridos, e permite valores duplicados.

// Create - é a operação de criar um novo recurso, ou seja, criar um novo vídeo, criar um novo usuário, etc.

// update - é a operação de atualizar um recurso existente, ou seja, atualizar um vídeo, atualizar um usuário, etc.

// delete - é a operação de deletar um recurso existente, ou seja, deletar um vídeo, deletar um usuário, etc.

import { randomUUID } from "node:crypto"; //randomUUID é uma função que gera um identificador único universal (UUID), ou seja, um identificador que é único em todo o mundo, e é usado para identificar recursos de forma única, como por exemplo, um vídeo, um usuário, etc.
import { sql } from "./db.js";

export class DatabasePostgres {
  async list(search) {
    let videos;

    if (search) {
      videos =
        await sql`SELECT * FROM videos WHERE title ILIKE ${`%${search}%`}`;
    } else {
      videos = sql`SELECT * FROM videos`;
    }

    return videos;
  }

  async create(video) {
    const videoId = randomUUID();

    const { title, description, duration } = video;

    await sql`INSERT INTO videos (id, title, description, duration) VALUES (${videoId}, ${title}, ${description}, ${duration})`;
  }

  async update(id, video) {
    const { title, description, duration } = video;

    await sql`UPDATE videos SET title = ${title}, description = ${description}, duration = ${duration} WHERE id = ${id}`;
  }

  async delete(id) {
    await sql`DELETE FROM videos WHERE id = ${id}`;
  }
}
