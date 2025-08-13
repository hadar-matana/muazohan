import { BaseService } from './BaseService';
import { PaginationOptions, PaginatedResult } from '../types';

export class SongService extends BaseService {
  async getAllSongs(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.min(100, Math.max(1, options.limit || 20));
      const skip = (page - 1) * limit;

      const [songs, total] = await Promise.all([
        this.prisma.songs.findMany({
          skip,
          take: limit,
          include: {
            artists: true,
            albums: true
          },
          orderBy: {
            title: 'asc'
          }
        }),
        this.prisma.songs.count()
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: songs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw new Error('Failed to fetch songs');
    }
  }

  async getSongById(id: string) {
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
    duration?: number;
    mp3Url?: string;
    artistId?: string;
    albumId?: string;
  }) {
    try {
      // Handle optional artistId and albumId by creating or finding default values
      let artistId = data.artistId;
      let albumId = data.albumId;

      // If no artistId provided, create or find a default "Unknown Artist"
      if (!artistId) {
        const defaultArtist = await this.prisma.artists.findFirst({
          where: { name: 'Unknown Artist' }
        });
        
        if (defaultArtist) {
          artistId = defaultArtist.id;
        } else {
          const newArtist = await this.prisma.artists.create({
            data: {
              id: this.generateId(),
              name: 'Unknown Artist'
            }
          });
          artistId = newArtist.id;
        }
      }

      // If no albumId provided, create or find a default "Unknown Album"
      if (!albumId) {
        const defaultAlbum = await this.prisma.albums.findFirst({
          where: { name: 'Unknown Album' }
        });
        
        if (defaultAlbum) {
          albumId = defaultAlbum.id;
        } else {
          const newAlbum = await this.prisma.albums.create({
            data: {
              id: this.generateId(),
              name: 'Unknown Album',
              artist_id: artistId,
              year: new Date().getFullYear()
            }
          });
          albumId = newAlbum.id;
        }
      }

      return await this.prisma.songs.create({
        data: {
          id: this.generateId(),
          title: data.title,
          duration: data.duration,
          mp3Url: data.mp3Url,
          artist_id: artistId,
          album_id: albumId
        },
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

  async updateSong(id: string, data: {
    title?: string;
    duration?: number;
    mp3Url?: string;
    artistId?: string;
    albumId?: string;
  }) {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.duration !== undefined) updateData.duration = data.duration;
      if (data.mp3Url !== undefined) updateData.mp3Url = data.mp3Url;
      if (data.artistId !== undefined) updateData.artist_id = data.artistId;
      if (data.albumId !== undefined) updateData.album_id = data.albumId;

      return await this.prisma.songs.update({
        where: { id },
        data: updateData,
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

  async deleteSong(id: string) {
    try {
      return await this.prisma.songs.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting song:', error);
      throw new Error('Failed to delete song');
    }
  }

  async searchSongs(query: string, options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.min(100, Math.max(1, options.limit || 20));
      const skip = (page - 1) * limit;

      const [songs, total] = await Promise.all([
        this.prisma.songs.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { artists: { name: { contains: query, mode: 'insensitive' } } },
              { albums: { name: { contains: query, mode: 'insensitive' } } }
            ]
          },
          skip,
          take: limit,
          include: {
            artists: true,
            albums: true
          },
          orderBy: {
            title: 'asc'
          }
        }),
        this.prisma.songs.count({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { artists: { name: { contains: query, mode: 'insensitive' } } },
              { albums: { name: { contains: query, mode: 'insensitive' } } }
            ]
          }
        })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: songs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error searching songs:', error);
      throw new Error('Failed to search songs');
    }
  }
}
