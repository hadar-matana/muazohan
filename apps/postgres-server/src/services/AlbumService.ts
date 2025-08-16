import { BaseService } from './BaseService';

export class AlbumService extends BaseService {
  async getAllAlbums() {
    try {
      return await this.prisma.albums.findMany({
        include: {
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          artists: true
        }
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async getAlbumById(id: string) {
    try {
      console.log('AlbumService.getAlbumById called with id:', id);
      
      // First, get the album with basic song data
      const album = await this.prisma.albums.findUnique({
        where: { id },
        include: {
          songs: true,
          artists: true
        }
      });
      
      if (!album) {
        return null;
      }
      
      // Then, manually fetch the songs with their relations
      const songsWithRelations = await this.prisma.songs.findMany({
        where: {
          album_id: id
        },
        include: {
          artists: true,
          albums: true
        }
      });
      
      // Combine the data
      const result = {
        ...album,
        songs: songsWithRelations
      };
      
      console.log('AlbumService.getAlbumById result:', JSON.stringify(result, null, 2));
      
      if (result.songs) {
        console.log('Songs with relations check:');
        result.songs.forEach((song, index) => {
          console.log(`Song ${index}:`, {
            id: song.id,
            title: song.title,
            hasArtists: !!song.artists,
            hasAlbums: !!song.albums,
            artistName: song.artists?.name,
            albumName: song.albums?.name
          });
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching album:', error);
      throw new Error('Failed to fetch album');
    }
  }

  async createAlbum(data: {
    name: string;
    year?: number;
    artistId: string;
    imageUrl?: string;
  }) {
    try {
      return await this.prisma.albums.create({
        data: {
          id: this.generateId(),
          name: data.name,
          year: data.year,
          artist_id: data.artistId,
          image_url: data.imageUrl
        },
        include: {
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          artists: true
        }
      });
    } catch (error) {
      console.error('Error creating album:', error);
      throw new Error('Failed to create album');
    }
  }

  async updateAlbum(id: string, data: {
    name?: string;
    year?: number;
    artistId?: string;
    imageUrl?: string;
  }) {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.year !== undefined) updateData.year = data.year;
      if (data.artistId !== undefined) updateData.artist_id = data.artistId;
      if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;

      return await this.prisma.albums.update({
        where: { id },
        data: updateData,
        include: {
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          artists: true
        }
      });
    } catch (error) {
      console.error('Error updating album:', error);
      throw new Error('Failed to update album');
    }
  }

  async deleteAlbum(id: string) {
    try {
      return await this.prisma.albums.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting album:', error);
      throw new Error('Failed to delete album');
    }
  }
}
