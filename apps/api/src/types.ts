export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: number; // in seconds
  imageUrl: string;
  audioUrl?: string; // will be used in later stages
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: Artist;
  year: number;
  imageUrl?: string;
}

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // in seconds
}