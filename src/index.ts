import cors from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { betterAuthProvider, OpenAPI } from "./lib/authProvider"

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
  .use(betterAuthProvider)
  .listen(PORT)

console.log(`Server is running on ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
