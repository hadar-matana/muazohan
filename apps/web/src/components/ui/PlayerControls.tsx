import React from 'react';
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import type { PlayerControlsProps } from '../../data/types';

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  canPlay,
  canGoNext,
  canGoPrevious
}) => {
  return (
    <div className="flex items-center space-x-6">
      <button 
        onClick={onPrevious}
        className="text-light-600 hover:text-orange-500 dark:text-dark-300 dark:hover:text-orange-400 transition-all duration-200 disabled:opacity-50 hover:scale-110 disabled:hover:scale-100"
        disabled={!canGoPrevious}
      >
        <SkipBack className="w-5 h-5" />
      </button>

      <button 
        onClick={onPlayPause}
        className="play-button w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-soft hover:shadow-glow"
        disabled={!canPlay}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <button 
        onClick={onNext}
        className="text-light-600 hover:text-orange-500 dark:text-dark-300 dark:hover:text-orange-400 transition-all duration-200 disabled:opacity-50 hover:scale-110 disabled:hover:scale-100"
        disabled={!canGoNext}
      >
        <SkipForward className="w-5 h-5" />
      </button>
    </div>
  );
}; 