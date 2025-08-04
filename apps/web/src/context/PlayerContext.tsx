import React, { createContext, useState, useRef, useEffect } from 'react';
import type { Song, PlayerContextType } from '../data/types';


const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSong = (song: Song) => {
    console.log('Playing song:', song.title, 'mp3Url:', song.mp3Url);
    setCurrentSong(song);
    if (song.mp3Url && audioRef.current) {
      let audioUrl = song.mp3Url;

      const safeUrl = encodeURI(audioUrl); 
      audioRef.current.src = safeUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          console.log('Audio started playing');
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          console.error('Audio URL was:', safeUrl);
          setIsPlaying(true);
        });
    } else {
      console.log('No mp3Url found, just updating UI');
      setIsPlaying(true);
    }
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setIsPlaying(true);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Audio error details:', audioRef.current?.error);
      });
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ currentSong, isPlaying, playSong, play, pause }}>
      {children}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </PlayerContext.Provider>
  );
};

export { PlayerContext };