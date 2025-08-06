import { PrismaClient } from '@prisma/client';

export class SongService {
  constructor(private prisma: PrismaClient) {}

  async getAllSongs() {
    try {
      return await this.prisma.songs.findMany({
        include: {
          artists: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw new Error('Failed to fetch songs');
    }
  }
} 