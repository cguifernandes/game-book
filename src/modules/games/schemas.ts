import { ApiResponseBase } from "@/utils/utils"
import { z } from "zod"

export const searchGamesQuerySchema = z
  .object({
    search: z
      .string()
      .min(1)
      .max(100)
      .optional()
      .describe(
        "Termo de busca para filtrar jogos por nome, descrição, desenvolvedor ou publisher"
      ),
    page: z.string().regex(/^\d+$/).optional().describe("Número da página (padrão: 1)"),
    limit: z
      .string()
      .regex(/^\d+$/)
      .optional()
      .describe("Quantidade de itens por página (padrão: 20, máximo: 100)"),
    sortBy: z
      .enum(["name", "releaseDate", "createdAt"])
      .optional()
      .describe("Campo para ordenação (name, releaseDate, createdAt)"),
    sortOrder: z.enum(["asc", "desc"]).optional().describe("Ordem de classificação (asc, desc)")
  })
  .transform(data => ({
    search: data.search,
    page: data.page ? parseInt(data.page, 10) : 1,
    limit: data.limit ? parseInt(data.limit, 10) : 20,
    sortBy: (data.sortBy || "createdAt") as "name" | "releaseDate" | "createdAt",
    sortOrder: (data.sortOrder || "desc") as "asc" | "desc"
  }))

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

export const gameSchema = z.object({
  id: z.cuid("ID deve ser um CUID válido"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(200, "Nome deve ter no máximo 200 caracteres")
    .trim(),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(200, "Slug deve ter no máximo 200 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  description: z
    .string()
    .max(5000, "Descrição deve ter no máximo 5000 caracteres")
    .optional()
    .nullable(),
  coverImage: z.string().url("Cover image deve ser uma URL válida").optional().nullable(),
  releaseDate: z.iso
    .datetime("Release date deve ser uma data válida (ISO 8601)")
    .optional()
    .nullable()
    .or(z.date().optional().nullable()),
  developer: z
    .string()
    .max(200, "Developer deve ter no máximo 200 caracteres")
    .optional()
    .nullable(),
  publisher: z
    .string()
    .max(200, "Publisher deve ter no máximo 200 caracteres")
    .optional()
    .nullable(),
  createdAt: z.iso.datetime("Created at deve ser uma data válida").or(z.date()),
  updatedAt: z.iso.datetime("Updated at deve ser uma data válida").or(z.date())
})

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 200)
}

export const createGameSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(200, "Nome deve ter no máximo 200 caracteres")
      .trim()
      .describe("Nome do jogo"),
    slug: z
      .string()
      .min(1, "Slug é obrigatório")
      .max(200, "Slug deve ter no máximo 200 caracteres")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug deve conter apenas letras minúsculas, números e hífens"
      )
      .optional()
      .describe("Slug único do jogo (gerado automaticamente se não fornecido)"),
    description: z
      .string()
      .max(5000, "Descrição deve ter no máximo 5000 caracteres")
      .optional()
      .nullable()
      .describe("Descrição do jogo"),
    coverImage: z
      .url("Cover image deve ser uma URL válida")
      .optional()
      .nullable()
      .describe("URL da imagem de capa do jogo"),
    releaseDate: z.iso
      .datetime("Release date deve ser uma data válida (ISO 8601)")
      .optional()
      .nullable()
      .or(z.date().optional().nullable())
      .describe("Data de lançamento do jogo (ISO 8601)"),
    developer: z
      .string()
      .max(200, "Developer deve ter no máximo 200 caracteres")
      .optional()
      .nullable()
      .describe("Desenvolvedora do jogo"),
    publisher: z
      .string()
      .max(200, "Publisher deve ter no máximo 200 caracteres")
      .optional()
      .nullable()
      .describe("Publicadora do jogo")
  })
  .transform(data => ({
    ...data,
    slug: data.slug || generateSlug(data.name)
  }))
  .describe("Schema para criação de um novo jogo")

export const createGameResponseSchema = ApiResponseBase(gameSchema)

export const gameIdParamSchema = z.object({
  id: z.cuid("ID deve ser um CUID válido")
})

export const updateGameSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .max(200, "Nome deve ter no máximo 200 caracteres")
      .trim()
      .optional()
      .describe("Nome do jogo"),
    slug: z
      .string()
      .min(1, "Slug é obrigatório")
      .max(200, "Slug deve ter no máximo 200 caracteres")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug deve conter apenas letras minúsculas, números e hífens"
      )
      .optional()
      .describe("Slug único do jogo"),
    description: z
      .string()
      .max(5000, "Descrição deve ter no máximo 5000 caracteres")
      .optional()
      .nullable()
      .describe("Descrição do jogo"),
    coverImage: z
      .url("Cover image deve ser uma URL válida")
      .optional()
      .nullable()
      .describe("URL da imagem de capa do jogo"),
    releaseDate: z.iso
      .datetime("Release date deve ser uma data válida (ISO 8601)")
      .optional()
      .nullable()
      .or(z.date().optional().nullable())
      .describe("Data de lançamento do jogo (ISO 8601)"),
    developer: z
      .string()
      .max(200, "Developer deve ter no máximo 200 caracteres")
      .optional()
      .nullable()
      .describe("Desenvolvedora do jogo"),
    publisher: z
      .string()
      .max(200, "Publisher deve ter no máximo 200 caracteres")
      .optional()
      .nullable()
      .describe("Publicadora do jogo")
  })
  .refine(data => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser fornecido para atualização"
  })
  .transform(data => {
    if (data.name && !data.slug) {
      return {
        ...data,
        slug: generateSlug(data.name)
      }
    }
    return data
  })
  .describe("Schema para atualização de um jogo existente")

export const updateGameResponseSchema = ApiResponseBase(gameSchema)
export const gameResponseSchema = ApiResponseBase(gameSchema)
export type Game = z.infer<typeof gameSchema>
export type CreateGameInput = z.infer<typeof createGameSchema>
export type UpdateGameInput = z.infer<typeof updateGameSchema>
export type GameIdParam = z.infer<typeof gameIdParamSchema>
export type PaginatedGames = z.infer<typeof paginatedGamesSchema>
export type SearchGamesQuery = z.infer<typeof searchGamesQuerySchema>
export type ErrorSchema = z.infer<typeof errorSchema>
export const paginatedGamesSchema = ApiResponseBase(
  z.object({
    data: z.array(gameSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1).max(100),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean()
    })
  })
)
