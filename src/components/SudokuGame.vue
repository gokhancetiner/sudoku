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
        <LeaderboardTable :key="leaderboardRefreshKey" />
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import SudokuGrid from './SudokuGrid.vue';
import GameInfo from './GameInfo.vue';
import AvailableDigits from './AvailableDigits.vue';
import GameCompletion from './GameCompletion.vue';
import LeaderboardTable from './LeaderboardTable.vue';
import { generatePuzzle } from '@/utils/puzzleGenerator';
import {
  placeNumber,
  clearCell,
  isSolutionCorrect,
} from '@/utils/sudokuValidator';
import { calculateFinalScore } from '@/utils/scoringSystem';
import { saveGameState, loadGameState, clearGameState } from '@/utils/storage';
import { addLeaderboardEntry } from '@/utils/leaderboard';
import {
  createHistory,
  pushToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  type HistoryState,
} from '@/utils/historyManager';
import { useGameStore } from '@/stores/gameStore';
import { useGameTimer } from '@/composables/useGameTimer';
import type { Difficulty } from '@/types/sudoku';

// Store
const store = useGameStore();

// Composables
const { startTimer, stopTimer, resetTimer, resumeTimer } = useGameTimer();

// Local state
const leaderboardRefreshKey = ref<number>(0);

let gameHistory = ref<HistoryState | null>(null);

// Computed
const canUndoMove = computed(() => {
  return gameHistory.value && canUndo(gameHistory.value);
});

const canRedoMove = computed(() => {
  return gameHistory.value && canRedo(gameHistory.value);
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
  gameHistory.value = createHistory(store.gameState);

  // Reset and start timer
  resetTimer();
  startTimer();
  leaderboardRefreshKey.value++;
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

const handleUndo = () => {
  if (!gameHistory.value || !canUndo(gameHistory.value)) return;
  const undoResult = undo(gameHistory.value);
  gameHistory.value = undoResult.history;
  if (undoResult.state) {
    store.gameState = undoResult.state;
  }
};

const handleRedo = () => {
  if (!gameHistory.value || !canRedo(gameHistory.value)) return;
  const redoResult = redo(gameHistory.value);
  gameHistory.value = redoResult.history;
  if (redoResult.state) {
    store.gameState = redoResult.state;
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (store.selectedRow === -1 || store.selectedCol === -1) return;

  const cell = store.gameState.userGrid[store.selectedRow][store.selectedCol];

  const key = event.key;

  if (key >= '1' && key <= '9' && !cell.isOriginal) {
    event.preventDefault();
    placeNumber(
      store.gameState.userGrid,
      store.selectedRow,
      store.selectedCol,
      parseInt(key),
    );
    pushMoveToHistory();
  } else if ((key === 'Backspace' || key === 'Delete') && !cell.isOriginal) {
    event.preventDefault();
    clearCell(store.gameState.userGrid, store.selectedRow, store.selectedCol);
    pushMoveToHistory();
  } else if (key === 'ArrowUp') {
    event.preventDefault();
    store.selectedRow = Math.max(0, store.selectedRow - 1);
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    store.selectedRow = Math.min(8, store.selectedRow + 1);
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    store.selectedCol = Math.max(0, store.selectedCol - 1);
  } else if (key === 'ArrowRight') {
    event.preventDefault();
    store.selectedCol = Math.min(8, store.selectedCol + 1);
  }
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
    stopTimer();

    clearGameState();
  }
};

const pushMoveToHistory = () => {
  if (gameHistory.value) {
    gameHistory.value = pushToHistory(gameHistory.value, store.gameState);
  }
};

onMounted(() => {
  // Try to load saved game state
  const savedState = loadGameState();
  if (savedState) {
    store.gameState = savedState;
    gameHistory.value = createHistory(store.gameState);
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
