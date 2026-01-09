import type { GameState } from '@/types/sudoku';

export interface HistoryState {
  states: GameState[];
  currentIndex: number;
}

const MAX_HISTORY_SIZE = 50;

function deepCopyGameState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state));
}

export function createHistory(initialState: GameState): HistoryState {
  return {
    states: [deepCopyGameState(initialState)],
    currentIndex: 0,
  };
}

export function pushToHistory(
  history: HistoryState,
  newState: GameState,
): HistoryState {
  const newStates = history.states.slice(0, history.currentIndex + 1);

  newStates.push(deepCopyGameState(newState));

  if (newStates.length > MAX_HISTORY_SIZE) {
    newStates.shift();
  }

  return {
    states: newStates,
    currentIndex: newStates.length - 1,
  };
}

export function undo(history: HistoryState): {
  history: HistoryState;
  state: GameState | null;
} {
  if (!canUndo(history)) {
    return { history, state: null };
  }

  const newIndex = history.currentIndex - 1;
  return {
    history: { ...history, currentIndex: newIndex },
    state: deepCopyGameState(history.states[newIndex]),
  };
}

export function redo(history: HistoryState): {
  history: HistoryState;
  state: GameState | null;
} {
  if (!canRedo(history)) {
    return { history, state: null };
  }

  const newIndex = history.currentIndex + 1;
  return {
    history: { ...history, currentIndex: newIndex },
    state: deepCopyGameState(history.states[newIndex]),
  };
}

export function canUndo(history: HistoryState): boolean {
  return history.currentIndex > 0;
}

export function canRedo(history: HistoryState): boolean {
  return history.currentIndex < history.states.length - 1;
}

export function clearHistory(initialState: GameState): HistoryState {
  return createHistory(initialState);
}

export function getHistoryInfo(history: HistoryState): {
  current: number;
  total: number;
} {
  return {
    current: history.currentIndex + 1,
    total: history.states.length,
  };
}
