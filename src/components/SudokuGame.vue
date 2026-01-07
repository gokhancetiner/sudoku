<template>
  <main class="flex flex-col lg:flex-row gap-8">
    <!-- Game Grid Section -->
    <div class="flex-1">
      <div class="bg-white rounded-lg shadow-xl p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ difficultyLabel }} - Sudoku Grid
        </h2>
        <div class="flex justify-center">
          <SudokuGrid
            :game-state="gameState"
            :selected-row="selectedRow"
            :selected-col="selectedCol"
            @select-cell="selectCell"
          />
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="lg:w-64 space-y-6">
      <GameInfo
        :score="gameState.score"
        :time-elapsed="gameState.timeElapsed"
        :hints-used="gameState.hintsUsed"
      />

      <GameDifficulty
        :current-difficulty="gameState.difficulty"
        @change-difficulty="changeDifficulty"
      />

      <AvailableDigits
        :user-grid="gameState.userGrid.map(row => row.map(cell => cell.value))"
        :solution="gameState.solution"
        @select-digit="selectDigit"
      />
    </aside>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SudokuGrid from './SudokuGrid.vue';
import GameInfo from './GameInfo.vue';
import GameDifficulty from './GameDifficulty.vue';
import AvailableDigits from './AvailableDigits.vue';
import { createEmptyGrid, generatePuzzle } from '@/utils/puzzleGenerator';
import type { GameState, Difficulty } from '@/types/sudoku';

// State
const selectedRow = ref<number>(-1);
const selectedCol = ref<number>(-1);
const selectedDigit = ref<number>(-1);

const gameState = ref<GameState>({
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
  difficulty: 'intermediate',
  score: 0,
  hintsUsed: 0,
  timeElapsed: 0,
  isGameOver: false,
});

// Computed
const difficultyLabel = computed(() => {
  const labels: Record<Difficulty, string> = {
    beginner: '🟢 Beginner',
    intermediate: '🟡 Intermediate',
    hard: '🔴 Hard',
    expert: '⚫ Expert',
  };
  return labels[gameState.value.difficulty];
});

// Methods
const initializeGame = () => {
  const { puzzle, solution } = generatePuzzle(gameState.value.difficulty);

  gameState.value.puzzle = puzzle;
  gameState.value.solution = solution;
  gameState.value.userGrid = puzzle.map((row) =>
    row.map((cell) => ({
      value: cell,
      isOriginal: cell !== 0,
      isSelected: false,
      hasError: false,
    })),
  );
  gameState.value.isGameOver = false;
};

const selectCell = (rowIndex: number, colIndex: number) => {
  selectedRow.value = rowIndex;
  selectedCol.value = colIndex;
};

const selectDigit = (digit: number) => {
  selectedDigit.value = digit;
};

const changeDifficulty = (difficulty: Difficulty) => {
  gameState.value.difficulty = difficulty;
  gameState.value.score = 0;
  gameState.value.hintsUsed = 0;
  gameState.value.timeElapsed = 0;
  initializeGame();
};

// Initialize game on component mount
onMounted(() => {
  initializeGame();
});
</script>

<style scoped>
</style>
