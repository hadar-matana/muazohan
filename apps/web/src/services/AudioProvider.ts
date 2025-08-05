import type { AudioProvider } from '../data/types';

export class HTML5AudioProvider implements AudioProvider {
  private audio: HTMLAudioElement;
  private onEndedCallback?: () => void;
  private onErrorCallback?: (error: Error) => void;
  private onTimeUpdateCallback?: (currentTime: number) => void;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.audio.addEventListener('ended', () => {
      this.onEndedCallback?.();
    });

    this.audio.addEventListener('error', (event) => {
      // Only trigger error callback if there's an actual error and we have a source
      if (this.audio.error && this.audio.src && this.audio.src !== '') {
        const error = new Error(`Audio playback error: ${this.audio.error?.message || 'Unknown error'}`);
        this.onErrorCallback?.(error);
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdateCallback?.(this.audio.currentTime);
    });

    this.audio.addEventListener('loadstart', () => {
    });
  }

  async play(url: string): Promise<void> {
    try {
      if (!url || url.trim() === '') {
        throw new Error('Cannot play audio: URL is empty or invalid');
      }

      try {
        new URL(url);
      } catch {
        throw new Error('Cannot play audio: Invalid URL format');
      }

      this.audio.src = url;
      this.audio.load();
      
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          this.audio.removeEventListener('canplay', onCanPlay);
          this.audio.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = () => {
          this.audio.removeEventListener('canplay', onCanPlay);
          this.audio.removeEventListener('error', onError);
          reject(new Error('Audio failed to load'));
        };
        
        this.audio.addEventListener('canplay', onCanPlay);
        this.audio.addEventListener('error', onError);
        
        setTimeout(() => {
          this.audio.removeEventListener('canplay', onCanPlay);
          this.audio.removeEventListener('error', onError);
          reject(new Error('Audio load timeout'));
        }, 10000); // 10 second timeout
      });
      
      await this.audio.play();
    } catch (error) {
      throw new Error(`Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  pause(): void {
    this.audio.pause();
  }

  resume(): void {
    this.audio.play().catch(error => {
      console.error('Failed to resume audio:', error);
    });
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  isPlaying(): boolean {
    return !this.audio.paused && !this.audio.ended && this.audio.currentTime > 0;
  }

  onEnded(callback: () => void): void {
    this.onEndedCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  onTimeUpdate(callback: (currentTime: number) => void): void {
    this.onTimeUpdateCallback = callback;
  }

  destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
  }
} 