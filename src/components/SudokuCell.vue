<template>
  <div
    class="w-12 h-12 flex items-center justify-center border-2 cursor-pointer transition-all duration-200"
    :class="[
      cellClasses,
      isSelected ? 'ring-2 ring-sudoku-highlight ring-inset' : '',
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

  // Border styling based on 3x3 box positions
  const topBorder = props.rowIndex % 3 === 0 ? 'border-t-4' : 'border-t';
  const bottomBorder =
    props.rowIndex === 8 ? 'border-b-4' : 'border-b';
  const leftBorder = props.colIndex % 3 === 0 ? 'border-l-4' : 'border-l';
  const rightBorder =
    props.colIndex === 8 ? 'border-r-4' : 'border-r';

  classes.push(topBorder, bottomBorder, leftBorder, rightBorder);

  // Border color
  const borderColor = props.cell.isOriginal
    ? 'border-gray-800'
    : 'border-sudoku-border';
  classes.push(borderColor);

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
</script>
