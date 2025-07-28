'use client';

import { Play, Pause, Music, Database, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { mockSongs } from '../data/mockSongs';
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

type DataSource = 'mock' | 'api';

export function SongListWithToggle() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('api');
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = usePlayback();

  useEffect(() => {
    const loadSongs = async () => {
      if (dataSource === 'mock') {
        // Stage 1: Load from local mock data
        setSongs(mockSongs);
        setIsLoading(false);
        setError(null);
      } else {
        // Stage 2: Load from API
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
      }
    };

    loadSongs();
  }, [dataSource]);

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
        <button 
          onClick={() => setDataSource('mock')}
          style={{ 
            marginTop: '16px', 
            padding: '8px 16px', 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Switch to Mock Data
        </button>
      </div>
    );
  }

  return (
    <div className="song-list">
      {/* Data Source Toggle */}
      <div className="data-source-toggle" style={{ 
        marginBottom: '24px', 
        padding: '16px', 
        background: 'var(--secondary)', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {dataSource === 'mock' ? <Layers size={20} /> : <Database size={20} />}
            <span style={{ fontWeight: '500' }}>
              {dataSource === 'mock' ? 'Stage 1: Mock Data' : 'Stage 2: API Data'}
            </span>
          </div>
          <span style={{ 
            fontSize: '0.875rem', 
            opacity: 0.7,
            padding: '4px 8px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}>
            {dataSource === 'mock' ? 'LOCAL' : 'BACKEND'}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setDataSource('mock')}
            style={{
              padding: '8px 12px',
              background: dataSource === 'mock' ? 'var(--primary)' : 'transparent',
              color: dataSource === 'mock' ? 'white' : 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Mock
          </button>
          <button
            onClick={() => setDataSource('api')}
            style={{
              padding: '8px 12px',
              background: dataSource === 'api' ? 'var(--primary)' : 'transparent',
              color: dataSource === 'api' ? 'white' : 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            API
          </button>
        </div>
      </div>

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