import { useGameStore } from '@/stores/gameStore';
import {
  placeNumber,
  clearCell,
  isSolutionCorrect,
} from '@/utils/sudokuValidator';
import { calculateFinalScore } from '@/utils/scoringSystem';
import { clearGameState } from '@/utils/storage';
import { addLeaderboardEntry } from '@/utils/leaderboard';

interface KeyboardControlsCallbacks {
  pushMoveToHistory: () => void;
  stopTimer: () => void;
}

export function useKeyboardControls(callbacks: KeyboardControlsCallbacks) {
  const store = useGameStore();

  const handleKeyPress = (event: KeyboardEvent): void => {
    // If no cell is selected, don't process other keys
    if (store.selectedRow === -1 || store.selectedCol === -1) return;

    const cell = store.gameState.userGrid[store.selectedRow][store.selectedCol];
    const key = event.key;

    // Handle number input (1-9)
    if (key >= '1' && key <= '9' && !cell.isOriginal) {
      event.preventDefault();
      placeNumber(
        store.gameState.userGrid,
        store.selectedRow,
        store.selectedCol,
        parseInt(key),
      );
      callbacks.pushMoveToHistory();
      checkGameCompletion();
      return;
    }

    // Handle delete/backspace
    if ((key === 'Backspace' || key === 'Delete') && !cell.isOriginal) {
      event.preventDefault();
      clearCell(store.gameState.userGrid, store.selectedRow, store.selectedCol);
      callbacks.pushMoveToHistory();
      return;
    }

    // Handle arrow keys for navigation
    if (key === 'ArrowUp') {
      event.preventDefault();
      store.selectedRow = Math.max(0, store.selectedRow - 1);
      return;
    }

    if (key === 'ArrowDown') {
      event.preventDefault();
      store.selectedRow = Math.min(8, store.selectedRow + 1);
      return;
    }

    if (key === 'ArrowLeft') {
      event.preventDefault();
      store.selectedCol = Math.max(0, store.selectedCol - 1);
      return;
    }

    if (key === 'ArrowRight') {
      event.preventDefault();
      store.selectedCol = Math.min(8, store.selectedCol + 1);
      return;
    }
  };

  const checkGameCompletion = (): void => {
    if (isSolutionCorrect(store.gameState.userGrid, store.gameState.solution)) {
      store.gameState.isGameOver = true;

      // Calculate final score when game is completed
      store.gameState.score = calculateFinalScore(
        store.gameState.userGrid,
        store.gameState.solution,
        store.gameState.hintsUsed,
        store.gameState.errorsCount,
      );

      // Save to leaderboard
      addLeaderboardEntry(
        store.gameState.score,
        store.gameState.difficulty,
        store.gameState.timeElapsed,
      );

      // Stop timer
      callbacks.stopTimer();

      // Clear saved game state
      clearGameState();
    }
  };

  return {
    handleKeyPress,
    checkGameCompletion,
  };
}
