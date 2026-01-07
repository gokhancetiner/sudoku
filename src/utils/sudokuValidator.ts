import { isValidMove } from './sudokuSolver';
import type { SudokuCell } from '@/types/sudoku';

function getConflictingCells(
  userGrid: SudokuCell[][],
  row: number,
  col: number,
  value: number,
): Array<[number, number]> {
  const conflicts: Array<[number, number]> = [];

  // Check row for conflicting cells
  for (let j = 0; j < 9; j++) {
    if (j !== col && userGrid[row][j].value === value) {
      conflicts.push([row, j]);
    }
  }

  // Check column for conflicting cells
  for (let i = 0; i < 9; i++) {
    if (i !== row && userGrid[i][col].value === value) {
      conflicts.push([i, col]);
    }
  }

  // Check 3x3 box for conflicting cells
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && userGrid[i][j].value === value) {
        // Avoid duplicates (cell could appear in both row and box, or column and box)
        if (!conflicts.some(([r, c]) => r === i && c === j)) {
          conflicts.push([i, j]);
        }
      }
    }
  }

  return conflicts;
}

export function isValidUserInput(
  userGrid: SudokuCell[][],
  row: number,
  col: number,
  value: number,
): boolean {
  if (value < 1 || value > 9) return false;

  const numberGrid = userGrid.map((r) => r.map((c) => c.value));
  return isValidMove(numberGrid, row, col, value);
}

export function placeNumber(
  userGrid: SudokuCell[][],
  row: number,
  col: number,
  value: number,
): boolean {
  const conflictingCells = getConflictingCells(userGrid, row, col, value);
  if (conflictingCells.length > 0) {
    userGrid[row][col].value = value;
    userGrid[row][col].hasError = true;
    conflictingCells.forEach(([r, c]) => {
      userGrid[r][c].hasError = true;
    });
    return false;
  }

  userGrid[row][col].value = value;
  userGrid[row][col].hasError = false;

  clearAllErrors(userGrid);
  return true;
}

export function clearCell(
  userGrid: SudokuCell[][],
  row: number,
  col: number,
): void {
  userGrid[row][col].value = 0;
  clearAllErrors(userGrid);
}

function clearAllErrors(userGrid: SudokuCell[][]): void {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      userGrid[i][j].hasError = false;
    }
  }
}

export function isSolutionCorrect(
  userGrid: SudokuCell[][],
  solution: number[][],
): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (userGrid[i][j].value !== solution[i][j]) {
        return false;
      }
    }
  }
  return true;
}
