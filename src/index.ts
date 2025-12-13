import cors from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { betterAuthProvider, OpenAPI } from "./lib/authProvider"
import { games } from "./modules/games"
import { formatErrorMessage } from "./utils/utils"

const PORT = process.env.PORT || 3000

const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths()
      }
    })
  )
  .onRequest(({ request }) => {
    console.log(`[${request.method}] ${request.url}`)
  })
  .onError(({ error, code, set }) => {
    console.error(`[${code}]`, error)

    if (code === "VALIDATION") {
      set.status = 400

      const validationError = error as any
      let errorMessage = error.message
      let validationErrors: any[] = []

      if (validationError.errors && Array.isArray(validationError.errors)) {
        validationErrors = validationError.errors.map((err: any) =>
          formatErrorMessage(err, validationError.property)
        )
        errorMessage = validationErrors.map(err => `${err.field}: ${err.message}`).join("; ")
      } else {
        try {
          const parsed = JSON.parse(error.message)
          if (parsed.errors && Array.isArray(parsed.errors)) {
            validationErrors = parsed.errors.map((err: any) =>
              formatErrorMessage(err, parsed.property)
            )
            errorMessage = validationErrors.map(err => `${err.field}: ${err.message}`).join("; ")
          } else if (parsed.message) {
            errorMessage = parsed.message
          }
        } catch {
          // Se não for JSON, usar mensagem original
        }
      }

      return {
        message: "Erro de validação",
        error: errorMessage,
        ...(validationErrors.length > 0 && { details: validationErrors })
      }
    }

    set.status = 500
    return {
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    }
  })
  .use(betterAuthProvider)
  .use(games)
  .listen(PORT)

console.log(`Server is running on ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
