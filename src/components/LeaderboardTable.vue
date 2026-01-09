<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-6">🏆 Leaderboard</h3>

    <!-- Leaderboards for all difficulties with records -->
    <div class="space-y-8">
      <div
        v-for="diff in difficultiesWithRecords"
        :key="diff"
        class="pb-6 border-b border-gray-200 last:border-b-0"
      >
        <!-- Difficulty Title -->
        <h4 class="text-md font-semibold text-sudoku-highlight mb-3">
          {{ getDifficultyEmoji(diff) }} {{ capitalizeFirstLetter(diff) }}
        </h4>

        <!-- Leaderboard Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-300">
                <th class="text-left py-2 px-2">Rank</th>
                <th class="text-left py-2 px-2">Player</th>
                <th class="text-right py-2 px-2">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, index) in getTopRecords(diff)"
                :key="`${record.difficulty}-${index}`"
                class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td class="py-3 px-2">
                  <span class="text-lg font-bold text-sudoku-highlight">
                    {{ getMedalIcon(index) }} {{ index + 1 }}
                  </span>
                </td>
                <td class="py-3 px-2 font-medium">{{ record.playerName }}</td>
                <td
                  class="py-3 px-2 text-right font-bold text-sudoku-highlight"
                >
                  {{ record.score }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-if="difficulties.every((diff) => getTopRecords(diff).length === 0)"
        class="text-center text-gray-500 py-8"
      >
        No records yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import type { Difficulty } from '@/types/sudoku';

const store = useGameStore();

const difficulties: Difficulty[] = [
  'beginner',
  'intermediate',
  'hard',
  'expert',
];

// Get records from store (automatically reactive)
const difficultiesWithRecords = computed(() => {
  return difficulties.filter(
    (diff) => store.getTopRecordsForDifficulty(diff).length > 0,
  );
});

// Helper to get top records for difficulty
const getTopRecords = (difficulty: Difficulty) => {
  return store.getTopRecordsForDifficulty(difficulty);
};

const getMedalIcon = (index: number): string => {
  const medals = ['🥇', '🥈', '🥉'];
  return medals[index] || '';
};

const getDifficultyEmoji = (difficulty: Difficulty): string => {
  const emojis: Record<Difficulty, string> = {
    beginner: '🟢',
    intermediate: '🟡',
    hard: '🟠',
    expert: '🔴',
  };
  return emojis[difficulty];
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>
