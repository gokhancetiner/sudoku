export type Difficulty = 'beginner' | 'intermediate' | 'hard' | 'expert';

export interface SudokuCell {
  value: number;
  isOriginal: boolean;
  isSelected: boolean;
  hasError: boolean;
}

export interface GameState {
  puzzle: number[][];
  solution: number[][];
  userGrid: SudokuCell[][];
  difficulty: Difficulty;
  score: number;
  hintsUsed: number;
  timeElapsed: number;
  isGameOver: boolean;
  errorsCount: number;
}
