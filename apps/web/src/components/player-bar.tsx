import { usePlayer } from '../context/usePlayer';
import { PlayerControls } from './ui/PlayerControls';
import { ProgressBar } from './ui/ProgressBar';
import { VolumeControl } from './ui/VolumeControl';
import { AudioUnavailableMessage } from './ui/AudioUnavailableMessage';

/**
 * Formats seconds into MM:SS format
 * @param seconds - The number of seconds to format
 * @returns Formatted time string (e.g., "3:45")
 */
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
    play, 
    pause, 
    setVolume,
    seekTo 
  } = usePlayer();

  if (!currentSong) return null;

  const hasAudio = Boolean(currentSong.mp3Url && currentSong.mp3Url.trim() !== '');

  const handleAudioUploaded = (url: string) => {
    // In a real app, you would update the song's mp3Url in the database
    console.log('Audio uploaded for song:', currentSong.title, 'URL:', url);
    // You could trigger a refresh of the song data here
    // or update the current song's mp3Url directly
  };

  return (
    <div className="bg-spotify-gray-800 border-t border-spotify-gray-700 p-4">
      {!hasAudio && (
        <AudioUnavailableMessage 
          songTitle={currentSong.title}
          artistName={currentSong.artist}
          onAudioUploaded={handleAudioUploaded}
        />
      )}
      
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
            onPlay={play}
            onPause={pause}
            onStop={() => {}}
            canPlay={hasAudio}
          />
        </div>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <span className="text-spotify-gray-300 text-xs">
            {formatDuration(currentTime)}
          </span>
          <div className="w-24">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
            />
          </div>
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