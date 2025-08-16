
import React, { useState } from 'react';
import { SongItem } from './song-item';
import { UploadSongModal } from './upload-song-modal';
import { trpc } from '../trpc';
import { usePlayer } from '../hooks/usePlayer';
import type { Song } from '../data/types';

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ children, onClick, variant = 'primary', disabled = false, size = 'md', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl',
  };
  
  const variantStyles = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-soft hover:shadow-glow active:scale-95 disabled:hover:shadow-soft disabled:active:scale-100',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-white border border-dark-600 hover:border-dark-500 shadow-soft disabled:hover:bg-dark-700',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function SongList() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { playSong, setPlaylist, currentSong, isPlaying } = usePlayer();

  const { data: songs, isLoading, refetch } = trpc.getSongs.useQuery();

  React.useEffect(() => {
    if (songs) {
      setPlaylist(songs);
    }
  }, [songs, setPlaylist]);

  const handleUploadSuccess = () => {
    refetch(); 
  };

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
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-display font-bold gradient-text">Your Music</h2>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Song</span>
          </Button>
        </div>
        <p className="text-light-500 dark:text-dark-400 text-sm">Discover and enjoy your favorite tracks</p>
      </div>
      
      <div className="glass rounded-2xl p-6">
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

      {/* Upload Modal */}
      <UploadSongModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
