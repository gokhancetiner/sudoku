import type { SudokuCell } from '@/types/sudoku';

export interface CompletionStatus {
  completedRows: Set<number>;
  completedCols: Set<number>;
  completedBoxes: Set<number>;
}

export function getBoxIndex(row: number, col: number): number {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function isRowComplete(grid: SudokuCell[][], row: number): boolean {
  return grid[row].every((cell) => cell.value !== 0);
}

function isColComplete(grid: SudokuCell[][], col: number): boolean {
  for (let row = 0; row < 9; row++) {
    if (grid[row][col].value === 0) return false;
  }
  return true;
}

function isBoxComplete(grid: SudokuCell[][], boxIndex: number): boolean {
  const startRow = Math.floor(boxIndex / 3) * 3;
  const startCol = (boxIndex % 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (grid[r][c].value === 0) return false;
    }
  }
  return true;
}

export function detectCompletions(grid: SudokuCell[][]): CompletionStatus {
  const completedRows = new Set<number>();
  const completedCols = new Set<number>();
  const completedBoxes = new Set<number>();

  for (let row = 0; row < 9; row++) {
    if (isRowComplete(grid, row)) {
      completedRows.add(row);
    }
  }

  for (let col = 0; col < 9; col++) {
    if (isColComplete(grid, col)) {
      completedCols.add(col);
    }
  }

  for (let box = 0; box < 9; box++) {
    if (isBoxComplete(grid, box)) {
      completedBoxes.add(box);
    }
  }

  return {
    completedRows,
    completedCols,
    completedBoxes,
  };
}
