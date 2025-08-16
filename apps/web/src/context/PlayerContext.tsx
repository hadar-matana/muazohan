import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
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



  const playSong = useCallback(async (song: Song) => {
    try {
      const songIndex = state.playlist.findIndex(s => s.id === song.id);
      
      setState(prev => ({
        ...prev,
        currentSong: song,
        currentIndex: songIndex >= 0 ? songIndex : 0, 
        currentTime: 0,
        duration: song.duration || 0,
        isPlaying: false, 
      }));

      if (!song.mp3Url || song.mp3Url.trim() === '') {
        const artistName = typeof song.artists === 'string' ? song.artists : song.artists?.name || 'Unknown Artist';
        console.warn(`No mp3Url found for song: "${song.title}" by ${artistName}`);
        return; 
      }

      setState(prev => ({ ...prev, isPlaying: true }));
      await audioProviderRef.current?.play(song.mp3Url);
    } catch (error) {
      console.error('Failed to play song:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [state.playlist]);

  const play = useCallback(async () => {
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
  }, [state.currentSong]);

  const pause = useCallback(() => {
    audioProviderRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (state.isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [state.isPlaying, pause, play]);

  const stop = useCallback(() => {
    audioProviderRef.current?.stop();
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentTime: 0 
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioProviderRef.current?.setVolume(clampedVolume);
    setState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  const seekTo = useCallback((time: number) => {
    audioProviderRef.current?.seekTo(time);
  }, []);

  const setPlaylist = useCallback((songs: Song[]) => {
    setState(prev => ({
      ...prev,
      playlist: songs,
      currentIndex: prev.currentSong && songs.find(s => s.id === prev.currentSong?.id) ? 
        songs.findIndex(s => s.id === prev.currentSong?.id) : -1,
      currentSong: prev.currentSong && songs.find(s => s.id === prev.currentSong?.id) ? 
        prev.currentSong : null,
    }));
  }, []);

  const playNext = useCallback(async () => {
    if (state.playlist.length === 0) return;
    
    let nextIndex: number;
    if (state.currentIndex === -1) {
      nextIndex = 0;
    } else {
      nextIndex = (state.currentIndex + 1) % state.playlist.length;
    }
    
    const nextSong = state.playlist[nextIndex];
    
    if (nextSong) {
      await playSong(nextSong);
    }
  }, [state.playlist, state.currentIndex, playSong]);

  const playPrevious = useCallback(async () => {
    if (state.playlist.length === 0) return;
    
    let prevIndex: number;
    if (state.currentIndex === -1) {
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
  }, [state.playlist, state.currentIndex, playSong]);

  useEffect(() => {
    if (audioProviderRef.current) {
      audioProviderRef.current.onEnded(() => {
        playNext();
      });
    }
  }, [playNext]);

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

