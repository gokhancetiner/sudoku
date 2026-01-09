<template>
  <main class="flex flex-col gap-8">
    <!-- Game Info Card (Horizontal) -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <GameInfo
        :time-elapsed="gameState.timeElapsed"
        :hints-used="gameState.hintsUsed"
        :current-difficulty="gameState.difficulty"
        @show-hint="showHint"
        @change-difficulty="changeDifficulty"
      />
    </div>

    <!-- Main Game Area -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Game Grid Section -->
      <div class="flex-1">
        <div class="bg-white rounded-lg shadow-xl p-6 h-full">
          <!-- Grid Header with Title and Undo/Redo Buttons -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">
              {{ difficultyLabel }} - Sudoku Grid
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
            <SudokuGrid
              :game-state="gameState"
              :selected-row="selectedRow"
              :selected-col="selectedCol"
              @select-cell="selectCell"
            />
          </div>

          <!-- Available Digits Below Grid -->
          <div class="mt-8 pt-3 border-t border-gray-300">
            <AvailableDigits
              :user-grid="
                gameState.userGrid.map((row) => row.map((cell) => cell.value))
              "
              :solution="gameState.solution"
              @select-digit="selectDigit"
            />
          </div>
        </div>
      </div>

      <aside class="lg:w-64 space-y-6 flex flex-col">
        <LeaderboardTable :key="leaderboardRefreshKey" />
      </aside>
    </div>

    <!-- Game Completion Modal -->
    <GameCompletion
      :is-visible="gameState.isGameOver"
      :score-breakdown="currentScoreBreakdown"
      :elapsed-time="gameState.timeElapsed"
      :hints-used="gameState.hintsUsed"
      :error-count="gameState.errorsCount"
      :difficulty="gameState.difficulty"
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
import { generatePuzzle, createEmptyGrid } from '@/utils/puzzleGenerator';
import {
  placeNumber,
  clearCell,
  isSolutionCorrect,
} from '@/utils/sudokuValidator';
import { calculateFinalScore, getScoreBreakdown } from '@/utils/scoringSystem';
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
import type { GameState, Difficulty } from '@/types/sudoku';

// State
const selectedRow = ref<number>(-1);
const selectedCol = ref<number>(-1);
const selectedDigit = ref<number>(-1);
const leaderboardRefreshKey = ref<number>(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

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
  errorsCount: 0,
});

let gameHistory = ref<HistoryState | null>(null);

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

const currentScoreBreakdown = computed(() => {
  return getScoreBreakdown(
    gameState.value.userGrid,
    gameState.value.solution,
    gameState.value.hintsUsed,
    gameState.value.errorsCount,
  );
});
const canUndoMove = computed(() => {
  return gameHistory.value && canUndo(gameHistory.value);
});

const canRedoMove = computed(() => {
  return gameHistory.value && canRedo(gameHistory.value);
});

// Watch gameState for changes and save to localStorage
watch(
  () => gameState.value,
  (newState) => {
    saveGameState(newState);
  },
  { deep: true },
);

// Watch selectedDigit to place number when digit is selected and cell is already selected
watch(selectedDigit, (newDigit) => {
  if (newDigit !== -1 && selectedRow.value !== -1 && selectedCol.value !== -1) {
    const cell = gameState.value.userGrid[selectedRow.value][selectedCol.value];
    if (!cell.isOriginal && newDigit >= 1 && newDigit <= 9) {
      placeNumber(
        gameState.value.userGrid,
        selectedRow.value,
        selectedCol.value,
        newDigit,
      );
      pushMoveToHistory();
      // Reset selected digit after placing
      selectedDigit.value = -1;
    }
  }
});

// Methods
const pushMoveToHistory = () => {
  if (gameHistory.value) {
    gameHistory.value = pushToHistory(gameHistory.value, gameState.value);
  }
};

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
  gameState.value.timeElapsed = 0;
  gameState.value.score = 0;
  gameState.value.hintsUsed = 0;
  gameState.value.errorsCount = 0;

  // Initialize history for new game
  gameHistory.value = createHistory(gameState.value);

  // Clear existing timer if any
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }

  // Start timer
  timerInterval = setInterval(() => {
    gameState.value.timeElapsed += 1;
  }, 1000);
  leaderboardRefreshKey.value++;
};

