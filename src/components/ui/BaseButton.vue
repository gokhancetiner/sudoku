<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[buttonClasses, sizeClasses, variantClasses, stateClasses]"
    :title="title"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'pill'
  | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
  label?: string;
  title?: string;
  fullWidth?: boolean;
  class?: string;
}

interface Emits {
  (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  fullWidth: false,
});

defineEmits<Emits>();

// Base button classes
const buttonClasses = computed(() => [
  'font-medium transition-all duration-200 rounded-lg whitespace-nowrap',
  props.fullWidth ? 'w-full' : '',
  props.class || '',
]);

// Size variants
const sizeClasses = computed(() => {
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  return sizes[props.size];
});

// Visual variants
const variantClasses = computed(() => {
  const variants: Record<ButtonVariant, Record<string, string>> = {
    primary: {
      enabled: 'bg-sudoku-highlight hover:bg-blue-700 text-white',
      disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed',
    },
    secondary: {
      enabled: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
    },
    outline: {
      enabled:
        'border-2 border-sudoku-highlight text-sudoku-highlight hover:bg-blue-50',
      disabled: 'border-2 border-gray-300 text-gray-400 cursor-not-allowed',
    },
    danger: {
      enabled: 'bg-red-500 hover:bg-red-600 text-white',
      disabled: 'bg-red-300 text-red-100 cursor-not-allowed',
    },
    pill: {
      enabled:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-4 py-1',
      disabled:
        'bg-gray-100 text-gray-400 cursor-not-allowed rounded-full px-4 py-1',
    },
    icon: {
      enabled: 'bg-blue-100 text-blue-700 hover:bg-blue-200 p-2',
      disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed p-2',
    },
  };

  const state = props.disabled ? 'disabled' : 'enabled';
  return variants[props.variant][state];
});

// State-specific classes
const stateClasses = computed(() => {
  if (props.disabled) {
    return 'opacity-60 cursor-not-allowed';
  }
  return '';
});
</script>

<style scoped>
button:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}
</style>
