import React from 'react';
import { trpc } from '../trpc';
import { Album } from '../data/types';

interface ArtistDetailProps {
  artistId: string;
  onAlbumClick: (album: Album) => void;
  onBack: () => void;
}

const ArtistDetail: React.FC<ArtistDetailProps> = ({ artistId, onAlbumClick, onBack }) => {
  const { data: artist, isLoading, error } = trpc.getArtistById.useQuery({ id: artistId });

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
          <p className="text-red-500 mb-2">Error loading artist</p>
          <p className="text-sm text-light-600 dark:text-dark-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-600 dark:text-dark-400 mb-2">Artist not found</p>
        </div>
      </div>
    );
  }

  const imageUrl = artist.image_url || '/default-album.jpg';

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
        <div className="flex items-center space-x-4">
          <img 
            src={imageUrl} 
            alt={artist.name}
            className="w-20 h-20 rounded-full object-cover shadow-lg"
            onError={(e) => {
              e.currentTarget.src = '/default-album.jpg';
            }}
          />
          <div>
            <h1 className="text-3xl font-bold text-light-900 dark:text-dark-100">
              {artist.name}
            </h1>
            <p className="text-light-600 dark:text-dark-400">
              {artist.albums?.length || 0} albums
            </p>
          </div>
        </div>
      </div>

      {/* Albums Section */}
      <div>
        <h2 className="text-2xl font-bold text-light-900 dark:text-dark-100 mb-4">
          Albums
        </h2>
        
        {!artist.albums || artist.albums.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-light-600 dark:text-dark-400">No albums found for this artist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artist.albums.map((album: Album) => (
              <div 
                key={album.id}
                className="glass p-4 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => onAlbumClick(album)}
              >
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={album.image_url || '/default-album.jpg'} 
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
                    <p className="text-xs text-light-500 dark:text-dark-500">
                      {album.year} • {album.songs?.length || 0} songs
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail; 