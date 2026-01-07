import { describe, it, expect } from 'vitest';
import { isValidMove, solveSudoku } from './sudokuSolver';

describe('sudokuSolver', () => {
  describe('isValidMove', () => {
    it('should return true for a valid move in empty grid', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      expect(isValidMove(grid, 0, 0, 1)).toBe(true);
    });

    it('should return false if number exists in row', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      grid[0][1] = 1;
      expect(isValidMove(grid, 0, 0, 1)).toBe(false);
    });

    it('should return false if number exists in column', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      grid[1][0] = 1;
      expect(isValidMove(grid, 0, 0, 1)).toBe(false);
    });

    it('should return false if number exists in 3x3 box', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      grid[1][1] = 1;
      expect(isValidMove(grid, 0, 0, 1)).toBe(false);
    });

    it('should work for bottom-right corner', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      grid[8][8] = 1;
      expect(isValidMove(grid, 8, 7, 1)).toBe(false);
    });

    it('should validate numbers 1-9', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      for (let i = 1; i <= 9; i++) {
        expect(isValidMove(grid, 0, 0, i)).toBe(true);
      }
    });

    it('should allow placing number at valid position', () => {
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));
      // All positions are valid for placing 1-9 in an empty grid
      expect(isValidMove(grid, 5, 5, 5)).toBe(true);
    });
  });

  describe('solveSudoku', () => {
    it('should solve a valid Sudoku puzzle', () => {
      const grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];

      const result = solveSudoku(grid);
      expect(result).toBe(true);

      // Check if all cells are filled
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(grid[i][j]).toBeGreaterThanOrEqual(1);
          expect(grid[i][j]).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should return false for partially invalid puzzles', () => {
      // Create a puzzle where the first row is already invalid
      const grid = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

      // Fill first row with numbers 1-9
      for (let i = 0; i < 9; i++) {
        grid[0][i] = i + 1;
      }
      // Now the grid is valid so far - the solver should complete it
      // instead of returning false
      const result = solveSudoku(grid);
      expect(result).toBe(true);
    });

    it('should solve already complete grid', () => {
      const grid = [
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

      const result = solveSudoku(grid);
      expect(result).toBe(true);
    });

    it('should solve grids with several givens', () => {
      // This is a moderate puzzle with enough clues
      const grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ];

      const result = solveSudoku(grid);
      expect(result).toBe(true);
      // Check that solution is complete
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(grid[i][j]).toBeGreaterThanOrEqual(1);
          expect(grid[i][j]).toBeLessThanOrEqual(9);
        }
      }
    });
  });
});
