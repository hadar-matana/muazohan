# React TypeScript Turborepo

A modern monorepo setup with React, TypeScript, Vite, and Turborepo.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps
- `web`: A React TypeScript application built with Vite

### Packages
- `@repo/ui`: A shared React component library
- `@repo/eslint-config`: Shared ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configurations

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build all packages:
```bash
npm run build
```

3. Start the development server:
```bash
npm run dev
```

The web app will be available at `http://localhost:5173`

## Available Scripts

- `npm run build` - Build all packages and apps
- `npm run dev` - Start development servers
- `npm run lint` - Lint all packages and apps
- `npm run format` - Format code with Prettier
- `npm run check-types` - Run TypeScript type checking
- `npm run clean` - Clean all build outputs

## Project Structure

```
├── apps/
│   └── web/                 # Vite React app
├── packages/
│   ├── ui/                  # Shared React components
│   ├── eslint-config/       # Shared ESLint configs
│   └── typescript-config/   # Shared TypeScript configs
├── package.json
├── turbo.json
└── README.md
```

## Key Features

- **Turborepo** for efficient monorepo management
- **Vite** for fast development and building
- **React 18** with TypeScript
- **Shared configurations** for consistent code quality
- **Hot Module Replacement** for fast development
- **Optimized builds** with code splitting

## Adding New Packages

To add a new package:

1. Create a new directory in `packages/`
2. Add a `package.json` with appropriate scripts
3. Update root `package.json` workspaces if needed
4. Configure TypeScript and ESLint using shared configs

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
