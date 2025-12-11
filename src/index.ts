import cors from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia, status } from "elysia"
import { betterAuthProvider, OpenAPI } from "./lib/authProvider"
import { games } from "./modules/games"

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
  .onError(({ error, code }) => {
    console.error(error)
    if (code === "VALIDATION") {
      return status(400, {
        message: "Erro ao processar a requisição",
        error: error instanceof Error ? error.message : "Erro ao processar a requisição"
      })
    }
  })
  .use(betterAuthProvider)
  .use(games)
  .listen(PORT)

console.log(`Server is running on ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
