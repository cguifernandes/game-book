import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { openAPI } from "better-auth/plugins"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
export const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
  basePath: "/api/auth",
  plugins: [openAPI()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true
  }),
  emailAndPassword: {
    enabled: true,
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
