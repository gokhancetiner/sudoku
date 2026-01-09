import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SudokuGame from './SudokuGame.vue';
import { useGameStore } from '@/stores/gameStore';
import type { SudokuCell } from '../types/sudoku';

describe('SudokuGame.vue', () => {
  it('should renders the component', () => {
    const wrapper = mount(SudokuGame);
    expect(wrapper.exists()).toBe(true);
  });

  it('should renders SudokuGrid component', () => {
    const wrapper = mount(SudokuGame);
    expect(wrapper.findComponent({ name: 'SudokuGrid' }).exists()).toBe(true);
  });

  it('should renders GameInfo component', () => {
    const wrapper = mount(SudokuGame);
    expect(wrapper.findComponent({ name: 'GameInfo' }).exists()).toBe(true);
  });

  it('should renders GameInfo component with difficulty', () => {
    const wrapper = mount(SudokuGame);
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });
    expect(gameInfo.exists()).toBe(true);
    expect(gameInfo.props('currentDifficulty')).toBe('intermediate');
  });

  it('should initializes with correct default game state', () => {
    const wrapper = mount(SudokuGame);
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });

    expect(gameInfo.props('timeElapsed')).toBe(0);
    expect(gameInfo.props('hintsUsed')).toBe(0);
  });

  it('should handles cell selection', async () => {
    const wrapper = mount(SudokuGame);
    const store = useGameStore();
    const sudokuGrid = wrapper.findComponent({ name: 'SudokuGrid' });

    await sudokuGrid.vm.$emit('select-cell', 3, 4);

    expect(store.selectedRow).toBe(3);
    expect(store.selectedCol).toBe(4);
  });

  it('should displays correct difficulty label', async () => {
    const wrapper = mount(SudokuGame);
    const mainContent = wrapper.find('h2');

    expect(mainContent.text()).toContain('Intermediate');
  });

  it('should updates difficulty label when difficulty changes', async () => {
    const wrapper = mount(SudokuGame);
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });

    await gameInfo.vm.$emit('change-difficulty', 'hard');
    await wrapper.vm.$nextTick();

    const mainContent = wrapper.find('h2');
    expect(mainContent.text()).toContain('Hard');
  });

  it('should fill a random empty cell with hint', async () => {
    const wrapper = mount(SudokuGame);
    const store = useGameStore();

    const initialEmpty = store.gameState.userGrid
      .flat()
      .filter((cell: SudokuCell) => cell.value === 0).length;

    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });
    await gameInfo.vm.$emit('show-hint');

    const afterHintEmpty = store.gameState.userGrid
      .flat()
      .filter((cell: { value: number }) => cell.value === 0).length;

    // One cell should be filled
    expect(afterHintEmpty).toBe(initialEmpty - 1);
  });

  it('should not exceed maximum hints (10)', async () => {
    const wrapper = mount(SudokuGame);
    const store = useGameStore();

    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });

    // Use 10 hints
    for (let i = 0; i < 15; i++) {
      await gameInfo.vm.$emit('show-hint');
    }

    // Should only have 10 hints used (not 15)
    expect(store.gameState.hintsUsed).toBe(10);
  });
});
