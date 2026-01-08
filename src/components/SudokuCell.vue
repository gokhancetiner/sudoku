<template>
  <div
    class="w-12 h-12 flex items-center justify-center border-2 cursor-pointer transition-all duration-200"
    :class="[
      cellClasses,
      isSelected ? 'ring-2 ring-sudoku-highlight ring-inset' : '',
      borderClasses,
    ]"
    @click="selectCell"
  >
    <span
      v-if="cell.value !== 0"
      class="text-lg font-semibold"
      :class="[
        cell.isOriginal ? 'text-gray-900 font-bold' : 'text-sudoku-highlight',
        cell.hasError ? 'text-sudoku-error' : '',
      ]"
    >
      {{ cell.value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SudokuCell } from '@/types/sudoku';

interface Props {
  cell: SudokuCell;
  isSelected: boolean;
  rowIndex: number;
  colIndex: number;
}

interface Emits {
  (e: 'select', rowIndex: number, colIndex: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectCell = () => {
  emit('select', props.rowIndex, props.colIndex);
};

const cellClasses = computed(() => {
  const classes: string[] = [];

  // Background color
  if (props.cell.hasError) {
    classes.push('bg-red-100');
  } else if (props.isSelected) {
    classes.push('bg-blue-100');
  } else if (props.cell.isOriginal) {
    classes.push('bg-gray-100');
  } else {
    classes.push('bg-white hover:bg-gray-50');
  }

  return classes;
});

const borderClasses = computed(() => {
  const classes: string[] = [];
  const row = props.rowIndex;
  const col = props.colIndex;

  // Darker borders on edges of 3x3 boxes
  if (row % 3 === 0) {
    classes.push('border-t-gray-800');
  }
  if (row % 3 === 2) {
    classes.push('border-b-gray-800');
  }
  if (col % 3 === 0) {
    classes.push('border-l-gray-800');
  }
  if (col % 3 === 2) {
    classes.push('border-r-gray-800');
  }

  return classes;
});
</script>
