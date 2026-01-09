import { describe, it, expect } from 'vitest';
import {
  createHistory,
  pushToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
  getHistoryInfo,
} from '@/utils/historyManager';
import { createEmptyGrid } from '@/utils/puzzleGenerator';
import type { GameState } from '@/types/sudoku';

describe('historyManager', () => {
  const createTestState = (score: number): GameState => ({
    puzzle: createEmptyGrid(),
    solution: createEmptyGrid(),
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
          })),
      ),
    difficulty: 'beginner',
    timeElapsed: 0,
    hintsUsed: 0,
    score,
    errorsCount: 0,
    isGameOver: false,
  });

  it('should create history with initial state', () => {
    const state = createTestState(0);
    const history = createHistory(state);

    expect(history.states.length).toBe(1);
    expect(history.currentIndex).toBe(0);
  });

  it('should push new state to history', () => {
    const state1 = createTestState(0);
    let history = createHistory(state1);

    const state2 = createTestState(100);
    history = pushToHistory(history, state2);

    expect(history.states.length).toBe(2);
    expect(history.currentIndex).toBe(1);
  });

  it('should undo to previous state', () => {
    const state1 = createTestState(0);
    let history = createHistory(state1);

    const state2 = createTestState(100);
    history = pushToHistory(history, state2);

    const { history: newHistory, state } = undo(history);
    expect(newHistory.currentIndex).toBe(0);
    expect(state?.score).toBe(0);
  });

  it('should redo to next state', () => {
    const state1 = createTestState(0);
    let history = createHistory(state1);

    const state2 = createTestState(100);
    history = pushToHistory(history, state2);

    const { history: undoHistory } = undo(history);
    const { history: redoHistory, state } = redo(undoHistory);

    expect(redoHistory.currentIndex).toBe(1);
    expect(state?.score).toBe(100);
  });

  it('should not undo when at beginning', () => {
    const state = createTestState(0);
    const history = createHistory(state);

    expect(canUndo(history)).toBe(false);
    const { state: resultState } = undo(history);
    expect(resultState).toBeNull();
  });

  it('should not redo when at end', () => {
    const state = createTestState(0);
    const history = createHistory(state);

    expect(canRedo(history)).toBe(false);
    const { state: resultState } = redo(history);
    expect(resultState).toBeNull();
  });

  it('should clear future history when pushing after undo', () => {
    const state1 = createTestState(0);
    let history = createHistory(state1);

    const state2 = createTestState(100);
    history = pushToHistory(history, state2);

    const state3 = createTestState(200);
    history = pushToHistory(history, state3);

    // Undo twice
    let undoResult = undo(history);
    undoResult = undo(undoResult.history);

    // Push new state (should clear state3)
    const state4 = createTestState(150);
    history = pushToHistory(undoResult.history, state4);

    expect(history.states.length).toBe(2);
    expect(canRedo(history)).toBe(false);
  });

  it('should get history info', () => {
    const state1 = createTestState(0);
    let history = createHistory(state1);

    const state2 = createTestState(100);
    history = pushToHistory(history, state2);

    const info = getHistoryInfo(history);
    expect(info.current).toBe(2);
    expect(info.total).toBe(2);
  });

  it('should clear history', () => {
    const state1 = createTestState(0);
    let history = createHistory(state1);

    const state2 = createTestState(100);
    history = pushToHistory(history, state2);

    const state3 = createTestState(200);
    history = clearHistory(state3);

    expect(history.states.length).toBe(1);
    expect(history.currentIndex).toBe(0);
  });

  it('should limit history size to MAX_HISTORY_SIZE', () => {
    let history = createHistory(createTestState(0));

    // Push 60 states (should limit to 50)
    for (let i = 1; i < 60; i++) {
      history = pushToHistory(history, createTestState(i));
    }

    expect(history.states.length).toBe(50);
  });
});
