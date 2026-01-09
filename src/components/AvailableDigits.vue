<template>
  <div>
    <h3 class="text-lg font-bold text-gray-900 mb-4">Available Digits</h3>
    <div class="flex justify-center gap-2">
      <button
        v-for="digit in digits"
        :key="digit"
        class="py-2 px-3 rounded-lg font-bold text-lg transition-all duration-200"
        :class="[
          isDigitComplete(digit)
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-sudoku-highlight text-white hover:bg-blue-600 cursor-pointer',
        ]"
        :disabled="isDigitComplete(digit)"
        @click="selectDigit(digit)"
      >
        {{ digit }}
      </button>
    </div>
    <p class="text-xs text-gray-500 mt-4 text-center">
      {{ completedCount }}/9 digits completed
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const store = useGameStore();

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const completedDigits = computed(() => {
  const completed = new Set<number>();
  const userGrid = store.gameState.userGrid.map((row) =>
    row.map((cell) => cell.value),
  );
  const solution = store.gameState.solution;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (solution[i][j] !== 0) {
        // Check if this digit is complete
        let count = 0;
        for (let k = 0; k < 9; k++) {
          for (let l = 0; l < 9; l++) {
            if (solution[k][l] === solution[i][j]) {
              if (userGrid[k][l] === solution[k][l]) {
                count++;
              }
            }
          }
        }
        if (count === 9) {
          completed.add(solution[i][j]);
        }
      }
    }
  }
  return completed;
});

const completedCount = computed(() => completedDigits.value.size);

const isDigitComplete = (digit: number): boolean => {
  return completedDigits.value.has(digit);
};

const selectDigit = (digit: number) => {
  if (!isDigitComplete(digit)) {
    store.selectedDigit = digit;
  }
};
</script>
