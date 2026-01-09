import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GameCompletion from './GameCompletion.vue';
import { useGameStore } from '@/stores/gameStore';
import { createPinia, setActivePinia } from 'pinia';
import type { GameState } from '@/types/sudoku';

describe('GameCompletion.vue', () => {
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
    hintsUsed: 2,
    timeElapsed: 100,
    isGameOver: true,
    errorsCount: 3,
  });

  it('should render component structure when isGameOver is true', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.element).toBeTruthy();
    expect(wrapper.text()).toContain('Puzzle Solved');
  });

  it('should display final score correctly', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('405');
  });

  it('should display score breakdown components', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('405');
    expect(wrapper.text()).toContain('Base Score');
  });

  it('should display hint penalty when hints are used', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.gameState.hintsUsed = 2;

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Hint Penalty');
  });

  it('should display error penalty when errors are present', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.gameState.errorsCount = 5;

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Error Penalty');
  });

  it('should format time correctly', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.gameState.timeElapsed = 125;

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('2:05');
  });

  it('should format time with hours correctly', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.gameState.timeElapsed = 3725;

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('1:02:05');
  });
  it('should emit restart event when restart button is clicked', async () => {
    const store = useGameStore();
    store.gameState = createMockGameState();

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    const restartButton = buttons[0];
    await restartButton.trigger('click');

    expect(wrapper.emitted('restart')).toBeTruthy();
  });

  it('should emit new-puzzle event when new puzzle button is clicked', async () => {
    const store = useGameStore();
    store.gameState = createMockGameState();

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThan(1);
    const newPuzzleButton = buttons[1];
    await newPuzzleButton.trigger('click');

    expect(wrapper.emitted('new-puzzle')).toBeTruthy();
  });

  it('should display hints and errors count in stats', () => {
    const store = useGameStore();
    store.gameState = createMockGameState();
    store.gameState.hintsUsed = 3;
    store.gameState.errorsCount = 5;

    const wrapper = mount(GameCompletion, {
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('3');
    expect(wrapper.text()).toContain('5');
  });
});
