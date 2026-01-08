import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveGameState, loadGameState, clearGameState } from './storage';
import type { GameState } from '@/types/sudoku';

describe('storage.ts', () => {
  const mockGameState: GameState = {
    puzzle: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    solution: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    userGrid: Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            value: 0,
            isOriginal: false,
            isSelected: false,
            hasError: false,
            isHint: false,
          })),
      ),
    difficulty: 'intermediate',
    score: 100,
    hintsUsed: 3,
    timeElapsed: 120,
    isGameOver: false,
    errorsCount: 0,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should saves game state to localStorage', () => {
    saveGameState(mockGameState);
    const saved = localStorage.getItem('sudoku-game-state');
    expect(saved).toBeDefined();
    expect(saved).toContain('intermediate');
  });

  it('should loads game state from localStorage', () => {
    saveGameState(mockGameState);
    const loaded = loadGameState();

    expect(loaded).toBeDefined();
    expect(loaded?.difficulty).toBe('intermediate');
    expect(loaded?.score).toBe(100);
    expect(loaded?.hintsUsed).toBe(3);
  });

  it('should returns null when no saved state exists', () => {
    const loaded = loadGameState();
    expect(loaded).toBeNull();
  });

  it('should clears game state from localStorage', () => {
    saveGameState(mockGameState);
    expect(localStorage.getItem('sudoku-game-state')).toBeDefined();

    clearGameState();
    expect(localStorage.getItem('sudoku-game-state')).toBeNull();
  });

  it('should preserves all game state properties', () => {
    const testState = { ...mockGameState, score: 500, timeElapsed: 300 };
    saveGameState(testState);
    const loaded = loadGameState();

    expect(loaded?.score).toBe(500);
    expect(loaded?.timeElapsed).toBe(300);
    expect(loaded?.hintsUsed).toBe(3);
    expect(loaded?.difficulty).toBe('intermediate');
  });
});
