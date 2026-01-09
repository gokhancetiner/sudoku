<template>
  <Teleport to="body">
    <div
      v-if="store.gameState.isGameOver"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4"
        @click.stop
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-sudoku-highlight to-sudoku-highlight/80 p-6 text-center"
        >
          <h2 class="text-3xl font-bold text-white">🎉 Puzzle Solved!</h2>
          <p class="text-sudoku-highlight/80 mt-2">Great job!</p>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Final Score -->
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">Final Score</p>
            <p class="text-5xl font-bold text-sudoku-highlight">
              {{ scoreBreakdown.finalScore }}
            </p>
          </div>

          <!-- Score Breakdown -->
          <div class="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-gray-700">Base Score (81 cells × 5 pts):</span>
              <span class="font-semibold text-green-600">
                +{{ scoreBreakdown.baseScore }}
              </span>
            </div>

            <div
              v-if="scoreBreakdown.hintPenalty > 0"
              class="flex justify-between items-center"
            >
              <span class="text-gray-700"
                >Hint Penalty ({{ store.gameState.hintsUsed }} hints):</span
              >
              <span class="font-semibold text-red-600">
                -{{ scoreBreakdown.hintPenalty }}
              </span>
            </div>

            <div
              v-if="scoreBreakdown.errorPenalty > 0"
              class="flex justify-between items-center"
            >
              <span class="text-gray-700"
                >Error Penalty ({{ store.gameState.errorsCount }} errors):</span
              >
              <span class="font-semibold text-red-600">
                -{{ scoreBreakdown.errorPenalty }}
              </span>
            </div>

            <div class="border-t pt-3 flex justify-between items-center">
              <span class="font-semibold text-gray-900">Total:</span>
              <span class="text-2xl font-bold text-sudoku-highlight">
                {{ scoreBreakdown.finalScore }}
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-xs text-gray-600">Time</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formatTime(store.gameState.timeElapsed) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-600">Difficulty</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ difficultyLabel }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-600">Errors</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ store.gameState.errorsCount }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="border-t p-4 flex gap-3">
          <button
            @click="$emit('restart')"
            class="flex-1 bg-sudoku-highlight hover:bg-sudoku-highlight/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Play Again
          </button>
          <button
            @click="$emit('new-puzzle')"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            New Puzzle
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { getScoreBreakdown } from '@/utils/scoringSystem';
import type { Difficulty } from '@/types/sudoku';

interface Emits {
  restart: [];
  'new-puzzle': [];
  close: [];
}

const store = useGameStore();
const emit = defineEmits<Emits>();

const scoreBreakdown = computed(() => {
  return getScoreBreakdown(
    store.gameState.userGrid,
    store.gameState.solution,
    store.gameState.hintsUsed,
    store.gameState.errorsCount,
  );
});

const difficultyLabel = computed(() => {
  const labels: Record<Difficulty, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    hard: 'Hard',
    expert: 'Expert',
  };
  return labels[store.gameState.difficulty];
});

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

const handleBackdropClick = () => {
  emit('close');
};
</script>

<style scoped></style>
