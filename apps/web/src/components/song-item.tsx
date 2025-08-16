import { SongItemProps } from '../data/types';
import { Play, Pause, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function SongItem({ song, index, isCurrentSong, isPlaying, onPlayPause }: SongItemProps) {
  const navigate = useNavigate();
  
  const hasAudio = Boolean(song.mp3Url && song.mp3Url.trim() !== '');
  
  const artistName = typeof song.artists === 'string' ? song.artists : song.artists?.name || 'Unknown Artist';
  const albumName = typeof song.albums === 'string' ? song.albums : song.albums?.name || 'Unknown Album';
  const imageUrl = song.image_url || '/default-album.jpg'; 

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.artist_id) {
      navigate(`/artists/${song.artist_id}`);
    }
  };

  const handleAlbumClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.album_id) {
      navigate(`/albums/${song.album_id}`);
    }
  };

  return (
    <div 
      className={`song-row group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
        isCurrentSong 
          ? 'bg-orange-500/10 border border-orange-500/20 shadow-soft' 
          : 'hover:bg-dark-700/50 hover:scale-[1.01]'
      }`}
      onClick={hasAudio ? onPlayPause : undefined}
    >
      <div className="col-span-1 flex items-center justify-center">
        <div className="relative group">
          {hasAudio ? (
            <>
              <span className={`text-sm font-medium transition-all duration-200 ${
                isCurrentSong && isPlaying 
                  ? 'text-orange-500' 
                  : 'text-dark-300 group-hover:text-orange-400'
              } group-hover:hidden`}>
                {isCurrentSong && isPlaying ? '♪' : index}
              </span>
              <div className="hidden group-hover:flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center transition-all duration-200 shadow-soft hover:shadow-glow">
                  {isCurrentSong && isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <span className="text-sm text-dark-500">
              <AlertTriangle className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      <div className="col-span-5 md:col-span-4 flex items-center min-w-0">
        <img 
          src={imageUrl} 
          alt={`${song.title} cover`} 
          className="song-image w-12 h-12 mr-4 rounded-xl shadow-soft"
          onError={(e) => {
            e.currentTarget.src = '/default-album.jpg';
          }}
        />
        <div className="song-info flex flex-col min-w-0 gap-1">
          <h3 className={`song-title font-semibold text-sm truncate transition-colors duration-200 ${
            isCurrentSong 
              ? 'text-orange-400' 
              : 'text-white group-hover:text-orange-100'
          }`}>
            {song.title}
          </h3>
          <p className="song-artist text-dark-300 text-xs truncate group-hover:text-dark-200 transition-colors duration-200">
            <button
              onClick={handleArtistClick}
              className="hover:text-orange-400 hover:underline transition-colors duration-200"
              disabled={!song.artist_id}
            >
              {artistName}
            </button>
            {!hasAudio && (
              <span className="ml-2 text-dark-500 text-xs">
                (No audio)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="hidden md:block col-span-3">
        <p className="song-album text-dark-400 text-sm truncate group-hover:text-dark-300 transition-colors duration-200">
          <button
            onClick={handleAlbumClick}
            className="hover:text-orange-400 hover:underline transition-colors duration-200"
            disabled={!song.album_id}
          >
            {albumName}
          </button>
        </p>
      </div>

      <div className="col-span-6 md:col-span-4 text-right">
        <p className="song-duration text-dark-400 text-sm font-mono">
          {song.duration ? formatDuration(song.duration) : '0:00'}
        </p>
      </div>
    </div>
  );
}