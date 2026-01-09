<template>
  <div class="flex flex-col gap-4">
    <!-- Row 1: Time and Show Hint Button -->
    <div class="flex items-center justify-between gap-4">
      <!-- Difficulty Selector (Pill Buttons) -->
      <div class="flex gap-2 items-center">
        <span class="text-sm text-gray-600 font-medium">Level:</span>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="diff in difficulties"
            :key="diff"
            @click="handleChangeDifficulty(diff)"
            class="px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
            :class="
              store.gameState.difficulty === diff
                ? 'bg-sudoku-highlight text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
          >
            {{ getDifficultyEmoji(diff) }} {{ capitalizeFirstLetter(diff) }}
          </button>
        </div>
      </div>
      <!-- Time -->
      <div class="flex gap-2 items-center">
        <p class="text-sm text-gray-600">⏱️ Time</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ formatTime(store.gameState.timeElapsed) }}
        </p>
      </div>

      <!-- Hint Button -->
      <button
        @click="handleShowHint"
        :disabled="store.gameState.hintsUsed >= 10"
        class="px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap"
        :class="
          store.gameState.hintsUsed >= 10
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-sudoku-hint text-white hover:bg-opacity-90'
        "
      >
        💡 Show Hint ({{ store.gameState.hintsUsed }}/10)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import type { Difficulty } from '@/types/sudoku';

const store = useGameStore();

interface Emits {
  (e: 'show-hint'): void;
  (e: 'change-difficulty', difficulty: Difficulty): void;
}

const difficulties: Difficulty[] = [
  'beginner',
  'intermediate',
  'hard',
  'expert',
];

const emit = defineEmits<Emits>();

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

const handleShowHint = () => {
  emit('show-hint');
};

const handleChangeDifficulty = (difficulty: Difficulty) => {
  emit('change-difficulty', difficulty);
};

const getDifficultyEmoji = (difficulty: Difficulty): string => {
  const emojis: Record<Difficulty, string> = {
    beginner: '🟢',
    intermediate: '🟡',
    hard: '🟠',
    expert: '🔴',
  };
  return emojis[difficulty];
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>
