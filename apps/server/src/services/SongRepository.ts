import { PrismaClient } from '@prisma/client';
import type { Song } from '@prisma/client';

export interface ISongRepository {
  findAll(): Promise<Song[]>;
  findById(id: string): Promise<Song | null>;
  create(song: Omit<Song, 'id'>): Promise<Song>;
  update(id: string, song: Partial<Song>): Promise<Song>;
  delete(id: string): Promise<void>;
}

export class PrismaSongRepository implements ISongRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Song[]> {
    return this.prisma.songs.findMany();
  }

  async findById(id: string): Promise<Song | null> {
    return this.prisma.songs.findUnique({
      where: { id },
    });
  }

  async create(song: Omit<Song, 'id'>): Promise<Song> {
    return this.prisma.songs.create({
      data: song,
    });
  }

  async update(id: string, song: Partial<Song>): Promise<Song> {
    return this.prisma.songs.update({
      where: { id },
      data: song,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.songs.delete({
      where: { id },
    });
  }
} 