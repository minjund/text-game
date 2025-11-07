<template>
  <div :class="cardClasses" @click="handleClick">
    <div v-if="title" class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <slot name="header-actions" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  hoverable?: boolean
  clickable?: boolean
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false,
  clickable: false,
  selected: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => [
  'game-card',
  `card-${props.variant}`,
  {
    'card-hoverable': props.hoverable,
    'card-clickable': props.clickable,
    'card-selected': props.selected,
    'card-disabled': props.disabled
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.game-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(148, 163, 184, 0.1);
  transition: all 0.3s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: 'Cinzel', serif;
  margin: 0;
}

.card-body {
  color: #cbd5e1;
}

.card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

/* Variants */
.card-primary {
  border-color: rgba(139, 92, 246, 0.3);
}

.card-success {
  border-color: rgba(16, 185, 129, 0.3);
}

.card-warning {
  border-color: rgba(245, 158, 11, 0.3);
}

.card-danger {
  border-color: rgba(239, 68, 68, 0.3);
}

.card-info {
  border-color: rgba(59, 130, 246, 0.3);
}

/* States */
.card-hoverable:hover {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
}

.card-clickable {
  cursor: pointer;
}

.card-selected {
  border-color: rgba(139, 92, 246, 0.8);
  box-shadow:
    0 12px 40px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.card-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
