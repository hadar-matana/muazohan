import { Song } from '../types';

const API_BASE_URL = 'http://localhost:3001/trpc';

export class ApiClient {
  async getSongs(): Promise<Song[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/songs.getAll`);
      const data = await response.json();
      return data.result.data;
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  }

  async getSongById(id: string): Promise<Song | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/songs.getById?input="${encodeURIComponent(id)}"`);
      const data = await response.json();
      return data.result.data;
    } catch (error) {
      console.error('Error fetching song:', error);
      return null;
    }
  }

  async searchSongs(query: string): Promise<Song[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/songs.search?input="${encodeURIComponent(query)}"`);
      const data = await response.json();
      return data.result.data;
    } catch (error) {
      console.error('Error searching songs:', error);
      return [];
    }
  }
}

export const apiClient = new ApiClient();