import type { ISongRepository } from './SongRepository';
import type { Song } from '@prisma/client';

export interface ISongService {
  getAllSongs(): Promise<Song[]>;
  getSongById(id: string): Promise<Song | null>;
  createSong(song: Omit<Song, 'id'>): Promise<Song>;
  updateSong(id: string, song: Partial<Song>): Promise<Song>;
  deleteSong(id: string): Promise<void>;
}

export class SongService implements ISongService {
  constructor(private songRepository: ISongRepository) {}

  async getAllSongs(): Promise<Song[]> {
    try {
      return await this.songRepository.findAll();
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw new Error('Failed to fetch songs');
    }
  }

  async getSongById(id: string): Promise<Song | null> {
    try {
      return await this.songRepository.findById(id);
    } catch (error) {
      console.error('Error fetching song by id:', error);
      throw new Error('Failed to fetch song');
    }
  }

  async createSong(song: Omit<Song, 'id'>): Promise<Song> {
    try {
      // Validate song data
      this.validateSongData(song);
      return await this.songRepository.create(song);
    } catch (error) {
      console.error('Error creating song:', error);
      throw new Error('Failed to create song');
    }
  }

  async updateSong(id: string, song: Partial<Song>): Promise<Song> {
    try {
      // Check if song exists
      const existingSong = await this.songRepository.findById(id);
      if (!existingSong) {
        throw new Error('Song not found');
      }

      // Validate song data if provided
      if (song.title || song.artist || song.album) {
        this.validateSongData(song as Omit<Song, 'id'>);
      }

      return await this.songRepository.update(id, song);
    } catch (error) {
      console.error('Error updating song:', error);
      throw new Error('Failed to update song');
    }
  }

  async deleteSong(id: string): Promise<void> {
    try {
      // Check if song exists
      const existingSong = await this.songRepository.findById(id);
      if (!existingSong) {
        throw new Error('Song not found');
      }

      await this.songRepository.delete(id);
    } catch (error) {
      console.error('Error deleting song:', error);
      throw new Error('Failed to delete song');
    }
  }

  private validateSongData(song: Omit<Song, 'id'>): void {
    if (!song.title || song.title.trim().length === 0) {
      throw new Error('Song title is required');
    }

    if (!song.artist || song.artist.trim().length === 0) {
      throw new Error('Song artist is required');
    }

    if (!song.album || song.album.trim().length === 0) {
      throw new Error('Song album is required');
    }

    if (song.duration && song.duration <= 0) {
      throw new Error('Song duration must be positive');
    }

    if (song.imageUrl && !this.isValidUrl(song.imageUrl)) {
      throw new Error('Invalid image URL');
    }

    if (song.mp3Url && !this.isValidUrl(song.mp3Url)) {
      throw new Error('Invalid MP3 URL');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 