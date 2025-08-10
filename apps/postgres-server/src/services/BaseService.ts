import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  protected generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async disconnect() {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  }
}
