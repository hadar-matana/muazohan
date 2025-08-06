import { PrismaClient } from '@prisma/client';

export class ArtistService {
  constructor(private prisma: PrismaClient) {}

  async getAllArtists() {
    try {
      return await this.prisma.artists.findMany({
        include: {
          albums: {
            include: {
              songs: true
            }
          },
          songs: true
        }
      });
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw new Error('Failed to fetch artists');
    }
  }

  async getArtistById(id: string) {
    try {
      return await this.prisma.artists.findUnique({
        where: { id },
        include: {
          albums: {
            include: {
              songs: true
            }
          },
          songs: true
        }
      });
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw new Error('Failed to fetch artist');
    }
  }
} 