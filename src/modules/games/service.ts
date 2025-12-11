import { Games, Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/auth"
import { PaginatedResult } from "@/utils/utils"
import { SearchGamesQuery } from "./schemas"

export class GamesService {
  async getAll(query: SearchGamesQuery): Promise<PaginatedResult<Games>> {
    const { search, page, limit, sortBy, sortOrder } = query

    const where: Prisma.GamesWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { developer: { contains: search, mode: "insensitive" } },
        { publisher: { contains: search, mode: "insensitive" } }
      ]
    }

    const orderBy: Prisma.GamesOrderByWithRelationInput = {}
    if (sortBy === "name") {
      orderBy.name = sortOrder
    } else if (sortBy === "releaseDate") {
      orderBy.releaseDate = sortOrder
    } else {
      orderBy.createdAt = sortOrder
    }

    const skip = (page - 1) * limit

    const [games, total] = await Promise.all([
      prisma.games.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.games.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return {
      data: games,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    }
  }
}
