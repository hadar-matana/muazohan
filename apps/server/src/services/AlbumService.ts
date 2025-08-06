import { PrismaClient } from '@prisma/client';

export class AlbumService {
  constructor(private prisma: PrismaClient) {}

  async getAllAlbums() {
    try {
      return await this.prisma.albums.findMany({
        include: {
          artists: true,
          songs: true
        }
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async getAlbumById(id: string) {
    try {
      return await this.prisma.albums.findUnique({
        where: { id },
        include: {
          artists: true,
          songs: true
        }
      });
    } catch (error) {
      console.error('Error fetching album:', error);
      throw new Error('Failed to fetch album');
    }
  }

  async getAlbumsByArtistId(artistId: string) {
    try {
      return await this.prisma.albums.findMany({
        where: { artist_id: artistId },
        include: {
          artists: true,
          songs: true
        }
      });
    } catch (error) {
      console.error('Error fetching albums by artist:', error);
      throw new Error('Failed to fetch albums by artist');
    }
  }
} 