import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

describe('App.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the Sudoku title', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Sudoku');
  });

  it('displays the subtitle', () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain('Vue 3 + TypeScript + TailwindCSS');
  });
});
