import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  addLeaderboardEntry,
  getAllRecords,
  getTopRecords,
  clearLeaderboard,
} from './leaderboard';

describe('leaderboard.ts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add a leaderboard entry', () => {
    addLeaderboardEntry(500, 'beginner', 120, 'Alice');

    const records = getAllRecords();
    expect(records.length).toBe(1);
    expect(records[0].score).toBe(500);
    expect(records[0].playerName).toBe('Alice');
    expect(records[0].difficulty).toBe('beginner');
  });

  it('should keep only top 3 per difficulty', () => {
    addLeaderboardEntry(100, 'beginner', 60, 'Player1');
    addLeaderboardEntry(200, 'beginner', 65, 'Player2');
    addLeaderboardEntry(300, 'beginner', 70, 'Player3');
    addLeaderboardEntry(250, 'beginner', 75, 'Player4');

    const topRecords = getTopRecords('beginner');
    expect(topRecords.length).toBe(3);
    expect(topRecords[0].score).toBe(300);
    expect(topRecords[1].score).toBe(250);
    expect(topRecords[2].score).toBe(200);
  });

  it('should sort records by score descending within difficulty', () => {
    addLeaderboardEntry(100, 'beginner', 60, 'Player1');
    addLeaderboardEntry(500, 'beginner', 65, 'Player2');
    addLeaderboardEntry(300, 'beginner', 70, 'Player3');

    const topRecords = getTopRecords('beginner');
    expect(topRecords[0].score).toBe(500);
    expect(topRecords[1].score).toBe(300);
    expect(topRecords[2].score).toBe(100);
  });

  it('should keep top 3 for each difficulty separately', () => {
    // Beginner records
    addLeaderboardEntry(100, 'beginner', 60, 'Alice');
    addLeaderboardEntry(200, 'beginner', 65, 'Bob');
    addLeaderboardEntry(300, 'beginner', 70, 'Charlie');

    // Intermediate records
    addLeaderboardEntry(400, 'intermediate', 80, 'Dave');
    addLeaderboardEntry(500, 'intermediate', 85, 'Eve');

    const beginnerRecords = getTopRecords('beginner');
    const intermediateRecords = getTopRecords('intermediate');

    expect(beginnerRecords.length).toBe(3);
    expect(intermediateRecords.length).toBe(2);
  });

  it('should clear all leaderboard records', () => {
    addLeaderboardEntry(500, 'beginner', 120, 'Alice');
    expect(getAllRecords().length).toBe(1);

    clearLeaderboard();
    expect(getAllRecords().length).toBe(0);
  });

  it('should return empty array when no records exist', () => {
    const records = getAllRecords();
    expect(records).toEqual([]);
  });

  it('should handle default player name "You"', () => {
    addLeaderboardEntry(300, 'intermediate', 90);

    const records = getAllRecords();
    expect(records[0].playerName).toBe('You');
  });
});
