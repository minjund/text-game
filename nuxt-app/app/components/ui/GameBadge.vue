<template>
  <span :class="badgeClasses">
    <span v-if="icon" class="badge-icon">{{ icon }}</span>
    <span class="badge-text"><slot /></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'rarity-common' | 'rarity-rare' | 'rarity-epic' | 'rarity-legendary'
  size?: 'small' | 'medium' | 'large'
  icon?: string
  outline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  outline: false
})

const badgeClasses = computed(() => [
  'game-badge',
  `badge-${props.variant}`,
  `badge-${props.size}`,
  {
    'badge-outline': props.outline
  }
])
</script>

<style scoped>
.game-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
}

.badge-icon {
  font-size: 1.1em;
}

.badge-text {
  font-size: inherit;
}

/* Sizes */
.badge-small {
  padding: 2px 8px;
  font-size: 12px;
}

.badge-medium {
  padding: 4px 12px;
  font-size: 14px;
}

.badge-large {
  padding: 6px 16px;
  font-size: 16px;
}

/* Variants - Solid */
.badge-default {
  background: rgba(71, 85, 105, 0.6);
  color: #e2e8f0;
}

.badge-primary {
  background: rgba(139, 92, 246, 0.6);
  color: #e9d5ff;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

.badge-success {
  background: rgba(16, 185, 129, 0.6);
  color: #d1fae5;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.badge-warning {
  background: rgba(245, 158, 11, 0.6);
  color: #fef3c7;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.badge-danger {
  background: rgba(239, 68, 68, 0.6);
  color: #fee2e2;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.badge-info {
  background: rgba(59, 130, 246, 0.6);
  color: #dbeafe;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

/* Rarity Variants */
.badge-rarity-common {
  background: rgba(107, 114, 128, 0.6);
  color: #f3f4f6;
  border: 1px solid rgba(107, 114, 128, 0.4);
}

.badge-rarity-rare {
  background: rgba(59, 130, 246, 0.6);
  color: #dbeafe;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.badge-rarity-epic {
  background: rgba(139, 92, 246, 0.6);
  color: #e9d5ff;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

.badge-rarity-legendary {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(217, 119, 6, 0.6) 100%);
  color: #fef3c7;
  border: 1px solid rgba(245, 158, 11, 0.6);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
}

/* Outline variants */
.badge-outline {
  background: transparent;
  border: 2px solid currentColor;
}

.badge-outline.badge-primary {
  color: #a78bfa;
}

.badge-outline.badge-success {
  color: #34d399;
}

.badge-outline.badge-warning {
  color: #fbbf24;
}

.badge-outline.badge-danger {
  color: #f87171;
}

.badge-outline.badge-info {
  color: #60a5fa;
}
</style>
