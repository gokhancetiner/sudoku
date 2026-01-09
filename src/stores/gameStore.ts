import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAllRecords, addLeaderboardEntry } from '@/utils/leaderboard';
import type { GameState, Difficulty } from '@/types/sudoku';
import type { LeaderboardEntry } from '@/utils/leaderboard';

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

  // Leaderboard state - synced from localStorage
  const leaderboardRecords = ref<LeaderboardEntry[]>(getAllRecords());

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

  /**
   * Get top records for a specific difficulty
   */
  const getTopRecordsForDifficulty = (difficulty: Difficulty) => {
    return leaderboardRecords.value.filter(
      (record) => record.difficulty === difficulty,
    );
  };

  // Methods
  /**
   * Add a new leaderboard entry and update local state
   */
  const addRecord = (
    score: number,
    difficulty: Difficulty,
    time: number,
    playerName: string = 'You',
  ) => {
    // Add to localStorage via utility
    addLeaderboardEntry(score, difficulty, time, playerName);

    // Sync local state
    leaderboardRecords.value = getAllRecords();
  };

  /**
   * Reload leaderboard from localStorage (useful for sync across tabs)
   */
  const reloadLeaderboard = () => {
    leaderboardRecords.value = getAllRecords();
  };

  // Expose state and methods to components
  return {
    gameState,
    selectedRow,
    selectedCol,
    selectedDigit,
    leaderboardRecords,
    difficultyLabel,
    getTopRecordsForDifficulty,
    addRecord,
    reloadLeaderboard,
  };
});
