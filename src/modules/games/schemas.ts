import { z } from "zod"

export const searchGamesQuerySchema = z
  .object({
    search: z.string().min(1).max(100).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(["name", "releaseDate", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional()
  })
  .transform(data => ({
    search: data.search,
    page: data.page ? parseInt(data.page, 10) : 1,
    limit: data.limit ? parseInt(data.limit, 10) : 20,
    sortBy: (data.sortBy || "createdAt") as "name" | "releaseDate" | "createdAt",
    sortOrder: (data.sortOrder || "desc") as "asc" | "desc"
  }))

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
  coverImage: z.url("Cover image deve ser uma URL válida").optional().nullable(),
  releaseDate: z
    .string()
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
  createdAt: z.string().datetime("Created at deve ser uma data válida").or(z.date()),
  updatedAt: z.string().datetime("Updated at deve ser uma data válida").or(z.date())
})

export const paginatedGamesSchema = z.object({
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

export type Game = z.infer<typeof gameSchema>
export type PaginatedGames = z.infer<typeof paginatedGamesSchema>
export type SearchGamesQuery = z.infer<typeof searchGamesQuerySchema>
