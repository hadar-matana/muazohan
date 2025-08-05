# Mua-ZOHAN Music Player

A modern, sleek music player built with React, TypeScript, and tRPC. Features a beautiful dark theme with orange accents, smooth animations, and an intuitive user interface.

## 🎨 Design System

### Theme
- **Dark Mode**: Modern dark theme with gradient backgrounds
- **Accent Color**: Orange (#f97316) for interactive elements and highlights
- **Typography**: Inter for body text, Poppins for headings
- **Animations**: Smooth transitions and subtle hover effects

### Key Features
- **Glass Morphism**: Semi-transparent backgrounds with backdrop blur
- **Rounded Corners**: Consistent use of rounded-xl and rounded-2xl
- **Smooth Transitions**: 200ms duration for all interactive elements
- **Hover Effects**: Scale transforms and color transitions
- **Custom Scrollbars**: Styled to match the theme

### Color Palette
- **Dark**: `#0f172a` to `#475569` (9 shades)
- **Orange**: `#fff7ed` to `#431407` (11 shades)
- **Text**: White for headings, dark-300/400 for body text

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

### Development
```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter=web dev
pnpm --filter=server dev
```

## 🏗️ Project Structure

```
muazohan2/
├── apps/
│   ├── web/          # React frontend
│   └── server/       # tRPC backend
├── packages/
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
```

## 🎵 Features

- **Music Playback**: Full audio player with play/pause, seek, and volume control
- **Song Library**: Browse and search through your music collection
- **Modern UI**: Smooth animations and responsive design
- **Dark Theme**: Easy on the eyes with orange accents
- **Real-time Updates**: Live progress tracking and state management

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma, Node.js
- **Styling**: Custom design system with glass morphism
- **State Management**: React Context for player state
- **Build Tool**: Vite

## 🎨 Styling Guidelines

### Components
- Use `.card` class for container elements
- Use `.btn`, `.btn-primary`, `.btn-secondary` for buttons
- Use `.glass` for glass morphism effects
- Use `.gradient-text` for accent text

### Colors
- Primary: `orange-500` (#f97316)
- Background: `dark-950` (#0f172a)
- Text: `white` for headings, `dark-300` for body
- Borders: `dark-700/50` for subtle separators

### Animations
- Hover: `hover:scale-[1.01]` for subtle lift
- Transitions: `transition-all duration-200`
- Loading: `animate-pulse-gentle` for smooth pulses

## 📝 License

MIT License - feel free to use this project for your own music player!
