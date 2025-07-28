# Music Streaming App - Spotify Clone

A full-stack music streaming application built with modern web technologies, designed to replicate core Spotify functionality.

## 🎵 Project Overview

This project demonstrates building an end-to-end music streaming platform with a clean, modern UI and scalable architecture. The project is divided into progressive stages, starting with basic UI mockups and evolving into a complete system.

## 🏗️ Architecture

This is a **Turborepo** monorepo containing:

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: tRPC + Express + TypeScript  
- **Styling**: Custom CSS with CSS Variables for theming
- **Icons**: Lucide React
- **Package Manager**: npm with workspaces

## 📁 Project Structure

```
├── apps/
│   ├── api/          # Backend tRPC + Express server
│   │   ├── src/
│   │   │   ├── routers/     # tRPC route definitions
│   │   │   ├── data/        # Mock data
│   │   │   ├── types.ts     # TypeScript interfaces
│   │   │   └── server.ts    # Express server setup
│   │   └── package.json
│   │
│   └── web/          # Frontend Next.js application
│       ├── app/           # Next.js 13+ app directory
│       ├── components/    # React components
│       ├── contexts/      # React contexts
│       ├── lib/          # Utilities and API client
│       ├── types/        # TypeScript type definitions
│       └── data/         # Frontend mock data (Stage 1)
│
└── packages/         # Shared packages
    ├── ui/           # Shared UI components
    ├── eslint-config/
    └── typescript-config/
```

## 🚀 Development Stages

### Stage 1: Frontend with Mock Data ✅
- **Goal**: Build basic UI with local mock data
- **Features**:
  - Responsive music library interface
  - Song list with album art, artist, and duration
  - Mock playback controls (play/pause UI states)
  - Sidebar navigation
  - Now playing component
  - Dark/light theme support

### Stage 2: Backend Integration ✅
- **Goal**: Create API server and integrate with frontend
- **Features**:
  - tRPC backend with Express
  - RESTful endpoints for songs
  - Type-safe API communication
  - Search functionality
  - Real-time data from backend
  - API health monitoring

### Stage 3: Database & Storage (Future)
- **Planned Features**:
  - Database integration (PostgreSQL/MongoDB)
  - File upload for music
  - Object storage for audio files
  - User authentication
  - Playlist management

## 🎮 Features Implemented

### Current Features
- ✅ **Music Library**: Browse all available songs
- ✅ **Playback Controls**: Play/pause (UI state only)
- ✅ **Now Playing**: Shows currently selected song
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Search Ready**: Backend search functionality
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Modern UI**: Spotify-inspired design

### UI Components
- **Sidebar**: Navigation with Home, Search, Library
- **Song List**: Grid view with hover effects
- **Player Bar**: Bottom player with controls
- **Song Cards**: Album art, title, artist, duration
- **Loading States**: Smooth loading animations

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd music-streaming-app
npm install
```

2. **Start development servers**:
```bash
# Starts both frontend and backend
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Individual Development

You can also run apps individually:

```bash
# Frontend only
cd apps/web
npm run dev

# Backend only  
cd apps/api
npm run dev
```

### API Endpoints

The backend provides the following tRPC endpoints:

- `GET /trpc/songs.getAll` - Get all songs
- `GET /trpc/songs.getById` - Get song by ID
- `GET /trpc/songs.search` - Search songs by title/artist/album
- `GET /health` - API health check

## 🎨 Design System

### Color Scheme
- **Primary**: Spotify Green (`#1db954`)
- **Background**: Dark (`#121212`) / Light (`#ffffff`)
- **Cards**: Dark (`#181818`) / Light (`#ffffff`)
- **Sidebar**: Black (`#000000`) / Light Gray (`#f8f9fa`)

### Typography
- **Headings**: Geist Sans (bold)
- **Body**: Geist Sans (regular)
- **Code**: Geist Mono

## 🧪 Testing the Application

1. **Start the application**:
```bash
npm run dev
```

2. **Test API health**:
```bash
curl http://localhost:3001/health
```

3. **Test song data**:
```bash
curl http://localhost:3001/trpc/songs.getAll
```

4. **Open frontend**: Navigate to http://localhost:3000

## 📊 Mock Data

The application includes rich mock data:
- **10 songs** from classic artists
- **5 artists**: The Beatles, Queen, Led Zeppelin, Pink Floyd, Daft Punk  
- **5 albums** with proper metadata
- **High-quality images** from Unsplash

## 🔄 How It Works

### Stage 1 Implementation
1. **Local Mock Data**: Songs stored in `apps/web/data/mockSongs.ts`
2. **Static UI**: Components render mock data
3. **State Management**: React Context for playback state
4. **Responsive Design**: CSS Grid and Flexbox

### Stage 2 Implementation  
1. **API Client**: Direct fetch calls to tRPC endpoints
2. **Backend**: Express server with tRPC routes
3. **Type Safety**: Shared types between frontend/backend
4. **Real Data**: Dynamic loading from API

## 🚧 Future Roadmap

### Stage 3: Database & Authentication
- [ ] User registration/login
- [ ] PostgreSQL database
- [ ] JWT authentication
- [ ] User playlists

### Stage 4: Audio Streaming
- [ ] Object storage (AWS S3/CloudFlare R2)
- [ ] Audio file upload
- [ ] Real audio playback
- [ ] Progress tracking

### Stage 5: Advanced Features
- [ ] Social features (follow users)
- [ ] Recommendations
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)

## 📝 Scripts

```bash
# Development
npm run dev          # Start all apps
npm run build        # Build all apps
npm run lint         # Lint all packages

# Individual apps
cd apps/web && npm run dev    # Frontend only
cd apps/api && npm run dev    # Backend only
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes and demonstrates modern full-stack development practices.

---

**Tech Stack**: Next.js, React, TypeScript, tRPC, Express, CSS Modules, Turborepo
