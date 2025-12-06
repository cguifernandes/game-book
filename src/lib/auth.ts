import { PrismaClient } from "@/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { openAPI } from "better-auth/plugins"

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || "" })
const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
  basePath: "/api/auth",
  plugins: [openAPI()],
  database: prismaAdapter(prisma, {
    provider: "sqlite",
    usePlural: true
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash(password) {
        return Bun.password.hash(password, { algorithm: "bcrypt" })
      },
      verify({ password, hash }) {
        return Bun.password.verify(password, hash)
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },
  advanced: { disableOriginCheck: true }
})
