import { usePlayer } from '../context/PlayerContext';


export default function PlayerBar() {
  const { currentSong, isPlaying, play, pause } = usePlayer();

  if (!currentSong) return null;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-spotify-gray-800 border-t border-spotify-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          <img 
            src={currentSong.imageUrl} 
            alt={`${currentSong.title} cover`}
            className="w-14 h-14 rounded-md mr-4"
          />
          <div className="min-w-0">
            <h4 className="text-white font-medium text-sm truncate">
              {currentSong.title}
            </h4>
            <p className="text-spotify-gray-300 text-xs truncate">
              {currentSong.artist.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 flex-1 justify-center">
          <button className="text-spotify-gray-300 hover:text-white transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button 
            onClick={isPlaying ? pause : play}
            className="play-button w-10 h-10 bg-white text-black hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              {isPlaying ? (
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </button>

          <button className="text-spotify-gray-300 hover:text-white transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="text-spotify-gray-300 text-xs">
            0:00
          </span>
          <div className="w-24 h-1 bg-spotify-gray-600 rounded-full">
            <div className="h-1 bg-spotify-green rounded-full w-0"></div>
          </div>
          <span className="text-spotify-gray-300 text-xs">
            {formatDuration(currentSong.duration)}
          </span>
          
          <div className="flex items-center space-x-2 ml-4">
            <svg className="w-4 h-4 text-spotify-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
            <div className="w-16 h-1 bg-spotify-gray-600 rounded-full">
              <div className="h-1 bg-spotify-green rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="w-full h-1 bg-spotify-gray-600 rounded-full">
          <div className="h-1 bg-spotify-green rounded-full w-0 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );
}