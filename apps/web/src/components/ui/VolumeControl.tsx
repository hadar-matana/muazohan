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
    <div className="flex items-center space-x-3">
      <Volume2 className="w-4 h-4 text-dark-300 hover:text-orange-400 transition-colors duration-200" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 h-1.5 bg-dark-700 rounded-full appearance-none cursor-pointer hover:bg-dark-600 transition-colors duration-200"
        style={{
          background: `linear-gradient(to right, #f97316 0%, #f97316 ${volume * 100}%, #475569 ${volume * 100}%, #475569 100%)`
        }}
      />
    </div>
  );
}; 