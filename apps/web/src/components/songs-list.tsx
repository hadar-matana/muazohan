
import React from 'react';
import { SongItem } from './song-item';
import { trpc } from '../trpc';
import { usePlayer } from '../context/PlayerContext';
import type { Song } from '../data/types';


export default function SongList() {
  const { playSong, setPlaylist, currentSong, isPlaying } = usePlayer();

  const { data: songs, isLoading } = trpc.getSongs.useQuery();

  // Set playlist when songs are loaded
  React.useEffect(() => {
    if (songs) {
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-light-600 dark:text-dark-300 text-lg">טוען...</div>
    </div>
  );
  
  if (!songs) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-light-600 dark:text-dark-300 text-lg">לא נמצאו שירים</div>
    </div>
  );

  return (   
    <div className="p-8 overflow-y-auto h-full">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold gradient-text mb-2">Your Music</h2>
        <p className="text-light-500 dark:text-dark-400 text-sm">Discover and enjoy your favorite tracks</p>
      </div>
      
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-light-600 dark:text-dark-300 text-sm font-medium border-b border-light-200/50 dark:border-dark-700/50 mb-4">
          <div className="col-span-1"></div>
          <div className="col-span-5 md:col-span-4">TITLE</div>
          <div className="hidden md:block col-span-3">ALBUM</div>
          <div className="col-span-6 md:col-span-4 text-right">DURATION</div>
        </div>

        <div className="space-y-2">
          {songs.map((song: Song, index: number) => (
            <SongItem
              key={song.id}
              song={song}
              index={index + 1}
              isCurrentSong={currentSong?.id === song.id}
              isPlaying={isPlaying && currentSong?.id === song.id}
              onPlayPause={() => playSong(song)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
