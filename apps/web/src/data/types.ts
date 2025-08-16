// Core domain entities
export interface Artist {
  id: string;
  name: string;
  image_url?: string | null;
  albums?: Album[];
  songs?: Song[];
}

export interface Album {
  id: string;
  name: string;
  year?: number | null;
  image_url?: string | null;
  artist_id: string;
  artists?: Artist;
  songs?: Song[];
}

export interface Song {
  id: string;
  title: string;
  duration?: number | null;
  image_url?: string | null;
  mp3Url?: string | null;
  artist_id: string;
  artists?: Artist;
  album_id: string;
  albums?: Album;
}



export interface PlayerState {
  currentSong: Song | null;
  playlist: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface PlayerActions {
  playSong(song: Song): void;
  setPlaylist(songs: Song[]): void;
  playNext(): void;
  playPrevious(): void;
  play(): void;
  pause(): void;
  togglePlayPause(): void;
  stop(): void;
  setVolume(volume: number): void;
  seekTo(time: number): void;
}

export interface PlayerContextType extends PlayerState, PlayerActions {}



export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  canPlay: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
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