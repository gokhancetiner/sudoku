import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, Difficulty } from '@/types/sudoku';

export const useGameStore = defineStore('game', () => {
  // State
  const gameState = ref<GameState>({
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
          })),
      ),
    difficulty: 'intermediate',
    score: 0,
    hintsUsed: 0,
    timeElapsed: 0,
    isGameOver: false,
    errorsCount: 0,
  });

  const selectedRow = ref<number>(-1);
  const selectedCol = ref<number>(-1);
  const selectedDigit = ref<number>(-1);

  // Getters
  const difficultyLabel = computed(() => {
    const labels: Record<Difficulty, string> = {
      beginner: '🟢 Beginner',
      intermediate: '🟡 Intermediate',
      hard: '🔴 Hard',
      expert: '⚫ Expert',
    };
    return labels[gameState.value.difficulty];
  });

  // Expose state and methods to components
  return {
    gameState,
    selectedRow,
    selectedCol,
    selectedDigit,
    difficultyLabel,
  };
});
