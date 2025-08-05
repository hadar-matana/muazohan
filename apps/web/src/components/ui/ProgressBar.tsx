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
      className="w-full h-2 bg-dark-700 rounded-full cursor-pointer hover:bg-dark-600 transition-colors duration-200 group"
      onClick={handleClick}
    >
      <div 
        className="h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-300 shadow-sm group-hover:shadow-glow"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}; 