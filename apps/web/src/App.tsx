import SongList from './components/songs-list'
import PlayerBar from './components/player-bar'
import { PlayerProvider } from './context/PlayerContext';
import { usePlayer } from './context/PlayerContext';

function AppContent() {
  const { currentSong } = usePlayer();

  return (
    <div className="h-screen bg-dark-950 flex flex-col overflow-hidden">
      <header className="glass border-b border-dark-700/50 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold gradient-text">
            Mua-ZOHAN
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse-gentle"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800"></div>
        <div className="relative z-10 h-full">
          <SongList />
        </div>
      </main>

      {currentSong && (
        <div className="animate-slide-up">
          <PlayerBar/>
        </div>
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