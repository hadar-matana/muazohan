
import { SongItemProps } from '../data/types';
import { Play, Pause, AlertTriangle } from 'lucide-react';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function SongItem({ song, index, isCurrentSong, isPlaying, onPlayPause }: SongItemProps) {
  const hasAudio = Boolean(song.mp3Url && song.mp3Url.trim() !== '');

  return (
    <div 
      className="song-row grid grid-cols-12 gap-4 items-center px-4 py-2 rounded-md cursor-pointer hover:bg-spotify-gray-800"
      style={{ backgroundColor: isCurrentSong ? '#374151' : 'transparent' }}
      onClick={hasAudio ? onPlayPause : undefined}
    >
      <div className="col-span-1 flex items-center justify-center">
        <div className="relative group">
          {hasAudio ? (
            <>
              <span className={`text-sm ${isCurrentSong && isPlaying ? 'text-spotify-green' : 'text-spotify-gray-300'} group-hover:hidden`}>
                {isCurrentSong && isPlaying ? '♪' : index}
              </span>
              <div className="hidden group-hover:flex items-center justify-center">
                <div className="play-button w-8 h-8 flex items-center justify-center">
                  {isCurrentSong && isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </div>
              </div>
            </>
          ) : (
            <span className="text-sm text-spotify-gray-500">
              <AlertTriangle className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>

      <div className="col-span-5 md:col-span-4 flex items-center min-w-0">
        <img 
          src={song.imageUrl} 
          alt={`${song.title} cover`} 
          className="song-image w-10 h-10 mr-3"
        />
        <div className="song-info flex flex-col min-w-0 gap-1">
          <h3 className={`song-title font-semibold text-sm truncate ${
            isCurrentSong ? 'text-spotify-green' : 'text-white'
          }`}>
            {song.title}
          </h3>
          <p className="song-artist text-spotify-gray-300 text-xs truncate">
            {song.artist}
            {!hasAudio && (
              <span className="ml-2 text-spotify-gray-500 text-xs">
                (No audio)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="hidden md:block col-span-3">
        <p className="song-album text-spotify-gray-300 text-sm truncate">
          {song.album}
        </p>
      </div>

      <div className="col-span-6 md:col-span-4 text-right">
        <p className="song-duration text-spotify-gray-300 text-sm">
          {formatDuration(song.duration)}
        </p>
      </div>
    </div>
  );
}