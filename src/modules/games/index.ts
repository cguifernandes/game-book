import { Elysia, status } from "elysia"
import { z } from "zod"
import {
  createGameResponseSchema,
  createGameSchema,
  errorSchema,
  gameIdParamSchema,
  gameResponseSchema,
  paginatedGamesSchema,
  searchGamesQuerySchema,
  updateGameResponseSchema,
  updateGameSchema
} from "./schemas"
import { GamesService } from "./service"

const gamesService = new GamesService()

export const games = new Elysia({ prefix: "/games" })
  .get(
    "/",
    async ({ query }) => {
      const result = await gamesService.getAll(query)

      return {
        message: "Jogos listados com sucesso",
        data: result
      }
    },
    {
      query: searchGamesQuerySchema,
      response: {
        200: paginatedGamesSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Listar jogos com busca e paginação",
        description:
          "Retorna uma lista paginada de jogos com suporte a busca por nome, descrição, desenvolvedor ou publisher.",
        tags: ["Games"]
      }
    }
  )
  .post(
    "/",
    async ({ body }) => {
      const game = await gamesService.create(body)

      return status(201, {
        message: "Jogo criado com sucesso",
        data: game
      })
    },
    {
      body: createGameSchema,
      response: {
        201: createGameResponseSchema,
        409: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Criar novo jogo",
        description:
          "Cria um novo jogo no catálogo. O slug será gerado automaticamente a partir do nome se não fornecido.",
        tags: ["Games"]
      }
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const game = await gamesService.getById(params.id)

      return {
        message: "Jogo encontrado com sucesso",
        data: game
      }
    },
    {
      params: gameIdParamSchema,
      response: {
        200: gameResponseSchema,
        404: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Buscar jogo por ID",
        description: "Retorna os detalhes de um jogo específico pelo seu ID.",
        tags: ["Games"]
      }
    }
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      const game = await gamesService.update(params.id, body)

      return {
        message: "Jogo atualizado com sucesso",
        data: game
      }
    },
    {
      params: gameIdParamSchema,
      body: updateGameSchema,
      response: {
        200: updateGameResponseSchema,
        404: errorSchema,
        409: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Atualizar jogo",
        description:
          "Atualiza um jogo existente. Todos os campos são opcionais. Se o nome for atualizado e o slug não for fornecido, um novo slug será gerado automaticamente.",
        tags: ["Games"]
      }
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      await gamesService.delete(params.id)

      return {
        message: "Jogo deletado com sucesso"
      }
    },
    {
      params: gameIdParamSchema,
      response: {
        200: z.object({
          message: z.string()
        }),
        404: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Deletar jogo",
        description: "Remove um jogo do catálogo pelo seu ID.",
        tags: ["Games"]
      }
    }
  )
