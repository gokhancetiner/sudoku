import { useGameStore } from '@/stores/gameStore';

export function useGameTimer() {
  const store = useGameStore();
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  const startTimer = (): void => {
    // Clear any existing timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
      store.gameState.timeElapsed += 1;
    }, 1000);
  };

  const stopTimer = (): void => {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const resetTimer = (): void => {
    stopTimer();
    store.gameState.timeElapsed = 0;
  };

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
