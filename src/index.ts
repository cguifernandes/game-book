import { Elysia } from "elysia"

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000)

console.log(`Server is running on ${app.server?.hostname}:${app.server?.port}`)
