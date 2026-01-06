import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SudokuCell from './SudokuCell.vue';
import type { SudokuCell as SudokuCellType } from '@/types/sudoku';

describe('SudokuCell.vue', () => {
  const createMockCell = (
    overrides?: Partial<SudokuCellType>,
  ): SudokuCellType => ({
    value: 0,
    isOriginal: false,
    isSelected: false,
    hasError: false,
    ...overrides,
  });

  it('renders the component', () => {
    const cell = createMockCell();
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: false,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the cell value', () => {
    const cell = createMockCell({ value: 5 });
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: false,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.text()).toContain('5');
  });

  it('does not display value when cell is empty', () => {
    const cell = createMockCell({ value: 0 });
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: false,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.text()).not.toContain('5');
  });

  it('emits select event on click', async () => {
    const cell = createMockCell();
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: false,
        rowIndex: 2,
        colIndex: 3,
      },
    });
    await wrapper.trigger('click');
    const selectEmitted = wrapper.emitted('select');
    expect(selectEmitted).toBeTruthy();
    expect(selectEmitted![0]).toEqual([2, 3]);
  });

  it('applies error styling when hasError is true', () => {
    const cell = createMockCell({ hasError: true });
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: false,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.classes()).toContain('bg-red-100');
  });

  it('should apply original cell styling when isOriginal is true', () => {
    const cell = createMockCell({ isOriginal: true, value: 5 });
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: false,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.classes()).toContain('bg-gray-100');
  });

  it('should applies highlight styling when isSelected is true', () => {
    const cell = createMockCell();
    const wrapper = mount(SudokuCell, {
      props: {
        cell,
        isSelected: true,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.classes('ring-2')).toBe(true);
  });

  it('should applies thick border for box boundaries', () => {
    // Test row 0 (top border should be thick)
    const wrapper = mount(SudokuCell, {
      props: {
        cell: createMockCell(),
        isSelected: false,
        rowIndex: 0,
        colIndex: 0,
      },
    });
    expect(wrapper.classes('border-t-4')).toBe(true);

    // Test row 8 (bottom border should be thick)
    const wrapper2 = mount(SudokuCell, {
      props: {
        cell: createMockCell(),
        isSelected: false,
        rowIndex: 8,
        colIndex: 0,
      },
    });
    expect(wrapper2.classes('border-b-4')).toBe(true);
  });
});
