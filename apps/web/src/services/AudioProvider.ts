export class AudioPlayer {
  private audio: HTMLAudioElement;
  private onTimeUpdateCallback?: (currentTime: number) => void;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.onTimeUpdateCallback?.(this.audio.currentTime);
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

  seekTo(time: number): void {
    if (this.audio.duration && time >= 0 && time <= this.audio.duration) {
      this.audio.currentTime = time;
    }
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

  onTimeUpdate(callback: (currentTime: number) => void): void {
    this.onTimeUpdateCallback = callback;
  }

  destroy(): void {
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
  }
} 