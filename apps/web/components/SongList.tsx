'use client';

import { Play, Pause, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { usePlayback } from '../contexts/PlaybackContext';
import { Song } from '../types';

interface SongItemProps {
  song: Song;
  isCurrentSong: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
}

function SongItem({ song, isCurrentSong, isPlaying, onPlayPause }: SongItemProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`song-item ${isCurrentSong ? 'current' : ''}`}>
      <div className="song-cover">
        <img src={song.imageUrl} alt={`${song.title} cover`} />
        <button className="play-button" onClick={onPlayPause}>
          {isCurrentSong && isPlaying ? <Pause size={16} /> : <Play size={16} />}
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

export function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayback();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const fetchedSongs = await apiClient.getSongs();
        setSongs(fetchedSongs);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch songs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handlePlayPause = (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Music className="loading-icon" />
        <p>Loading your music...</p>
      </div>
    );
  }

      if (error) {
      return (
        <div className="error-container">
          <p>Error loading songs: {error}</p>
        </div>
      );
    }

  return (
    <div className="song-list">
      <div className="song-list-header">
        <h2>Your Music</h2>
        <p>{songs.length || 0} songs</p>
      </div>
      
      <div className="song-list-table">
        <div className="song-list-table-header">
          <div className="header-cover">#</div>
          <div className="header-title">Title</div>
          <div className="header-album">Album</div>
          <div className="header-duration">Duration</div>
        </div>
        
        <div className="song-list-content">
          {songs.map((song, index) => (
            <SongItem
              key={song.id}
              song={song}
              isCurrentSong={currentSong?.id === song.id}
              isPlaying={isPlaying}
              onPlayPause={() => handlePlayPause(song)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}