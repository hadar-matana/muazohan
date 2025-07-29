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
- pnpm 8+ (recommended) or npm

### Installation

⚠️ **Important**: Always run commands from the **root directory** of the monorepo, not from individual package directories.

1. Install dependencies from the root directory:
```bash
# From the project root directory
pnpm install
```

2. Build all packages:
```bash
pnpm run build
```

3. Start the development server:
```bash
pnpm run dev
```

The web app will be available at `http://localhost:5173`

### If using npm instead of pnpm

If you prefer to use npm:

```bash
npm install
npm run build
npm run dev
```

## Available Scripts

All commands should be run from the **root directory**:

- `pnpm install` - Install all dependencies
- `pnpm run build` - Build all packages and apps
- `pnpm run dev` - Start development servers
- `pnpm run lint` - Lint all packages and apps
- `pnpm run format` - Format code with Prettier
- `pnpm run check-types` - Run TypeScript type checking
- `pnpm run clean` - Clean all build outputs

## Project Structure

```
├── apps/
│   └── web/                 # Vite React app
├── packages/
│   ├── ui/                  # Shared React components
│   ├── eslint-config/       # Shared ESLint configs
│   └── typescript-config/   # Shared TypeScript configs
├── package.json
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── turbo.json
└── README.md
```

## Key Features

- **Turborepo** for efficient monorepo management
- **Vite** for fast development and building
- **React 18** with TypeScript
- **pnpm workspaces** for efficient dependency management
- **Shared configurations** for consistent code quality
- **Hot Module Replacement** for fast development
- **Optimized builds** with code splitting

## Common Issues & Solutions

### Error: `@repo/ui is not in the npm registry`

This error occurs when you try to install dependencies from inside a package directory (like `apps/web/`) instead of the root.

**Solution**: Always run `pnpm install` (or `npm install`) from the **root directory** of the monorepo.

```bash
# ❌ Wrong - don't do this
cd apps/web
pnpm install

# ✅ Correct - do this instead
# From the project root
pnpm install
```

### Switching between npm and pnpm

If you want to switch package managers:

1. Delete `node_modules` and lock files:
```bash
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml
```

2. Install with your preferred package manager:
```bash
# For pnpm
pnpm install

# For npm
npm install
```

## Adding New Packages

To add a new package:

1. Create a new directory in `packages/` or `apps/`
2. Add a `package.json` with appropriate scripts
3. Install dependencies from the root: `pnpm install`
4. Configure TypeScript and ESLint using shared configs

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
