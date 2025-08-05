import React from 'react';
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import type { PlayerControlsProps } from '../../data/types';

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  canPlay
}) => {
  return (
    <div className="flex items-center space-x-6">
      <button 
        className="text-spotify-gray-300 hover:text-white transition-colors disabled:opacity-50"
        disabled={!canPlay}
      >
        <SkipBack className="w-5 h-5" />
      </button>

      <button 
        onClick={onPlayPause}
        className="play-button w-10 h-10 bg-white text-black hover:scale-105 disabled:opacity-50"
        disabled={!canPlay}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <button 
        className="text-spotify-gray-300 hover:text-white transition-colors disabled:opacity-50"
        disabled={!canPlay}
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
}; 