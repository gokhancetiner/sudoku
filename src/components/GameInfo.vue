<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Game Info</h3>
    <div class="space-y-4">
      <div>
        <p class="text-sm text-gray-600">Time</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ formatTime(timeElapsed) }}
        </p>
      </div>

      <!-- Show Hint Button -->
      <button
        @click="handleShowHint"
        :disabled="hintsUsed >= 10"
        class="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 mt-4"
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
interface Props {
  timeElapsed: number;
  hintsUsed: number;
}

interface Emits {
  (e: 'show-hint'): void;
}

defineProps<Props>();
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
</script>
