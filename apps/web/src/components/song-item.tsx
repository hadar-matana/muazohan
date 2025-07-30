
import { SongItemProps } from '../data/types';

export function SongItem({ song, index, isCurrentSong, isPlaying, onPlayPause }: SongItemProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`song-row grid grid-cols-12 gap-4 items-center px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-spotify-gray-800 ${
        isCurrentSong ? 'bg-spotify-gray-700' : ''
      }`}
      onClick={onPlayPause}
    >
      <div className="col-span-1 flex items-center justify-center">
        <div className="relative group">
          <span className={`text-sm ${isCurrentSong && isPlaying ? 'text-spotify-green' : 'text-spotify-gray-300'} group-hover:hidden`}>
            {isCurrentSong && isPlaying ? '♪' : index}
          </span>
          <div className="hidden group-hover:flex items-center justify-center">
            <div className="play-button w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor">
                {isCurrentSong && isPlaying ? (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-5 md:col-span-4 flex items-center min-w-0">
        <img 
          src={song.imageUrl} 
          alt={`${song.title} cover`} 
          className="song-image w-10 h-10 mr-3"
        />
        <div className="song-info flex flex-col min-w-0">
          <h3 className={`song-title font-medium text-sm truncate ${
            isCurrentSong ? 'text-spotify-green' : 'text-white'
          }`}>
            {song.title}
          </h3>
          <p className="song-artist text-spotify-gray-300 text-sm truncate">
            {song.artist.name}
          </p>
        </div>
      </div>

      <div className="hidden md:block col-span-3">
        <p className="song-album text-spotify-gray-300 text-sm truncate">
          {song.album.name}
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