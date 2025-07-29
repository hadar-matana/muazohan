
import { Song } from '../types';

interface SongItemProps {
  song: Song;
//   isCurrentSong: boolean;
//   isPlaying: boolean;
  onPlayPause: () => void;
}

export function SongItem({ song, onPlayPause }: SongItemProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div>
        <img src={song.imageUrl} alt={`${song.title} cover`} />
        <button className="play-button" onClick={onPlayPause}>
          {/* {isCurrentSong && isPlaying ? <Pause size={16} /> : <Play size={16} />} */}
        </button>
      </div>
      <div className="song-info">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-artist">{song.artist.name}</p>
      </div>
      <div className="song-album">
        <p>{song.album.name}</p>
      </div>
      <div className="song-duration">
        <p>{formatDuration(song.duration)}</p>
      </div>
    </div>
  );
}