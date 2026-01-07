import { describe, it, expect } from 'vitest';
import {
  generatePuzzle,
  createEmptyGrid,
  generateCompleteSudoku,
} from './puzzleGenerator';
import { solveSudoku } from './sudokuSolver';

describe('puzzleGenerator', () => {
  describe('createEmptyGrid', () => {
    it('should create 9x9 grid', () => {
      const grid = createEmptyGrid();
      expect(grid.length).toBe(9);
      expect(grid[0].length).toBe(9);
    });

    it('should fill grid with zeros', () => {
      const grid = createEmptyGrid();
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(grid[i][j]).toBe(0);
        }
      }
    });

    it('should be independent grids', () => {
      const grid1 = createEmptyGrid();
      const grid2 = createEmptyGrid();
      grid1[0][0] = 5;
      expect(grid2[0][0]).toBe(0);
    });
  });

  describe('generateCompleteSudoku', () => {
    it('should generate a valid complete Sudoku', () => {
      const grid = generateCompleteSudoku();

      // Check no empty cells
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(grid[i][j]).toBeGreaterThanOrEqual(1);
          expect(grid[i][j]).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should generate unique grids', () => {
      const grid1 = generateCompleteSudoku();
      const grid2 = generateCompleteSudoku();

      let isDifferent = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid1[i][j] !== grid2[i][j]) {
            isDifferent = true;
            break;
          }
        }
        if (isDifferent) break;
      }

      expect(isDifferent).toBe(true);
    });

    it('generated grid should be solvable', () => {
      const grid = generateCompleteSudoku();

      // Check all cells are filled
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(grid[i][j]).not.toBe(0);
        }
      }
    });

    it('should satisfy Sudoku constraints', () => {
      const grid = generateCompleteSudoku();

      // Check rows
      for (let i = 0; i < 9; i++) {
        const seen = new Set();
        for (let j = 0; j < 9; j++) {
          expect(seen.has(grid[i][j])).toBe(false);
          seen.add(grid[i][j]);
        }
      }

      // Check columns
      for (let j = 0; j < 9; j++) {
        const seen = new Set();
        for (let i = 0; i < 9; i++) {
          expect(seen.has(grid[i][j])).toBe(false);
          seen.add(grid[i][j]);
        }
      }

      // Check 3x3 boxes
      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const seen = new Set();
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const row = boxRow * 3 + i;
              const col = boxCol * 3 + j;
              expect(seen.has(grid[row][col])).toBe(false);
              seen.add(grid[row][col]);
            }
          }
        }
      }
    });
  });

  describe('generatePuzzle', () => {
    it('should generate beginner puzzle with correct difficulty', () => {
      const { puzzle } = generatePuzzle('beginner');

      const visibleCells = puzzle.flat().filter((cell) => cell !== 0).length;
      expect(visibleCells).toBeGreaterThanOrEqual(36);
      expect(visibleCells).toBeLessThanOrEqual(40);
    });

    it('should generate intermediate puzzle with correct difficulty', () => {
      const { puzzle } = generatePuzzle('intermediate');

      const visibleCells = puzzle.flat().filter((cell) => cell !== 0).length;
      expect(visibleCells).toBeGreaterThanOrEqual(32);
      expect(visibleCells).toBeLessThanOrEqual(36);
    });

    it('should generate hard puzzle with correct difficulty', () => {
      const { puzzle } = generatePuzzle('hard');

      const visibleCells = puzzle.flat().filter((cell) => cell !== 0).length;
      expect(visibleCells).toBeGreaterThanOrEqual(28);
      expect(visibleCells).toBeLessThanOrEqual(32);
    });

    it('should generate expert puzzle with correct difficulty', () => {
      const { puzzle } = generatePuzzle('expert');

      const visibleCells = puzzle.flat().filter((cell) => cell !== 0).length;
      expect(visibleCells).toBeGreaterThanOrEqual(24);
      expect(visibleCells).toBeLessThanOrEqual(28);
    });

    it('should generate solvable puzzle', () => {
      const { puzzle } = generatePuzzle('intermediate');

      const isSolvable = solveSudoku(puzzle);
      expect(isSolvable).toBe(true);
    });

    it('solution should match puzzle', () => {
      const { puzzle, solution } = generatePuzzle('intermediate');

      // Check all puzzle cells are in solution
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle[i][j] !== 0) {
            expect(solution[i][j]).toBe(puzzle[i][j]);
          }
        }
      }
    });

    it('should generate unique puzzles', () => {
      const puzzle1 = generatePuzzle('intermediate');
      const puzzle2 = generatePuzzle('intermediate');

      let isDifferent = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle1.puzzle[i][j] !== puzzle2.puzzle[i][j]) {
            isDifferent = true;
            break;
          }
        }
        if (isDifferent) break;
      }

      expect(isDifferent).toBe(true);
    });

    it('puzzle should have empty cells', () => {
      const { puzzle } = generatePuzzle('intermediate');

      let hasEmptyCells = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle[i][j] === 0) {
            hasEmptyCells = true;
            break;
          }
        }
        if (hasEmptyCells) break;
      }

      expect(hasEmptyCells).toBe(true);
    });

    it('solution should be complete', () => {
      const { solution } = generatePuzzle('intermediate');

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          expect(solution[i][j]).toBeGreaterThanOrEqual(1);
          expect(solution[i][j]).toBeLessThanOrEqual(9);
        }
      }
    });
  });
});
