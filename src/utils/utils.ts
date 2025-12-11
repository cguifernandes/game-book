import { z } from "zod"

export const ApiResponseBase = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    message: z.string().optional(),
    error: z.string().optional(),
    data: schema.optional().nullable()
  })

export type PaginatedResult<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
