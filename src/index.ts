import { betterAuthProvider, OpenAPI } from "@/lib/authProvider"
import cors from "@elysiajs/cors"
import openapi from "@elysiajs/openapi"
import { Elysia } from "elysia"

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
  .listen(3000)

console.log(`Server is running on ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
