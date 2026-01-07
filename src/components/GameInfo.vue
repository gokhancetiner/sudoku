<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Game Info</h3>
    <div class="space-y-4">
      <div>
        <p class="text-sm text-gray-600">Score</p>
        <p class="text-2xl font-bold text-sudoku-highlight">
          {{ score }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Time</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ formatTime(timeElapsed) }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Hints Used</p>
        <p class="text-2xl font-bold text-sudoku-hint">{{ hintsUsed }}/10</p>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-sudoku-hint h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(hintsUsed / 10) * 100}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number;
  timeElapsed: number;
  hintsUsed: number;
}

defineProps<Props>();

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};
</script>
