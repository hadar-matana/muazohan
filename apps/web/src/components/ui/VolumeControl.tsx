import React from 'react';
import { Volume2 } from 'lucide-react';
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
      <Volume2 className="w-4 h-4 text-spotify-gray-300" />
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