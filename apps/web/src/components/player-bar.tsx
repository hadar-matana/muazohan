import { usePlayer } from '../context/PlayerContext';
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
    isPlaying, 
    currentTime, 
    duration, 
    volume,
    togglePlayPause, 
    setVolume,
    seekTo 
  } = usePlayer();

  if (!currentSong) return null;

  const hasAudio = Boolean(currentSong.mp3Url && currentSong.mp3Url.trim() !== '');

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
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 flex-1 justify-center">
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onStop={() => {}}
            canPlay={hasAudio}
          />
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="text-spotify-gray-300 text-xs">
            {formatDuration(currentTime)}
          </span>
          <span className="text-spotify-gray-300 text-xs">
            {formatDuration(duration)}
          </span>
          
          <VolumeControl
            volume={volume}
            onVolumeChange={setVolume}
          />
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
        />
      </div>
    </div>
  );
}