import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GameInfo from './GameInfo.vue';
import { useGameStore } from '@/stores/gameStore';

describe('GameInfo.vue', () => {
  beforeEach(() => {
    const store = useGameStore();
    store.gameState.timeElapsed = 0;
    store.gameState.hintsUsed = 0;
    store.gameState.difficulty = 'intermediate';
  });

  it('should formats time correctly (MM:SS)', () => {
    const store = useGameStore();
    store.gameState.timeElapsed = 90;
    const wrapper = mount(GameInfo);
    expect(wrapper.text()).toContain('1:30');
  });

  it('should formats time correctly (HH:MM:SS)', () => {
    const store = useGameStore();
    store.gameState.timeElapsed = 3661;
    const wrapper = mount(GameInfo);
    expect(wrapper.text()).toContain('1:01:01');
  });

  it('should displays hints used counter', () => {
    const store = useGameStore();
    store.gameState.hintsUsed = 3;
    const wrapper = mount(GameInfo);
    expect(wrapper.text()).toContain('3/10');
  });

  it('should updates time when store changes', async () => {
    const store = useGameStore();
    store.gameState.timeElapsed = 60;
    const wrapper = mount(GameInfo);
    expect(wrapper.text()).toContain('1:00');

    store.gameState.timeElapsed = 120;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('2:00');
  });
});
