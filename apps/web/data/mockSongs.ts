import { Song, Artist, Album } from '../types';

// Stage 1: Mock data in frontend (before API integration)
// This demonstrates the initial stage where we only have local mock data

// Mock Artists
const artists: Artist[] = [
  {
    id: '1',
    name: 'The Beatles',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Queen',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Led Zeppelin',
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop'
  }
];

// Mock Albums
const albums: Album[] = [
  {
    id: '1',
    name: 'Abbey Road',
    artist: artists[0],
    year: 1969,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'A Night at the Opera',
    artist: artists[1],
    year: 1975,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Led Zeppelin IV',
    artist: artists[2],
    year: 1971,
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop'
  }
];

// Mock Songs for Stage 1
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Come Together',
    artist: artists[0],
    album: albums[0],
    duration: 259,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Something',
    artist: artists[0],
    album: albums[0],
    duration: 182,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: artists[1],
    album: albums[1],
    duration: 355,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    title: 'Stairway to Heaven',
    artist: artists[2],
    album: albums[2],
    duration: 482,
    imageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop'
  }
];