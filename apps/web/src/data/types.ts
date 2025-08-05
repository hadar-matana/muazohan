// Core domain entities
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
  mp3Url?: string | null;
}

// Audio playback abstractions (DIP)
export interface AudioProvider {
  play(url: string): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  isPlaying(): boolean;
  onEnded(callback: () => void): void;
  onError(callback: (error: Error) => void): void;
  onTimeUpdate(callback: (currentTime: number) => void): void;
  destroy(): void;
}

// Player state management (SRP)
export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

// Player actions (ISP)
export interface PlayerActions {
  playSong(song: Song): void;
  play(): void;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  seekTo(time: number): void;
}

// Player context (combines state and actions)
export interface PlayerContextType extends PlayerState, PlayerActions {}

// UI Component interfaces (ISP)
export interface PlayableItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  duration: number;
}

export interface PlayableItemProps {
  item: PlayableItem;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  canPlay: boolean;
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

// Legacy interfaces for backward compatibility
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