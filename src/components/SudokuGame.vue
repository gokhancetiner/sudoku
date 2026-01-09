<template>
  <main class="flex flex-col gap-8">
    <!-- Game Info Card (Horizontal) -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <GameInfo @show-hint="showHint" @change-difficulty="changeDifficulty" />
    </div>

    <!-- Main Game Area -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Game Grid Section -->
      <div class="flex-1">
        <div class="bg-white rounded-lg shadow-xl p-6 h-full">
          <!-- Grid Header with Title and Undo/Redo Buttons -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">
              {{ store.difficultyLabel }} - Sudoku Grid
            </h2>
            <!-- Undo/Redo Buttons -->
            <div class="flex gap-2">
              <button
                @click="handleUndo"
                :disabled="!canUndoMove"
                class="px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap"
                :class="
                  canUndoMove
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                "
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button
                @click="handleRedo"
                :disabled="!canRedoMove"
                class="px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap"
                :class="
                  canRedoMove
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                "
                title="Redo (Ctrl+Shift+Z)"
              >
                ↷ Redo
              </button>
            </div>
          </div>
          <div class="flex justify-center">
            <SudokuGrid @select-cell="selectCell" />
          </div>

          <!-- Available Digits Below Grid -->
          <div class="mt-8 pt-3 border-t border-gray-300">
            <AvailableDigits />
          </div>
        </div>
      </div>

      <aside class="lg:w-64 space-y-6 flex flex-col">
        <LeaderboardTable />
      </aside>
    </div>

    <!-- Game Completion Modal -->
    <GameCompletion
      @restart="initializeGame"
      @new-puzzle="handleNewPuzzle"
      @close="closeCompletionModal"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import SudokuGrid from './SudokuGrid.vue';
import GameInfo from './GameInfo.vue';
import AvailableDigits from './AvailableDigits.vue';
import GameCompletion from './GameCompletion.vue';
import LeaderboardTable from './LeaderboardTable.vue';
import { generatePuzzle } from '@/utils/puzzleGenerator';
import { placeNumber } from '@/utils/sudokuValidator';
import { saveGameState, loadGameState } from '@/utils/storage';
import { useGameStore } from '@/stores/gameStore';
import { useGameTimer } from '@/composables/useGameTimer';
import { useGameHistory } from '@/composables/useGameHistory';
import { useKeyboardControls } from '@/composables/useKeyboardControls';
import type { Difficulty } from '@/types/sudoku';

// Store
const store = useGameStore();

// Composables
const { startTimer, stopTimer, resetTimer, resumeTimer } = useGameTimer();
const {
  canUndoMove,
  canRedoMove,
  initializeHistory,
  pushMoveToHistory,
  handleUndo,
  handleRedo,
} = useGameHistory();

const { handleKeyPress } = useKeyboardControls({
  pushMoveToHistory,
  stopTimer,
});

// Watch gameState for changes and save to localStorage
watch(
  () => store.gameState,
  (newState) => {
    saveGameState(newState);
  },
  { deep: true },
);

// Watch selectedDigit to place number when digit is selected and cell is already selected
watch(
  () => store.selectedDigit,
  (newDigit: number) => {
    if (
      newDigit !== -1 &&
      store.selectedRow !== -1 &&
      store.selectedCol !== -1
    ) {
      const { userGrid } = store.gameState;
      const cell = userGrid[store.selectedRow][store.selectedCol];
      if (!cell.isOriginal && newDigit >= 1 && newDigit <= 9) {
        placeNumber(userGrid, store.selectedRow, store.selectedCol, newDigit);
        pushMoveToHistory();
        // Reset selected digit after placing
        store.selectedDigit = -1;
      }
    }
  },
);

// Methods
const initializeGame = () => {
  const { puzzle, solution } = generatePuzzle(store.gameState.difficulty);

  store.gameState.puzzle = puzzle;
  store.gameState.solution = solution;
  store.gameState.userGrid = puzzle.map((row) =>
    row.map((cell) => ({
      value: cell,
      isOriginal: cell !== 0,
      isSelected: false,
      hasError: false,
    })),
  );
  store.gameState.isGameOver = false;
  store.gameState.timeElapsed = 0;
  store.gameState.score = 0;
  store.gameState.hintsUsed = 0;
  store.gameState.errorsCount = 0;

  // Initialize history for new game
  initializeHistory(store.gameState);

  // Reset and start timer
  resetTimer();
  startTimer();
};

const selectCell = (rowIndex: number, colIndex: number) => {
  const cell = store.gameState.userGrid[rowIndex][colIndex];

  // If a digit is already selected, place it immediately
  if (
    store.selectedDigit !== -1 &&
    !cell.isOriginal &&
    store.selectedDigit >= 1 &&
    store.selectedDigit <= 9
  ) {
    placeNumber(
      store.gameState.userGrid,
      rowIndex,
      colIndex,
      store.selectedDigit,
    );
    pushMoveToHistory();
  }

  // Always select the cell
  store.selectedRow = rowIndex;
  store.selectedCol = colIndex;
};

const showHint = () => {
  // Check if max hints reached
  if (store.gameState.hintsUsed >= 10) {
    return;
  }

  // Find all empty cells (value is 0 and not original)
  const emptyCells: Array<[number, number]> = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = store.gameState.userGrid[i][j];
      if (cell.value === 0 && !cell.isOriginal) {
        emptyCells.push([i, j]);
      }
    }
  }

  // If no empty cells, return
  if (emptyCells.length === 0) {
    return;
  }

  // Pick random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];

  // Fill with correct answer from solution
  const correctValue = store.gameState.solution[row][col];
  store.gameState.userGrid[row][col].value = correctValue;
  store.gameState.userGrid[row][col].hasError = false;

  // Increment hints used
  store.gameState.hintsUsed += 1;

  // Push to history
  pushMoveToHistory();
};

const changeDifficulty = (difficulty: Difficulty) => {
  store.gameState.difficulty = difficulty;
  store.gameState.score = 0;
  store.gameState.hintsUsed = 0;
  store.gameState.timeElapsed = 0;
  initializeGame();
};

const handleNewPuzzle = () => {
  store.gameState.isGameOver = false;
  initializeGame();
};

const closeCompletionModal = () => {
  store.gameState.isGameOver = false;
};

onMounted(() => {
  // Try to load saved game state
  const savedState = loadGameState();
  if (savedState) {
    store.gameState = savedState;
    initializeHistory(store.gameState);
    // Resume timer from saved elapsed time
    resumeTimer();
  } else {
    // Start fresh game if no saved state
    initializeGame();
  }
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  stopTimer();
});
</script>

<style scoped></style>
