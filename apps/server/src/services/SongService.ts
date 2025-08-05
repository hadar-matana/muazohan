import { PrismaClient } from '@prisma/client';
import type { Songs } from '@prisma/client';

export class SongService {
  constructor(private prisma: PrismaClient) {}

  async getAllSongs(): Promise<Songs[]> {
    try {
      return await this.prisma.songs.findMany();
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw new Error('Failed to fetch songs');
    }
  }
} 