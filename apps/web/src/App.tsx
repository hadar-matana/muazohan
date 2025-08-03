import SongList from './components/songs-list'
import PlayerBar from './components/player-bar'
import { PlayerProvider, usePlayer } from './context/PlayerContext';

function AppContent() {
  const { currentSong } = usePlayer();

  return (
    <div className="h-screen bg-spotify-black flex flex-col">
      <header className="bg-spotify-gray-900 p-4 border-b border-spotify-gray-700">
        <h1 className="text-2xl font-bold text-white">Mua-ZOHAN</h1>
      </header>

      <main className="flex-1 overflow-hidden">
        <SongList />
      </main>

      {currentSong && (
        <PlayerBar/>
      )}
    </div>
  );
}

function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}

export default App