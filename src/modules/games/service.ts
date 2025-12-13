import { Games, Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/auth"
import { PaginatedResult } from "@/utils/utils"
import { CreateGameInput, SearchGamesQuery, UpdateGameInput } from "./schemas"

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

  async create(data: CreateGameInput): Promise<Games> {
    const existingGame = await prisma.games.findUnique({
      where: { slug: data.slug }
    })

    if (existingGame) {
      throw new Error(`Jogo com slug "${data.slug}" já existe`)
    }

    const releaseDate = data.releaseDate
      ? typeof data.releaseDate === "string"
        ? new Date(data.releaseDate)
        : data.releaseDate
      : null

    const game = await prisma.games.create({
      data: {
        ...data,
        releaseDate
      }
    })

    return game
  }

  async getById(id: string): Promise<Games> {
    const game = await prisma.games.findUnique({
      where: { id }
    })

    if (!game) {
      throw new Error(`Jogo com ID "${id}" não encontrado`)
    }

    return game
  }

  async update(id: string, data: UpdateGameInput): Promise<Games> {
    const existingGame = await prisma.games.findUnique({
      where: { id }
    })

    if (!existingGame) {
      throw new Error(`Jogo com ID "${id}" não encontrado`)
    }

    if (data.slug && data.slug !== existingGame.slug) {
      const slugExists = await prisma.games.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        throw new Error(`Jogo com slug "${data.slug}" já existe`)
      }
    }

    const releaseDate = data.releaseDate
      ? typeof data.releaseDate === "string"
        ? new Date(data.releaseDate)
        : data.releaseDate
      : undefined

    const updateData: Prisma.GamesUpdateInput = {
      ...(data.name && { name: data.name }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
      ...(releaseDate !== undefined && { releaseDate }),
      ...(data.developer !== undefined && { developer: data.developer }),
      ...(data.publisher !== undefined && { publisher: data.publisher })
    }

    const game = await prisma.games.update({
      where: { id },
      data: updateData
    })

    return game
  }

  async delete(id: string): Promise<void> {
    const game = await prisma.games.findUnique({
      where: { id }
    })

    if (!game) {
      throw new Error(`Jogo com ID "${id}" não encontrado`)
    }

    await prisma.games.delete({
      where: { id }
    })
  }
}
