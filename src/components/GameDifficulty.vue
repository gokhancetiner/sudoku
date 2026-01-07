<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Difficulty</h3>
    <div class="space-y-2">
      <button
        v-for="difficulty in difficulties"
        :key="difficulty"
        @click="selectDifficulty(difficulty)"
        class="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200"
        :class="
          currentDifficulty === difficulty
            ? 'bg-sudoku-highlight text-white'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        "
      >
        {{ capitalizeFirstLetter(difficulty) }}
      </button>
    </div>

    <!-- Hint Button -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <button
        @click="handleShowHint"
        :disabled="hintsUsed >= 10"
        class="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200"
        :class="
          hintsUsed >= 10
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-sudoku-hint text-white hover:bg-opacity-90'
        "
      >
        💡 Show Hint ({{ hintsUsed }}/10)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Difficulty } from '@/types/sudoku';

interface Props {
  currentDifficulty: Difficulty;
  hintsUsed: number;
}

interface Emits {
  (e: 'change-difficulty', difficulty: Difficulty): void;
  (e: 'show-hint'): void;
}

const difficulties: Difficulty[] = [
  'beginner',
  'intermediate',
  'hard',
  'expert',
];

defineProps<Props>();
const emit = defineEmits<Emits>();

const selectDifficulty = (difficulty: Difficulty) => {
  emit('change-difficulty', difficulty);
};

const handleShowHint = () => {
  emit('show-hint');
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>
