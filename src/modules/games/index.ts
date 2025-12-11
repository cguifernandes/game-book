import { ApiResponseBase } from "@/utils/utils"
import { Elysia, status } from "elysia"
import { gameSchema, searchGamesQuerySchema } from "./schemas"
import { GamesService } from "./service"

const gamesService = new GamesService()

export const games = new Elysia({ prefix: "/games" }).get(
  "/",
  async ({ query }) => {
    const { search, page, limit, sortBy, sortOrder } = query

    try {
      const games = await gamesService.getAll({ search, page, limit, sortBy, sortOrder })

      return status(200, {
        message: "Jogos listados com sucesso",
        data: games.data
      })
    } catch (error) {
      return status(500, {
        message: "Erro ao listar jogos",
        error: error instanceof Error ? error.message : "Erro ao listar jogos"
      })
    }
  },
  {
    query: searchGamesQuerySchema,
    response: { body: ApiResponseBase(gameSchema) },
    detail: {
      summary: "Listar jogos com busca e paginação",
      description:
        "Retorna uma lista paginada de jogos com suporte a busca por nome, descrição, desenvolvedor ou publisher. Parâmetros: search (string opcional), page (número, padrão: 1), limit (número, padrão: 20, máx: 100), sortBy (name|releaseDate|createdAt, padrão: createdAt), sortOrder (asc|desc, padrão: desc)",
      tags: ["Games"]
    }
  }
)
