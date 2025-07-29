
import { useState, useEffect } from 'react';
import { Song } from '../types';
import { mockSongs } from '../songs';
import { SongItem } from './song-item';

interface SongListProps {
  onPlaySong: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

export default function SongList({ onPlaySong, currentSong, isPlaying }: SongListProps) {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    // Simulate loading songs - in this case, we're using mockSongs
    setSongs(mockSongs);
  }, []);

  return (   
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold text-white mb-6">Your Music</h2>
      
      {/* Song List Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-spotify-gray-300 text-sm font-medium border-b border-spotify-gray-700 mb-2">
        <div className="col-span-6 md:col-span-5">TITLE</div>
        <div className="hidden md:block col-span-3">ALBUM</div>
        <div className="col-span-6 md:col-span-4 text-right">DURATION</div>
      </div>

      {/* Songs */}
      <div className="space-y-1">
        {songs.map((song, index) => (
          <SongItem
            key={song.id}
            song={song}
            index={index + 1}
            isCurrentSong={currentSong?.id === song.id}
            isPlaying={isPlaying && currentSong?.id === song.id}
            onPlayPause={() => onPlaySong(song)}
          />
        ))}
      </div>
    </div>
  );
}