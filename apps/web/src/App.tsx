import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PlayerBar from './components/player-bar'
import Navigation, { ViewType } from './components/navigation'
import { PlayerProvider } from './context/PlayerContext';
import { usePlayer } from './hooks/usePlayer';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ui/ThemeToggle';

function AppContent() {
  const { currentSong, togglePlayPause } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentView = (): ViewType => {
    if (location.pathname.startsWith('/artists')) return 'artists';
    if (location.pathname.startsWith('/albums')) return 'albums';
    return 'songs';
  };

  const handleViewChange = (view: ViewType) => {
    navigate(`/${view}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && currentSong) {
        const target = event.target as HTMLElement;
        const isInput = target.tagName === 'INPUT' || 
                       target.tagName === 'TEXTAREA' || 
                       target.contentEditable === 'true';
        
        if (!isInput) {
          event.preventDefault();
          togglePlayPause();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSong, togglePlayPause]);

  return (
    <div className="h-screen bg-light-100 dark:bg-dark-950 flex flex-col overflow-hidden">
      <header className="glass border-b border-light-200/50 dark:border-dark-700/50 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold gradient-text">
            Mua-ZOHAN
          </h1>
          <div className="flex items-center space-x-4">
            <Navigation currentView={getCurrentView()} onViewChange={handleViewChange} />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse-gentle"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse-gentle" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-br from-light-200 via-light-300 to-light-400 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800"></div>
        <div className="relative z-10 h-full overflow-auto">
          <Outlet />
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
    <ThemeProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App