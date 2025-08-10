import React from 'react';
import { trpc } from '../trpc';
import { Song } from '../data/types';
import { SongItem } from './song-item';
import { usePlayer } from '../context/PlayerContext';

interface AlbumDetailProps {
  albumId: string;
  onSongClick: (song: Song) => void;
  onBack: () => void;
}

const AlbumDetail: React.FC<AlbumDetailProps> = ({ albumId, onSongClick, onBack }) => {
  const { data: album, isLoading, error } = trpc.getAlbumById.useQuery({ id: albumId });
  const { setPlaylist, currentSong, isPlaying } = usePlayer();

  // Set playlist when album songs are loaded
  React.useEffect(() => {
    if (album?.songs) {
      setPlaylist(album.songs);
    }
  }, [album?.songs, setPlaylist]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading album</p>
          <p className="text-sm text-light-600 dark:text-dark-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-600 dark:text-dark-400 mb-2">Album not found</p>
        </div>
      </div>
    );
  }

  const imageUrl = album.image_url || '/default-album.jpg';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-light-200 dark:hover:bg-dark-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center space-x-6">
          <img 
            src={imageUrl} 
            alt={album.name}
            className="w-32 h-32 rounded-lg object-cover shadow-lg"
            onError={(e) => {
              e.currentTarget.src = '/default-album.jpg';
            }}
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-light-900 dark:text-dark-100">
              {album.name}
            </h1>
            <p className="text-lg text-light-600 dark:text-dark-400">
              {album.artists?.name || 'Unknown Artist'}
            </p>
            <p className="text-sm text-light-500 dark:text-dark-500">
              {album.year} • {album.songs?.length || 0} songs
            </p>
          </div>
        </div>
      </div>

      {/* Songs Section */}
      <div>
        <h2 className="text-2xl font-bold text-light-900 dark:text-dark-100 mb-4">
          Songs
        </h2>
        
        {!album.songs || album.songs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-light-600 dark:text-dark-400">No songs found in this album</p>
          </div>
        ) : (
          <div className="space-y-2">
            {album.songs.map((song, index) => (
              <div key={song.id} className="glass rounded-lg">
                <SongItem
                  song={song}
                  index={index}
                  isCurrentSong={currentSong?.id === song.id}
                  isPlaying={isPlaying && currentSong?.id === song.id}
                  onPlayPause={() => onSongClick(song)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail; 