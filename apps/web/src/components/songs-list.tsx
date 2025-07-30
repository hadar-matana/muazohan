
// import { useState } from 'react';
import { SongListProps } from '../data/types';
import { SongItem } from './song-item';
import { trpc } from '../trpc';



export default function SongList({ onPlaySong, currentSong, isPlaying }: SongListProps) {
  // const [songs, setSongs] = useState<Song[]>(mockSongs);

  const { data: songs, isLoading } = trpc.getSongs.useQuery();

  if (isLoading) return <div>טוען...</div>;
  if (!songs) return <div>לא נמצאו שירים</div>;

  return (   
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="text-xl font-bold text-white mb-6">Your Music</h2>
      
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-spotify-gray-300 text-sm font-medium border-b border-spotify-gray-700 mb-2">
        <div className="col-span-6 md:col-span-5">TITLE</div>
        <div className="hidden md:block col-span-3">ALBUM</div>
        <div className="col-span-6 md:col-span-4 text-right">DURATION</div>
      </div>

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
