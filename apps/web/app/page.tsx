'use client';

import { Sidebar } from '../components/Sidebar';
import { SongListWithToggle } from '../components/SongListWithToggle';
import { Player } from '../components/Player';

export default function Home() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <SongListWithToggle />
      </main>
      <Player />
    </div>
  );
}
