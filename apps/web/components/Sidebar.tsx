'use client';

import { Home, Search, Library, Music } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo">
          <Music size={32} />
          <h1>MusicStream</h1>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="#" className="nav-item active">
                <Home size={20} />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-item">
                <Search size={20} />
                <span>Search</span>
              </a>
            </li>
            <li>
              <a href="#" className="nav-item">
                <Library size={20} />
                <span>Your Library</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Playlists */}
        <div className="sidebar-playlists">
          <h3>Playlists</h3>
          <ul>
            <li><a href="#" className="playlist-item">Liked Songs</a></li>
            <li><a href="#" className="playlist-item">Recently Played</a></li>
            <li><a href="#" className="playlist-item">My Playlist #1</a></li>
            <li><a href="#" className="playlist-item">Favorites</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}