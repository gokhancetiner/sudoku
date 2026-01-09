import type { SudokuCell } from '@/types/sudoku';

export interface CompletionStatus {
  completedRows: Set<number>;
  completedCols: Set<number>;
  completedBoxes: Set<number>;
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function isRowComplete(
  grid: SudokuCell[][],
  row: number,
  solution: number[][],
): boolean {
  for (let col = 0; col < 9; col++) {
    const cell = grid[row][col];
    // Cell must be filled AND must match solution
    if (cell.value === 0 || cell.value !== solution[row][col]) {
      return false;
    }
  }
  return true;
}

function isColComplete(
  grid: SudokuCell[][],
  col: number,
  solution: number[][],
): boolean {
  for (let row = 0; row < 9; row++) {
    const cell = grid[row][col];
    // Cell must be filled AND must match solution
    if (cell.value === 0 || cell.value !== solution[row][col]) {
      return false;
    }
  }
  return true;
}

function isBoxComplete(
  grid: SudokuCell[][],
  boxIndex: number,
  solution: number[][],
): boolean {
  const startRow = Math.floor(boxIndex / 3) * 3;
  const startCol = (boxIndex % 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      const cell = grid[r][c];
      // Cell must be filled AND must match solution
      if (cell.value === 0 || cell.value !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Detect completed rows, columns, and boxes with validation against solution
 * Animation only triggers when a section is completely filled AND correct
 * @param grid - Current user grid
 * @param solution - Solution grid for validation
 * @returns CompletionStatus with validated completions
 */
export function detectCompletions(
  grid: SudokuCell[][],
  solution: number[][],
): CompletionStatus {
  const completedRows = new Set<number>();
  const completedCols = new Set<number>();
  const completedBoxes = new Set<number>();

  for (let row = 0; row < 9; row++) {
    if (isRowComplete(grid, row, solution)) {
      completedRows.add(row);
    }
  }

  for (let col = 0; col < 9; col++) {
    if (isColComplete(grid, col, solution)) {
      completedCols.add(col);
    }
  }

  for (let box = 0; box < 9; box++) {
    if (isBoxComplete(grid, box, solution)) {
      completedBoxes.add(box);
    }
  }

  return {
    completedRows,
    completedCols,
    completedBoxes,
  };
}
