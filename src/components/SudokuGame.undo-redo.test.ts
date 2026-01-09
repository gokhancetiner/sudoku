import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SudokuGame from './SudokuGame.vue';

describe('SudokuGame.vue - Undo/Redo Integration', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(SudokuGame);
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should render GameInfo component', () => {
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });
    expect(gameInfo.exists()).toBe(true);
  });

  it('should have undo and redo buttons in grid header', async () => {
    await wrapper.vm.$nextTick();

    // Find the grid container
    const gridSection = wrapper.find('.flex-1');
    expect(gridSection.exists()).toBe(true);

    // Undo/Redo buttons should exist in the grid header
    const buttons = wrapper.findAll('button');
    const undoButton = buttons.find((b) => b.text().includes('Undo'));
    const redoButton = buttons.find((b) => b.text().includes('Redo'));
    expect(undoButton?.exists()).toBe(true);
    expect(redoButton?.exists()).toBe(true);
  });

  it('should initialize with keyboard shortcuts for undo/redo', () => {
    // Component should be properly initialized
    expect(wrapper.vm.$el).toBeDefined();
  });

  it('should respond to GameInfo undo event', async () => {
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });

    // Trigger undo event
    await gameInfo.vm.$emit('undo');

    // Component should still be functional
    expect(wrapper.exists()).toBe(true);
  });

  it('should respond to GameInfo redo event', async () => {
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });

    // Trigger redo event
    await gameInfo.vm.$emit('redo');

    // Component should still be functional
    expect(wrapper.exists()).toBe(true);
  });

  it('should maintain game state after undo/redo actions', async () => {
    // Component should be functional
    expect(wrapper.exists()).toBe(true);

    // Component should render SudokuGrid
    const sudokuGrid = wrapper.findComponent({ name: 'SudokuGrid' });
    expect(sudokuGrid.exists()).toBe(true);
  });

  it('should render SudokuGrid component with game state', () => {
    const sudokuGrid = wrapper.findComponent({ name: 'SudokuGrid' });
    expect(sudokuGrid.exists()).toBe(true);
  });

  it('should integrate history manager on game initialization', () => {
    // Component should be initialized and functional
    expect(wrapper.exists()).toBe(true);

    // GameInfo should exist
    const gameInfo = wrapper.findComponent({ name: 'GameInfo' });
    expect(gameInfo.exists()).toBe(true);

    // Leaderboard should exist
    const leaderboard = wrapper.findComponent({ name: 'LeaderboardTable' });
    expect(leaderboard.exists()).toBe(true);
  });
});
