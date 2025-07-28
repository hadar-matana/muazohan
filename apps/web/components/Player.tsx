'use client';

import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayback } from '../contexts/PlaybackContext';

export function Player() {
  const { currentSong, isPlaying, pauseSong, resumeSong } = usePlayback();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <div className="player">
      <div className="player-content">
        {/* Currently playing song info */}
        <div className="player-song-info">
          <img 
            src={currentSong.imageUrl} 
            alt={`${currentSong.title} cover`}
            className="player-cover"
          />
          <div className="player-text">
            <h4 className="player-song-title">{currentSong.title}</h4>
            <p className="player-artist">{currentSong.artist.name}</p>
          </div>
        </div>

        {/* Player controls */}
        <div className="player-controls">
          <div className="player-buttons">
            <button className="control-button" disabled>
              <SkipBack size={20} />
            </button>
            <button 
              className="play-pause-button"
              onClick={isPlaying ? pauseSong : resumeSong}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="control-button" disabled>
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="progress-container">
            <span className="time">0:00</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '0%' }}></div>
            </div>
            <span className="time">{formatDuration(currentSong.duration)}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="player-volume">
          <Volume2 size={20} />
          <div className="volume-bar">
            <div className="volume-fill" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}