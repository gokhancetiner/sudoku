import { describe, it, expect } from 'vitest';
import {
  calculateBaseScore,
  calculateHintPenalty,
  calculateFinalScore,
  getScoreBreakdown,
} from './scoringSystem';
import type { SudokuCell } from '@/types/sudoku';

const createCell = (value: number): SudokuCell => ({
  value,
  isOriginal: false,
  isSelected: false,
  hasError: false,
});

const createFullGrid = (value: number): SudokuCell[][] =>
  Array(9)
    .fill(null)
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => createCell(value)),
    );

const createSolutionGrid = (): number[][] =>
  Array(9)
    .fill(null)
    .map((_, i) =>
      Array(9)
        .fill(null)
        .map((_, j) => ((i * 3 + Math.floor(j / 3)) % 9) + 1),
    );

describe('Scoring System', () => {
  describe('calculateBaseScore', () => {
    it('should return 5 points per correctly placed number', () => {
      const userGrid = createFullGrid(0);
      const solution = createSolutionGrid();

      // Place 5 correct numbers
      for (let i = 0; i < 5; i++) {
        userGrid[i][0].value = solution[i][0];
      }

      expect(calculateBaseScore(userGrid, solution)).toBe(25);
    });

    it('should return 405 points for complete correct grid', () => {
      const userGrid = createFullGrid(0);
      const solution = createSolutionGrid();

      // Copy solution to user grid
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          userGrid[i][j].value = solution[i][j];
        }
      }

      // 81 cells * 5 points = 405
      expect(calculateBaseScore(userGrid, solution)).toBe(405);
    });
  });

  describe('calculateHintPenalty', () => {
    it('should return 0 for no hints used', () => {
      expect(calculateHintPenalty(0)).toBe(0);
    });

    it('should return 3 for first hint', () => {
      expect(calculateHintPenalty(1)).toBe(3);
    });

    it('should return 7 for two hints (3 + 4)', () => {
      expect(calculateHintPenalty(2)).toBe(7);
    });

    it('should return 12 for three hints (3 + 4 + 5)', () => {
      expect(calculateHintPenalty(3)).toBe(12);
    });

    it('should calculate increasing hint penalties correctly', () => {
      expect(calculateHintPenalty(5)).toBe(25);
    });
  });

  describe('calculateFinalScore', () => {
    it('should calculate correct final score', () => {
      const userGrid = createFullGrid(0);
      const solution = createSolutionGrid();

      // Place all correct numbers
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          userGrid[i][j].value = solution[i][j];
        }
      }

      // 405 (base) - 7 (2 hints) - 2 (errors) = 396
      const score = calculateFinalScore(userGrid, solution, 2, 2);
      expect(score).toBe(396);
    });

    it('should handle partial completion', () => {
      const userGrid = createFullGrid(0);
      const solution = createSolutionGrid();

      for (let i = 0; i < 40; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        userGrid[row][col].value = solution[row][col];
      }

      const score = calculateFinalScore(userGrid, solution, 3, 5);
      expect(score).toBe(183);
    });
  });

  describe('getScoreBreakdown', () => {
    it('should return all score components', () => {
      const userGrid = createFullGrid(0);
      const solution = createSolutionGrid();

      // Place all correct numbers
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          userGrid[i][j].value = solution[i][j];
        }
      }

      const breakdown = getScoreBreakdown(userGrid, solution, 2, 3);

      expect(breakdown).toHaveProperty('baseScore');
      expect(breakdown).toHaveProperty('hintPenalty');
      expect(breakdown).toHaveProperty('errorPenalty');
      expect(breakdown).toHaveProperty('finalScore');

      expect(breakdown.baseScore).toBe(405);
      expect(breakdown.hintPenalty).toBe(7);
      expect(breakdown.errorPenalty).toBe(3);
      expect(breakdown.finalScore).toBe(395);
    });
  });
});
