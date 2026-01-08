import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GameInfo from './GameInfo.vue';

describe('GameInfo.vue', () => {
  it('should renders the component', () => {
    const wrapper = mount(GameInfo, {
      props: {
        score: 0,
        timeElapsed: 0,
        hintsUsed: 0,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should formats time correctly (MM:SS)', () => {
    const wrapper = mount(GameInfo, {
      props: {
        score: 0,
        timeElapsed: 90, // 1 minute 30 seconds
        hintsUsed: 0,
      },
    });
    expect(wrapper.text()).toContain('1:30');
  });

  it('should formats time correctly (HH:MM:SS)', () => {
    const wrapper = mount(GameInfo, {
      props: {
        score: 0,
        timeElapsed: 3661, // 1 hour 1 minute 1 second
        hintsUsed: 0,
      },
    });
    expect(wrapper.text()).toContain('1:01:01');
  });

  it('should displays hints used counter', () => {
    const wrapper = mount(GameInfo, {
      props: {
        score: 0,
        timeElapsed: 0,
        hintsUsed: 3,
      },
    });
    expect(wrapper.text()).toContain('3/10');
  });

  it('should shows "Game Info" heading', () => {
    const wrapper = mount(GameInfo, {
      props: {
        score: 0,
        timeElapsed: 0,
        hintsUsed: 0,
      },
    });
    expect(wrapper.text()).toContain('Game Info');
  });

  it('should updates time when prop changes', async () => {
    const wrapper = mount(GameInfo, {
      props: {
        score: 0,
        timeElapsed: 60,
        hintsUsed: 0,
      },
    });
    expect(wrapper.text()).toContain('1:00');

    await wrapper.setProps({ timeElapsed: 120 });
    expect(wrapper.text()).toContain('2:00');
  });
});
