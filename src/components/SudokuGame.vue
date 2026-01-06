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
    </aside>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SudokuGrid from './SudokuGrid.vue';
import GameInfo from './GameInfo.vue';
import GameDifficulty from './GameDifficulty.vue';
import type { GameState, Difficulty } from '@/types/sudoku';

// State
const selectedRow = ref<number>(-1);
const selectedCol = ref<number>(-1);

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
const selectCell = (rowIndex: number, colIndex: number) => {
  selectedRow.value = rowIndex;
  selectedCol.value = colIndex;
};

const changeDifficulty = (difficulty: Difficulty) => {
  gameState.value.difficulty = difficulty;
  gameState.value.score = 0;
  gameState.value.hintsUsed = 0;
  gameState.value.timeElapsed = 0;
};
</script>

<style scoped>
</style>
