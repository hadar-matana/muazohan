import { usePlayer } from '../hooks/usePlayer';
import { PlayerControls } from './ui/PlayerControls';
import { ProgressBar } from './ui/ProgressBar';
import { VolumeControl } from './ui/VolumeControl';


const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function PlayerBar() {
  const { 
    currentSong, 
    playlist,
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    togglePlayPause,
    playNext,
    playPrevious,
    setVolume,
    seekTo 
  } = usePlayer();



  if (!currentSong) return null;

  const hasAudio = Boolean(currentSong.mp3Url && currentSong.mp3Url.trim() !== '');
  
  // Always show the player bar if there's a current song, even if it doesn't have audio
  
  // Handle both old and new schema
  const artistName = typeof currentSong.artists === 'string' ? currentSong.artists : currentSong.artists?.name || 'Unknown Artist';
  const imageUrl = currentSong.image_url || '/default-album.jpg';

  return (
    <div className="glass border-t border-light-200/50 dark:border-dark-700/50 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          <img 
            src={imageUrl} 
            alt={`${currentSong.title} cover`}
            className="w-16 h-16 rounded-2xl mr-4 shadow-soft object-cover"
            onError={(e) => {
              e.currentTarget.src = '/default-album.jpg';
            }}
          />
          <div className="min-w-0">
            <h4 className="text-light-950 dark:text-white font-medium text-sm truncate group-hover:text-orange-600 dark:group-hover:text-orange-100 transition-colors duration-200">
              {currentSong.title}
            </h4>
            <p className="text-light-600 dark:text-dark-300 text-xs truncate">
              {artistName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 flex-1 justify-center">
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onNext={playNext}
            onPrevious={playPrevious}
            canPlay={hasAudio}
            canGoNext={playlist.length > 1}
            canGoPrevious={playlist.length > 1}
          />
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="text-light-500 dark:text-dark-400 text-xs font-mono">
            {formatDuration(currentTime)}
          </span>
          <span className="text-light-500 dark:text-dark-400 text-xs font-mono">
            {formatDuration(duration)}
          </span>
          
          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
        />
      </div>
    </div>
  );
}