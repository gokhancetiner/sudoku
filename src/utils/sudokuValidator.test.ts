import { describe, it, expect } from 'vitest';
import {
  isValidUserInput,
  placeNumber,
  clearCell,
  isSolutionCorrect,
} from './sudokuValidator';
import type { SudokuCell } from '@/types/sudoku';

// Helper to create empty grid
const createEmptyGrid = (): SudokuCell[][] => {
  return Array(9)
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
    );
};

describe('sudokuValidator', () => {
  describe('isValidUserInput', () => {
    it('should allow placing valid number in empty cell', () => {
      const grid = createEmptyGrid();
      expect(isValidUserInput(grid, 0, 0, 5)).toBe(true);
    });

    it('should reject duplicate in row', () => {
      const grid = createEmptyGrid();
      grid[0][1].value = 5;
      expect(isValidUserInput(grid, 0, 0, 5)).toBe(false);
    });

    it('should reject duplicate in column', () => {
      const grid = createEmptyGrid();
      grid[1][0].value = 5;
      expect(isValidUserInput(grid, 0, 0, 5)).toBe(false);
    });

    it('should reject duplicate in 3x3 box', () => {
      const grid = createEmptyGrid();
      grid[1][1].value = 5;
      expect(isValidUserInput(grid, 0, 0, 5)).toBe(false);
    });

    it('should reject invalid numbers', () => {
      const grid = createEmptyGrid();
      expect(isValidUserInput(grid, 0, 0, 0)).toBe(false);
      expect(isValidUserInput(grid, 0, 0, 10)).toBe(false);
      expect(isValidUserInput(grid, 0, 0, -1)).toBe(false);
    });

    it('should allow different numbers in same row', () => {
      const grid = createEmptyGrid();
      grid[0][1].value = 1;
      grid[0][2].value = 2;
      expect(isValidUserInput(grid, 0, 0, 3)).toBe(true);
    });
  });

  describe('placeNumber', () => {
    it('should place valid number without error', () => {
      const grid = createEmptyGrid();
      const result = placeNumber(grid, 0, 0, 5);
      expect(result).toBe(true);
      expect(grid[0][0].value).toBe(5);
      expect(grid[0][0].hasError).toBe(false);
    });

    it('should place invalid number with error flag', () => {
      const grid = createEmptyGrid();
      grid[0][1].value = 5;
      const result = placeNumber(grid, 0, 0, 5);
      expect(result).toBe(false);
      expect(grid[0][0].value).toBe(5);
      expect(grid[0][0].hasError).toBe(true);
    });

    it('should clear previous error when valid move made', () => {
      const grid = createEmptyGrid();
      grid[0][1].value = 5;
      placeNumber(grid, 0, 0, 5);
      expect(grid[0][0].hasError).toBe(true);
      placeNumber(grid, 0, 0, 3);
      expect(grid[0][0].hasError).toBe(false);
    });
  });

  describe('clearCell', () => {
    it('should clear cell value and error', () => {
      const grid = createEmptyGrid();
      grid[0][0].value = 5;
      grid[0][0].hasError = true;
      clearCell(grid, 0, 0);
      expect(grid[0][0].value).toBe(0);
      expect(grid[0][0].hasError).toBe(false);
    });
  });

  describe('isSolutionCorrect', () => {
    it('should return true for matching solution', () => {
      const solution = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
      ];

      const grid = createEmptyGrid();
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          grid[i][j].value = solution[i][j];
        }
      }

      expect(isSolutionCorrect(grid, solution)).toBe(true);
    });
  });
});
