<template>
  <div class="empire-progress-card">
    <!-- Header -->
    <div class="empire-header">
      <div class="empire-title">
        <span class="empire-icon">⚔️</span>
        <span class="empire-label">아카샤 대제국</span>
      </div>
      <div class="empire-health">
        <span class="health-percent">{{ healthPercentage }}%</span>
      </div>
    </div>

    <!-- 체력 바 -->
    <div class="empire-health-bar">
      <div
        class="empire-health-fill"
        :style="{ width: healthPercentage + '%' }"
        :class="healthBarClass"
      >
        <div class="progress-shine"></div>
      </div>
    </div>

    <!-- 상태 텍스트 -->
    <div class="empire-status">
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentHealth: number
  totalHealth: number
}

const props = defineProps<Props>()

// 체력 퍼센트
const healthPercentage = computed(() => {
  return Math.floor((props.currentHealth / props.totalHealth) * 100)
})

// 체력바 색상 클래스
const healthBarClass = computed(() => {
  const percent = healthPercentage.value
  if (percent > 70) return 'health-high'
  if (percent > 30) return 'health-medium'
  return 'health-low'
})

// 상태 텍스트
const statusText = computed(() => {
  const percent = healthPercentage.value
  if (percent <= 0) return '제국 붕괴!'
  if (percent <= 20) return '제국이 무너지고 있습니다...'
  if (percent <= 50) return '제국의 전력이 약화되었습니다'
  if (percent <= 80) return '제국이 흔들리고 있습니다'
  return '막강한 제국이 건재합니다'
})
</script>

<style scoped>
.empire-progress-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.4);
}

.empire-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.empire-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.empire-icon {
  font-size: 28px;
}

.empire-label {
  font-size: 14px;
  font-weight: 700;
  color: #fca5a5;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Cinzel', serif;
}

.empire-count {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: 'Courier New', monospace;
}

.current-count {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.count-separator {
  font-size: 24px;
  color: #64748b;
}

.total-count {
  font-size: 26px;
  color: #94a3b8;
  font-weight: 700;
}

.empire-progress-bar {
  width: 100%;
  height: 20px;
  background: rgba(71, 85, 105, 0.3);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}

.empire-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  transition: width 0.8s ease;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
  position: relative;
  overflow: hidden;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .empire-progress-card {
    padding: 20px;
  }

  .empire-icon {
    font-size: 24px;
  }

  .empire-label {
    font-size: 12px;
  }

  .current-count {
    font-size: 28px;
  }

  .count-separator {
    font-size: 20px;
  }

  .total-count {
    font-size: 22px;
  }

  .empire-progress-bar {
    height: 16px;
  }
}
</style>
