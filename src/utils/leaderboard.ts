import type { Difficulty } from '@/types/sudoku';

export interface LeaderboardEntry {
  score: number;
  playerName: string;
  difficulty: Difficulty;
}

const LEADERBOARD_KEY = 'sudoku-leaderboard';
const MAX_ENTRIES_PER_DIFFICULTY = 3;

export function addLeaderboardEntry(
  score: number,
  difficulty: Difficulty,
  time: number,
  playerName: string = 'You',
): void {
  try {
    const records = getAllRecords();

    records.push({
      score,
      playerName,
      difficulty,
    });

    const filtered = filterTopPerDifficulty(records);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to add leaderboard entry:', error);
  }
}

export function getAllRecords(): LeaderboardEntry[] {
  try {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (!saved) return [];
    return JSON.parse(saved) as LeaderboardEntry[];
  } catch (error) {
    console.error('Failed to load leaderboard records:', error);
    return [];
  }
}

export function getTopRecords(difficulty: Difficulty): LeaderboardEntry[] {
  const records = getAllRecords();
  return records
    .filter((r) => r.difficulty === difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES_PER_DIFFICULTY);
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (error) {
    console.error('Failed to clear leaderboard:', error);
  }
}

function filterTopPerDifficulty(
  records: LeaderboardEntry[],
): LeaderboardEntry[] {
  const difficulties: Difficulty[] = [
    'beginner',
    'intermediate',
    'hard',
    'expert',
  ];
  const filtered: LeaderboardEntry[] = [];

  difficulties.forEach((diff) => {
    const diffRecords = records
      .filter((r) => r.difficulty === diff)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES_PER_DIFFICULTY);

    filtered.push(...diffRecords);
  });

  return filtered;
}
