import { PrismaClient } from "@prisma/client";

/**
 * Prismaクライアントのインスタンス
 * 開発環境ではホットリロード時に複数のインスタンスが作成されるのを防ぐ
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 