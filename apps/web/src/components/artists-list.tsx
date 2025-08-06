import React from 'react';
import { trpc } from '../trpc';
import { Artist } from '../data/types';

interface ArtistItemProps {
  artist: Artist;
  onClick: (artist: Artist) => void;
}

const ArtistItem: React.FC<ArtistItemProps> = ({ artist, onClick }) => {
  const imageUrl = artist.image_url || '/default-album.jpg';
  
  return (
    <div 
      className="glass p-4 rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
      onClick={() => onClick(artist)}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={artist.name}
            className="w-16 h-16 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow"
            onError={(e) => {
              e.currentTarget.src = '/default-album.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-light-900 dark:text-dark-100 group-hover:text-orange-500 transition-colors">
            {artist.name}
          </h3>
          <p className="text-sm text-light-600 dark:text-dark-400">
            {artist.albums?.length || 0} albums
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ArtistsListProps {
  onArtistClick: (artist: Artist) => void;
}

const ArtistsList: React.FC<ArtistsListProps> = ({ onArtistClick }) => {
  const { data: artists, isLoading, error } = trpc.getArtists.useQuery();

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
          <p className="text-red-500 mb-2">Error loading artists</p>
          <p className="text-sm text-light-600 dark:text-dark-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-light-600 dark:text-dark-400 mb-2">No artists found</p>
          <p className="text-sm text-light-500 dark:text-dark-500">Add some artists to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-light-900 dark:text-dark-100 mb-2">
          Artists
        </h2>
        <p className="text-light-600 dark:text-dark-400">
          Discover and explore your favorite artists
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <ArtistItem 
            key={artist.id} 
            artist={artist} 
            onClick={onArtistClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtistsList; 