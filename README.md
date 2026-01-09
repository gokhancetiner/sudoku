# Insider Sudoku

A Sudoku game built with Vue 3, TypeScript, and TailwindCSS as a trial day interview project.

## Features

- 🎮 Classical Sudoku game with 4 difficulty ranks
- ⏱️ Real-time scoring and timer
- 💡 Hint system with configurable limits
- 🏆 Leaderboard with persistent records
- 📊 Live score tracking (updated as you play)
- 🎨 Beautiful UI with TailwindCSS
- 📱 Responsive design
- ✅ Type-safe TypeScript implementation

## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

Produces optimized production build in `dist/`

### Preview

```bash
npm run preview
```

Preview the production build locally

## Project Structure

```
src/
├── components/       # Vue components
├── composables/      # Reusable logic (timer, history, keyboard controls)
├── stores/          # Pinia state management (gameState)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── styles/          # Global styles
└── main.ts          # Application entry point
```

### Composables

- **useGameTimer** - Manages game timer (start, stop, reset, resume)
- **useGameHistory** - Handles undo/redo functionality with history tracking
- **useKeyboardControls** - Routes keyboard input (digits, arrows, shortcuts)
- **useRealtimeScoring** - Calculates live score during gameplay with progress tracking

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Next generation frontend build tool
- **TailwindCSS** - Utility-first CSS framework
- **Vitest** - Unit testing framework

## Commit Messages

Each commit represents a single feature or phase of development. See the git history for detailed progress.
