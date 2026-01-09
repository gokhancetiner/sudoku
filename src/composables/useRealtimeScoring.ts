import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import {
  calculateBaseScore,
  calculateHintPenalty,
} from '@/utils/scoringSystem';
import type { SudokuCell } from '@/types/sudoku';

/**
 * Composable for real-time score calculation during gameplay
 * Updates score as player fills cells, uses hints, or makes errors
 */
export const useRealtimeScoring = () => {
  const store = useGameStore();

  /**
   * Calculate current score based on correct cells, hints, and errors
   * @returns Current game score
   */
  const currentScore = computed(() => {
    const userGrid = store.gameState.userGrid as SudokuCell[][];
    const solution = store.gameState.solution;
    const hintsUsed = store.gameState.hintsUsed;
    const errorsCount = store.gameState.errorsCount || 0;

    const baseScore = calculateBaseScore(userGrid, solution);
    const hintPenalty = calculateHintPenalty(hintsUsed);
    const finalScore = baseScore - hintPenalty - errorsCount;

    return Math.max(0, finalScore);
  });

  /**
   * Calculate progress percentage (filled cells vs total cells)
   * @returns Progress as percentage (0-100)
   */
  const progressPercentage = computed(() => {
    const userGrid = store.gameState.userGrid as SudokuCell[][];
    let filledCount = 0;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i][j].value !== null) {
          filledCount++;
        }
      }
    }

    // 81 total cells
    return Math.round((filledCount / 81) * 100);
  });

  /**
   * Calculate correct cells count
   * @returns Number of correctly filled cells
   */
  const correctCellsCount = computed(() => {
    const userGrid = store.gameState.userGrid as SudokuCell[][];
    const solution = store.gameState.solution;
    let correctCount = 0;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (
          userGrid[i][j].value === solution[i][j] &&
          !userGrid[i][j].isOriginal
        ) {
          correctCount++;
        }
      }
    }

    return correctCount;
  });

  return {
    currentScore,
    progressPercentage,
    correctCellsCount,
  };
};
