<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="icon" class="btn-icon">{{ icon }}</span>
    <span class="btn-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' | 'success'
  size?: 'small' | 'medium' | 'large' | 'huge'
  icon?: string
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'game-btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  {
    'btn-disabled': props.disabled,
    'btn-full-width': props.fullWidth
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.game-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-family: 'Cinzel', serif;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.game-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.game-btn:hover::before {
  width: 300px;
  height: 300px;
}

.game-btn:hover {
  transform: translateY(-3px);
}

.game-btn:active {
  transform: translateY(-1px);
}

/* Variants */
.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
}

.btn-secondary {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(100, 116, 139, 0.4);
}

.btn-secondary:hover {
  box-shadow: 0 8px 25px rgba(100, 116, 139, 0.6);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-danger:hover {
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.6);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.btn-warning:hover {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6);
}

.btn-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-info:hover {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-success:hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
}

/* Sizes */
.btn-small {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 8px;
}

.btn-medium {
  padding: 12px 28px;
  font-size: 15px;
}

.btn-large {
  padding: 16px 36px;
  font-size: 18px;
}

.btn-huge {
  padding: 24px 60px;
  font-size: 22px;
}

/* States */
.btn-disabled,
.game-btn:disabled {
  background: rgba(71, 85, 105, 0.5);
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none;
}

.btn-disabled::before,
.game-btn:disabled::before {
  display: none;
}

.btn-full-width {
  width: 100%;
}

.btn-icon {
  font-size: 1.2em;
  position: relative;
  z-index: 1;
}

.btn-text {
  position: relative;
  z-index: 1;
}
</style>
