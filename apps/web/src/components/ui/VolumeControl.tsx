import React from 'react';
import type { VolumeControlProps } from '../../data/types';

export const VolumeControl: React.FC<VolumeControlProps> = ({ 
  volume, 
  onVolumeChange 
}) => {
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="flex items-center space-x-2">
      <svg className="w-4 h-4 text-spotify-gray-300" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-16 h-1 bg-spotify-gray-600 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume * 100}%, #4B5563 ${volume * 100}%, #4B5563 100%)`
        }}
      />
    </div>
  );
}; 