import { PrismaClient } from '@prisma/client';

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // Song operations
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

  async getSongById(id: number) {
    try {
      return await this.prisma.songs.findUnique({
        where: { id },
        include: {
          artists: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error fetching song:', error);
      throw new Error('Failed to fetch song');
    }
  }

  async createSong(data: {
    title: string;
    duration: number;
    url: string;
    artistId?: number;
    albumId?: number;
  }) {
    try {
      return await this.prisma.songs.create({
        data,
        include: {
          artists: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error creating song:', error);
      throw new Error('Failed to create song');
    }
  }

  async updateSong(id: number, data: any) {
    try {
      return await this.prisma.songs.update({
        where: { id },
        data,
        include: {
          artists: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error updating song:', error);
      throw new Error('Failed to update song');
    }
  }

  async deleteSong(id: number) {
    try {
      return await this.prisma.songs.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting song:', error);
      throw new Error('Failed to delete song');
    }
  }

  // Artist operations
  async getAllArtists() {
    try {
      return await this.prisma.artists.findMany({
        include: {
          songs: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw new Error('Failed to fetch artists');
    }
  }

  async getArtistById(id: number) {
    try {
      return await this.prisma.artists.findUnique({
        where: { id },
        include: {
          songs: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw new Error('Failed to fetch artist');
    }
  }

  async createArtist(data: { name: string; bio?: string }) {
    try {
      return await this.prisma.artists.create({
        data,
        include: {
          songs: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error creating artist:', error);
      throw new Error('Failed to create artist');
    }
  }

  async updateArtist(id: number, data: any) {
    try {
      return await this.prisma.artists.update({
        where: { id },
        data,
        include: {
          songs: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error updating artist:', error);
      throw new Error('Failed to update artist');
    }
  }

  async deleteArtist(id: number) {
    try {
      return await this.prisma.artists.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw new Error('Failed to delete artist');
    }
  }

  // Album operations
  async getAllAlbums() {
    try {
      return await this.prisma.albums.findMany({
        include: {
          songs: true,
          artists: true
        }
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async getAlbumById(id: number) {
    try {
      return await this.prisma.albums.findUnique({
        where: { id },
        include: {
          songs: true,
          artists: true
        }
      });
    } catch (error) {
      console.error('Error fetching album:', error);
      throw new Error('Failed to fetch album');
    }
  }

  async createAlbum(data: {
    title: string;
    releaseDate: Date;
    artistId?: number;
  }) {
    try {
      return await this.prisma.albums.create({
        data,
        include: {
          songs: true,
          artists: true
        }
      });
    } catch (error) {
      console.error('Error creating album:', error);
      throw new Error('Failed to create album');
    }
  }

  async updateAlbum(id: number, data: any) {
    try {
      return await this.prisma.albums.update({
        where: { id },
        data,
        include: {
          songs: true,
          artists: true
        }
      });
    } catch (error) {
      console.error('Error updating album:', error);
      throw new Error('Failed to update album');
    }
  }

  async deleteAlbum(id: number) {
    try {
      return await this.prisma.albums.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting album:', error);
      throw new Error('Failed to delete album');
    }
  }

  // Search operations
  async searchSongs(query: string) {
    try {
      return await this.prisma.songs.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { artists: { name: { contains: query, mode: 'insensitive' } } },
            { albums: { title: { contains: query, mode: 'insensitive' } } }
          ]
        },
        include: {
          artists: true,
          albums: true
        }
      });
    } catch (error) {
      console.error('Error searching songs:', error);
      throw new Error('Failed to search songs');
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
