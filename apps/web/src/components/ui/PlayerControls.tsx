import React from 'react';
import type { PlayerControlsProps } from '../../data/types';

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  canPlay
}) => {
  return (
    <div className="flex items-center space-x-6">
      <button 
        className="text-spotify-gray-300 hover:text-white transition-colors disabled:opacity-50"
        disabled={!canPlay}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
        </svg>
      </button>

      <button 
        onClick={isPlaying ? onPause : onPlay}
        className="play-button w-10 h-10 bg-white text-black hover:scale-105 disabled:opacity-50"
        disabled={!canPlay}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          {isPlaying ? (
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          ) : (
            <path d="M8 5v14l11-7z" />
          )}
        </svg>
      </button>

      <button 
        className="text-spotify-gray-300 hover:text-white transition-colors disabled:opacity-50"
        disabled={!canPlay}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
        </svg>
      </button>
    </div>
  );
}; 