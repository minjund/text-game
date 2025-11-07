<template>
  <button
    :class="['action-button', variant, { 'action-button-disabled': disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <div class="action-icon">{{ icon }}</div>
    <div class="action-content">
      <div class="action-title">{{ title }}</div>
      <div v-if="description" class="action-description">{{ description }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.action-button {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-button:hover:not(.action-button-disabled) {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.action-button:active:not(.action-button-disabled) {
  transform: scale(0.98);
}

.action-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-title {
  font-size: 16px;
  font-weight: 700;
  font-family: 'Cinzel', serif;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.action-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

/* Variants */
.action-button.primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

.action-button.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.action-button.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.action-button.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.action-button.info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

/* Disabled state */
.action-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
</style>
