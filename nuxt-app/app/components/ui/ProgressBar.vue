<template>
  <div class="progress-bar-container">
    <div v-if="label" class="progress-label">
      <span>{{ label }}</span>
      <span class="progress-text">{{ current }} / {{ max }}</span>
    </div>
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :class="variant"
        :style="{ width: percentage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  max: number
  label?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const percentage = computed(() => {
  return Math.min(Math.max((props.current / props.max) * 100, 0), 100)
})
</script>

<style scoped>
.progress-bar-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
}

.progress-text {
  font-family: 'Cinzel', serif;
  color: #94a3b8;
}

.progress-bar-track {
  width: 100%;
  height: 12px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-bar-fill.primary {
  background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
}

.progress-bar-fill.success {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.progress-bar-fill.warning {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.progress-bar-fill.danger {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.progress-bar-fill.info {
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}
</style>