const selectCell = (rowIndex: number, colIndex: number) => {
  const cell = gameState.value.userGrid[rowIndex][colIndex];

  // If a digit is already selected, place it immediately
  if (
    selectedDigit.value !== -1 &&
    !cell.isOriginal &&
    selectedDigit.value >= 1 &&
    selectedDigit.value <= 9
  ) {
    placeNumber(
      gameState.value.userGrid,
      rowIndex,
      colIndex,
      selectedDigit.value,
    );
    pushMoveToHistory();
  }

  // Always select the cell
  selectedRow.value = rowIndex;
  selectedCol.value = colIndex;
};

const selectDigit = (digit: number) => {
  selectedDigit.value = digit;
};

const showHint = () => {
  // Check if max hints reached
  if (gameState.value.hintsUsed >= 10) {
    return;
  }

  // Find all empty cells (value is 0 and not original)
  const emptyCells: Array<[number, number]> = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = gameState.value.userGrid[i][j];
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
  const correctValue = gameState.value.solution[row][col];
  gameState.value.userGrid[row][col].value = correctValue;
  gameState.value.userGrid[row][col].hasError = false;

  // Increment hints used
  gameState.value.hintsUsed += 1;

  // Push to history
  pushMoveToHistory();
};

const changeDifficulty = (difficulty: Difficulty) => {
  gameState.value.difficulty = difficulty;
  gameState.value.score = 0;
  gameState.value.hintsUsed = 0;
  gameState.value.timeElapsed = 0;
  initializeGame();
};

const handleNewPuzzle = () => {
  gameState.value.isGameOver = false;
  initializeGame();
};

const closeCompletionModal = () => {
  gameState.value.isGameOver = false;
};

const handleUndo = () => {
  if (!gameHistory.value || !canUndo(gameHistory.value)) return;
  const undoResult = undo(gameHistory.value);
  gameHistory.value = undoResult.history;
  if (undoResult.state) {
    gameState.value = undoResult.state;
  }
};

const handleRedo = () => {
  if (!gameHistory.value || !canRedo(gameHistory.value)) return;
  const redoResult = redo(gameHistory.value);
  gameHistory.value = redoResult.history;
  if (redoResult.state) {
    gameState.value = redoResult.state;
  }
};

// Keyboard event handler for number input
const handleKeyPress = (event: KeyboardEvent) => {
  // Handle undo (Ctrl+Z or Cmd+Z)
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === 'z' &&
    !event.shiftKey
  ) {
    event.preventDefault();
    handleUndo();
    return;
  }

  // Handle redo (Ctrl+Shift+Z or Cmd+Shift+Z)
  if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey) {
    event.preventDefault();
    handleRedo();
    return;
  }

  if (selectedRow.value === -1 || selectedCol.value === -1) return;

  const cell = gameState.value.userGrid[selectedRow.value][selectedCol.value];

  const key = event.key;

  if (key >= '1' && key <= '9' && !cell.isOriginal) {
    event.preventDefault();
    placeNumber(
      gameState.value.userGrid,
      selectedRow.value,
      selectedCol.value,
      parseInt(key),
    );
    pushMoveToHistory();
  } else if ((key === 'Backspace' || key === 'Delete') && !cell.isOriginal) {
    event.preventDefault();
    clearCell(gameState.value.userGrid, selectedRow.value, selectedCol.value);
    pushMoveToHistory();
  } else if (key === 'ArrowUp') {
    event.preventDefault();
    selectedRow.value = Math.max(0, selectedRow.value - 1);
  } else if (key === 'ArrowDown') {
    event.preventDefault();
    selectedRow.value = Math.min(8, selectedRow.value + 1);
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    selectedCol.value = Math.max(0, selectedCol.value - 1);
  } else if (key === 'ArrowRight') {
    event.preventDefault();
    selectedCol.value = Math.min(8, selectedCol.value + 1);
  }
  if (isSolutionCorrect(gameState.value.userGrid, gameState.value.solution)) {
    gameState.value.isGameOver = true;
    // Calculate final score when game is completed
    gameState.value.score = calculateFinalScore(
      gameState.value.userGrid,
      gameState.value.solution,
      gameState.value.hintsUsed,
      gameState.value.errorsCount,
    );
    // Save to leaderboard
    addLeaderboardEntry(
      gameState.value.score,
      gameState.value.difficulty,
      gameState.value.timeElapsed,
    );
    // Stop timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }

    clearGameState();
  }
};

onMounted(() => {
  // Try to load saved game state
  const savedState = loadGameState();
  if (savedState) {
    gameState.value = savedState;
    gameHistory.value = createHistory(gameState.value);
    // Resume timer from saved elapsed time
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
      gameState.value.timeElapsed += 1;
    }, 1000);
  } else {
    // Start fresh game if no saved state
    initializeGame();
  }
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped></style>
