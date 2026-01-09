<template>
  <div class="flex flex-col gap-4">
    <!-- Row 1: Time and Show Hint Button -->
    <div class="flex items-center justify-between gap-4">
      <!-- Difficulty Selector (Pill Buttons) -->
      <div class="flex gap-2 items-center">
        <span class="text-sm text-gray-600 font-medium">Level:</span>
        <div class="flex gap-2 flex-wrap">
          <BaseButton
            v-for="diff in difficulties"
            :key="diff"
            variant="pill"
            size="sm"
            :class="
              store.gameState.difficulty === diff
                ? 'ring-2 ring-sudoku-highlight'
                : ''
            "
            @click="handleChangeDifficulty(diff)"
          >
            {{ getDifficultyEmoji(diff) }} {{ capitalizeFirstLetter(diff) }}
          </BaseButton>
        </div>
      </div>
      <!-- Time -->
      <div class="flex gap-2 items-center">
        <p class="text-sm text-gray-600">⏱️ Time</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ formatTime(store.gameState.timeElapsed) }}
        </p>
      </div>

      <!-- Real-time Score -->
      <div class="flex gap-2 items-center">
        <p class="text-sm text-gray-600">⭐ Score</p>
        <p class="text-2xl font-bold text-sudoku-highlight">
          {{ currentScore }}
        </p>
      </div>

      <!-- Hint Button -->
      <BaseButton
        :disabled="store.gameState.hintsUsed >= 10"
        @click="handleShowHint"
      >
        💡 ({{ store.gameState.hintsUsed }}/10)
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { useRealtimeScoring } from '@/composables/useRealtimeScoring';
import { BaseButton } from '@/components/ui';
import type { Difficulty } from '@/types/sudoku';

const store = useGameStore();
const { currentScore } = useRealtimeScoring();

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
