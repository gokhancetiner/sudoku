import { solveSudoku } from './sudokuSolver';

export type Difficulty = 'beginner' | 'intermediate' | 'hard' | 'expert';

interface DifficultyConfig {
  minVisible: number;
  maxVisible: number;
}

const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  beginner: { minVisible: 36, maxVisible: 40 },
  intermediate: { minVisible: 32, maxVisible: 36 },
  hard: { minVisible: 28, maxVisible: 32 },
  expert: { minVisible: 24, maxVisible: 28 },
};

export function createEmptyGrid(): number[][] {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
}

export function generateCompleteSudoku(): number[][] {
  const grid: number[][] = createEmptyGrid();

  const shuffle = (): number[] => {
    const shuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  for (let box = 0; box < 3; box++) {
    const nums = shuffle();
    let idx = 0;
    for (let r = box * 3; r < box * 3 + 3; r++) {
      for (let c = box * 3; c < box * 3 + 3; c++) {
        grid[r][c] = nums[idx++];
      }
    }
  }

  solveSudoku(grid);
  return grid;
}

function removeCells(
  grid: number[][],
  cellsToRemove: number,
): { puzzle: number[][]; solution: number[][] } {
  const puzzle = grid.map((row) => [...row]);
  const solution = grid.map((row) => [...row]);
  let removed = 0;

  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return { puzzle, solution };
}

export function generatePuzzle(difficulty: Difficulty = 'intermediate'): {
  puzzle: number[][];
  solution: number[][];
} {
  const config = DIFFICULTY_MAP[difficulty];
  const visibleCells =
    Math.floor(Math.random() * (config.maxVisible - config.minVisible + 1)) +
    config.minVisible;
  const cellsToRemove = 81 - visibleCells;

  const completeSudoku = generateCompleteSudoku();
  return removeCells(completeSudoku, cellsToRemove);
}

export function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}
