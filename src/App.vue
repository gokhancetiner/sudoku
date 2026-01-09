<template>
  <div
    class="min-h-screen bg-gradient-to-br from-sudoku-light to-gray-50 py-8 px-4"
  >
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Sudoku</h1>
      </header>

      <!-- Game Component -->
      <SudokuGame />
    </div>
  </div>
</template>

<script setup lang="ts">
import SudokuGame from './components/SudokuGame.vue';
</script>

<style scoped></style>
