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
        :hints-used="gameState.hintsUsed"
        @change-difficulty="changeDifficulty"
        @show-hint="showHint"
      />

      <AvailableDigits
        :user-grid="
          gameState.userGrid.map((row) => row.map((cell) => cell.value))
        "
        :solution="gameState.solution"
        @select-digit="selectDigit"
      />
    </aside>

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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SudokuGrid from './SudokuGrid.vue';
import GameInfo from './GameInfo.vue';
import GameDifficulty from './GameDifficulty.vue';
import AvailableDigits from './AvailableDigits.vue';
import GameCompletion from './GameCompletion.vue';
import { generatePuzzle, createEmptyGrid } from '@/utils/puzzleGenerator';
import {
  placeNumber,
  clearCell,
  isSolutionCorrect,
} from '@/utils/sudokuValidator';
import { calculateFinalScore, getScoreBreakdown } from '@/utils/scoringSystem';
import type { GameState, Difficulty } from '@/types/sudoku';

// State
const selectedRow = ref<number>(-1);
const selectedCol = ref<number>(-1);
const selectedDigit = ref<number>(-1);
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
  gameState.value.timeElapsed = 0;
  gameState.value.score = 0;
  gameState.value.hintsUsed = 0;
  gameState.value.errorsCount = 0;

  // Clear existing timer if any
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }

  // Start timer
  timerInterval = setInterval(() => {
    gameState.value.timeElapsed += 1;
  }, 1000);
};

const selectCell = (rowIndex: number, colIndex: number) => {
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

// Keyboard event handler for number input
const handleKeyPress = (event: KeyboardEvent) => {
  if (selectedRow.value === -1 || selectedCol.value === -1) return;

  const cell = gameState.value.userGrid[selectedRow.value][selectedCol.value];

  const key = event.key;

  if (key >= '1' && key <= '9' && !cell.isOriginal) {
    event.preventDefault();
    const num = parseInt(key);
    placeNumber(
      gameState.value.userGrid,
      selectedRow.value,
      selectedCol.value,
      num,
    );
  } else if ((key === 'Backspace' || key === 'Delete') && !cell.isOriginal) {
    event.preventDefault();
    clearCell(gameState.value.userGrid, selectedRow.value, selectedCol.value);
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
    // Stop timer
    if (timerInterval !== null) {
      clearInterval(timerInterval);
    }
  }
};

onMounted(() => {
  initializeGame();
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
