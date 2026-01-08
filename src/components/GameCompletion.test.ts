import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GameCompletion from './GameCompletion.vue';
import type { Difficulty } from '@/types/sudoku';

describe('GameCompletion.vue', () => {
  const scoreBreakdown = {
    baseScore: 405,
    hintPenalty: 7,
    errorPenalty: 3,
    finalScore: 395,
  };

  it('should render component structure when isVisible is true', () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
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
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('395');
  });

  it('should display score breakdown components', () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('405');
    expect(wrapper.text()).toContain('7');
    expect(wrapper.text()).toContain('3');
    expect(wrapper.text()).toContain('Base Score');
  });

  it('should display hint penalty when hints are used', () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 2,
        errorCount: 0,
        difficulty: 'intermediate' as Difficulty,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Hint Penalty');
  });

  it('should display error penalty when errors are present', () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 0,
        errorCount: 5,
        difficulty: 'intermediate' as Difficulty,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Error Penalty');
  });

  it('should format time correctly', () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 125,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('2:05');
  });

  it('should format time with hours correctly', () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 3725,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain('1:02:05');
  });

  it('should emit restart event when restart button is clicked', async () => {
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
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
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 2,
        errorCount: 3,
        difficulty: 'intermediate' as Difficulty,
      },
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
    const wrapper = mount(GameCompletion, {
      props: {
        isVisible: true,
        scoreBreakdown,
        elapsedTime: 100,
        hintsUsed: 3,
        errorCount: 5,
        difficulty: 'intermediate' as Difficulty,
      },
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
