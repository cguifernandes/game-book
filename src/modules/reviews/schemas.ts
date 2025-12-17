import { ApiResponseBase } from "@/utils/utils"
import { z } from "zod"

export const gameStatusEnum = z.enum(["WANT_TO_PLAY", "PLAYING", "COMPLETED", "ON_HOLD", "DROPPED"])

export const reviewSchema = z.object({
  id: z.cuid("ID deve ser um CUID válido"),
  userId: z.cuid("User ID deve ser um CUID válido"),
  gameId: z.cuid("Game ID deve ser um CUID válido"),
  status: gameStatusEnum,
  rating: z
    .number()
    .int("Rating deve ser um número inteiro")
    .min(1, "Rating deve ser no mínimo 1")
    .max(5, "Rating deve ser no máximo 5")
    .optional()
    .nullable(),
  review: z.string().max(5000, "Review deve ter no máximo 5000 caracteres").optional().nullable(),
  completedAt: z.iso
    .datetime("Completed at deve ser uma data válida")
    .optional()
    .nullable()
    .or(z.date().optional().nullable()),
  addedAt: z.iso.datetime("Added at deve ser uma data válida").or(z.date()),
  updatedAt: z.iso.datetime("Updated at deve ser uma data válida").or(z.date())
})

export const createReviewSchema = z
  .object({
    gameId: z.cuid("Game ID deve ser um CUID válido").describe("ID do jogo a ser avaliado"),
    status: gameStatusEnum
      .optional()
      .default("WANT_TO_PLAY")
      .describe("Status do jogo (WANT_TO_PLAY, PLAYING, COMPLETED, ON_HOLD, DROPPED)"),
    rating: z
      .number()
      .int("Rating deve ser um número inteiro")
      .min(1, "Rating deve ser no mínimo 1")
      .max(5, "Rating deve ser no máximo 5")
      .optional()
      .nullable()
      .describe("Avaliação do jogo (1-5 estrelas)"),
    review: z
      .string()
      .min(1, "Review é obrigatório")
      .max(5000, "Review deve ter no máximo 5000 caracteres")
      .describe("Review/avaliação textual do jogo"),
    completedAt: z.iso
      .datetime("Completed at deve ser uma data válida (ISO 8601)")
      .optional()
      .nullable()
      .or(z.date().optional().nullable())
      .describe("Data de conclusão do jogo (ISO 8601)")
  })
  .describe("Schema para criar um review de um jogo")

export const updateReviewSchema = z
  .object({
    status: gameStatusEnum
      .optional()
      .describe("Status do jogo (WANT_TO_PLAY, PLAYING, COMPLETED, ON_HOLD, DROPPED)"),
    rating: z
      .number()
      .int("Rating deve ser um número inteiro")
      .min(1, "Rating deve ser no mínimo 1")
      .max(5, "Rating deve ser no máximo 5")
      .optional()
      .nullable()
      .describe("Avaliação do jogo (1-5 estrelas)"),
    review: z
      .string()
      .min(1, "Review não pode estar vazio")
      .max(5000, "Review deve ter no máximo 5000 caracteres")
      .optional()
      .nullable()
      .describe("Review/avaliação textual do jogo"),
    completedAt: z.iso
      .datetime("Completed at deve ser uma data válida (ISO 8601)")
      .optional()
      .nullable()
      .or(z.date().optional().nullable())
      .describe("Data de conclusão do jogo (ISO 8601)")
  })
  .refine(data => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização"
  })
  .describe("Schema para atualizar um review")

export const gameIdParamSchema = z.object({
  gameId: z.cuid("Game ID deve ser um CUID válido")
})

export const errorSchema = z.object({
  message: z.string(),
  error: z.union([
    z.string(),
    z.array(
      z.object({
        field: z.string(),
        message: z.string(),
        received: z.any().optional()
      })
    )
  ]),
  details: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
        received: z.any().optional()
      })
    )
    .optional()
})

export const createReviewResponseSchema = ApiResponseBase(reviewSchema)
export const updateReviewResponseSchema = ApiResponseBase(reviewSchema)
export const reviewResponseSchema = ApiResponseBase(reviewSchema)

export type Review = z.infer<typeof reviewSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
export type GameIdParam = z.infer<typeof gameIdParamSchema>
