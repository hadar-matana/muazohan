import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import type { PlayerContextType, PlayerState, Song } from '../data/types';
import { AudioPlayer } from '../services/AudioProvider';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    playlist: [],
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });

  const audioProviderRef = useRef<AudioPlayer>();

  useEffect(() => {
    audioProviderRef.current = new AudioPlayer();
    audioProviderRef.current.onTimeUpdate((currentTime) => {
      setState(prev => ({ ...prev, currentTime }));
    });

    return () => {
      audioProviderRef.current?.destroy();
    };
  }, []);

  const playSong = async (song: Song) => {
    try {
      // Find the index of the song in the playlist
      const songIndex = state.playlist.findIndex(s => s.id === song.id);
      
      setState(prev => ({
        ...prev,
        currentSong: song,
        currentIndex: songIndex >= 0 ? songIndex : 0, // Ensure we don't set -1
        currentTime: 0,
        duration: song.duration || 0,
      }));

      if (!song.mp3Url || song.mp3Url.trim() === '') {
        const artistName = typeof song.artists === 'string' ? song.artists : song.artists?.name || 'Unknown Artist';
        console.warn(`No mp3Url found for song: "${song.title}" by ${artistName}`);
        setState(prev => ({ ...prev, isPlaying: false }));
        return;
      }

      setState(prev => ({ ...prev, isPlaying: true }));
      await audioProviderRef.current?.play(song.mp3Url);
    } catch (error) {
      console.error('Failed to play song:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const play = async () => {
    if (!state.currentSong) return;

    if (!state.currentSong.mp3Url || state.currentSong.mp3Url.trim() === '') {
      console.warn('Cannot play: No audio URL available for current song');
      return;
    }

    try {
      audioProviderRef.current?.resume();
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error('Failed to resume playback:', error);
    }
  };

  const pause = () => {
    audioProviderRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const togglePlayPause = async () => {
    if (state.isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const stop = () => {
    audioProviderRef.current?.stop();
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: 0 
    }));
  };

  const setVolume = (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioProviderRef.current?.setVolume(clampedVolume);
    setState(prev => ({ ...prev, volume: clampedVolume }));
  };

  const seekTo = (time: number) => {
    audioProviderRef.current?.seekTo(time);
  };

  const setPlaylist = (songs: Song[]) => {
    setState(prev => ({
      ...prev,
      playlist: songs,
      currentIndex: -1,
      currentSong: null,
    }));
  };

  const playNext = async () => {
    if (state.playlist.length === 0) return;
    
    let nextIndex: number;
    if (state.currentIndex === -1) {
      // If no song is currently playing, start with the first song
      nextIndex = 0;
    } else {
      nextIndex = (state.currentIndex + 1) % state.playlist.length;
    }
    
    const nextSong = state.playlist[nextIndex];
    
    if (nextSong) {
      await playSong(nextSong);
    }
  };

  const playPrevious = async () => {
    if (state.playlist.length === 0) return;
    
    let prevIndex: number;
    if (state.currentIndex === -1) {
      // If no song is currently playing, start with the last song
      prevIndex = state.playlist.length - 1;
    } else {
      prevIndex = state.currentIndex === 0 
        ? state.playlist.length - 1 
        : state.currentIndex - 1;
    }
    
    const prevSong = state.playlist[prevIndex];
    
    if (prevSong) {
      await playSong(prevSong);
    }
  };

  const contextValue: PlayerContextType = {
    ...state,
    playSong,
    setPlaylist,
    playNext,
    playPrevious,
    play,
    pause,
    togglePlayPause,
    stop,
    setVolume,
    seekTo,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerContext };

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};