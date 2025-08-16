import { BaseService } from './BaseService';

export class ArtistService extends BaseService {
  async getAllArtists() {
    try {
      return await this.prisma.artists.findMany({
        include: {
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          albums: {
            include: {
              songs: {
                include: {
                  artists: true,
                  albums: true
                }
              }
            }
          }
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
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          albums: {
            include: {
              songs: {
                include: {
                  artists: true,
                  albums: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw new Error('Failed to fetch artist');
    }
  }

  async createArtist(data: { name: string; imageUrl?: string }) {
    try {
      return await this.prisma.artists.create({
        data: {
          id: this.generateId(),
          name: data.name,
          image_url: data.imageUrl
        },
        include: {
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          albums: {
            include: {
              songs: {
                include: {
                  artists: true,
                  albums: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating artist:', error);
      throw new Error('Failed to create artist');
    }
  }

  async updateArtist(id: string, data: { name?: string; imageUrl?: string }) {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;

      return await this.prisma.artists.update({
        where: { id },
        data: updateData,
        include: {
          songs: {
            include: {
              artists: true,
              albums: true
            }
          },
          albums: {
            include: {
              songs: {
                include: {
                  artists: true,
                  albums: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error updating artist:', error);
      throw new Error('Failed to update artist');
    }
  }

  async deleteArtist(id: string) {
    try {
      return await this.prisma.artists.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw new Error('Failed to delete artist');
    }
  }
}
