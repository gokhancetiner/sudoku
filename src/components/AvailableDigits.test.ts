import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AvailableDigits from './AvailableDigits.vue';

describe('AvailableDigits.vue', () => {
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

  it('should renders the component', () => {
    const wrapper = mount(AvailableDigits, {
      props: {
        userGrid: createEmptyGrid(),
        solution: createSolutionGrid(),
      },
    });
    for (let i = 1; i <= 9; i++) {
      expect(wrapper.text()).toContain(String(i));
    }
    expect(wrapper.text()).toContain('0/9 digits completed');
    expect(wrapper.text()).toContain('Available Digits');
  });

  it('should emit select-digit event when available digit is clicked', async () => {
    const wrapper = mount(AvailableDigits, {
      props: {
        userGrid: createEmptyGrid(),
        solution: createSolutionGrid(),
      },
    });
    const buttons = wrapper.findAll('button');
    await buttons[4].trigger('click');

    expect(wrapper.emitted('select-digit')).toBeTruthy();
    expect(wrapper.emitted('select-digit')?.[0]).toEqual([5]);
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

    const wrapper = mount(AvailableDigits, {
      props: {
        userGrid,
        solution,
      },
    });
    const buttons = wrapper.findAll('button');
    const button1 = buttons[0];
    expect(button1.attributes('disabled')).toBeDefined();

    await button1.trigger('click');
    expect(wrapper.emitted('select-digit')).toBeFalsy();
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

    const wrapper = mount(AvailableDigits, {
      props: {
        userGrid,
        solution,
      },
    });

    expect(wrapper.text()).toContain('2/9 digits completed');
  });

  it('shows "9/9 digits completed" when puzzle is fully solved', async () => {
    const userGrid = createSolutionGrid();
    const solution = createSolutionGrid();

    const wrapper = mount(AvailableDigits, {
      props: {
        userGrid,
        solution,
      },
    });
    expect(wrapper.text()).toContain('9/9 digits completed');
  });

  it('should handle multiple digit selections correctly', async () => {
    const wrapper = mount(AvailableDigits, {
      props: {
        userGrid: createEmptyGrid(),
        solution: createSolutionGrid(),
      },
    });

    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click'); // Digit 1
    await buttons[2].trigger('click'); // Digit 3
    await buttons[5].trigger('click'); // Digit 6

    const emitted = wrapper.emitted('select-digit');
    expect(emitted).toHaveLength(3);
    expect(emitted?.[0]).toEqual([1]);
    expect(emitted?.[1]).toEqual([3]);
    expect(emitted?.[2]).toEqual([6]);
  });
});
