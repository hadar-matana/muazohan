import React from 'react';
import type { ProgressBarProps } from '../../data/types';

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  return (
    <div 
      className="w-full h-1 bg-spotify-gray-600 rounded-full cursor-pointer"
      onClick={handleClick}
    >
      <div 
        className="h-1 bg-spotify-green rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}; 