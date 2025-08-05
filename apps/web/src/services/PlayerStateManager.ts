import type { PlayerState, Song, AudioProvider } from '../data/types';

export class PlayerStateManager {
  private state: PlayerState;
  private listeners: Set<(state: PlayerState) => void> = new Set();

  constructor(private audioProvider: AudioProvider) {
    this.state = {
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
    };

    this.setupAudioListeners();
  }

  private setupAudioListeners(): void {
    this.audioProvider.onEnded(() => {
      this.updateState({ isPlaying: false });
    });

    this.audioProvider.onError((error) => {
      // Only log errors that are not related to empty src during initialization
      if (!error.message.includes('Empty src attribute')) {
        console.error('Audio error:', error);
      }
      this.updateState({ isPlaying: false });
    });

    this.audioProvider.onTimeUpdate((currentTime) => {
      this.updateState({ currentTime });
    });
  }

  private updateState(partialState: Partial<PlayerState>): void {
    this.state = { ...this.state, ...partialState };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: PlayerState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): PlayerState {
    return { ...this.state };
  }

  async playSong(song: Song): Promise<void> {
    // Update state immediately to show the song is selected
    this.updateState({
      currentSong: song,
      currentTime: 0,
      duration: song.duration,
    });

    // Check if song has a valid mp3Url
    if (!song.mp3Url || song.mp3Url.trim() === '') {
      console.warn(`No mp3Url found for song: "${song.title}" by ${song.artist}`);
      // Don't set isPlaying to true if there's no audio to play
      this.updateState({ isPlaying: false });
      return;
    }

    try {
      this.updateState({ isPlaying: true });
      await this.audioProvider.play(song.mp3Url);
    } catch (error) {
      console.error('Failed to play song:', error);
      this.updateState({ isPlaying: false });
      // Don't throw the error, just log it and continue
      // This allows the UI to show the song is selected even if audio fails
    }
  }

  async play(): Promise<void> {
    if (!this.state.currentSong) return;

    // Check if current song has audio
    if (!this.state.currentSong.mp3Url || this.state.currentSong.mp3Url.trim() === '') {
      console.warn('Cannot play: No audio URL available for current song');
      return;
    }

    try {
      this.audioProvider.resume();
      this.updateState({ isPlaying: true });
    } catch (error) {
      console.error('Failed to resume playback:', error);
    }
  }

  pause(): void {
    this.audioProvider.pause();
    this.updateState({ isPlaying: false });
  }

  stop(): void {
    this.audioProvider.stop();
    this.updateState({ 
      isPlaying: false, 
      currentTime: 0 
    });
  }

  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.audioProvider.setVolume(clampedVolume);
    this.updateState({ volume: clampedVolume });
  }

  seekTo(time: number): void {
    // Note: HTML5 Audio API doesn't provide a direct seek method
    // This would need to be implemented differently or through a custom audio provider
    console.warn('Seek functionality not implemented in HTML5AudioProvider');
  }

  destroy(): void {
    this.audioProvider.destroy();
    this.listeners.clear();
  }
} 