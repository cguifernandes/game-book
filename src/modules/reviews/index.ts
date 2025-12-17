import { betterAuthProvider } from "@/lib/authProvider"
import { Elysia, status } from "elysia"
import { z } from "zod"
import {
  createReviewResponseSchema,
  createReviewSchema,
  errorSchema,
  gameIdParamSchema,
  reviewResponseSchema,
  updateReviewResponseSchema,
  updateReviewSchema
} from "./schemas"
import { ReviewsService } from "./service"

const reviewsService = new ReviewsService()

export const reviews = new Elysia({ prefix: "/reviews" })
  .use(betterAuthProvider)
  .post(
    "/",
    async ({ body, user }) => {
      const review = await reviewsService.create(user.id, body)

      return status(201, {
        message: "Review criado com sucesso",
        data: review
      })
    },
    {
      auth: true,
      body: createReviewSchema,
      response: {
        201: createReviewResponseSchema,
        401: errorSchema,
        409: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Criar review de um jogo",
        description:
          "Cria um review de um jogo no perfil do usuário autenticado. O review text é obrigatório.",
        tags: ["Reviews"]
      }
    }
  )
  .get(
    "/",
    async ({ user }) => {
      const reviews = await reviewsService.getAllByUserId(user.id)

      return {
        message: "Reviews listados com sucesso",
        data: reviews
      }
    },
    {
      auth: true,
      response: {
        200: z.object({
          message: z.string(),
          data: z.array(reviewResponseSchema.shape.data)
        }),
        401: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Listar reviews do usuário",
        description: "Retorna todos os reviews do usuário autenticado (perfil do usuário).",
        tags: ["Reviews"]
      }
    }
  )
  .get(
    "/:gameId",
    async ({ params, user }) => {
      const review = await reviewsService.getByUserId(user.id, params.gameId)

      return {
        message: "Review encontrado com sucesso",
        data: review
      }
    },
    {
      auth: true,
      params: gameIdParamSchema,
      response: {
        200: reviewResponseSchema,
        401: errorSchema,
        404: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Buscar review por ID do jogo",
        description: "Retorna o review de um jogo específico do usuário autenticado.",
        tags: ["Reviews"]
      }
    }
  )
  .patch(
    "/:gameId",
    async ({ params, body, user }) => {
      const review = await reviewsService.update(user.id, params.gameId, body)

      return {
        message: "Review atualizado com sucesso",
        data: review
      }
    },
    {
      auth: true,
      params: gameIdParamSchema,
      body: updateReviewSchema,
      response: {
        200: updateReviewResponseSchema,
        401: errorSchema,
        404: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Atualizar review",
        description:
          "Atualiza um review existente do usuário autenticado (status, rating, review text, etc.).",
        tags: ["Reviews"]
      }
    }
  )
  .delete(
    "/:gameId",
    async ({ params, user }) => {
      await reviewsService.delete(user.id, params.gameId)

      return {
        message: "Review removido com sucesso"
      }
    },
    {
      auth: true,
      params: gameIdParamSchema,
      response: {
        200: z.object({
          message: z.string()
        }),
        401: errorSchema,
        404: errorSchema,
        400: errorSchema,
        500: errorSchema
      },
      detail: {
        summary: "Remover review",
        description: "Remove um review do perfil do usuário autenticado.",
        tags: ["Reviews"]
      }
    }
  )
