import type { SudokuCell } from '@/types/sudoku';

const POINTS_PER_CELL = 5;
const FIRST_HINT_PENALTY = 3;

export const calculateBaseScore = (
  userGrid: SudokuCell[][],
  solution: number[][],
): number => {
  let correctCount = 0;

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (
        userGrid[i][j].value === solution[i][j] &&
        !userGrid[i][j].isOriginal
      ) {
        correctCount++;
      }
    }
  }

  return correctCount * POINTS_PER_CELL;
};

export const calculateHintPenalty = (hintsUsed: number): number => {
  let totalPenalty = 0;

  for (let i = 0; i < hintsUsed; i++) {
    totalPenalty += FIRST_HINT_PENALTY + i;
  }

  return totalPenalty;
};

export const calculateFinalScore = (
  userGrid: SudokuCell[][],
  solution: number[][],
  hintsUsed: number,
  errorsCount: number,
): number => {
  const baseScore = calculateBaseScore(userGrid, solution);
  const hintPenalty = calculateHintPenalty(hintsUsed);
  const finalScore = baseScore - hintPenalty - errorsCount;

  return Math.max(0, finalScore);
};

export const getScoreBreakdown = (
  userGrid: SudokuCell[][],
  solution: number[][],
  hintsUsed: number,
  errorsCount: number,
) => {
  const baseScore = calculateBaseScore(userGrid, solution);
  const hintPenalty = calculateHintPenalty(hintsUsed);

  const finalScore = calculateFinalScore(
    userGrid,
    solution,
    hintsUsed,
    errorsCount,
  );

  return {
    baseScore,
    hintPenalty,
    errorPenalty: errorsCount,
    finalScore,
  };
};
