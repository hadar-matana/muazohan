import React, { createContext, useState, useEffect, useRef } from 'react';
import type { PlayerContextType, PlayerState } from '../data/types';
import { HTML5AudioProvider } from '../services/AudioProvider';
import { PlayerStateManager } from '../services/PlayerStateManager';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });

  const audioProviderRef = useRef<HTML5AudioProvider>();
  const stateManagerRef = useRef<PlayerStateManager>();

  useEffect(() => {
    // Initialize audio provider and state manager
    audioProviderRef.current = new HTML5AudioProvider();
    stateManagerRef.current = new PlayerStateManager(audioProviderRef.current);

    // Subscribe to state changes
    const unsubscribe = stateManagerRef.current.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
      stateManagerRef.current?.destroy();
    };
  }, []);

  const playSong = async (song: any) => {
    try {
      await stateManagerRef.current?.playSong(song);
    } catch (error) {
      console.error('Failed to play song:', error);
    }
  };

  const play = async () => {
    try {
      await stateManagerRef.current?.play();
    } catch (error) {
      console.error('Failed to play:', error);
    }
  };

  const pause = () => {
    stateManagerRef.current?.pause();
  };

  const stop = () => {
    stateManagerRef.current?.stop();
  };

  const setVolume = (volume: number) => {
    stateManagerRef.current?.setVolume(volume);
  };

  const seekTo = (time: number) => {
    stateManagerRef.current?.seekTo(time);
  };

  const contextValue: PlayerContextType = {
    ...state,
    playSong,
    play,
    pause,
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