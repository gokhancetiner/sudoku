import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GameInfo from './GameInfo.vue';

describe('GameInfo.vue', () => {
  it('should formats time correctly (MM:SS)', () => {
    const wrapper = mount(GameInfo, {
      props: {
        timeElapsed: 90,
        hintsUsed: 0,
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.text()).toContain('1:30');
  });

  it('should formats time correctly (HH:MM:SS)', () => {
    const wrapper = mount(GameInfo, {
      props: {
        timeElapsed: 3661,
        hintsUsed: 0,
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.text()).toContain('1:01:01');
  });

  it('should displays hints used counter', () => {
    const wrapper = mount(GameInfo, {
      props: {
        timeElapsed: 0,
        hintsUsed: 3,
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.text()).toContain('3/10');
  });

  it('should updates time when prop changes', async () => {
    const wrapper = mount(GameInfo, {
      props: {
        timeElapsed: 60,
        hintsUsed: 0,
        currentDifficulty: 'intermediate',
      },
    });
    expect(wrapper.text()).toContain('1:00');

    await wrapper.setProps({ timeElapsed: 120 });
    expect(wrapper.text()).toContain('2:00');
  });
});
