import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableDigits from './AvailableDigits.vue';
import { useGameStore } from '@/stores/gameStore';
import { createPinia, setActivePinia } from 'pinia';
import type { GameState } from '@/types/sudoku';

describe('AvailableDigits.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createEmptyGrid = (): number[][] =>
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

  const createSolutionGrid = (): number[][] => {
    // Create a valid Sudoku solution pattern
    const grid: number[][] = [];
    for (let i = 0; i < 9; i++) {
      grid[i] = [];
      for (let j = 0; j < 9; j++) {
        grid[i][j] = ((i * 3 + Math.floor(j / 3) + j) % 9) + 1;
      }
    }
    return grid;
  };

  const createMockGameState = (
    userGridValues: number[][],
    solution: number[][],
  ): GameState => ({
    puzzle: Array(9)
      .fill(null)
      .map(() => Array(9).fill(0)),
    solution,
    userGrid: userGridValues.map((row) =>
      row.map((value) => ({
        value,
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
    store.gameState = createMockGameState(
      createEmptyGrid(),
      createSolutionGrid(),
    );

    const wrapper = mount(AvailableDigits);
    for (let i = 1; i <= 9; i++) {
      expect(wrapper.text()).toContain(String(i));
    }
    expect(wrapper.text()).toContain('0/9 digits completed');
    expect(wrapper.text()).toContain('Available Digits');
  });

  it('should emit select-digit event when available digit is clicked', async () => {
    const store = useGameStore();
    store.gameState = createMockGameState(
      createEmptyGrid(),
      createSolutionGrid(),
    );

    const wrapper = mount(AvailableDigits);
    const buttons = wrapper.findAll('button');
    await buttons[4].trigger('click');

    expect(store.selectedDigit).toBe(5);
  });

  it('should not emit event when completed digit is clicked', async () => {
    const userGrid = createEmptyGrid();
    const solution = createSolutionGrid();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solution[i][j] === 1) {
          userGrid[i][j] = 1;
        }
      }
    }

    const store = useGameStore();
    store.gameState = createMockGameState(userGrid, solution);

    const wrapper = mount(AvailableDigits);
    const buttons = wrapper.findAll('button');
    const button1 = buttons[0];
    expect(button1.attributes('disabled')).toBeDefined();

    await button1.trigger('click');
    expect(store.selectedDigit).not.toBe(1);
  });

  it('should updates completed count when digits are filled', async () => {
    const userGrid = createEmptyGrid();
    const solution = createSolutionGrid();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solution[i][j] === 1) {
          userGrid[i][j] = 1;
        }
        if (solution[i][j] === 2) {
          userGrid[i][j] = 2;
        }
      }
    }

    const store = useGameStore();
    store.gameState = createMockGameState(userGrid, solution);

    const wrapper = mount(AvailableDigits);

    expect(wrapper.text()).toContain('2/9 digits completed');
  });

  it('shows "9/9 digits completed" when puzzle is fully solved', async () => {
    const userGrid = createSolutionGrid();
    const solution = createSolutionGrid();

    const store = useGameStore();
    store.gameState = createMockGameState(userGrid, solution);

    const wrapper = mount(AvailableDigits);
    expect(wrapper.text()).toContain('9/9 digits completed');
  });

  it('should handle multiple digit selections correctly', async () => {
    const store = useGameStore();
    store.gameState = createMockGameState(
      createEmptyGrid(),
      createSolutionGrid(),
    );

    const wrapper = mount(AvailableDigits);

    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click'); // Digit 1
    expect(store.selectedDigit).toBe(1);

    await buttons[2].trigger('click'); // Digit 3
    expect(store.selectedDigit).toBe(3);

    await buttons[5].trigger('click'); // Digit 6
    expect(store.selectedDigit).toBe(6);
  });
});
