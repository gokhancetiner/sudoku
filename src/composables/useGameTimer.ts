import { useGameStore } from '@/stores/gameStore';

/**
 * Composable for managing the game timer
 * Handles starting, stopping, and resetting the game timer
 */
export function useGameTimer() {
  const store = useGameStore();
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Start the game timer
   * Clears any existing timer before starting a new one
   */
  const startTimer = (): void => {
    // Clear any existing timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
      store.gameState.timeElapsed += 1;
    }, 1000);
  };

  /**
   * Stop the game timer
   * Clears the interval and sets reference to null
   */
  const stopTimer = (): void => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  /**
   * Reset the timer to 0 and stop it
   */
  const resetTimer = (): void => {
    stopTimer();
    store.gameState.timeElapsed = 0;
  };

  /**
   * Resume timer from a specific elapsed time
   * Used when loading a saved game state
   */
  const resumeTimer = (): void => {
    startTimer();
  };

  return {
    startTimer,
    stopTimer,
    resetTimer,
    resumeTimer,
  };
}
