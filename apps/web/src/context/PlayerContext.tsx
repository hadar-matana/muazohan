import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import type { PlayerContextType, PlayerState, Song } from '../data/types';
import { AudioPlayer } from '../services/AudioProvider';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
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
      setState(prev => ({
        ...prev,
        currentSong: song,
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

  const contextValue: PlayerContextType = {
    ...state,
    playSong,
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