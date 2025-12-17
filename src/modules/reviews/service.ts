import { Prisma, UserGames } from "@/generated/prisma/client"
import { prisma } from "@/lib/auth"
import { CreateReviewInput, UpdateReviewInput } from "./schemas"

export class ReviewsService {
  async create(userId: string, data: CreateReviewInput): Promise<UserGames> {
    const game = await prisma.games.findUnique({
      where: { id: data.gameId }
    })

    if (!game) {
      throw new Error(`Jogo com ID "${data.gameId}" não encontrado`)
    }

    const completedAt = data.completedAt
      ? typeof data.completedAt === "string"
        ? new Date(data.completedAt)
        : data.completedAt
      : null

    const review = await prisma.userGames.create({
      data: {
        userId,
        gameId: data.gameId,
        status: data.status || "WANT_TO_PLAY",
        rating: data.rating ?? null,
        review: data.review ?? null,
        completedAt
      },
      include: {
        game: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return review
  }

  async getByUserId(userId: string, gameId: string): Promise<UserGames> {
    const review = await prisma.userGames.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      },
      include: {
        game: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!review) {
      throw new Error("Review não encontrado")
    }

    return review
  }

  async update(userId: string, gameId: string, data: UpdateReviewInput): Promise<UserGames> {
    const existingReview = await prisma.userGames.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    })

    if (!existingReview) {
      throw new Error("Review não encontrado")
    }

    const completedAt = data.completedAt
      ? typeof data.completedAt === "string"
        ? new Date(data.completedAt)
        : data.completedAt
      : data.completedAt === null
        ? null
        : undefined

    const updateData: Prisma.UserGamesUpdateInput = {
      ...(data.status && { status: data.status }),
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.review !== undefined && { review: data.review }),
      ...(completedAt !== undefined && { completedAt })
    }

    const review = await prisma.userGames.update({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      },
      data: updateData,
      include: {
        game: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return review
  }

  async delete(userId: string, gameId: string): Promise<void> {
    const existingReview = await prisma.userGames.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    })

    if (!existingReview) {
      throw new Error("Review não encontrado")
    }

    await prisma.userGames.delete({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    })
  }

  async getAllByUserId(userId: string): Promise<UserGames[]> {
    const reviews = await prisma.userGames.findMany({
      where: { userId },
      include: {
        game: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        addedAt: "desc"
      }
    })

    return reviews
  }
}
