'use client';

import React, { createContext, useContext, useState } from 'react';
import { Song, PlaybackState } from '../types';

interface PlaybackContextType extends PlaybackState {
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  stopSong: () => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentSong: null,
    isPlaying: false,
    progress: 0,
  });

  const playSong = (song: Song) => {
    setPlaybackState({
      currentSong: song,
      isPlaying: true,
      progress: 0,
    });
  };

  const pauseSong = () => {
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
    }));
  };

  const resumeSong = () => {
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: true,
    }));
  };

  const stopSong = () => {
    setPlaybackState({
      currentSong: null,
      isPlaying: false,
      progress: 0,
    });
  };

  return (
    <PlaybackContext.Provider
      value={{
        ...playbackState,
        playSong,
        pauseSong,
        resumeSong,
        stopSong,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}