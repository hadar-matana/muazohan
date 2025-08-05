import { PrismaClient } from '@prisma/client';
import { PrismaSongRepository } from './services/SongRepository';
import { SongService } from './services/SongService';

export interface Container {
  songService: SongService;
  prisma: PrismaClient;
}

export function createContainer(): Container {
  const prisma = new PrismaClient();
  const songRepository = new PrismaSongRepository(prisma);
  const songService = new SongService(songRepository);

  return {
    songService,
    prisma,
  };
}

// Global container instance
export const container = createContainer(); 