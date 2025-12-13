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

export const formatErrorMessage = (err: any, property?: string) => {
  const field = err.path?.join(".") || property || "campo desconhecido"
  let message = err.message

  if (!message && err.expected && err.received) {
    message = `Esperado ${err.expected}, recebido ${err.received}`
  }

  if (!message && err.code === "invalid_type") {
    message = `Tipo inválido: esperado ${err.expected}, recebido ${err.received}`
  }

  return {
    field,
    message: message || "Validação falhou",
    expected: err.expected,
    received: err.received
  }
}
