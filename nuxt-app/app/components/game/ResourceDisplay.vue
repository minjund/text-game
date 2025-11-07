<template>
  <div :class="['resource-display', variant]">
    <span class="resource-icon">{{ icon }}</span>
    <div class="resource-info">
      <span class="resource-label">{{ label }}</span>
      <span class="resource-value">{{ formattedValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  label: string
  value: number
  variant?: 'default' | 'compact'
  showPlus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showPlus: false
})

const formattedValue = computed(() => {
  const val = Math.floor(props.value)
  if (props.showPlus && val > 0) {
    return `+${val}`
  }
  return val.toLocaleString()
})
</script>

<style scoped>
.resource-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 10px 16px;
  transition: all 0.3s;
}

.resource-display:hover {
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.resource-icon {
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.4));
}

.resource-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.resource-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.resource-value {
  font-size: 16px;
  font-weight: 700;
  color: #e2e8f0;
  font-family: 'Cinzel', serif;
}

/* Compact variant for mobile */
.resource-display.compact {
  padding: 6px 12px;
  gap: 6px;
}

.resource-display.compact .resource-icon {
  font-size: 20px;
}

.resource-display.compact .resource-info {
  gap: 0;
}

.resource-display.compact .resource-label {
  font-size: 10px;
}

.resource-display.compact .resource-value {
  font-size: 14px;
}
</style>
