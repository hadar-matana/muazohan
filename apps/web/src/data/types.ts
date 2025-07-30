export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Album {
  id: string;
  name: string;
  artist: Artist;
  year: number;
  imageUrl: string;
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  album: Album;
  duration: number; // in seconds
  imageUrl: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
}

export interface PlayerBarProps {
  playerState: PlayerState;
  onPlayPause: () => void;
}

export interface SongItemProps {
  song: Song;
  index: number;
  isCurrentSong: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export interface SongListProps {
  onPlaySong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}