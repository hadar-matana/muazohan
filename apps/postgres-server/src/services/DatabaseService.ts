import { SongService } from './SongService';
import { ArtistService } from './ArtistService';
import { AlbumService } from './AlbumService';
import { PaginationOptions, PaginatedResult } from '../types';

export class DatabaseService {
  public songs: SongService;
  public artists: ArtistService;
  public albums: AlbumService;

  constructor() {
    this.songs = new SongService();
    this.artists = new ArtistService();
    this.albums = new AlbumService();
  }

  async getAllSongs(options?: PaginationOptions): Promise<PaginatedResult<any>> {
    return this.songs.getAllSongs(options);
  }

  async getSongById(id: string) {
    return this.songs.getSongById(id);
  }

  async createSong(data: {
    title: string;
    duration?: number;
    mp3Url?: string;
    artistId: string;
    albumId: string;
  }) {
    return this.songs.createSong(data);
  }

  async updateSong(id: string, data: {
    title?: string;
    duration?: number;
    mp3Url?: string;
    artistId?: string;
    albumId?: string;
  }) {
    return this.songs.updateSong(id, data);
  }

  async deleteSong(id: string) {
    return this.songs.deleteSong(id);
  }

  async getAllArtists() {
    return this.artists.getAllArtists();
  }

  async getArtistById(id: string) {
    return this.artists.getArtistById(id);
  }

  async createArtist(data: { name: string; imageUrl?: string }) {
    return this.artists.createArtist(data);
  }

  async updateArtist(id: string, data: { name?: string; imageUrl?: string }) {
    return this.artists.updateArtist(id, data);
  }

  async deleteArtist(id: string) {
    return this.artists.deleteArtist(id);
  }

  async getAllAlbums() {
    return this.albums.getAllAlbums();
  }

  async getAlbumById(id: string) {
    return this.albums.getAlbumById(id);
  }

  async createAlbum(data: {
    name: string;
    year?: number;
    artistId: string;
    imageUrl?: string;
  }) {
    return this.albums.createAlbum(data);
  }

  async updateAlbum(id: string, data: {
    name?: string;
    year?: number;
    artistId?: string;
    imageUrl?: string;
  }) {
    return this.albums.updateAlbum(id, data);
  }

  async deleteAlbum(id: string) {
    return this.albums.deleteAlbum(id);
  }

  async searchSongs(query: string, options?: PaginationOptions): Promise<PaginatedResult<any>> {
    return this.songs.searchSongs(query, options);
  }

  async disconnect() {
    await this.songs.disconnect();
    await this.artists.disconnect();
    await this.albums.disconnect();
  }
}
