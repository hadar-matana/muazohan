import axios from 'axios';
import FormData from 'form-data';

export class MicroserviceClient {
  private s3BaseUrl: string;
  private postgresBaseUrl: string;

  constructor() {
    this.s3BaseUrl = process.env.S3_SERVER_URL || 'http://localhost:3002';
    this.postgresBaseUrl = process.env.POSTGRES_SERVER_URL || 'http://localhost:3003';
  }

  // S3 Server methods
  async uploadFile(file: File, folder: string = 'songs'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await axios.post(`${this.s3BaseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.url;
    } catch (error) {
      console.error('Error uploading file to S3 server:', error);
      throw new Error('Failed to upload file');
    }
  }

  async uploadFileToS3(file: { buffer: Buffer; originalname: string; mimetype: string; size: number }, folder: string = 'songs'): Promise<string> {
    try {
      console.log('Starting S3 upload:', {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        folder
      });

      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });
      formData.append('folder', folder);

      const response = await axios.post(`${this.s3BaseUrl}/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      console.log('S3 upload successful:', response.data);
      return response.data.url;
    } catch (error) {
      console.error('Error uploading file to S3 server:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
      }
      throw new Error('Failed to upload file');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await axios.delete(`${this.s3BaseUrl}/upload/${key}`);
    } catch (error) {
      console.error('Error deleting file from S3 server:', error);
      throw new Error('Failed to delete file');
    }
  }

  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const response = await axios.get(`${this.s3BaseUrl}/upload/url/${key}?expires=${expiresIn}`);
      return response.data.url;
    } catch (error) {
      console.error('Error getting file URL from S3 server:', error);
      throw new Error('Failed to get file URL');
    }
  }

  // PostgreSQL Server methods
  async getAllSongs() {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/songs`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching songs from PostgreSQL server:', error);
      throw new Error('Failed to fetch songs');
    }
  }

  async getSongById(id: string) {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/songs/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching song from PostgreSQL server:', error);
      throw new Error('Failed to fetch song');
    }
  }

  async createSong(data: {
    title: string;
    duration: number;
    url: string;
    artistId?: string;
    albumId?: string;
  }) {
    try {
      console.log('Creating song in PostgreSQL:', {
        title: data.title,
        duration: data.duration,
        url: data.url,
        artistId: data.artistId,
        albumId: data.albumId
      });

      // Map url to mp3Url for PostgreSQL service
      const postgresData = {
        title: data.title,
        duration: data.duration,
        mp3Url: data.url,
        ...(data.artistId && { artistId: data.artistId }),
        ...(data.albumId && { albumId: data.albumId }),
      };
      
      console.log('PostgreSQL data:', postgresData);
      
      const response = await axios.post(`${this.postgresBaseUrl}/songs`, postgresData);
      console.log('Song created successfully:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating song in PostgreSQL server:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
      }
      throw new Error('Failed to create song');
    }
  }

  async updateSong(id: string, data: any) {
    try {
      const response = await axios.put(`${this.postgresBaseUrl}/songs/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating song in PostgreSQL server:', error);
      throw new Error('Failed to update song');
    }
  }

  async deleteSong(id: string) {
    try {
      await axios.delete(`${this.postgresBaseUrl}/songs/${id}`);
    } catch (error) {
      console.error('Error deleting song from PostgreSQL server:', error);
      throw new Error('Failed to delete song');
    }
  }

  async getAllArtists() {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/artists`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching artists from PostgreSQL server:', error);
      throw new Error('Failed to fetch artists');
    }
  }

  async getArtistById(id: string) {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/artists/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching artist from PostgreSQL server:', error);
      throw new Error('Failed to fetch artist');
    }
  }

  async createArtist(data: { name: string; bio?: string }) {
    try {
      const response = await axios.post(`${this.postgresBaseUrl}/artists`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating artist in PostgreSQL server:', error);
      throw new Error('Failed to create artist');
    }
  }

  async updateArtist(id: string, data: any) {
    try {
      const response = await axios.put(`${this.postgresBaseUrl}/artists/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating artist in PostgreSQL server:', error);
      throw new Error('Failed to update artist');
    }
  }

  async deleteArtist(id: string) {
    try {
      await axios.delete(`${this.postgresBaseUrl}/artists/${id}`);
    } catch (error) {
      console.error('Error deleting artist from PostgreSQL server:', error);
      throw new Error('Failed to delete artist');
    }
  }

  async getAllAlbums() {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/albums`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching albums from PostgreSQL server:', error);
      throw new Error('Failed to fetch albums');
    }
  }

  async getAlbumById(id: string) {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/albums/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching album from PostgreSQL server:', error);
      throw new Error('Failed to fetch album');
    }
  }

  async createAlbum(data: {
    title: string;
    releaseDate: Date;
    artistId?: string;
  }) {
    try {
      const response = await axios.post(`${this.postgresBaseUrl}/albums`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating album in PostgreSQL server:', error);
      throw new Error('Failed to create album');
    }
  }

  async updateAlbum(id: string, data: any) {
    try {
      const response = await axios.put(`${this.postgresBaseUrl}/albums/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating album in PostgreSQL server:', error);
      throw new Error('Failed to update album');
    }
  }

  async deleteAlbum(id: string) {
    try {
      await axios.delete(`${this.postgresBaseUrl}/albums/${id}`);
    } catch (error) {
      console.error('Error deleting album from PostgreSQL server:', error);
      throw new Error('Failed to delete album');
    }
  }

  async searchSongs(query: string) {
    try {
      const response = await axios.get(`${this.postgresBaseUrl}/songs/search/${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching songs in PostgreSQL server:', error);
      throw new Error('Failed to search songs');
    }
  }
}
