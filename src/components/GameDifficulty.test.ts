import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GameDifficulty from './GameDifficulty.vue';

describe('GameDifficulty.vue', () => {
  it('should renders the component', () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should renders all four difficulty buttons', () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'intermediate',
      },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(4);
  });

  it('should displays difficulty labels correctly', () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.text()).toContain('Beginner');
    expect(wrapper.text()).toContain('Intermediate');
    expect(wrapper.text()).toContain('Hard');
    expect(wrapper.text()).toContain('Expert');
  });

  it('should highlights the current difficulty button', () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'hard',
      },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons[2].classes()).toContain('bg-sudoku-highlight');
  });

  it('should does not highlight non-current difficulty buttons', () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'beginner',
      },
    });
    const buttons = wrapper.findAll('button');
    expect(buttons[1].classes()).toContain('bg-gray-100');
    expect(buttons[2].classes()).toContain('bg-gray-100');
    expect(buttons[3].classes()).toContain('bg-gray-100');
  });

  it('should emits change-difficulty event when button is clicked', async () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'beginner',
      },
    });
    const buttons = wrapper.findAll('button');
    await buttons[2].trigger('click');

    expect(wrapper.emitted('change-difficulty')).toBeTruthy();
    expect(wrapper.emitted('change-difficulty')?.[0]).toEqual(['hard']);
  });

  it('should emits change-difficulty with correct difficulty value', async () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'intermediate',
      },
    });
    const buttons = wrapper.findAll('button');

    // Test each difficulty
    await buttons[0].trigger('click');
    expect(wrapper.emitted('change-difficulty')).toBeTruthy();
    expect(wrapper.emitted('change-difficulty')?.[0]).toEqual(['beginner']);

    await buttons[1].trigger('click');
    expect(wrapper.emitted('change-difficulty')?.[1]).toEqual(['intermediate']);

    await buttons[3].trigger('click');
    expect(wrapper.emitted('change-difficulty')?.[2]).toEqual(['expert']);
  });

  it('should updates highlight when currentDifficulty prop changes', async () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'beginner',
      },
    });
    let buttons = wrapper.findAll('button');
    expect(buttons[0].classes()).toContain('bg-sudoku-highlight');

    await wrapper.setProps({ currentDifficulty: 'expert' });
    buttons = wrapper.findAll('button');
    expect(buttons[3].classes()).toContain('bg-sudoku-highlight');
  });

  it('should shows "Difficulty" heading', () => {
    const wrapper = mount(GameDifficulty, {
      props: {
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.text()).toContain('Difficulty');
  });
});
