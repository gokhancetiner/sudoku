import { ref, computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import {
  createHistory,
  pushToHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  type HistoryState,
} from '@/utils/historyManager';

export function useGameHistory() {
  const store = useGameStore();
  const gameHistory = ref<HistoryState | null>(null);

  const canUndoMove = computed(() => {
    return gameHistory.value && canUndo(gameHistory.value);
  });

  const canRedoMove = computed(() => {
    return gameHistory.value && canRedo(gameHistory.value);
  });

  const initializeHistory = (initialState: typeof store.gameState): void => {
    gameHistory.value = createHistory(initialState);
  };

  const pushMoveToHistory = (): void => {
    if (gameHistory.value) {
      gameHistory.value = pushToHistory(gameHistory.value, store.gameState);
    }
  };

  const handleUndo = (): void => {
    if (!gameHistory.value || !canUndo(gameHistory.value)) return;
    const undoResult = undo(gameHistory.value);
    gameHistory.value = undoResult.history;
    if (undoResult.state) {
      store.gameState = undoResult.state;
    }
  };

  const handleRedo = (): void => {
    if (!gameHistory.value || !canRedo(gameHistory.value)) return;
    const redoResult = redo(gameHistory.value);
    gameHistory.value = redoResult.history;
    if (redoResult.state) {
      store.gameState = redoResult.state;
    }
  };

  return {
    gameHistory,
    canUndoMove,
    canRedoMove,
    initializeHistory,
    pushMoveToHistory,
    handleUndo,
    handleRedo,
  };
}
