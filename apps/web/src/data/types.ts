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
  artist: string;
  album: string;
  duration: number; // in seconds
  imageUrl: string;
  mp3Url?: string | null
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

export interface PlayerContextType  {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song) => void;
  play: () => void;
  pause: () => void;
}