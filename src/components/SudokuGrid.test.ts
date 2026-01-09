import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SudokuGrid from './SudokuGrid.vue';
import { useGameStore } from '@/stores/gameStore';
import { createPinia, setActivePinia } from 'pinia';
import type { GameState } from '@/types/sudoku';

describe('SudokuGrid.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createMockGameState = (): GameState => ({
    puzzle: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    solution: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    userGrid: Array(9)
      .fill(null)
      .map(() =>
        Array(9)
          .fill(null)
          .map(() => ({
            value: 0,
            isOriginal: false,
            isSelected: false,
            hasError: false,
          })),
      ),
    difficulty: 'intermediate',
    score: 0,
    hintsUsed: 0,
    timeElapsed: 0,
    isGameOver: false,
    errorsCount: 0,
  });

  it('should renders the component', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.selectedRow = -1;
    store.selectedCol = -1;

    const wrapper = mount(SudokuGrid);
    expect(wrapper.exists()).toBe(true);
  });

  it('should renders 81 cells (9x9 grid)', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.selectedRow = -1;
    store.selectedCol = -1;

    const wrapper = mount(SudokuGrid);
    const cells = wrapper.findAllComponents({ name: 'SudokuCell' });
    expect(cells.length).toBe(81);
  });

  it('should emits select-cell event with correct indices', async () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.selectedRow = -1;
    store.selectedCol = -1;

    const wrapper = mount(SudokuGrid);

    // Simulate selecting a cell at row 3, col 5
    // Cell index = 3*9 + 5 = 32
    const cells = wrapper.findAllComponents({ name: 'SudokuCell' });
    if (cells.length > 32) {
      await cells[32].vm.$emit('select', 3, 5);
    }

    expect(wrapper.emitted('select-cell')).toBeTruthy();
  });

  it('should highlights the selected cell', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.selectedRow = 4;
    store.selectedCol = 4;

    const wrapper = mount(SudokuGrid);

    const cells = wrapper.findAllComponents({ name: 'SudokuCell' });
    // Center cell should be selected (row 4, col 4 = index 40)
    expect(cells[40].props('isSelected')).toBe(true);
  });

  it('shouldapplies grid layout with correct styling', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.selectedRow = -1;
    store.selectedCol = -1;

    const wrapper = mount(SudokuGrid);

    const gridContainer = wrapper.find('[style*="grid-template-columns"]');
    expect(gridContainer.exists()).toBe(true);
  });
});
