<template>
  <div class="flex flex-col gap-4">
    <div class="bg-white rounded-lg shadow-lg p-3">
      <div
        class="grid gap-0"
        style="grid-template-columns: repeat(9, minmax(0, 1fr))"
      >
        <SudokuCell
          v-for="(cell, index) in flattenedGrid"
          :key="`${Math.floor(index / 9)}-${index % 9}`"
          :cell="cell"
          :is-selected="
            selectedRow === Math.floor(index / 9) && selectedCol === index % 9
          "
          :row-index="Math.floor(index / 9)"
          :col-index="index % 9"
          :completions="completions"
          @select="selectCell"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SudokuCell from './SudokuCell.vue';
import { detectCompletions } from '@/utils/completionDetector';
import type { SudokuCell as SudokuCellType, GameState } from '@/types/sudoku';

interface Props {
  gameState: GameState;
  selectedRow: number;
  selectedCol: number;
}

interface Emits {
  (e: 'select-cell', rowIndex: number, colIndex: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const flattenedGrid = computed(() => {
  const grid: SudokuCellType[] = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      grid.push(props.gameState.userGrid[i][j]);
    }
  }
  return grid;
});

const completions = computed(() => {
  return detectCompletions(props.gameState.userGrid);
});

const selectCell = (rowIndex: number, colIndex: number) => {
  emit('select-cell', rowIndex, colIndex);
};
</script>
