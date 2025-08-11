import React from 'react';
import { trpc } from '../trpc';
import { Album } from '../data/types';

interface AlbumItemProps {
  album: Album;
  onClick: (album: Album) => void;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ album, onClick }) => {
  const imageUrl = album.image_url || '/default-album.jpg';
  
  return (
    <div 
      className="glass p-4 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(album)}
    >
      <div className="space-y-3">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={album.name}
            className="w-full h-48 rounded-lg object-cover shadow-lg group-hover:shadow-xl transition-shadow"
            onError={(e) => {
              e.currentTarget.src = '/default-album.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg"></div>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-light-900 dark:text-dark-100 group-hover:text-orange-500 transition-colors line-clamp-2">
            {album.name}
          </h3>
          <p className="text-sm text-light-600 dark:text-dark-400">
            {album.artists?.name || 'Unknown Artist'}
          </p>
          <p className="text-xs text-light-500 dark:text-dark-500">
            {album.year} • {album.songs?.length || 0} songs
          </p>
        </div>
      </div>
    </div>
  );
};

interface AlbumsListProps {
  onAlbumClick: (album: Album) => void;
}

const AlbumsList: React.FC<AlbumsListProps> = ({ onAlbumClick }) => {
  const { data: albums, isLoading, error } = trpc.getAlbums.useQuery();

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
          <p className="text-red-500 mb-2">Error loading albums</p>
          <p className="text-sm text-light-600 dark:text-dark-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-600 dark:text-dark-400 mb-2">No albums found</p>
          <p className="text-sm text-light-500 dark:text-dark-500">Add some albums to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-light-900 dark:text-dark-100 mb-2">
          Albums
        </h2>
        <p className="text-light-600 dark:text-dark-400">
          Browse and explore your music collection
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album: Album) => (
          <AlbumItem 
            key={album.id} 
            album={album} 
            onClick={onAlbumClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumsList; 