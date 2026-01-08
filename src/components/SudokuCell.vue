<template>
  <div
    class="w-12 h-12 flex items-center justify-center border-2 cursor-pointer transition-all duration-200"
    :class="[
      cellClasses,
      isSelected ? 'ring-2 ring-sudoku-highlight ring-inset' : '',
      borderClasses,
      showAnimation
        ? 'completion-animation bg-gradient-to-br from-green-200 to-emerald-200'
        : '',
    ]"
    @click="selectCell"
  >
    <span
      v-if="cell.value !== 0"
      class="text-lg font-semibold"
      :class="[
        cell.isOriginal ? 'text-gray-900 font-bold' : 'text-sudoku-highlight',
        cell.hasError ? 'text-sudoku-error' : '',
        showAnimation ? 'text-green-700' : '',
      ]"
    >
      {{ cell.value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { SudokuCell } from '@/types/sudoku';
import type { CompletionStatus } from '@/utils/completionDetector';
import { getBoxIndex } from '@/utils/completionDetector';

interface Props {
  cell: SudokuCell;
  isSelected: boolean;
  rowIndex: number;
  colIndex: number;
  completions?: CompletionStatus;
}

interface Emits {
  (e: 'select', rowIndex: number, colIndex: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showAnimation = ref(false);
const previousCompletionState = ref<{
  rowCompleted: boolean;
  colCompleted: boolean;
  boxCompleted: boolean;
}>({
  rowCompleted: false,
  colCompleted: false,
  boxCompleted: false,
});

let animationTimeout: ReturnType<typeof setTimeout> | null = null;

const selectCell = () => {
  emit('select', props.rowIndex, props.colIndex);
};

const currentCompletionState = computed(() => {
  if (!props.completions) {
    return {
      rowCompleted: false,
      colCompleted: false,
      boxCompleted: false,
    };
  }

  const boxIndex = getBoxIndex(props.rowIndex, props.colIndex);
  return {
    rowCompleted: props.completions.completedRows.has(props.rowIndex),
    colCompleted: props.completions.completedCols.has(props.colIndex),
    boxCompleted: props.completions.completedBoxes.has(boxIndex),
  };
});

watch(
  currentCompletionState,
  (newState) => {
    const prevState = previousCompletionState.value;

    // Check if any new completion occurred
    const newRowCompletion = newState.rowCompleted && !prevState.rowCompleted;
    const newColCompletion = newState.colCompleted && !prevState.colCompleted;
    const newBoxCompletion = newState.boxCompleted && !prevState.boxCompleted;

    if (newRowCompletion || newColCompletion || newBoxCompletion) {
      showAnimation.value = true;

      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }

      animationTimeout = setTimeout(() => {
        showAnimation.value = false;
      }, 5000);
    }

    previousCompletionState.value = { ...newState };
  },
  { deep: true },
);

const cellClasses = computed(() => {
  const classes: string[] = [];

  // Background color
  if (props.cell.hasError) {
    classes.push('bg-red-100');
  } else if (showAnimation.value) {
    classes.push('');
  } else if (props.isSelected) {
    classes.push('bg-blue-100');
  } else if (props.cell.isOriginal) {
    classes.push('bg-gray-100');
  } else {
    classes.push('bg-white hover:bg-gray-50');
  }

  return classes.filter(Boolean);
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

<style scoped>
@keyframes completionPulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

.completion-animation {
  animation: completionPulse 5s ease-out forwards;
}
</style>
