import { useState } from 'react'
import SongList from './components/songs-list'
import PlayerBar from './components/player-bar'
import { Song, PlayerState } from './types'

function App() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    volume: 1,
  });

  const handlePlaySong = (song: Song) => {
    setPlayerState(prev => ({
      ...prev,
      currentSong: song,
      isPlaying: true,
    }));
  };

  const handlePlayPause = () => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  return (
    <div className="h-screen bg-spotify-black flex flex-col">
      {/* Header */}
      <header className="bg-spotify-gray-900 p-4 border-b border-spotify-gray-700">
        <h1 className="text-2xl font-bold text-white">Music Player</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <SongList 
          onPlaySong={handlePlaySong} 
          currentSong={playerState.currentSong}
          isPlaying={playerState.isPlaying}
        />
      </main>

      {/* Player Bar */}
      {playerState.currentSong && (
        <PlayerBar 
          playerState={playerState}
          onPlayPause={handlePlayPause}
        />
      )}
    </div>
  )
}

export default App